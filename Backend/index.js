require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { corsOptions } = require("./src/config/corsOptions.js");
const credentials = require("./src/middleware/credentials.middleware.js");
const cookieParser = require("cookie-parser");

const expenseRouter = require("./src/routes/expenses.router.js");
const budgetRouter = require("./src/routes/budgets.router.js");
const userRouter = require("./src/routes/user.router.js");

const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/budgets", budgetRouter);
app.use("/expenses", expenseRouter);

app.listen(process.env.PORT, () => {
  console.log(`App listing on Port: ${process.env.PORT}`);
});
