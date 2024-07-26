const express = require("express");
const connectToDB = require("./config/connectToDB");
const { errorHandler, notFound } = require("./middlewares/error");
const xss = require("xss-clean");
const cors = require("cors");

// allow the application to read the variable that exist in dotenv file
require("dotenv").config();

//Connection To DB
connectToDB();

//Init App
const app = express();

//Middlewares
//this middleware to express recognize
// the json files that comes from the client
app.use(express.json());

// Prevent XSS(Cross site scripting) Attaks
app.use(xss());

//Cors Policy
app.use(cors({
    origin: "http://localhost:3000"
}));


// Routes
app.use('/api/auth',require("./routes/authRoute"));
app.use('/api/users',require("./routes/usersRoute"));
app.use('/api/posts',require("./routes/postsRoute"));
app.use('/api/comments',require("./routes/commentsRoute"));
app.use('/api/categories',require("./routes/categoriesRoute"));
app.use('/api/password',require("./routes/passwordRoute"));

// Error Handler Middlewar
app.use(notFound);
app.use(errorHandler);

//Running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
));