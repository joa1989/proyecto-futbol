"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);

    const firstUrl = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const res = await fetch(firstUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error ?? "Error");
      return;
    }

    // si registró, hace login para setear cookie
    if (mode === "register") {
      const res2 = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data2 = await res2.json().catch(() => ({}));
      if (!res2.ok) {
        setError(data2?.error ?? "Error login");
        return;
      }
    }

    r.push("/dashboard");
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Proyecto Futbol
      </h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("register")} disabled={mode === "register"}>
          Registro
        </button>
        <button onClick={() => setMode("login")} disabled={mode === "login"}>
          Login
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="password (mín 8)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={submit}>
          {mode === "register" ? "Crear cuenta" : "Entrar"}
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>
    </main>
  );
}