"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase"; 

export default function Home() {
  const [dni, setDni] = useState(1);
  const [listaAut, setListaAut] = useState([]); 
  const [historia, setHistoria] = useState([]);
  const [szukaj, setSzukaj] = useState("");

  useEffect(() => {
    async function pobierzAuta() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const sformatowane = data.map(auto => ({
          id: auto.id,
          nazwa: `${auto.brand} ${auto.model}`,
          cena: auto.price,
          status: "Dostępny"
        }));
        setListaAut(sformatowane);
      }
    }
    pobierzAuta();
  }, []);

  const przefiltrowaneAuta = listaAut.filter((auto) =>
    auto.nazwa.toLowerCase().includes(szukaj.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 p-4 flex justify-between items-center px-10 shadow-sm">
        <div className="font-bold text-xl uppercase italic">
          Auto<span className="text-blue-600">Flex</span>
        </div>
      </nav>

      <div className="pt-32 flex flex-col items-center px-6">
        <div className="w-full max-w-xl bg-white p-8 rounded-[2.5rem] shadow-xl border mb-8 text-center">
          <h1 className="text-3xl font-black mb-4 uppercase">Dni: {dni}</h1>
          <input type="range" min="1" max="30" value={dni} onChange={(e) => setDni(parseInt(e.target.value))} className="w-full h-3 bg-blue-50 rounded-full appearance-none cursor-pointer accent-blue-600" />
        </div>

        <div className="w-full max-w-xl mb-12">
          <input type="text" placeholder="Szukaj..." className="w-full p-5 rounded-2xl border outline-none" onChange={(e) => setSzukaj(e.target.value)} />
        </div>

        {/* TU BYŁ BŁĄD - linia 146 poprawiona */}
        <div className="max-w-6xl w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {przefiltrowaneAuta.map((auto) => (
              <div key={auto.id} className="bg-white rounded-3xl shadow-lg p-6 border group">
                <h3 className="text-xl font-bold mb-4">{auto.nazwa}</h3>
                <div className="flex justify-between items-end border-t pt-4">
                  <span className="text-2xl font-black">{auto.cena * dni} PLN</span>
                  <button className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold">Rezerwuj</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}