import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, username, storeName } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Validation ตาม role
    if (role === "customer" && !username) {
      return NextResponse.json({ message: "Username is required" }, { status: 400 });
    }
    if (role === "store" && !storeName) {
      return NextResponse.json({ message: "Store name is required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      username: role === "customer" ? username : undefined,
      storeName: role === "store" ? storeName : undefined,
    });

    return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
