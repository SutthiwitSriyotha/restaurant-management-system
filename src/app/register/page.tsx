"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // default = ลูกค้า
  const [username, setUsername] = useState("");
  const [storeName, setStoreName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, username, storeName }),
    });

    if (res.ok) {
      alert("Register success!");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to register");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full px-2 py-1"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full px-2 py-1"
          />
        </div>

        <div>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border w-full px-2 py-1"
          >
            <option value="customer">Customer</option>
            <option value="store">Store</option>
          </select>
        </div>

        {role === "customer" && (
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border w-full px-2 py-1"
              placeholder="ชื่อผู้ใช้"
            />
          </div>
        )}

        {role === "store" && (
          <div>
            <label>Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="border w-full px-2 py-1"
              placeholder="ชื่อร้าน เช่น ก๋วยเตี๋ยวเจ๊อ๋อง"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
