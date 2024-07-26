const { prisma } = require("../prisma/prisma-client");
const errorMessage = require("../utils/error-message");
const mockTransactionsList = require("../prisma/transactions");

const categoryHandle = async (category, userId) => {
  let newCategoryId;
  try {
    if (category) {
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
      }
    } else {
      const nameless = await prisma.category.findFirst({
        where: { AND: [{ userId }, { name: "__other" }] },
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
    if (amount < 1) {
      return res.status(400).json({ error: "Amount can't be 0 or less" });
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
      if (amount < 1) {
        return res.status(400).json({ error: "Amount can't be 0 or less" });
      }

      const newCategoryId = await categoryHandle(category, userId);

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          name: name || undefined,
          date: newDate ? newDate.toISOString() : undefined,
          amount: amount ? parseInt(amount) : undefined,
          categoryId: newCategoryId,
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
        orderBy: {
          date: "asc",
        },
        include: { category: { select: { name: true } } },
      });
      const totalExpenseByYear = await prisma.transaction.aggregateRaw({
        pipeline: [
          { $match: { userId: { $oid: userId }, type: "expense" } },
          {
            $lookup: {
              let: { catObjId: { $toObjectId: "$categoryId" } },
              from: "Category",
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$catObjId"] } } },
              ],
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $group: {
              _id: {
                year: { $dateToString: { format: "%Y", date: "$date" } },
                month: { $dateToString: { format: "%Y-%m", date: "$date" } },
              },
              expense: { $sum: "$amount" },
              categories: {
                $push: { name: "$category.name", expense: { $sum: "$amount" } },
              },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $group: {
              _id: "$_id.year",
              months: {
                $push: {
                  month: "$_id.month",
                  expense: "$expense",
                  categories: "$categories",
                },
              },
            },
          },
        ],
      });

      const totalIncomeByYear = await prisma.transaction.aggregateRaw({
        pipeline: [
          { $match: { userId: { $oid: userId }, type: "income" } },
          {
            $group: {
              _id: {
                year: { $dateToString: { format: "%Y", date: "$date" } },
                month: { $dateToString: { format: "%Y-%m", date: "$date" } },
              },
              income: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $group: {
              _id: "$_id.year",
              months: { $push: { month: "$_id.month", income: "$income" } },
            },
          },
        ],
      });

      const expenseMap = new Map();
      const incomeMap = new Map();

      totalExpenseByYear.forEach((yearData) => {
        expenseMap.set(yearData._id, yearData);
      });

      totalIncomeByYear.forEach((yearData) => {
        incomeMap.set(yearData._id, yearData);
      });

      // Combine data
      const combinedResult = [];

      // Create a set of all unique years
      const allYears = new Set([...expenseMap.keys(), ...incomeMap.keys()]);

      allYears.forEach((year) => {
        const expenseYearData = expenseMap.get(year) || { months: [] };
        const incomeYearData = incomeMap.get(year) || { months: [] };

        // Create a map of all unique months
        const allMonthsMap = new Map();

        expenseYearData.months.forEach((monthData) => {
          allMonthsMap.set(monthData.month, {
            month: monthData.month,
            expense: monthData.expense,
            expenseCategories: monthData.categories || [],
            income: 0,
          });
        });

        incomeYearData.months.forEach((monthData) => {
          if (allMonthsMap.has(monthData.month)) {
            const existingMonthData = allMonthsMap.get(monthData.month);
            existingMonthData.income = monthData.income;
          } else {
            allMonthsMap.set(monthData.month, {
              month: monthData.month,
              expense: 0,
              expenseCategories: [],
              income: monthData.income,
            });
          }
        });

        // Convert the map back to an array and sort by month
        const combinedMonths = Array.from(allMonthsMap.values()).sort((a, b) =>
          a.month.localeCompare(b.month)
        );

        combinedResult.push({
          year: year,
          months: combinedMonths,
        });
      });

      // Sort the combined result by year
      combinedResult.sort((a, b) => a.year.localeCompare(b.year));

      res.json({
        transactions,
        totalIncomeByYear,
        byYearData: combinedResult,
      });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Transactions"));
    }
  },

  populate: async (req, res, next) => {
    const userId = req.user.userId;
    try {
      const allTransaction = await prisma.transaction.findMany({
        where: { userId },
      });
      if (allTransaction.length > 0) {
        return res.status(400).json({ error: "Transactions are present" });
      }
      await prisma.transaction.deleteMany({ where: { userId } });
      await prisma.category.deleteMany({ where: { userId } });
      for (let transaction of mockTransactionsList) {
        //mock data for 2023
        if (transaction.date.startsWith("2023")) {
          const newDate = new Date(transaction.date);
          const newCategoryId = await categoryHandle(
            transaction.category,
            userId
          );
          await prisma.transaction.create({
            data: {
              name: transaction.name,
              date: newDate.toISOString(),
              amount: parseInt(transaction.amount),
              categoryId: newCategoryId,
              userId,
              type: transaction.type,
            },
          });
        }
      }
      res.status(201).json({ message: "transactions deleted" });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Populate"));
    }
  },
};

module.exports = transactionController;
