const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/auth");
const streamsRouter = require("./routes/streams");
const cors = require("cors");

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

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Sign up, sign in and sign out routes
app.use(authRouter);

// Streams routes
app.use(streamsRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
