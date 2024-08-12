const { allowedOrigins } = require("../config/corsOptions.js");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  //console.log(origin);

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }

  next();
};

module.exports = credentials;
