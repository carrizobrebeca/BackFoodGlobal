
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dp60mfvgd',
  api_key: 'CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dp60mfvgd',
  api_secret: '-vF37gciGAv9ICq-Gw0TLEkRej0'
});

module.exports = cloudinary;
