const { prisma } = require("../prisma/prisma-client");
const errorMessage = require("../utils/error-message");
const { format } = require("date-fns");

const categoryHandle = async (category, userId) => {
  let newCategoryId;
  try {
    if (category.trim()) {
      const findCategory = await prisma.category.findFirst({
        where: { AND: [{ userId }, { name: category.toLowerCase().trim() }] },
      });

      if (!findCategory) {
        const createCategory = await prisma.category.create({
          data: {
            name: category.toLowerCase().trim(),
            userId,
          },
        });
        newCategoryId = createCategory.id;
      } else {
        newCategoryId = findCategory.id;
      }
    } else {
      const nameless = await prisma.category.findUnique({
        where: { name: "__other" },
      });
      if (!nameless) {
        const createNameless = await prisma.category.create({
          data: {
            name: "__other",
            userId,
          },
        });
        newCategoryId = createNameless.id;
      } else {
        newCategoryId = nameless.id;
      }
    }
    return newCategoryId;
  } catch (error) {
    console.log(error);
    next(errorMessage(500, "Error in category handler"));
  }
};

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
      const newCategoryId = await categoryHandle(category, userId);
      const transaction = await prisma.transaction.create({
        data: {
          name,
          date: newDate.toISOString(),
          amount: parseInt(amount),
          categoryId: newCategoryId,
          userId,
          type,
        },
        include: {
          category: { select: { name: true } },
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
    const newDate = date ? new Date(date) : undefined;

    try {
      const existTransaction = await prisma.transaction.findUnique({
        where: { id },
      });
      if (!existTransaction) {
        return res.status(400).json({ error: "Item not found" });
      }
      if (existTransaction.userId !== userId) {
        return res.status(402).json({ error: "Forbidden" });
      }
      if (type && type !== "income" && type !== "expense") {
        return res.status(400).json({ error: "Incorrect type" });
      }

      const newCategoryId = await categoryHandle(category, userId);

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          name: name || undefined,
          date: newDate ? newDate.toISOString() : undefined,
          amount: amount ? parseInt(amount) : undefined,
          categoryId: category ? newCategoryId : undefined,
          type: type || undefined,
        },
        include: {
          category: { select: { name: true } },
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
        include: { category: { select: { name: true } } },
      });

      const getCategories = await prisma.category.findMany({
        where: { userId },
        include: {
          transactions: {
            select: {
              name: true,
              amount: true,
              type: true,
            },
          },
        },
      });

      const totalExpenseByCategory = [];
      getCategories.forEach((category) => {
        totalExpenseByCategory.push({
          total: category.transactions.reduce(
            (a, b) => (b.type === "expense" ? a + b.amount : a),
            0
          ),
          category: category.name,
          categoryId: category.id,
        });
      });

      const totalExpenseByMonth = await prisma.transaction.aggregateRaw({
        pipeline: [
          {
            $match: {
              userId: { $oid: userId },
              type: "expense",
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

      const newTransactions = [];
      transactions.forEach((item) => {
        newTransactions.push({
          ...item,
          date: format(new Date(item.date), "yyyy-MM-dd"),
        });
      });
      res.json({
        transactions: newTransactions,
        totalExpenseByCategory,
        totalExpenseByMonth,
      });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Transactions"));
    }
  },
};

module.exports = transactionController;
