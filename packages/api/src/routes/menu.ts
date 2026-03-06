import { Router } from "express";
import { prisma } from "@cloudkitchen/db";

export const menuRouter = Router();

menuRouter.get("/", async (_req, res, next) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { available: true },
          orderBy: { name: "asc" },
        },
      },
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});

menuRouter.get("/items/:id", async (req, res, next) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params["id"] },
      include: { category: true },
    });
    if (!item) {
      res.status(404).json({ success: false, error: "Menu item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});
