const User = require("../Model/User");
const appError = require("../Utils/appError");
const runAsync = require("../Utils/runasync");


const jwt = require('jsonwebtoken');

const createTokenSendRes = (id, res, statusCode, message) => {

    let token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRIR_IN
    });
    console.log("GEN ", token);
    let cookieOptions = {
        expires: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
        ),


        secure: true,
        httpOnly: true,
        sameSite: "None",
        path: "/",
    };
    if (process.env.NODE_ENV == 'production') {

        cookieOptions.secure = true
    }

    
    res.cookie('jwtBlog', token, cookieOptions);
    // res.headers['access-control-allow-credentials'] = true

    // we will set cookies 
    res.status(statusCode).json({
        status: "success",
        user: message

    })
}

exports.signUp = runAsync(async (req, res, next) => {

    const { userName, email, password, mobile } = req.body;
    if (!userName || !email || !password || !mobile) {
        return next(new appError("please enter all the details  ", 400));
    }


    const existing = await User.findOne({ email }).select('+password')
    if (existing) {
        return next(new appError("email id already exists please enter diffrent email address  ", 400));

    }


    const newUser = await User.create({ userName, email, password, mobile });
    if (!newUser) {
        return next(new appError("something went wrong  ", 500));

    }
    console.log(newUser);
    newUser.password = undefined;
    createTokenSendRes(newUser._id, res, 201, newUser)
});





exports.login = runAsync(async (req, res, next) => {

    const { email, password } = req.body;


    if (!email || !password) {
        return next(new appError("please enter credential for get into in ", 400));
    }

    const user = await User.findOne({ email }).select('+password')


    if (!user || !await user.correctPass(password, user.password)) {

        return next(new appError("please enter valid email id and password", 400));
    }
    user.password = undefined
    createTokenSendRes(user.id, res, 200, user)

})













