const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();
const PORT = 5000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(
  cookieSession({
    keys: ["lsajdjasdjsdssf"],
  })
);

app.post("/signup", async (req, res) => {
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

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found!");
  }

  if (user.password !== password) {
    return res.send("Invalid password!");
  }

  req.session.userId = user.id;

  res.send("You are signed in!");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
