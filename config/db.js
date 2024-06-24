const mongoose = require('mongoose');


require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION, {
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
const db = mongoose.connection;
