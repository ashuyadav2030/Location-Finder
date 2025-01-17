# Location Data API

This project provides APIs to fetch and manage hierarchical location data (states, districts, subdistricts, and villages) along with geolocation coordinates using Google Maps API. 

## Features

- **Fetch Location Data**: Retrieve states, districts, subdistricts, and villages from JSON files or a MySQL database.
- **Dynamic Location Queries**: Supports hierarchical location-based queries based on user input.
- **Google Maps Integration**: Fetch geographical coordinates of locations using the Google Maps Geocoding API.
- **Error Handling**: Provides informative error messages for missing or invalid data.

---

## Installation

### Prerequisites

- Node.js
- MySQL
- A `.env` file with the following variables:
  ```env
  SECRET_KEY=<Your Google Maps API Key>
  ```

### Steps

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project_folder>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure the database in `config/db.js`.
5. Place the required JSON files (`data.json`, `up.json`) in the root directory.
6. Start the server:
   ```bash
   npm start
   ```

---

## API Endpoints

### 1. `GET /locationdata`
Fetches location data from `data.json`.

**Response:**
```json
{
  "data": [ ... ]
}
```

### 2. `GET /districts`
Fetches districts for a given state.

**Query Parameters:**
- `state` (required): Name of the state.

**Response:**
```json
[
  "District1",
  "District2",
  ...
]
```

### 3. `GET /subdistricts`
Fetches subdistricts for a given state and district.

**Query Parameters:**
- `state` (required): Name of the state.
- `district` (required): Name of the district.

**Response:**
```json
[
  "Subdistrict1",
  "Subdistrict2",
  ...
]
```

### 4. `GET /villages`
Fetches villages for a given state, district, and subdistrict.

**Query Parameters:**
- `state` (required): Name of the state.
- `district` (required): Name of the district.
- `subdistrict` (required): Name of the subdistrict.

**Response:**
```json
[
  "Village1",
  "Village2",
  ...
]
```

### 5. `POST /getcoordinates`
Fetches latitude, longitude, and display name for a given location.

**Body Parameters:**
- `state` (required): Name of the state.
- `village` (required): Name of the village.

**Response:**
```json
{
  "lat": 28.7041,
  "lon": 77.1025,
  "display_name": "Village, State, India"
}
```

---

## Folder Structure
```
.
├── config
│   └── db.js             # Database configuration
├── data.json             # JSON file for general location data
├── up.json               # JSON file for Uttar Pradesh-specific data
├── server.js             # Entry point of the application
├── controllers
│   └── location.js       # Contains all API logic
└── package.json          # Node.js package configuration
```

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Storage**: JSON files
- **API Integration**: Google Maps Geocoding API

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For queries, feel free to reach out:

- **Name**: Swapnil Dubey
- **Email**: swapnildubey3636@gmail.ocm

