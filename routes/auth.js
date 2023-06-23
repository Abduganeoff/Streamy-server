const express = require("express");
const usersRepo = require("../repositories/users");

const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });

  if (existingUser) {
    return res.send("Email in use!");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match!");
  }
  const user = await usersRepo.create({ email, password });

  // Store the id of the user inside the users cookie
  req.session.userId = user.id;

  res.send("Account created!");
});

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found!");
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send("Invalid password!");
  }

  req.session.userId = user.id;

  res.send("You are signed in!");
});

module.exports = router;
