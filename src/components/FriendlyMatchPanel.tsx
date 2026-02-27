"use client";

import { useEffect, useState } from "react";

type Match = {
  id: string;
  type: "FRIENDLY" | "LEAGUE";
  status: "PENDING" | "PLAYED";
  kickoffAt: string;
  playedAt: string | null;
  homeClubId: string;
  awayClubId: string | null;
  awayName: string | null;
  homeGoals: number | null;
  awayGoals: number | null;
};

function formatLocal(dtIso: string) {
  return new Date(dtIso).toLocaleString();
}

export default function FriendlyMatchPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [match, setMatch] = useState<Match | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  async function loadLatest() {
    setError("");
    const res = await fetch("/api/matches/latest", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError((data as any).error || "Error");
      setMatch(null);
      return;
    }

    setMatch((data as any).match || null);
    setNowMs(Date.now());
  }

  async function scheduleFriendly() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/matches/friendly/schedule", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data as any).error || "Error");
        return;
      }

      setMatch((data as any).match);
      setNowMs(Date.now());
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  // Carga inicial del último partido
  useEffect(() => {
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reloj interno SOLO cuando hay partido pendiente
  useEffect(() => {
    if (match?.status !== "PENDING") return;

    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [match?.status, match?.id]);

  const kickoffMs = match ? new Date(match.kickoffAt).getTime() : null;
  const isKickoffPassed = kickoffMs !== null ? nowMs >= kickoffMs : false;

  return (
    <div className="mt-6 border rounded p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Amistosos (programados)</h2>

        <button
          onClick={loadLatest}
          disabled={loading}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Refrescar
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={scheduleFriendly}
          disabled={loading}
          className="px-3 py-2 rounded border bg-blue-600 text-white font-semibold shadow cursor-pointer disabled:opacity-50 hover:opacity-90"
        >
          {loading ? "Procesando..." : "Programar amistoso (+1 min)"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4">
        {!match ? (
          <p className="text-sm opacity-70">No hay partidos todavía.</p>
        ) : (
          <div className="text-sm">
            <p>
              <strong>Estado:</strong> {match.status}
            </p>
            <p>
              <strong>Kickoff:</strong> {formatLocal(match.kickoffAt)}
            </p>
            <p>
              <strong>Rival:</strong> {match.awayName || "Rival"}
            </p>

            {match.status === "PENDING" && (
              <p className="mt-2 opacity-70">
                {isKickoffPassed
                  ? "Ya llegó la hora. Se jugará automáticamente cuando corra el runner."
                  : "Aún no es la hora. Se jugará automáticamente al llegar el kickoff."}
              </p>
            )}

            {match.status === "PLAYED" && (
              <div className="mt-3">
                <p className="opacity-70">
                  Jugado: {match.playedAt ? formatLocal(match.playedAt) : "-"}
                </p>
                <p className="text-lg font-bold mt-1">
                  Resultado: {match.homeGoals ?? 0} - {match.awayGoals ?? 0}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}