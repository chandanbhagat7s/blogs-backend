const Blog = require("../Model/Blog");
const appError = require("../Utils/appError");
const runAsync = require("../Utils/runasync");



exports.createblog = runAsync(async (req, res, next) => {
    const { blogName, content, seenFrom, type } = req.body;
    if (!blogName || !content) {
        return next(new appError("please provide the name of blog"))
    }
    const newblog = await Blog.create({
        createdBy: req.user._id,
        blogName,
        seenFrom,
        type,
        content
    })

    res.status(200).send({
        status: true,
        message: "Blog is posted"
    })


})


exports.getAllBlogs = runAsync(async (req, res, next) => {

    const blogs = await Blog.find({
        hidden: false
    });


    res.status(200).send({
        status: true,
        blogs
    })



})

exports.hideBlog = runAsync(async (req, res, next) => {

    const blogs = await Blog.findByIdAndUpdate(req.body.id, {
        hidden: true
    });



    res.status(200).send({
        status: true,
        message: "blog is hidden now "
    })



})


exports.unhideTheBlog = runAsync(async (req, res, next) => {

    const blogs = await Blog.findByIdAndUpdate(req.body.id, {
        hidden: false
    });


    res.status(200).send({
        status: true,
        message: "Blog is now seen to all the users"
    })



})















