const express = require("express");
const streamsRepo = require("../repositories/streamsRepo");
const { validationResult } = require("express-validator");
const {
  requireTitle,
  requirePlatform,
  requireSummary,
  requireDescription,
} = require("./validators");

const router = express.Router();

router.get("/streams", async (req, res) => {
  const streams = await streamsRepo.getAll();
  res.send(streams);
});

router.get("/streams/:id", async (req, res) => {
  const stream = await streamsRepo.getOne(req.params.id);

  if (!stream) {
    return res.status(404).send("Stream not found!");
  }

  res.send(stream);
});

router.post(
  "/streams",
  [requireTitle, requirePlatform, requireSummary, requireDescription],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { title, platform, summary, description } = req.body;

    await streamsRepo.create({
      title,
      platform,
      summary,
      description,
      upVotes: 0,
      downVotes: 0,
    });

    res.send("Stream created!");
  }
);

router.put("/streams/:id", async (req, res) => {
  const stream = await streamsRepo.getOne(req.params.id);

  if (!stream) {
    return res.status(404).send("Stream not found!");
  }

  const { upVotes, downVotes } = req.body;

  if (upVotes !== undefined) {
    stream.upVotes += upVotes;
  }

  if (downVotes !== undefined) {
    stream.downVotes += downVotes;
  }

  await streamsRepo.update(req.params.id, stream);

  res.send("Stream updated!");
});

module.exports = router;
