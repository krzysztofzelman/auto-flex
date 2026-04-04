import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Auto-Flex | Ogłoszenia",
  description: "Nowoczesna giełda samochodowa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col bg-slate-950 text-white`}>
        
        {/* WARSTWA GRAFICZNA TŁA (AURORA) */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[130px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[110px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-10%] left-[15%] w-[700px] h-[700px] bg-indigo-800/20 rounded-full blur-[140px] animate-blob animation-delay-4000"></div>
        </div>

        {/* NOWOCZESNA NAWIGACJA (GLASSMORPHISM) */}
        <nav className="sticky top-0 z-50 flex gap-8 p-5 bg-white/5 backdrop-blur-lg border-b border-white/10 px-10 items-center">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-white hover:text-blue-400 transition-colors no-underline"
          >
            <span className="text-xl">🏠</span> Lista ogłoszeń
          </a>
          <a
            href="/dodaj"
            className="flex items-center gap-2 font-bold text-white hover:text-blue-400 transition-colors no-underline"
          >
            <span className="text-xl">➕</span> Dodaj auto
          </a>
        </nav>

        {/* GŁÓWNA TREŚĆ */}
        <main className="flex-1 relative z-10">
          {children}
        </main>

        {/* STOPKA (OPCJONALNIE) */}
        <footer className="p-10 text-center text-slate-500 border-t border-white/5 bg-black/20">
          © 2026 Auto-Flex - Twoja giełda
        </footer>

      </body>
    </html>
  );
}