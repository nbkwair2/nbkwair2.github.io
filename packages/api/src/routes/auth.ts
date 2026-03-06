import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@cloudkitchen/db";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      res.status(500).json({ success: false, error: "JWT_SECRET is not configured" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: process.env["JWT_EXPIRES_IN"] ?? "7d" }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, phone } = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      res.status(409).json({ success: false, error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, phone },
    });

    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      res.status(500).json({ success: false, error: "JWT_SECRET is not configured" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: process.env["JWT_EXPIRES_IN"] ?? "7d" }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
});
