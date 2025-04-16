import Mood from '../models/Mood.js';

// Get all moods
export const getMoods = async (req, res) => {
  try {
    console.log('Getting all moods');
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error('Error in getMoods controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add new mood
export const createMood = async (req, res) => {
  try {
    console.log('Creating mood:', req.body);
    const { mood, intensity, note, activities } = req.body;
    
    const newMood = new Mood({
      mood,
      intensity,
      note,
      activities
    });

    const savedMood = await newMood.save();
    res.json(savedMood);
  } catch (err) {
    console.error('Error in createMood controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update mood
export const updateMood = async (req, res) => {
  try {
    let mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    mood = await Mood.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(mood);
  } catch (err) {
    console.error('Error in updateMood controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete mood
export const deleteMood = async (req, res) => {
  try {
    let mood = await Mood.findById(req.params.id);

    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    await Mood.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mood removed' });
  } catch (err) {
    console.error('Error in deleteMood controller:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};