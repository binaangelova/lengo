const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
  vocabulary: [
    {
      bulgarian: { type: String, required: true },
      english: { type: String, required: true },
    },
  ],
  grammar: { type: String, required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }, // Reference to the Test model
});

module.exports = mongoose.model('Lesson', lessonSchema);
