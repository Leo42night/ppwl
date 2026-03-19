import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export default function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col justify-center">
      <Navbar />
      <main className="flex-1 container py-8 mx-auto">
        <Outlet />
      </main>
      <footer className="p-4 border-t text-center text-sm">
        © 2026 Praktikum Pemrogragam Web Lanjut - 2026 (Asdos | Sisfo UNTAN)
      </footer>
    </div>
  );
}