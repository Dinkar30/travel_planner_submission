import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  

  const { data: lead } = await supabase
    .from("leads")
    .select(`*, trips(name)`)
    .eq("id", id)
    .single();

  // 2. Fetch Notes (Call Log)
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (!lead) return <div className="p-10">Lead not found.</div>;

  // Server Action for Status Update
  async function updateStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    const id = formData.get("id") as string;
    await supabase.from("leads").update({ status }).eq("id", id);
  }

  // Server Action for Adding Notes
  async function addNote(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    const lead_id = formData.get("id") as string;
    if (!content) return;
    await supabase.from("notes").insert([{ lead_id, content }]);
  }

  const statuses = ["NEW", "CONTACTED", "QUALIFIED", "VIBE CHECK SENT", "CONFIRMED", "NOT A FIT"];

  return (
    <main className="min-h-screen bg-[#FFFBF5] p-8 font-poppins">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-sm text-neutral-500 hover:underline mb-4 block">← Back to Dashboard</Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Lead Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <h1 className="text-3xl font-bold mb-2">{lead.name}</h1>
              <p className="text-neutral-500 mb-6">{lead.email} • {lead.phone}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <span className="block text-xs uppercase opacity-50 font-bold">Trip</span>
                  {lead.trips?.name}
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <span className="block text-xs uppercase opacity-50 font-bold">Group</span>
                  {lead.group_type}
                </div>
              </div>

              <div className="border-t pt-6">
                <span className="block text-xs uppercase opacity-50 font-bold mb-2">Vibe Check Message</span>
                <p className="text-neutral-700 italic">"{lead.message}"</p>
              </div>
            </div>

            {/* Call Log / Notes Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <h3 className="font-bold mb-4">Call Log</h3>
              <form action={addNote} className="mb-8 space-y-2">
                <input type="hidden" name="id" value={id} />
                <Textarea name="content" placeholder="What was said on the call?" className="resize-none" />
                <Button className="bg-brand-ink text-white hover:bg-neutral-800">Add Note</Button>
              </form>

              <div className="space-y-4">
                {notes?.map((note) => (
                  <div key={note.id} className="text-sm border-l-2 border-neutral-200 pl-4 py-1">
                    <p className="text-neutral-800">{note.content}</p>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <h3 className="font-bold mb-4 text-sm uppercase opacity-50">Update Pipeline</h3>
              <form action={updateStatus} className="space-y-2">
                <input type="hidden" name="id" value={id} />
                <select name="status" className="w-full h-10 rounded-md border border-input px-3 text-sm mb-4">
                  {statuses.map(s => (
                    <option key={s} value={s} selected={lead.status === s}>{s}</option>
                  ))}
                </select>
                <Button className="w-full bg-[#D55D27] text-white hover:bg-[#bb4c1b]">Update Status</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}