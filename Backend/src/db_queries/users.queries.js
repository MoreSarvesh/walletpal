const getAllUsers = "SELECT * FROM users";

const getUserId = "SELECT id FROM users WHERE username = $1";

const getUserByUsername = "SELECT * FROM users WHERE username = $1";

const addUser = "INSERT INTO users (username, password) VALUES ($1, $2)";

const setUserRefreshToken =
  " UPDATE users SET refreshtoken = $1 WHERE username = $2";

module.exports = {
  getAllUsers,
  getUserByUsername,
  addUser,
  setUserRefreshToken,
  getUserId,
};
