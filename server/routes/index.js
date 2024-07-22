const express = require("express");
const router = express.Router();
const {
  UserController,
  TransactionController,
  CategoryController,
} = require("../controllers");
const { authenticateToken } = require("../middleware/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.current);

router.post(
  "/transactions",
  authenticateToken,
  TransactionController.createTransaction
);
router.get(
  "/transactions",
  authenticateToken,
  TransactionController.getTransactions
);
router.delete(
  "/transactions",
  authenticateToken,
  TransactionController.deleteTransaction
);
router.put(
  "/transactions/:id",
  authenticateToken,
  TransactionController.updateTransaction
);

router.get("/categories", authenticateToken, CategoryController.getCategories);

module.exports = router;
