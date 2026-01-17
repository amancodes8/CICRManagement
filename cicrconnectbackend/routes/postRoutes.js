const express = require('express');
const router = express.Router();
// IMPORTANT: Ensure these names match your postController.js exports exactly
const { 
  getPosts, 
  createPost, 
  likePost, 
  deletePost 
} = require('../controllers/postController'); 
const { protect } = require('../middleware/authMiddleware');

// If any of the variables above (like getPosts) are undefined, this line crashes:
router.get('/posts', protect, getPosts); 
router.post('/posts', protect, createPost);
router.post('/posts/:id/like', protect, likePost);
router.delete('/posts/:id', protect, deletePost);

module.exports = router;