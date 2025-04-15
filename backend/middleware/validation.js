const validateRegistration = (req, res, next) => {
  const { username, password, email } = req.body;
  
  // Username validation
  if (!username || typeof username !== 'string' || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  // Password validation
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  next();
};

const validateLesson = (req, res, next) => {
  const { name, level, vocabulary, grammar } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Lesson name is required.' });
  }

  const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  if (!level || !validLevels.includes(level)) {
    return res.status(400).json({ error: 'Invalid lesson level.' });
  }

  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    return res.status(400).json({ error: 'Vocabulary must be a non-empty array.' });
  }

  for (const word of vocabulary) {
    if (!word.bulgarian || !word.english) {
      return res.status(400).json({ error: 'Each vocabulary item must have bulgarian and english translations.' });
    }
  }

  if (!grammar || typeof grammar !== 'string' || grammar.trim().length === 0) {
    return res.status(400).json({ error: 'Grammar content is required.' });
  }

  next();
};

const validateTest = (req, res, next) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Questions must be a non-empty array.' });
  }

  for (const [index, question] of questions.entries()) {
    if (!question.question || typeof question.question !== 'string') {
      return res.status(400).json({ error: `Question ${index + 1} text is required.` });
    }

    if (!Array.isArray(question.options) || question.options.length < 2) {
      return res.status(400).json({ error: `Question ${index + 1} must have at least 2 options.` });
    }

    if (!question.correctAnswer || !question.options.includes(question.correctAnswer)) {
      return res.status(400).json({ error: `Question ${index + 1} must have a valid correct answer.` });
    }
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLesson,
  validateTest
};
