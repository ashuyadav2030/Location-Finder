const express = require('express')
const dotenv = require('dotenv')
const routes = require('./routes/index')
const mysql = require("./config/db")
const cors = require('cors')
dotenv.config()

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views','./views')
app.use(cors())

app.use('/', routes)

//Listen
mysql.query("SELECT 1",(err) =>{
    if(err){
        console.err("Error testing MySQL connection:", err.message)
        return;
    }
    console.log(("MySQL DB Connected"))

    const port = process.env.PORT
    app.listen(port, () => {
        console.log((`Server is running on ${port}`))
    })
})