const express = require('express');
const Confession = require('models/Confession');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// PUBLIC ROUTE - GET /api/confessions
router.get('/', async (req, res) => {
  try {
    const confessions = await Confession.find()
      .select('title body createdAt')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      count: confessions.length,
      confessions 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// PROTECTED ROUTE - POST /api/confessions
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title and confession text' 
      });
    }

    const confession = new Confession({
      title,
      body,
      user: req.user.userId
    });

    await confession.save();

    res.status(201).json({ 
      success: true, 
      message: 'Confession posted successfully',
      confession: {
        id: confession._id,
        title: confession.title,
        body: confession.body,
        createdAt: confession.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// PROTECTED ROUTE - DELETE /api/confessions/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const confessionId = req.params.id;

    const confession = await Confession.findById(confessionId);

    if (!confession) {
      return res.status(404).json({ 
        success: false, 
        message: 'Confession not found' 
      });
    }

    if (confession.user.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You can only delete your own confessions' 
      });
    }

    await Confession.findByIdAndDelete(confessionId);

    res.json({ 
      success: true, 
      message: 'Confession deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;