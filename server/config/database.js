const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`database connected at port: ${connect.connection.port}`);
  } catch (error) {
    console.log(`error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
