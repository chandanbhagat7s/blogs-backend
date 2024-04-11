







const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
// creating schema
const blogSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.mongo.ObjectId,
        ref: 'User',
        required: [true, "must provide the information about creater of blog"]
    },
    blogName: {
        type: String,
        required: [true, "Blog name should be provided"],
        maxLength: 20,
        minLenght: 5
    },
    content: {
        type: String,
        required: [true, "please enter all the content"]
    },
    seenFrom: {
        type: Date
    },
    type: {
        type: String,
        required: true,
        enum: ["Beauty", "Travel", "Lifestyle", "Personal", "Tech", "Health", "Fitness", "Wellness", "SaaS", "Business", "Education", "Food and Recipe ", "Love and Relationships", "Alternative topics", "Green living", "Music", "Automotive", "Marketing", "Internet services", "Finance", "Sports", "Entertainment", "Productivity", "Hobbies", "Parenting", "Pets", "Photography", "Agriculture", "others",
        ]
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    hidden: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    coverImage: {
        type: String
    },
    comments: {
        type: [Object]
    },
    verifiedComment: {
        type: [Object]
    }


})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;








































