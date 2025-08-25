import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Menu from "@/models/Menu";

export async function GET(req: Request) {
  const storeId = req.url.split("storeId=")[1]; // query ?storeId=
  if (!storeId) return NextResponse.json({ message: "StoreId missing" }, { status: 400 });

  await connectDB();
  const menus = await Menu.find({ storeId });
  return NextResponse.json(menus);
}

//เพิ่มเมนูอาหาร
export async function POST(req: Request) {
  const body = await req.json();
  const { storeId, name, price, imageUrl, addons } = body;

  await connectDB();
  const menu = await Menu.create({ storeId, name, price, imageUrl, addons });
  return NextResponse.json(menu);
}

//ลบเมนูอาหาร
export async function DELETE(req: Request) {
  const id = req.url.split("id=")[1]; // query ?id=
  if (!id) return NextResponse.json({ message: "Id missing" }, { status: 400 });

  await connectDB();
  await Menu.findByIdAndDelete(id);
  return NextResponse.json({ message: "Menu deleted" });
}
