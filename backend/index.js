const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodeCrypto = require('crypto');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const User = require('./models/User');
const Test = require('./models/Test');
const Lesson = require('./models/Lesson');
const TestResult = require('./models/TestResult'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Increase payload size limits for file uploads and large requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced security middleware
app.use(cors({
  origin: ['https://lengo-learn.vercel.app', 'http://localhost:5173'], // Allow both production and development URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import middleware
const { authenticateToken, isAdmin } = require('./middleware/auth');
const { validateRegistration, validateLesson, validateTest } = require('./middleware/validation');
const sanitizeMiddleware = require('./middleware/sanitize');

// Security middleware
// Security middleware with enhanced configuration
// Apply sanitization middleware globally
app.use(sanitizeMiddleware);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],  // Removed unsafe-inline
      styleSrc: ["'self'"],   // Removed unsafe-inline
      imgSrc: ["'self'"],     // Restricted to only same origin
      connectSrc: ["'self'", "https://lengo-learn.vercel.app", "http://localhost:5173"],
      formAction: ["'self'"], // Restrict form submissions to same origin
      frameAncestors: ["'none'"], // Prevent iframe embedding
      objectSrc: ["'none'"],  // Prevent object/embed elements
      baseUri: ["'self'"],    // Restrict base URI
      upgradeInsecureRequests: [] // Force HTTPS
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hsts: { 
    maxAge: 31536000, 
    includeSubDomains: true,
    preload: true 
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  noSniff: true, // Prevent MIME type sniffing
  permittedCrossDomainPolicies: "none", // Restrict Adobe Flash and PDF content
  xssFilter: true // Enable XSS filter in older browsers
}));

// Prevent MongoDB injection and cross-site scripting (XSS)
app.use(mongoSanitize());
app.use((req, res, next) => {
  // Sanitize request body, query, and params
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/javascript:/gi, '')
          .replace(/[<>]/g, '');
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };
  
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter); // Apply rate limiting to all routes

const PORT = process.env.PORT || 5003;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add security options
      ssl: true,
      authSource: 'admin',
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
    });
    console.log('Connected to MongoDB');

    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};


// Endpoint for creating lessons
app.post('/lessons', authenticateToken, isAdmin, validateLesson, async (req, res) => {
  try {
    const { name, level, vocabulary, grammar } = req.body;

    if (!name || !level || !vocabulary || !grammar) {
      return res.status(400).json({ error: 'All fields are required: name, level, vocabulary, and grammar.' });
    }

    const lastTest = await Test.findOne().sort({ _id: -1 });
    const newLesson = new Lesson({
      name,
      level,
      vocabulary,
      grammar,
      test: lastTest ? lastTest._id : null,
    });

    await newLesson.save();
    res.status(201).json({ message: 'Lesson created successfully!', lessonId: newLesson._id });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Server error while creating the lesson.' });
  }
});

// Endpoint for fetching all lessons
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('test', 'questions');
    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Error fetching lessons.' });
  }
});

// Endpoint for fetching a lesson by ID
app.get('/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid lesson ID format.' });
    }

    const lesson = await Lesson.findById(id).populate('test');
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found.' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Error fetching lesson.' });
  }
});

// Backend: Fetch lessons by level
app.get('/lessons/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const lessons = await Lesson.find({ level });
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Грешка при извличане на уроците.' });
  }
});


app.get('/lessons/:levelId/:lessonName', async (req, res) => {
  try {
    const { levelId, lessonName } = req.params;
    const lesson = await Lesson.findOne({ level: levelId, name: lessonName }).populate('test');
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found.' });
    }

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// Endpoint for creating tests
app.post('/tests', authenticateToken, isAdmin, validateTest, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'Questions are required.' });
    }

    for (const [index, question] of questions.entries()) {
      if (!question.question || !question.options || !question.correctAnswer) {
        return res.status(400).json({
          error: `Each question must contain text, options, and a correct answer (issue with question ${index + 1}).`,
        });
      }
    }

    const newTest = new Test({ questions });
    await newTest.save();
    res.status(201).json({ message: 'Test created successfully!', testId: newTest._id });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Server error while creating the test.' });
  }
});

// Endpoint for fetching all tests
app.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Error fetching tests.' });
  }
});

app.get('/completed-tests', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required.' });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Extract user ID from the decoded token
    const userId = decoded.id;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid token: user ID missing.' });
    }
    const completedTests = await TestResult.find({ userId }).populate('lessonId');

    res.json(completedTests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Error fetching tests.' });
  }
});

