const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

router.route('/')
  .get(getAllBlogs)
  .post(upload.single('image'), createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(updateBlog)
  .delete(deleteBlog);

module.exports = router;