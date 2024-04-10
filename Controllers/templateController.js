const Blog = require("../Model/Blog");

const multer = require('multer');
const appError = require("../Utils/appError");
const runAsync = require("../Utils/runasync");

const cloudinary = require('cloudinary');
const sharp = require("sharp");



exports.createblog = runAsync(async (req, res, next) => {
    const { blogName, content, seenFrom, type } = req.body;




    if (!blogName || !content) {
        return next(new appError("please provide the name of blog"))
    }
    const result = await cloudinary.v2.uploader.upload(`public/blogs/${req.body.coverImage}`, {
        folder: 'blogs', // Save files in a folder named lms

    });


    const newblog = await Blog.create({

        createdBy: req.user._id,
        ...req.body,
        coverImage: result.secure_url,

    })



    res.status(200).send({
        status: true,
        message: "Blog is posted"
    })


})


exports.getAllBlogs = runAsync(async (req, res, next) => {

    const blogs = await Blog.find({
        hidden: false
    }).populate("createdBy");


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



















const multerStorage = multer.memoryStorage();





exports.resizeImage = runAsync(async (req, res, next) => {

    if (!req.file) {
        return next(new appError("please upload a file", 400))
    }


    // cover image
    req.body.coverImage = `${req.user._id}--cover.jpg`
    await sharp(req.file.buffer).toFormat('jpeg').toFile(`public/blogs/${req.body.coverImage}`)





    next()


})


// destination(for saving files) of multer package 
const uploads = multer(
    {
        storage: multerStorage,
    }
)

exports.uploadImages = uploads.single('image')

