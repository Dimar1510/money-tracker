const { prisma } = require("../prisma/prisma-client");
const errorMessage = require("../utils/error-message");

const categoryController = {
  getCategories: async (req, res, next) => {
    const userId = req.user.userId;
    try {
      const categories = await prisma.category.findMany({
        where: { userId },
        select: { name: true },
      });

      res.json(categories);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Get Transactions"));
    }
  },
};

module.exports = categoryController;
