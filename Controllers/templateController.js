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





exports.postNewCommentOnBlog = runAsync(async (req, res, next) => {
    const { byUser, comment, id } = req.body;
    const obj = {
        byUser,
        comment,
    }
    await Blog.findByIdAndUpdate(id, {
        $push: { comments: obj }


    });


    res.status(200).send({
        status: true,
        message: "comment is posted admin will soon review it and verify it "
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





exports.viewByAdminAndVerifyAll = runAsync(async (req, res, next) => {

    // const blogs = await Blog.findByIdAndUpdate(req.body.Blogid, {
    //     $push : {verifiedComment : req.body.comments}
    // });

    const blog = await Blog.findById(req.body.BlogId)

    let initial = blog.verifiedComment
    blog.verifiedComment = [...initial, req.body.toBeVerified];

    await blog.save()





    res.status(200).send({
        status: true,
        message: "Blog comments are now public"
    })



})




exports.verifyTheComment = runAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.body.id);

    const { byUser, comment } = req.body;
    if (!byUser || !comment) {
        return next(new appError("please provide the comment which to be approved", 400))
    }
    let verifiedComment;

    blog.comments = blog.comments.map(el => {
        let a = el.byUser == req.body.byUser
        let b = el.comment == req.body.comment
        if (a && b) {
            verifiedComment = el;
        } else {
            return el;
        }
    })

    blog.verifiedComment.push(verifiedComment);

    await blog.save()


    res.status(200).send({
        status: true,
        message: "Comment selected is approved"
    })










})




exports.deleteSelectedComment = runAsync(async (req, res, next) => {

    const blogs = await Blog.findByIdAndUpdate(req.body.id);
    console.log("BLOG IS ", blogs);


    let remaning = blogs.comments.map((el) => {
        let a = el.byUser == req.body.byUser
        let b = el.comment == req.body.comment
        if (a && b) {

        } else {
            return el;
        }

    })
    console.log("REMAINING COMMENTS", remaning);

    blogs.comments = remaning.map(el => {
        if (el) {
            return el;
        }
    });

    await blogs.save()




    res.status(200).send({
        status: true,
        message: "Comment selected is deleted"
    })



})




// to display all the comments to admin 

// exports.getAllNewComments =runAsync(async (req, res, next) => {

//     const blogs = await Blog.findByIdAndUpdate(req.body.id, {
//         hidden: false
//     });


//     res.status(200).send({
//         status: true,

//     })



// })























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

