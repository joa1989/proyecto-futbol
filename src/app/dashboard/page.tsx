"use client";
import FriendlyMatchPanel from "@/components/FriendlyMatchPanel";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const resUpcoming = await fetch("/api/matches/upcoming", {
        credentials: "include",
      });

      if (resUpcoming.ok) {
        const data = await resUpcoming.json();
        setUpcoming(Array.isArray(data) ? data : []);
      } else {
        setUpcoming([]);
      }

      const resRecent = await fetch("/api/matches/recent", {
        credentials: "include",
      });

      if (resRecent.ok) {
        const data = await resRecent.json();
        setRecent(Array.isArray(data) ? data : []);
      } else {
        setRecent([]);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <FriendlyMatchPanel />
      <div>
        <h2 className="text-xl font-semibold mb-3">Próximos partidos</h2>
        {upcoming.length === 0 && <p>No hay partidos programados.</p>}
        {upcoming.map((match) => (
          <div key={match.id} className="border p-3 rounded mb-2">
            <p>Kickoff: {new Date(match.kickoffAt).toLocaleString()}</p>
            <p>Estado: {match.status}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Últimos resultados</h2>
        {recent.length === 0 && <p>No hay resultados aún.</p>}
        {recent.map((match) => (
          <div key={match.id} className="border p-3 rounded mb-2">
            <p>
              Resultado: {match.homeGoals} - {match.awayGoals}
            </p>
            <p>Jugado: {match.playedAt ? new Date(match.playedAt).toLocaleString() : "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}