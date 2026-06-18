"use client";

import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // No user found? Kick them to the login page
        router.push("/login");
      } else {
        setAuthorized(true);
      }
    };
    checkUser();
  }, [router]);

  if (!authorized) return null;
  const navItems = [
    { name: "Enquiries", href: "/admin" },
    { name: "Manage Trips", href: "/admin/trips" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-100 fixed h-full flex flex-col font-poppins">
        <div className="p-8">
          <h1 className="text-xl font-bold text-[#D55D27]">Nomichi Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                pathname === item.href 
                  ? "bg-[#D55D27] text-white shadow-md" 
                  : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-neutral-50">
          <Link href="/" className="text-xs font-bold text-neutral-400 hover:text-brand-rust uppercase tracking-widest">
            Public Site
          </Link>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}