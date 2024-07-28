const transactions = require("./transactions");
const { PrismaClient } = require("@prisma/client");

const USERID = "669b6b0fa5d74412c31643cd";

const prisma = new PrismaClient();

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

const main = async () => {
  const userId = USERID;
  try {
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.category.deleteMany({ where: { userId } });

    const transactions2023 = transactions.filter((tx) =>
      tx.date.startsWith("20")
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
  } catch (error) {
    console.log(error);
  }
};

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
