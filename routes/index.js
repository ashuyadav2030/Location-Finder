const express = require('express')
const router = express.Router()
const {locationdata, getcoordinates} = require('../controller/controller')

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/locationdata', locationdata)

router.post('/getcoordinates', getcoordinates)


module.exports = router;