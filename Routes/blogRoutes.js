const express = require('express');
const { signUp, login } = require('../Controllers/userController');
const { createblog, uploadImages, resizeImage, getAllBlogs, postNewCommentOnBlog, deleteSelectedComment, verifyTheComment } = require('../Controllers/templateController');
const { protectRoute } = require('../Middleware/protect');

const blogRoutes = express.Router();











blogRoutes.get('/readAllblogs', getAllBlogs)
blogRoutes.post('/uploadComment', postNewCommentOnBlog)


blogRoutes.use(protectRoute)
blogRoutes.post('/createBlog', uploadImages, resizeImage, createblog)
blogRoutes.post('/deleteComment', deleteSelectedComment)
blogRoutes.post('/verifyComment', verifyTheComment)
blogRoutes.post('/hideBlog', createblog)
// blogRoutes.post('/login', login)

module.exports = blogRoutes;




























