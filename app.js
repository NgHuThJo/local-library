const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const catalogRouter = require("./routes/catalog");

const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  validate: { xForwardedForHeader: false },
});

const app = express();

// Connect to database
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

async function main() {
  const dev_db_url =
    "mongodb+srv://admin:mypassword@cluster0.gtpnbtc.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0";
  const mongoDB = process.env.MONGO_URL || dev_db_url;

  await mongoose.connect(mongoDB);
}

main().catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.use(limiter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
