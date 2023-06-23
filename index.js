const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/auth");

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

// Sign up, sign in and sign out routes
app.use(authRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
