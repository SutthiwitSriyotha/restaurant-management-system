// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

type RegisterBody = {
  email: string;
  password: string;
  role?: "customer" | "store";
  username?: string;
  storeName?: string;
};

export async function POST(req: Request) {
  try {
    const { email, password, role, username, storeName }: RegisterBody = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // validation per role
    if (role === "customer" && (!username || username.trim() === "")) {
      return NextResponse.json({ message: "Username is required for customers" }, { status: 400 });
    }
    if (role === "store" && (!storeName || storeName.trim() === "")) {
      return NextResponse.json({ message: "Store name is required for stores" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || "customer",
      username: role === "customer" ? username : undefined,
      storeName: role === "store" ? storeName : undefined,
    });

    return NextResponse.json(
      {
        message: "User created",
        user: { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
