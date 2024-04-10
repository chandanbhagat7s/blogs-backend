const jwt = require("jsonwebtoken");
// const User = require("../Models/UserSchema"); 
// const runAsync = require("../utils/catchAsync");
const User = require("../Model/User");
const runAsync = require("../Utils/runasync");
const appError = require("../Utils/appError");










// this is the middleware for just rendering the pages difffrent for if user is logged 
exports.protectRoute = runAsync(async (req, res, next) => {

    // we need to see weather the user is loged in or not 
    let token;
    console.log("COOKIE IS ", req.cookie);
    // console.log(token);
    // console.log("cookies", req.cookies.jwt);
    if (req.cookies) {
        token = req.cookies.jwtBlog
        console.log("req.cookies.jwt", req.cookies.jwtBlog);
    }
    // console.log(req.headers);
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {

        return next(new appError("please login to get access"))
    }


    // console.log(token);

    // we need to get the id from the token which we have encoded 
    let decode = jwt.decode(token, process.env.JWT_SECRET_KEY)
    let currentUser = await User.findById(decode.id);
    // console.log(currentUser);

    if (!currentUser) {
        return next(new appError("user do not exist please register !!", 400))
    }

    // we need to check weater the password is changed or not 
    if (currentUser.IsPasswordChanged(decode.iat)) {
        return next(new appError("password has changed please login again", 401))
    }

    req.user = currentUser;



    next()

})
