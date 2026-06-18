"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Empty form that matches our fields, including id (for editing)
const emptyForm = {
  id: null as number | null,
  name: "",
  destination: "",
  start_date: "",
  end_date: "",
  price_gst: "",
  total_seats: "",
  description: "",
  status: "open",
};

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [formSubmitting, setFormSubmitting] = useState(false);
  // Used to determine if creating (null) or editing (id given).
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("create");

  // Fetch all trips
  async function fetchTrips() {
    setLoading(true);
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) {
      setTrips(data || []);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchTrips();
  }, []);

  // Form change handler
  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Open dialog in "create" mode
  function openCreateDialog() {
    setForm({ ...emptyForm });
    setDialogMode("create");
    setDialogOpen(true);
  }

  // Open dialog in "edit" mode with a pre-filled trip
  function openEditDialog(trip: any) {
    setForm({
      id: trip.id ?? null,
      name: trip.name ?? "",
      destination: trip.destination ?? "",
      start_date: trip.start_date ? trip.start_date.slice(0, 10) : "", // ensure YYYY-MM-DD
      end_date: trip.end_date ? trip.end_date.slice(0, 10) : "",
      price_gst: trip.price_gst != null ? String(trip.price_gst) : "",
      total_seats: trip.total_seats != null ? String(trip.total_seats) : "",
      description: trip.description ?? "",
      status: trip.status ?? "open",
    });
    setDialogMode("edit");
    setDialogOpen(true);
  }

  // Handle form submission for both create and update
  async function handleSubmitTrip(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);

    // Compose payload, converting appropriate fields
    const payload = {
      name: form.name,
      destination: form.destination,
      start_date: form.start_date,
      end_date: form.end_date,
      price_gst: parseFloat(form.price_gst),
      total_seats: parseInt(form.total_seats),
      description: form.description,
      status: form.status,
    };

    let error: any = null, data: any = null;

    // If editing, do update; else insert new
    if (form.id) {
      const res = await supabase
        .from("trips")
        .update(payload)
        .eq("id", form.id)
        .select();
      error = res.error;
      data = res.data;
    } else {
      const res = await supabase
        .from("trips")
        .insert([payload])
        .select();
      error = res.error;
      data = res.data;
    }

    if (error) {
      // Use toast if available
      if (typeof toast === "function") toast.error(form.id ? "Failed to update trip." : "Failed to create trip.");
      else alert(form.id ? "Failed to update trip." : "Failed to create trip.");
    } else {
      if (typeof toast === "function")
        toast.success(form.id ? "Trip updated!" : "Trip created!");
      // Refetch or update in-place
      if (form.id) {
        // Update trip in the trips array
        setTrips(trips =>
          trips.map(t => (t.id === form.id ? { ...t, ...data[0] } : t))
        );
      } else {
        // Add new trip to the list
        setTrips(trips => [data![0], ...trips]);
      }
      setDialogOpen(false);
      setForm({ ...emptyForm });
    }
    setFormSubmitting(false);
  }

  // Reset form and mode when dialog closes
  function handleDialogChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setForm({ ...emptyForm });
      setDialogMode("create");
    }
  }

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Trips</h1>
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#D55D27] text-white hover:bg-[#bb4c1b] font-semibold"
              onClick={openCreateDialog}
            >
              + Create Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "edit" ? "Edit Trip" : "Create a New Trip"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitTrip} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  required
                  name="name"
                  id="name"
                  placeholder="Trip Name"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  required
                  name="destination"
                  id="destination"
                  placeholder="e.g. Bali, Indonesia"
                  value={form.destination}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    required
                    name="start_date"
                    id="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    required
                    name="end_date"
                    id="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="price_gst">Price (incl GST)</Label>
                  <Input
                    required
                    name="price_gst"
                    id="price_gst"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 1500"
                    value={form.price_gst}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="total_seats">Total Seats</Label>
                  <Input
                    required
                    name="total_seats"
                    id="total_seats"
                    type="number"
                    min="1"
                    placeholder="e.g. 20"
                    value={form.total_seats}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  required
                  name="description"
                  id="description"
                  placeholder="Describe the trip"
                  value={form.description}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  name="status"
                  id="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full h-10 rounded-md border border-input px-3 text-sm"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <DialogFooter className="mt-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-[#D55D27] text-white hover:bg-[#bb4c1b] min-w-[120px]"
                  disabled={formSubmitting}
                >
                  {formSubmitting
                    ? (dialogMode === "edit" ? "Saving..." : "Creating...")
                    : (dialogMode === "edit" ? "Save" : "Create Trip")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Seats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-neutral-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-neutral-400">
                  No trips found.
                </TableCell>
              </TableRow>
            ) : (
              trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-semibold">{trip.name}</TableCell>
                  <TableCell>{trip.destination}</TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">
                      {trip.start_date ? format(new Date(trip.start_date), "dd MMM yyyy") : "?"}
                      {" - "}
                      {trip.end_date ? format(new Date(trip.end_date), "dd MMM yyyy") : "?"}
                    </span>
                  </TableCell>
                  <TableCell>${trip.price_gst?.toLocaleString()}</TableCell>
                  <TableCell>{trip.total_seats}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trip.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-neutral-200 text-neutral-700"
                    }`}>
                      {trip.status?.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-400">
                    {trip.created_at
                      ? format(new Date(trip.created_at), "dd MMM yyyy, HH:mm")
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEditDialog(trip)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}