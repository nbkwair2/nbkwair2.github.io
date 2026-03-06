import { Router } from "express";
import { z } from "zod";
import { prisma } from "@cloudkitchen/db";
import { authenticate, type AuthRequest } from "../middleware/auth";
import { OrderStatus } from "@cloudkitchen/shared-types";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
      notes: z.string().optional(),
    })
  ),
  deliveryAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  specialInstructions: z.string().optional(),
});

ordersRouter.get("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user!.userId },
      include: {
        items: { include: { menuItem: true } },
        deliveryAddress: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
});

ordersRouter.get("/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params["id"] },
      include: {
        items: { include: { menuItem: true } },
        deliveryAddress: true,
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    // Customers can only view their own orders
    if (req.user!.role === "CUSTOMER" && order.customerId !== req.user!.userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

ordersRouter.post("/", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { items, deliveryAddress, specialInstructions } = createOrderSchema.parse(req.body);

    // Fetch menu items
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: items.map((i) => i.menuItemId) } },
    });

    if (menuItems.length !== items.length) {
      res.status(400).json({ success: false, error: "One or more menu items not found" });
      return;
    }

    const subtotal = items.reduce((sum, item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
      return sum + Number(menuItem.price) * item.quantity;
    }, 0);

    const tax = subtotal * 0.1;
    const deliveryFee = deliveryAddress ? 5.0 : 0;
    const total = subtotal + tax + deliveryFee;

    const order = await prisma.order.create({
      data: {
        customerId: req.user!.userId,
        subtotal,
        tax,
        deliveryFee,
        total,
        specialInstructions,
        items: {
          create: items.map((item) => {
            const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPrice: Number(menuItem.price),
              totalPrice: Number(menuItem.price) * item.quantity,
              notes: item.notes,
            };
          }),
        },
        ...(deliveryAddress && {
          deliveryAddress: { create: deliveryAddress },
        }),
      },
      include: {
        items: { include: { menuItem: true } },
        deliveryAddress: true,
      },
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

ordersRouter.patch("/:id/status", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { status } = z
      .object({ status: z.nativeEnum(OrderStatus) })
      .parse(req.body);

    const order = await prisma.order.update({
      where: { id: req.params["id"] },
      data: { status },
    });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});
