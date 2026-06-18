import { supabase } from "@/lib/supabase";
import EnquiryForm from "@/components/EnquiryForm";

function formatDates(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const s = new Date(start).toLocaleDateString("en-IN", opts);
  const e = new Date(end).toLocaleDateString("en-IN", opts);
  return `${s} – ${e}`;
}

export default async function Page() {
  const { data: trips } = await supabase.from("trips").select("*").eq("status", "open");

  return (
    <main className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] font-poppins pb-20">
      {/* Header */}
      <header className="py-16 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Travel that finds you.
        </h1>
        <p className="text-lg text-neutral-600 max-w-xl mx-auto">
          Slow, offbeat, small-group journeys designed to feel personal.
        </p>
      </header>

      {/* Trip Cards */}
      <section className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
        {trips?.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow flex flex-col">
            <h2 className="text-2xl font-bold text-[#D55D27] mb-4">{trip.name}</h2>
            
            <div className="space-y-2 mb-6 text-sm">
              <p><span className="font-bold opacity-60 uppercase tracking-wider text-[10px]">Destination</span><br/>{trip.destination}</p>
              <p><span className="font-bold opacity-60 uppercase tracking-wider text-[10px]">Dates</span><br/>{formatDates(trip.start_date, trip.end_date)}</p>
              <p><span className="font-bold opacity-60 uppercase tracking-wider text-[10px]">Price (incl. GST)</span><br/>
                <span className="text-lg font-semibold">₹{Number(trip.price_gst).toLocaleString("en-IN")}</span>
              </p>
            </div>

            <p className="text-neutral-700 leading-relaxed text-sm border-t pt-6 mt-auto">
              {trip.description}
            </p>
          </div>
        ))}
      </section>

      {/* Enquiry Form Section */}
      <section className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
          <div className="bg-[#D55D27] py-4 text-center">
            <h3 className="text-white font-bold tracking-wide uppercase text-sm">Start your journey</h3>
          </div>
          <div className="p-8">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}