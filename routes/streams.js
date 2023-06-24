const express = require("express");
const streamsRepo = require("../repositories/streamsRepo");

const router = express.Router();

router.get("/streams", (req, res) => {
  res.send("Streams");
});

router.get("/streams/:id", (req, res) => {});

router.post("/streams", (req, res) => {});

router.put("/streams/:id", (req, res) => {});

module.exports = router;
