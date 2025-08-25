import mongoose, { Schema, models } from "mongoose";

const MenuSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    addons: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const Menu = models.Menu || mongoose.model("Menu", MenuSchema);
export default Menu;
