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


const getcoordinates = async (req, res) => {
  const { state, village } = req.body;
  // console.log(req.body)

  if (!state ||  !village) {
    return res.status(400).json({ error: "Please provide state, and village name." })
  }

  const query = `${village}, ${state}, India`;
  const encodedQuery = encodeURIComponent(query);

  const googleMapsApiKey = process.env.SECRET_KEY;
  const googleGeocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${googleMapsApiKey}`;

  try {
    const response = await axios.get(googleGeocodingUrl);

    if (response.data.status !== "OK" || response.data.results.length === 0) {
      return res.status(404).json({ error: "No coordinates found for the selected location. Try selecting a nearby location." })
    }

    const location = response.data.results[0].geometry.location;
    const displayName = response.data.results[0].formatted_address;

    return res.json({
      lat: location.lat,
      lon: location.lng,
      display_name: displayName,
    });
  } catch (error) {
    console.error("Error fetching coordinates:", error)
    return res.status(500).json({ error: "An error occurred while fetching coordinates. Please try again later." })
  }
}

module.exports = { locationdata, getcoordinates }