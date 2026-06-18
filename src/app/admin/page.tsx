"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  status: "NEW" | "CONTACTED" | "CONFIRMED";
  trip: {
    name: string;
  } | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadge(status: Lead['status']) {
  let color = "";
  switch (status) {
    case "NEW":
      color = "bg-blue-100 text-blue-800";
      break;
    case "CONTACTED":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "CONFIRMED":
      color = "bg-green-100 text-green-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }
  return (
    <Badge className={`text-xs px-2 py-1 font-semibold rounded-md ${color}`}>
      {status}
    </Badge>
  );
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      // join with trips
      let { data, error } = await supabase
        .from("leads")
        .select(
          `
            id,
            created_at,
            name,
            email,
            status,
            trip:trip_id (
              name
            )
          `
        )
        .order("created_at", { ascending: false });
      if (!error && data) setLeads(data as Lead[]);
      setLoading(false);
    }
    fetchLeads();
  }, []);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-neutral-900 font-poppins px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-neutral-600">Manage traveller enquiries all in one place.</p>
        </header>
        <div className="bg-white rounded-xl shadow-lg border border-neutral-100 overflow-x-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Leads</h2>
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Traveller Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trip Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-400">
                      No leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{formatDate(lead.created_at)}</TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${lead.email}`}
                          className="underline text-blue-600 hover:text-blue-800"
                        >
                          {lead.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {lead.trip?.name || (
                          <span className="text-neutral-400">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(lead.status)}</TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-sm text-[#D55D27] hover:underline font-semibold"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}