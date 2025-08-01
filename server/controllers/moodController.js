import Mood from '../models/Mood.js';

// Get all moods
export const getMoods = async (req, res) => {
  try {
    console.log('Getting all moods');
    const userId = req.userId;
    const moods = await Mood.find({ user: userId }).sort({ date: -1 });
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
    const { mood, customMood, intensity, note, activities, tags } = req.body;
    
    // Validate required fields
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }
    
    if (!intensity || intensity < 1 || intensity > 10) {
      return res.status(400).json({ message: 'Valid intensity (1-10) is required' });
    }
    
    const newMood = new Mood({
      user: req.userId,
      mood,
      customMood: customMood || '',
      intensity,
      note: note || '',
      activities: activities || [],
      tags: tags || []
    });

    const savedMood = await newMood.save();
    console.log('Mood saved successfully:', savedMood);
    res.json(savedMood);
  } catch (err) {
    console.error('Error in createMood controller:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update mood
export const updateMood = async (req, res) => {
  try {
    const userId = req.userId;
    let mood = await Mood.findOne({ _id: req.params.id, user: userId });

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
    const userId = req.userId;
    let mood = await Mood.findOne({ _id: req.params.id, user: userId });

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