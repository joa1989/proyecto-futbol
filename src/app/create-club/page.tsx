"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClubPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [colors, setColors] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/clubs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, colors }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h1 className="text-xl font-bold mb-4">Crear Club</h1>

        <input
          type="text"
          placeholder="Nombre del club"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Colores"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Crear
        </button>
      </form>
    </div>
  );
}