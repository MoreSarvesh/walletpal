const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  //console.log("req headers: ", req.headers);

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    //console.log("No auth header: ", authHeader);

    return res.status(401).json({ error: "No authorization header" });
  } //unauthorized

  //console.log("authHeader: ", authHeader);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error: ", err);

      return res.status(403).json({ error: err });
    } //forbidden

    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
