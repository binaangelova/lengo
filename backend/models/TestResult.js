const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: String, required: true }],
});

module.exports = mongoose.model('TestResult', testResultSchema);
