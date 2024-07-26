const { prisma } = require("../prisma/prisma-client");
const errorMessage = require("../utils/error-message");

const categoryController = {
  getCategories: async (req, res, next) => {
    const userId = req.user.userId;
    try {
      const categories = await prisma.category.findMany({
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

      res.json(categories);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Categories"));
    }
  },

  updateCategory: async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.userId;
    if (!name) {
      return res.status(400).json({ error: "Field missing" });
    }
    try {
      const existCategory = await prisma.category.findUnique({ where: { id } });
      if (!existCategory) {
        return res.status(400).json({ error: "Item not found" });
      }
      if (existCategory.userId !== userId) {
        return res.status(402).json({ error: "Forbidden" });
      }
      const findCategory = await prisma.category.findFirst({
        where: { AND: [{ userId }, { name: name.toLowerCase().trim() }] },
      });
      if (findCategory) {
        return res.status(400).json({ error: "Name taken" });
      }

      const category = await prisma.category.update({
        where: { id },
        data: {
          name: name.toLowerCase().trim(),
        },
      });
      res.json(category);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Categories"));
    }
  },

  deleteCategory: async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const existCategory = await prisma.category.findUnique({ where: { id } });
      if (!existCategory) {
        return res.status(400).json({ error: "Item not found" });
      }
      if (existCategory.userId !== userId) {
        return res.status(402).json({ error: "Forbidden" });
      }
      if (existCategory.name === "__other") {
        return res.status(402).json({ error: "Cant delete category 'other'" });
      }

      let namelessId;
      const nameless = await prisma.category.findFirst({
        where: { AND: [{ userId }, { name: "__other" }] },
      });
      if (nameless) {
        namelessId = nameless.id;
      } else {
        const createNameless = await prisma.category.create({
          data: {
            name: "__other",
            userId,
          },
        });
        namelessId = createNameless.id;
      }

      await prisma.transaction.updateMany({
        where: { categoryId: id },
        data: {
          categoryId: namelessId,
        },
      });

      await prisma.category.delete({ where: { id } });
      res.json({ message: "category deleted" });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Categories"));
    }
  },
};

module.exports = categoryController;
