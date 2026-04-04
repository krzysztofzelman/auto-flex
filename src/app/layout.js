'use client'

import { Geist } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <html lang="pl">
      <body className={geistSans.variable} style={{ margin: 0, minHeight: "100vh" }}>
        <nav style={{
          background: "#0f172a",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#60a5fa", fontSize: "18px", fontWeight: "500", letterSpacing: "1px", cursor: "pointer" }}>
              AUTO<span style={{ color: "#fff" }}>FLEX</span>
            </span>
          </Link>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {!loading && (
              <>
                <a href="/" style={{ color: "#94a3b8", fontSize: "14px", textDecoration: "none" }}>
                  Lista ogłoszeń
                </a>
                {user ? (
                  <>
                    <a href="/dodaj" style={{
                      color: "#fff",
                      fontSize: "14px",
                      textDecoration: "none",
                      background: "#2563eb",
                      padding: "7px 16px",
                      borderRadius: "6px",
                    }}>
                      + Dodaj auto
                    </a>
                    <button
                      onClick={handleLogout}
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        background: "#ef4444",
                        border: "none",
                        padding: "7px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Wyloguj się
                    </button>
                  </>
                ) : (
                  <a href="/login" style={{
                    color: "#fff",
                    fontSize: "14px",
                    textDecoration: "none",
                    background: "#2563eb",
                    padding: "7px 16px",
                    borderRadius: "6px",
                  }}>
                    Zaloguj się
                  </a>
                )}
              </>
            )}
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}