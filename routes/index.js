const express = require('express')
const router = express.Router()
const {locationdata,districts, subdistricts, villages, getcoordinates} = require('../controller/controller')

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/locationdata', locationdata)

router.post('/districts', districts)

router.get('/subdistricts', subdistricts)

router.get('/villages', villages)

router.post('/getcoordinates', getcoordinates)

module.exports = router;