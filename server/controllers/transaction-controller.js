const { prisma } = require("../prisma/prisma-client");
const errorMessage = require("../utils/error-message");
const { format } = require("date-fns");

const transactionController = {
  createTransaction: async (req, res, next) => {
    const { name, date, amount, category, type } = req.body;
    if (!name || !date || !amount || !type) {
      return res.status(400).json({ error: "Field missing" });
    }
    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ error: "Incorrect type" });
    }
    const newDate = new Date(date);
    const userId = req.user.userId;
    try {
      const transaction = await prisma.transaction.create({
        data: {
          name,
          date: newDate.toISOString(),
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
    const ids = req.body;
    const userId = req.user.userId;

    try {
      const transactions = await prisma.transaction.findMany({
        where: { id: { in: ids } },
      });
      if (!transactions) {
        return res.status(400).json({ error: "Item not found" });
      }
      transactions.forEach((transaction) => {
        console.log(transaction.userId, userId);
        if (transaction.userId !== userId) {
          return res.status(402).json({ error: "Forbidden" });
        }
      });

      await prisma.transaction.deleteMany({ where: { id: { in: ids } } });
      res.json({ message: "transactions deleted" });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Delete Transaction"));
    }
  },

  updateTransaction: async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const { name, date, amount, category, type } = req.body;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      return res.status(400).json({ error: "Item not found" });
    }
    if (transaction.userId !== userId) {
      return res.status(402).json({ error: "Forbidden" });
    }
    if (type && type !== "income" && type !== "expense") {
      return res.status(400).json({ error: "Incorrect type" });
    }

    const newDate = date ? new Date(date) : undefined;

    try {
      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          name: name || undefined,
          date: newDate ? newDate.toISOString() : undefined,
          amount: amount ? parseInt(amount) : undefined,
          category: category ? category.toLowerCase() : undefined,
          type: type || undefined,
        },
      });

      res.status(201).json(transaction);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Update Transaction"));
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
        by: "category",
        _sum: {
          amount: true,
        },
        where: { userId },
      });

      const byMonth = await prisma.transaction.aggregateRaw({
        pipeline: [
          {
            $match: {
              userId: { $oid: userId },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
              total: { $sum: "$amount" },
            },
          },
        ],
      });
      const categories = [];
      getCategories.forEach((category) => {
        categories.push({
          total: category._sum.amount,
          category: category.category,
        });
      });
      const newTransactions = [];
      transactions.forEach((item) => {
        newTransactions.push({
          ...item,
          date: format(new Date(item.date), "yyyy-MM-dd"),
        });
      });
      res.json({ transactions: newTransactions, categories, byMonth });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Transactions"));
    }
  },
};

module.exports = transactionController;
