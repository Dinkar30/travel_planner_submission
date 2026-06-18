"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-neutral-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-brand-ink">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button 
            type="submit" 
            className="w-full bg-[#D55D27] hover:bg-[#bb4c1b] font-bold" 
            disabled={loading}
          >
            {loading ? "Verifying..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}