const fs = require("fs");
const axios = require("axios");

const locationdata = (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading JSON file")
    } else {
      res.json(JSON.parse(data))
    }
  })
}

const getcoordinates = async (req, res) => {
  const { state, district, village } = req.body;

  if (!state || !district || !village) {
    return res.status(400).json({ error: "Please provide state, district, and village name." });
  }

  const query = `${village}, ${district}, ${state}`;
  const encodedQuery = encodeURIComponent(query)

  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&addressdetails=1&email=swapnildubey3636@gmail.com`;

  try {
    const response = await axios.get(nominatimUrl);

    if (response.data.length === 0) {
      return res.status(404).json({error:"No coordinates found for the selected location. Try selecting a nearby location."});
    }

    const { lat, lon, display_name } = response.data[0];
    return res.json({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      display_name: display_name,
    });
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return res.status(500).json({error: "An error occurred while fetching coordinates. Please try again later."});
  }
}




module.exports = { locationdata, getcoordinates }