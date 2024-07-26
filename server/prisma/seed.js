const transactions = require("./transactions");
const { PrismaClient } = require("@prisma/client");

const USERID = "669b6b0fa5d74412c31643cd";

const prisma = new PrismaClient();
const categoryHandle = async (category, userId) => {
  let newCategoryId;
  try {
    if (category) {
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

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();
  for (let transaction of transactions) {
    const newDate = new Date(transaction.date);
    const userId = USERID;
    const newCategoryId = await categoryHandle(transaction.category, userId);
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

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
