const express = require("express");
const router = express.Router();
const { contactUsController } = require("../controllers/ContactUs");
router.post("/contct", contactUsController);
module.exports = router;
