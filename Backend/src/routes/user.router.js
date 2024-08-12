const { Router } = require("express");
const {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  handelRefreshTokens,
} = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", handelRefreshTokens);

//protected route
router.get("/", verifyJWT, getUsers);
router.get("/logout", verifyJWT, logoutUser);

module.exports = router;
