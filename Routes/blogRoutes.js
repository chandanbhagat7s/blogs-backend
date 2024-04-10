const express = require('express');
const { signUp, login } = require('../Controllers/userController');
const { createblog } = require('../Controllers/templateController');
const { protectRoute } = require('../Middleware/protect');

const blogRoutes = express.Router();



blogRoutes.use(protectRoute)
blogRoutes.post('/createBlog', createblog)
blogRoutes.post('/hideBlog', createblog)
// blogRoutes.post('/login', login)

module.exports = blogRoutes;




























