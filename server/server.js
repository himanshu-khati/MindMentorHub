const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const connectCloudinary = require("./config/cloudinary");

dotenv.config();
connectDatabase();
connectCloudinary();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`mindMentor server is listening at port: ${PORT}`);
});
