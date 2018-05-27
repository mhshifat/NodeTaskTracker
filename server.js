const express = require("express");
const color = require("colors");
const layout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

require("./database/conn");

const config = require("./config/config");

const homeRoutes = require("./routes/homeRoutes");
const registerRoutes = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");

const app = express();

app.use(layout);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(express.static("public"));

app.use(session({
  secret: 'NodeTaskTracker',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
  res.locals.user = req.cookies.NodeTaskTracker;
  res.locals.warning = req.flash('warning');
  res.locals.info = req.flash('info');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(homeRoutes);
app.use(registerRoutes);
app.use(loginRoutes);

app.listen(config.port, () => {
  console.log(color.green(`The Server Has Started >>> http://localhost:${config.port}`));
});
