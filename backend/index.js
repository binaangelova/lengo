const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Test = require('./models/Test');
const Lesson = require('./models/Lesson');
const TestResult = require('./models/TestResult'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};


// Endpoint for creating lessons
app.post('/lessons', async (req, res) => {
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
app.post('/tests', async (req, res) => {
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
app.put('/lessons/:id', async (req, res) => {
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

app.post('/submitTestResults', async (req, res) => {
  try {
    const { lessonId, answers, token } = req.body; // Remove token from the body, we'll extract it from headers

    if (!lessonId || !answers) {
      return res.status(400).json({ error: 'Lesson ID and answers are required.' });
    }
    // Extract the token from request headers instead of body
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

    // Generate JWT token with role
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role in the token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, isAdmin: user.role === 'admin' }); // Send role status
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
app.delete('/users/:id', async (req, res) => {
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


// Start the server after connecting to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
