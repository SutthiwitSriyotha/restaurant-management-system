import { NextResponse } from "next/server"; 
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

type RegisterBody = {
  email: string;
  password: string;
  role?: string;
};

export async function POST(req: Request) {
  try {
    const { email, password, role }: RegisterBody = await req.json();
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, role });

    return NextResponse.json(
      { 
        message: "User created", 
        user: { id: newUser._id.toString(), email: newUser.email, role: newUser.role } 
      }, 
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
