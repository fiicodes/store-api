require('dotenv').config()


//async errors
require('express-async-errors')

const express=require('express')
const app=express()

const connectDB=require('./db/connect')
const productsRouter=require('./routes/products')

const notFoundMiddleware=require('./middleware/not-found')
const errorMiddleware=require('./middleware/error-handler')
const { connect } = require('mongoose')

//middleware
app.use(express.json())

//routes

app.get('/',(req,res)=>{
    res.send('<h1>Store API </h1><a href="/api/v1/products">products</a>')
})
app.use('/api/v1/products',productsRouter)


const port=process.env.PORT || 3000
//the connect.js function return a promise thats y we use async
const start=async()=>{
    try{
        //connectdb
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`server is listening to port  ${port}...`))
    }
    catch(error){
        console.log(error)
    }
}
start()


//products route

app.use(notFoundMiddleware)
app.use(errorMiddleware)



