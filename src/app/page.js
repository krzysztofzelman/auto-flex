"use client"
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import { supabase } from "@/supabase"; 

export default function Home() {
  const [dni, setDni] = useState(1);
  const [listaAut, setListaAut] = useState([]); 

  useEffect(() => {
    async function pobierzAuta() {
      // Jeśli supabase jest nullem (podczas buildu), przerywamy cicho
      if (!supabase) return;
      
      const { data } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setListaAut(data.map(auto => ({
          id: auto.id,
          nazwa: `${auto.brand} ${auto.model}`,
          cena: auto.price
        })));
      }
    }
    pobierzAuta();
  }, []);

  return (
    <main className="p-10 font-sans min-h-screen bg-white text-black">
      <h1 className="text-3xl font-black italic uppercase mb-10">AutoFlex</h1>
      
      <div className="bg-slate-100 p-6 rounded-2xl mb-10 max-w-md">
        <p className="font-bold mb-2">Dni wynajmu: {dni}</p>
        <input type="range" min="1" max="30" value={dni} onChange={(e) => setDni(parseInt(e.target.value))} className="w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listaAut.length > 0 ? listaAut.map((auto) => (
          <div key={auto.id} className="border-2 border-black p-6 rounded-3xl">
            <h2 className="text-xl font-bold">{auto.nazwa}</h2>
            <p className="text-2xl font-black mt-4">{auto.cena * dni} PLN</p>
            <button className="mt-4 bg-black text-white px-6 py-2 rounded-full font-bold w-full">Rezerwuj</button>
          </div>
        )) : <p>Ładowanie aut lub brak danych...</p>}
      </div>
    </main>
  );
}