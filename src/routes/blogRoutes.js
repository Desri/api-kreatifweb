const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementReadCount,
  publishBlog,
  unpublishBlog,
  togglePublishBlog
} = require('../controllers/blogController');

router.route('/')
  .get(getAllBlogs)
  .post(upload.single('image'), createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(upload.single('image'), updateBlog)
  .delete(deleteBlog);

router.route('/:id/read')
  .post(incrementReadCount);

router.route('/:id/publish')
  .post(publishBlog);

router.route('/:id/unpublish')
  .post(unpublishBlog);

router.route('/:id/toggle-publish')
  .post(togglePublishBlog);

module.exports = router;