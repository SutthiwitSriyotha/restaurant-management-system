"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

type Addon = { name: string; price: number };

export default function MenuDashboard() {
  const [menus, setMenus] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [addonName, setAddonName] = useState("");
  const [addonPrice, setAddonPrice] = useState(0);
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    getSession().then((session: any) => {
      if (session?.user?.role === "store") {
        setStoreId(session.user.id);
        setStoreName(session.user.storeName); // ดึงชื่อร้านจาก session
        fetchMenus(session.user.id);
      }
    });
  }, []);

  const fetchMenus = async (storeId: string) => {
    const res = await fetch(`/api/menu?storeId=${storeId}`);
    const data = await res.json();
    setMenus(data);
  };

  const addAddon = () => {
    if (addonName && addonPrice) {
      setAddons([...addons, { name: addonName, price: addonPrice }]);
      setAddonName("");
      setAddonPrice(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, name, price, addons }),
    });
    setName("");
    setPrice(0);
    setAddons([]);
    fetchMenus(storeId); // ดึงเมนูใหม่หลังเพิ่ม
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
    fetchMenus(storeId);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard: {storeName}</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label>Name</label>
          <input
            className="border px-2 py-1 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            className="border px-2 py-1 w-full"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div className="border p-2 rounded">
          <h2 className="font-semibold">Add-ons</h2>
          {addons.map((a, idx) => (
            <p key={idx}>{a.name} +{a.price} บาท</p>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Addon Name"
              className="border px-2 py-1 flex-1"
              value={addonName}
              onChange={(e) => setAddonName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="border px-2 py-1 w-24"
              value={addonPrice}
              onChange={(e) => setAddonPrice(Number(e.target.value))}
            />
            <button type="button" onClick={addAddon} className="bg-green-500 text-white px-3 rounded">
              Add
            </button>
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
          Add Menu
        </button>
      </form>

      <div className="space-y-2">
        {menus.map((menu) => (
          <div key={menu._id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <h2 className="font-bold">{menu.name}</h2>
              <p>Price: {menu.price} บาท</p>
              {menu.addons?.length > 0 && (
                <p>Add-ons: {menu.addons.map((a: Addon) => `${a.name}+${a.price}บาท`).join(", ")}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(menu._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
