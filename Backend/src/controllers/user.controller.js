const pool = require("../dbConnection.js");
const jwt = require("jsonwebtoken");

//querie imports
const {
  getAllUsers,
  getUserByUsername,
  setUserRefreshToken,
  addUser,
} = require("../db_queries/users.queries.js");

//get all users
const getUsers = (req, res) => {
  pool.query(getAllUsers, (error, result) => {
    if (error) {
      console.log("error", error);
      res.status(500).json({ error: error });
    } else {
      //console.log("result", result.rows);
      res.status(200).json({ data: result.rows });
    }
  });
};

//registeration
const registerUser = (req, res) => {
  const { username, password } = req.body;
  //console.log(`username: ${username} password: ${password}`);

  pool.query(addUser, [username, password], (error, result) => {
    if (error) {
      console.log("error", error);
      return res.status(500).json({ error: error });
    } else {
      //console.log("result", result);
      return res.status(201).json({ data: result });
    }
  });
};

//login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  //console.log(`username: ${username} password: ${password}`);

  const userExists = await pool.query(getUserByUsername, [username]);
  //console.log("user:", userExists);
  //console.log("user Exists");

  if (!userExists.rowCount) {
    console.log("user does not exists");
    return res.status(400).json({ error: "user does not exists" });
  }

  if (userExists.rows[0].password !== password) {
    console.log("incorrect password");
    return res.status(401).json({ error: "incorrect password" });
  }

  //console.log("generating tokens");

  const accessToken = jwt.sign(
    {
      username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = jwt.sign(
    {
      username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  //console.log("adding refresh token");
  pool.query(setUserRefreshToken, [refreshToken, username], (error, result) => {
    if (error) {
      console.log("Refresh token error: ", error);
      res.status(500).json({ error: error });
    } else {
      //console.log("refresh token set");
    }
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(201).json({ accessToken });
};

//logout
const logoutUser = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt)
    return res.status(204).json({ message: "cookie does not exists" });

  const refreshToken = cookie.jwt;

  const user = await pool.query("SELECT * FROM users WHERE refreshtoken = $1", [
    refreshToken,
  ]);

  if (!user.rowCount) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(204).json({ error: "user not found! cookie cleared" });
  }

  pool.query(loginUser, [username, ""], (error, result) => {
    if (error) {
      console.log("error", error);
      res.status(500).json({ error: error });
    } else {
      console.log("result", result);
    }
  });

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(204).json({ message: "user logout successful" });
};

//refreshtoken
const handelRefreshTokens = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) return res.status(400).json({ error: "no jwt cookie" }); //unauthorized

  console.log(cookie.jwt);

  const refreshToken = cookie.jwt;

  const user = await pool.query("SELECT * FROM users WHERE refreshtoken = $1", [
    refreshToken,
  ]);

  console.log(user);

  if (!user.rowCount) return res.status(403).json({ error: "user not found" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.username !== user.rows[0].username)
      return res.status(403).json({ error: "Username do not match" });

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken, username: decoded.username });
  });
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  handelRefreshTokens,
  logoutUser,
};
