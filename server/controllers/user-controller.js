const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const errorMessage = require("../utils/error-message");
const jwt = require("jsonwebtoken");

const UserController = {
  register: async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Field missing" });
    }

    try {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Register"));
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Field missing" });
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: "Wrong login or password" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Wrong login or password" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      console.log(req.body);
      res.json({ token });
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Login"));
    }
  },

  current: async (req, res, next) => {
    const userId = req.user.userId;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.log(error);
      next(errorMessage(500, "Error in Current"));
    }
  },
};

module.exports = UserController;
