const { prisma } = require("../prisma/prisma-client");
const errorMessage = require("../utils/error-message");
const mockTransactionsList = require("../prisma/transactions");

const processCategories = async (transactions, userId) => {
  const categoryMap = {};

  const uniqueCategories = [
    ...new Set(
      transactions.map((tx) =>
        tx.category
          ? tx.category.toLowerCase().trim()
          : (tx.category = "__other")
      )
    ),
  ];

  const existingCategories = await prisma.category.findMany({
    where: {
      userId,
      name: { in: uniqueCategories },
    },
  });

  for (const category of existingCategories) {
    categoryMap[category.name] = category.id;
  }

  for (const category of uniqueCategories) {
    if (!categoryMap[category]) {
      const newCategory = await prisma.category.create({
        data: {
          name: category,
          userId,
        },
      });
      categoryMap[category] = newCategory.id;
    }
  }

  return categoryMap;
};

const populateController = {
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

      const transactions2023 = mockTransactionsList.filter((tx) =>
        tx.date.startsWith("2023")
      );

      const categoryMap = await processCategories(transactions2023, userId);

      const transactionsToCreate = transactions2023.map((transaction) => {
        const newDate = new Date(transaction.date);
        return {
          name: transaction.name,
          date: newDate.toISOString(),
          amount: parseInt(transaction.amount),
          categoryId: categoryMap[transaction.category.toLowerCase().trim()],
          userId,
          type: transaction.type,
        };
      });

      if (transactionsToCreate.length > 0) {
        await prisma.transaction.createMany({
          data: transactionsToCreate,
        });
      }

      res.status(201).json({ message: "transactions created" });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Populate"));
    }
  },
};

module.exports = populateController;
