import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "store"], default: "customer" },
  username: { type: String }, // สำหรับลูกค้า
  storeName: { type: String }, // สำหรับร้าน
});

const User = models.User || mongoose.model("User", userSchema);
export default User;
