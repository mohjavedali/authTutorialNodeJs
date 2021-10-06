const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const authRoute = require('./Routes/Auth.route');
const { varifyAccessToken } = require('./helpers/jwt.helper');
require('dotenv').config();
require("./helpers/init_mongodb");


const app = express();
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/', varifyAccessToken, async(req, res, next)=>{

    res.send("hello from  my app running");
})

app.use('/Auth', authRoute);

app.use(async (req, res, next)=>{
    // const error = new Error("not foud");
    // error.status = 404;
    // next(error)
    next(createError.NotFound())
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status || 500,
            message:err.message,
        },
    })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
