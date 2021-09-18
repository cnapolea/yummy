require('dotenv').config();
const axios = require('axios');

// GEOCODING API KEY
const GEO_API_KEY = process.env.GEO_API_KEY;

module.exports = (inputsObject) => {
  const { address1, postalCode, city, country } = inputsObject;
  const formatAdress = address1.split(' ').join('+');
  return `https://maps.googleapis.com/maps/api/geocode/json?components=street_address:${formatAdress}|administrative_area:${city}|country:${country}|postal_code:${postalCode}&key=${GEO_API_KEY}`;
};
