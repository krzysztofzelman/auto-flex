"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase"; 

export default function Home() {
  const [dni, setDni] = useState(1);
  const [listaAut, setListaAut] = useState([]); 
  const [historia, setHistoria] = useState([]);
  const [szukaj, setSzukaj] = useState("");
  const [polubione, setPolubione] = useState({});

  useEffect(() => {
    async function pobierzAuta() {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Błąd pobierania:", error);
      } else if (data) {
        const sformatowane = data.map(auto => ({
          id: auto.id,
          nazwa: `${auto.brand} ${auto.model}`,
          cena: auto.price,
          paliwo: "Benzyna",
          status: "Dostępny"
        }));
        setListaAut(sformatowane);
      }
    }
    pobierzAuta();
  }, []);

  const sumaZarobku = historia.reduce((acc, curr) => acc + Number(curr.koszt), 0);
  const liczbaWynajmow = historia.length;
  const przefiltrowaneAuta = listaAut.filter((auto) =>
    auto.nazwa.toLowerCase().includes(szukaj.toLowerCase())
  );

  const toggleLike = (id) => {
    setPolubione((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBooking = (auto) => {
    if (auto.status === "Wypożyczony") return;
    const finalnyKoszt = (dni > 5 ? auto.cena * dni * 0.9 : auto.cena * dni).toFixed(0);
    const nowaLista = listaAut.map((a) => a.id === auto.id ? { ...a, status: "Wypożyczony" } : a);
    setListaAut(nowaLista);
    setHistoria([{ id: Date.now(), auto: auto.nazwa, dni, koszt: finalnyKoszt, godzina: new Date().toLocaleTimeString() }, ...historia]);
    alert(`Sukces! Zarezerwowano ${auto.nazwa}.`);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900 font-sans">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 p-4 flex justify-between items-center px-10 shadow-sm">
        <div className="font-bold text-xl uppercase tracking-tighter italic">
          Auto<span className="text-blue-600">Flex</span>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold">Zaloguj</button>
      </nav>

      <div className="pt-32 flex flex-col items-center px-6">
        <div className="w-full max-w-xl bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 text-center">
          <h1 className="text-3xl font-black mb-4 uppercase">Czas wynajmu</h1>
          <div className="flex items-center justify-center gap-4 mb-6 text-blue-600">
            <span className="text-6xl font-black">{dni}</span>
            <span className="text-slate-400 font-bold text-xl uppercase pt-2">Dni</span>
          </div>
          <input type="range" min="1" max="30" value={dni} onChange={(e) => setDni(parseInt(e.target.value))} className="w-full h-3 bg-blue-50 rounded-full appearance-none cursor-pointer accent-blue-600" />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xl mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-md text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Przychód</p>
            <p className="text-3xl font-black text-green-600">{sumaZarobku} PLN</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-md text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Rezerwacje</p>
            <p className="text-3xl font-black text-blue-600">{liczbaWynajmow}</p>
          </div>
        </div>

        <div className="w-full max-w-xl mb-12">
          <input type="text" placeholder="Szukaj modelu..." className="w-full p-5 rounded-2xl border border-slate-200 outline-none text-lg" onChange={(e) => setSzukaj(e.target.value)} />
        </div>

        <div className="max-w-6xl w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {przefiltrowaneAuta.map((auto) => (
              <div key={auto.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 group transition-all hover:shadow-2xl">
                <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400 font-black uppercase text-2xl p-4 opacity-30">{auto.nazwa}</div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <button onClick={() => toggleLike(auto.id)} className="text-2xl">{polubione[auto.id] ? "❤️" : "🤍"}</button>
                    <h3 className="text-xl font-bold">{auto.nazwa}</h3>
                  </div>
                  <div className="flex justify-between items-end border-t pt-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Koszt</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black">{(dni > 5 ? auto.cena * dni * 0.9 : auto.cena * dni).toFixed(0)}</span>
                        <span className="text-sm font-bold text-slate-400">PLN</span>
                      </div>
                    </div>
                    <button onClick={() => handleBooking(auto)} className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white">Rezerwuj</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}