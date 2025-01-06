const mysql = require("../config/db")
const fs = require("fs")
const axios = require("axios")

const locationdata = (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading JSON file")
    } else {
      res.json(JSON.parse(data))
    }
  })
}

const districts = (req, res) => {
  const { state } = req.body;
  // console.log("State received:", state)
  mysql.query(
    "SELECT DISTINCT district FROM villagedata WHERE state = ?",
    [state],
    (err, results) => {
      if (err) return res.status(500).send("Error fetching districts.")
      // console.log("Districts from DB:", results)
      res.json(results.map((row) => row.district))
    }
  )
}

const subdistricts = (req, res) => {
  const { district } = req.query;
  mysql.query(
    "SELECT DISTINCT subdistrict FROM villagedata WHERE district = ?",
    [district],
    (err, results) => {
      if (err) return res.status(500).send("Error fetching sub-districts.")
      res.json(results.map((row) => row.subdistrict))
    }
  )
}

const villages = (req, res) => {
  const { subDistrict } = req.query;
  mysql.query(
    "SELECT DISTINCT village FROM villagedata WHERE subdistrict = ?",
    [subDistrict],
    (err, results) => {
      if (err) return res.status(500).send("Error fetching villages.")
      res.json(results.map((row) => row.village))
    }
  )
}

const getcoordinates = async (req, res) => {
  const { state, village } = req.body;
  if (!state || !village)
    return res.status(400).json({ error: "Missing data." })
  const query = `${village}, ${state}, India`;
  const apiKey = process.env.SECRET_KEY;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );
    if (response.data.status !== "OK")
      return res.status(404).json({ error: "Location not found." })
    const location = response.data.results[0].geometry.location;
    const displayName = response.data.results[0].formatted_address;
    res.json({
      lat: location.lat,
      lon: location.lng,
      display_name: displayName,
    });
  } catch {
    res.status(500).send("Error fetching coordinates.")
  }
}

module.exports = {locationdata, districts, subdistricts, villages, getcoordinates}