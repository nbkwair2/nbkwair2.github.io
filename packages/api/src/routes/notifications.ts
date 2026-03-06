import { Router } from "express";
import { prisma } from "@cloudkitchen/db";
import { authenticate, type AuthRequest } from "../middleware/auth";

export const notificationsRouter = Router();

notificationsRouter.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
});

notificationsRouter.patch("/:id/read", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params["id"], userId: req.user!.userId },
      data: { read: true },
    });
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
});
