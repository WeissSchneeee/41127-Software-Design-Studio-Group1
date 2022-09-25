const { Console } = require("console");
const express = require ("express");
const { addErrorLog } = require("../../index.js");
const router = express.Router();
const connection = require("../../index.js").connection;


module.exports = router;