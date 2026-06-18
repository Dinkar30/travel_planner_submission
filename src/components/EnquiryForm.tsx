"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnquirySchema, EnquiryFormValues } from "@/lib/schema";
import { supabase } from "@/lib/supabase";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EnquiryForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(EnquirySchema),
    defaultValues: {
      name: "", email: "", phone: "", trip_id: "", 
      group_type: "solo", preferred_month: "", message: "",
    },
  });

  // Fetch trips directly here to bypass prop issues
  useEffect(() => {
    async function getTrips() {
      const { data } = await supabase.from("trips").select("id, name").eq("status", "open");
      if (data) setTrips(data);
    }
    getTrips();
  }, []);

  async function onSubmit(data: EnquiryFormValues) {
    setLoading(true);
    const { error } = await supabase.from("leads").insert([data]);
    setLoading(false);
    if (!error) setSuccess(true);
    else console.error("Supabase Error:", error);
  }

  if (success) return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#D55D27] text-center font-poppins">
      <h2 className="text-2xl font-bold mb-2">Thank you</h2>
      <p>We have received your enquiry and will reach out shortly.</p>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#D55D27] font-poppins">
      <h2 className="text-xl font-bold text-center mb-6">Trip Enquiry</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="trip_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Which trip?</FormLabel>
                <FormControl>
                  <select 
                    {...field}
                    className="w-full h-11 rounded-md border border-input bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#D55D27] outline-none"
                  >
                    <option value="">Select a trip</option>
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><Input {...field} placeholder="Name" /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><Input {...field} placeholder="Phone" /></FormItem>
            )} />
          </div>

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><Input type="email" {...field} placeholder="Email" /></FormItem>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="group_type" render={({ field }) => (
              <FormItem>
                <FormLabel>Group</FormLabel>
                <select {...field} className="w-full h-11 rounded-md border border-input bg-white px-3 py-2 text-sm">
                  <option value="solo">Solo</option>
                  <option value="friends">Friends</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                </select>
              </FormItem>
            )} />
            <FormField control={form.control} name="preferred_month" render={({ field }) => (
              <FormItem><FormLabel>Month</FormLabel><Input placeholder="Oct" {...field} /></FormItem>
            )} />
          </div>

          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem>
              <FormLabel>What should this trip feel like?</FormLabel>
              <Textarea {...field} className="min-h-[80px]" placeholder="Tell us more..." />
            </FormItem>
          )} />

          <Button type="submit" className="w-full bg-[#D55D27] hover:bg-[#bb4c1b] h-12" disabled={loading}>
            {loading ? "Sending..." : "Send enquiry"}
          </Button>
        </form>
      </Form>
    </div>
  );
}