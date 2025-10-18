const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('category').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;

    // Check if the id is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // If valid ObjectId, search by _id
      blog = await Blog.findById(id).populate('category');
    } else {
      // Otherwise, search by slug
      blog = await Blog.findOne({ slug: id }).populate('category');
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blogData = {
      title: req.body.title,
      slug: req.body.slug, // Optional - will be auto-generated from title if not provided
      content: req.body.content,
      metaDescription: req.body.metaDescription,
      category: req.body.category,
      author: req.body.author,
      tags: req.body.tags,
      published: req.body.published
    };

    // Handle image upload if file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'kreatifweb-blogs',
        resource_type: 'auto'
      });

      blogData.image = result.secure_url;

      // Delete temporary file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }

    const blog = await Blog.create(blogData);
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    // Clean up file if upload fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.title) updateData.title = req.body.title;
    if (req.body.content) updateData.content = req.body.content;
    if (req.body.metaDescription) updateData.metaDescription = req.body.metaDescription;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.author) updateData.author = req.body.author;
    if (req.body.tags) updateData.tags = req.body.tags;
    if (req.body.published !== undefined) updateData.published = req.body.published;

    // Handle image upload if file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'kreatifweb-blogs',
        resource_type: 'auto'
      });

      updateData.image = result.secure_url;

      // Delete temporary file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    // Clean up file if upload fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.incrementReadCount = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;

    // Check if the id is a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // If valid ObjectId, search by _id
      blog = await Blog.findByIdAndUpdate(
        id,
        { $inc: { readCount: 1 } },
        { new: true }
      ).populate('category');
    } else {
      // Otherwise, search by slug
      blog = await Blog.findOneAndUpdate(
        { slug: id },
        { $inc: { readCount: 1 } },
        { new: true }
      ).populate('category');
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: {
        readCount: blog.readCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { published: true },
      { new: true }
    ).populate('category');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog published successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.unpublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { published: false },
      { new: true }
    ).populate('category');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog unpublished successfully',
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.togglePublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.published = !blog.published;
    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id).populate('category');

    res.json({
      success: true,
      message: `Blog ${blog.published ? 'published' : 'unpublished'} successfully`,
      data: updatedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};