app.get('/completed-tests/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const completedTests = await TestResult.find({ userId }).populate('lessonId');

    res.json(completedTests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Error fetching tests.' });
  }
});


// PUT endpoint for updating lessons
app.put('/lessons/:id', authenticateToken, isAdmin, validateLesson, async (req, res) => {
  const lessonId = req.params.id;
  const { name, level, vocabulary, grammar, test } = req.body;

  try {
    // Update the lesson
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { name, level, vocabulary, grammar, test },
      { new: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ error: 'Урокът не е намерен.' });
    }

    res.status(200).json({ lesson: updatedLesson });
  } catch (err) {
    res.status(500).json({ error: 'Грешка при обновяването на урока.' });
  }
});

// Delete a lesson by ID
app.delete('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // If lesson has a test, delete the test
    if (lesson.test) {
      await Test.findByIdAndDelete(lesson.test);
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(req.params.id);

    res.json({ message: 'Lesson and its test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


app.put('/tests/:id', async (req, res) => {
  const testId = req.params.id;
  const { questions } = req.body;

  console.log('Received testId:', testId);
  console.log('Received questions:', questions);

  try {
    // Update the test
    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      { questions },
      { new: true }
    );

    if (!updatedTest) {
      console.error('Test not found with ID:', testId);
      return res.status(404).json({ error: 'Тестът не е намерен.' });
    }

    console.log('Test updated successfully:', updatedTest);
    res.status(200).json({ test: updatedTest });
  } catch (err) {
    console.error('Error updating test:', err);
    res.status(500).json({ error: 'Грешка при обновяването на теста.' });
  }
});

app.post('/submitTestResults', authenticateToken, async (req, res) => {
  try {
    const { lessonId, answers } = req.body;

    if (!lessonId || !answers) {
      return res.status(400).json({ error: 'Lesson ID and answers are required.' });
    }

    // User ID is now available from authenticateToken middleware
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid token: user ID missing.' });
    }

    console.log('Received test results:', lessonId, answers, 'for user:', userId);

    // Save the test result
    const newTestResult = new TestResult({
      lessonId,
      userId,
      answers,
    });

    await newTestResult.save();

    res.status(200).json(newTestResult);
  } catch (error) {
    console.error('Error during test submission:', error);
    res.status(500).json({ error: 'Error submitting test results.' });
  }
});


app.get('/getTestResult/:testResultId', async (req, res) => {
  try {
    const { testResultId } = req.params;

    // Fetch the test result by lesson ID
    console.log(testResultId);
    const testResult = await TestResult.findById(testResultId).populate({
      path: 'lessonId',
      populate: {
        path: 'test', // Populate the test field in the lesson
        model: 'Test', // Specify the Test model
      },
    });
    console.log(testResult)
    if (!testResult) {
      return res.status(404).json({ error: 'Test results not found for this lesson.' });
    }

    // Fetch the lesson's correct answers (you can modify this to match your schema)
    const lesson = testResult.lessonId;

    // Assuming `lesson.test.questions` contains the correct answers
    const correctAnswers = lesson.test.questions.map((q) => q.correctAnswer);

    // Return the test results with the correct answers
    res.status(200).json({
      lessonName: lesson.name,
      questions: lesson.test.questions,
      selectedAnswers: testResult.answers,
      correctAnswers: correctAnswers,
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Error fetching test results.' });
  }
});


// Endpoint for registering a user
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check if all required fields are provided
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required.' });
    }

    // Check if the user or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use.' });
    }

    // Default role to 'user' if not provided
    const userRole = role || 'user';

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, password: hashedPassword, email, role: userRole });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Endpoint for logging in a user
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token with role and extended expiration
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generate CSRF token using Node's crypto module
    const csrfToken = nodeCrypto.randomBytes(32).toString('hex');

    res.json({ 
      token, 
      isAdmin: user.role === 'admin',
      csrfToken 
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});


app.get('/user', async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token is required.' });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Extract user ID from the decoded token
    const userId = decoded.id;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid token: user ID missing.' });
    }

    // Fetch the user but EXCLUDE the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error while fetching user.' });
  }
});

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

// Endpoint to fetch a user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    const user = await User.findById(id, 'username _id email'); // Include 'email' in the fields
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Error fetching user details.' });
  }
});

// DELETE user by ID
app.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Add error handling middleware last
app.use(errorHandler);

// Start the server after connecting to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
