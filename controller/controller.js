const mysql = require("../config/db");
const fs = require("fs");
const axios = require("axios");

const locationdata = (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading JSON file");
    } else {
      res.json(JSON.parse(data));
    }
  });
};

const districts = (req, res) => {
  const { state } = req.query;

  if (!state) return res.status(400).send("State is required.")

  if (state.toLowerCase() === "uttar pradesh") {
    fs.readFile("up.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading UP JSON file:", err);
        return res.status(500).send("Error reading UP JSON file.")
      }

      const upData = JSON.parse(data)

      const districts = upData.districts.map(district => district.district)
      
      res.json(districts)
    });
  } else {
    mysql.query(
      "SELECT DISTINCT district FROM villagedata WHERE state = ?",
      [state],
      (err, results) => {
        if (err) {
          console.error("Error fetching districts:", err)
          return res.status(500).send("Error fetching districts.")
        }
        res.json(results.map((row) => row.district))
      }
    );
  }
};

const subdistricts = (req, res) => {
  const { state, district } = req.query;

  if (!state || !district) {
    return res.status(400).send("State and district are required.");
  }

  if (state.toLowerCase() === "uttar pradesh") {
    fs.readFile("up.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading UP JSON file.");
      }
      try {
        const jsonData = JSON.parse(data);
        console.log(jsonData);

        const districtData = jsonData.districts.find(
          (item) => item.district.toLowerCase() === district.toLowerCase() 
        );

        if (districtData) {
          const subdistricts = [
            ...new Set(
              districtData.subdistricts.map((subdistrict) => subdistrict.subdistrict)
            ),
          ];

          return res.json(subdistricts.sort());
        } else {
          return res.status(404).send("District not found.");
        }
      } catch (err) {
        console.error("Error parsing JSON:", err);
        return res.status(500).send("Error parsing UP JSON file.");
      }
    });
  } else {
    mysql.query(
      "SELECT DISTINCT subdistrict FROM villagedata WHERE district = ?",
      [district],
      (err, results) => {
        if (err) return res.status(500).send("Error fetching sub-districts.")
        
        console.log("Subdistrict Results:", results);

        res.json(results.map((row) => row.subdistrict).sort())
      }
    )
  }
}

const villages = (req, res) => {
  const { state, district, subdistrict } = req.query;

  if (!state || !district || !subdistrict) {
    return res.status(400).send("State, district, and subdistrict are required.")
  }

  console.log(`State: ${state}, District: ${district}, Subdistrict: ${subdistrict}`)

  if (state.toLowerCase() === "uttar pradesh") {
    fs.readFile("up.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading UP JSON file.");
      }
      try {
        const jsonData = JSON.parse(data);

        const districtData = jsonData.districts.find(
          (item) => item.district.toLowerCase() === district.toLowerCase() 
        );

        if (districtData) {
          const subdistrictData = districtData.subdistricts.find(
            (item) => item.subdistrict.toLowerCase() === subdistrict.toLowerCase()
          );

          if (subdistrictData) {
            return res.json(subdistrictData.village.sort())
          } else {
            return res.status(404).send("Subdistrict not found.")
          }
        } else {
          return res.status(404).send("District not found.")
        }
      } catch (err) {
        console.error("Error parsing JSON:", err)
        return res.status(500).send("Error parsing UP JSON file.")
      }
    })
  } else {
    mysql.query(
      "SELECT DISTINCT village FROM villagedata WHERE district = ? AND subdistrict = ?",
      [district, subdistrict],
      (err, results) => {
        if (err) return res.status(500).send("Error fetching villages.");
        
        console.log("Village Results:", results);

        res.json(results.map((row) => row.village).sort());
      }
    )
  }
}

const getcoordinates = async (req, res) => {
  const { state, village } = req.body;
  if (!state || !village)
    return res.status(400).json({ error: "Missing data." });
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
};

module.exports = {
  locationdata,
  districts,
  subdistricts,
  villages,
  getcoordinates,
};
