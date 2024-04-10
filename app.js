const express = require('express');
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express()

const mongoose = require("mongoose");
const userRouter = require('./Routes/userRoute');
const globalErrorHandler = require('./Utils/globalErrorHandler');
const blogRoutes = require('./Routes/blogRoutes');

dotenv.config({ path: './.config.env' });


const PORT = process.env.PORT;

// app.use(express.static(`${__dirname}/Public`))

// to get all everything 
app.use(express.json())
// app.use(morgan("dev"))
// app.use(cookieParser())


app.use(morgan('dev'))


// make the database connection
mongoose.connect(process.env.DATABASE, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then((con) => {
    // console.log(con.connection);
    console.log("database connected");
}).catch(e => {
    console.log("not connected");
})


app.use('/api/v1/blogs/', blogRoutes)
app.use('/api/v1/users/', userRouter)



app.listen(PORT, () => {
    console.log("server started at ", PORT);
})


app.use(globalErrorHandler)
























