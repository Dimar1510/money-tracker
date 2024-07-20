const { prisma } = require("../prisma/prisma-client");
const errorMessage = require("../utils/error-message");

const transactionController = {
  createTransaction: async (req, res, next) => {
    const { name, date, amount, category, type } = req.body;
    if (!name || !date || !amount || !type) {
      return res.status(400).json({ error: "Field missing" });
    }
    console.log(type);
    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ error: "Incorrect type" });
    }

    const userId = req.user.userId;
    try {
      const transaction = await prisma.transaction.create({
        data: {
          name,
          date,
          amount: parseInt(amount),
          category: category.toLowerCase(),
          userId,
          type,
        },
      });

      res.status(201).json(transaction);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Create Transaction"));
    }
  },

  deleteTransaction: async (req, res, next) => {
    const { id } = req.body;
    const userId = req.user.userId;
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });
      if (!transaction) {
        return res.status(400).json({ error: "User not found" });
      }
      if (transaction.userId !== userId) {
        return res.status(402).json({ error: "Forbidden" });
      }
      await prisma.transaction.delete({ where: { id } });
      res.json({ message: "transaction deleted" });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Delete Transaction"));
    }
  },

  getTransactions: async (req, res, next) => {
    const userId = req.user.userId;
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
        },
      });

      const getCategories = await prisma.transaction.groupBy({
        by: ["category"],
        _sum: {
          amount: true,
        },
        where: { userId },
      });
      const categories = [];
      getCategories.forEach((category) => {
        categories.push({
          total: category._sum.amount,
          category: category.category,
        });
      });
      res.json({ transactions, categories });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Transactions"));
    }
  },
};

module.exports = transactionController;