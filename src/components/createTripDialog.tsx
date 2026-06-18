"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type Trip = {
  id?: number;
  name: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  price_gst: number | null;
  total_seats: number | null;
  description: string;
  status: string;
};

interface CreateTripDialogProps {
  trip?: Trip;
  triggerContent?: React.ReactNode;
}

function CreateTripDialog({ trip, triggerContent }: CreateTripDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Pre-fill fields if editing
  useEffect(() => {
    if (trip) {
      setName(trip.name ?? "");
      setDestination(trip.destination ?? "");
      setStartDate(trip.start_date ? trip.start_date.slice(0, 10) : ""); // YYYY-MM-DD
      setEndDate(trip.end_date ? trip.end_date.slice(0, 10) : "");
      setPrice(trip.price_gst != null ? trip.price_gst.toString() : "");
      setTotalSeats(trip.total_seats != null ? trip.total_seats.toString() : "");
      setDescription(trip.description ?? "");
      setStatus(trip.status ?? "open");
    } else {
      setName("");
      setDestination("");
      setStartDate("");
      setEndDate("");
      setPrice("");
      setTotalSeats("");
      setDescription("");
      setStatus("open");
    }
  }, [trip, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tripData = {
      name,
      destination,
      start_date: startDate ? startDate : null,
      end_date: endDate ? endDate : null,
      price_gst: price ? parseFloat(price) : null,
      total_seats: totalSeats ? parseInt(totalSeats, 10) : null,
      description,
      status,
    };

    let errorObj;

    if (trip && trip.id) {
      // Edit mode
      const { error } = await supabase
        .from("trips")
        .update(tripData)
        .eq("id", trip.id);
      errorObj = error;
    } else {
      // Create mode
      const { error } = await supabase.from("trips").insert([tripData]);
      errorObj = error;
    }

    setLoading(false);

    if (errorObj) {
      setError(errorObj.message);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  const isEdit = !!(trip && trip.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerContent || (
          <Button variant="default">
            {isEdit ? "Edit Trip" : "Create Trip"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Trip" : "Create a New Trip"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modify the details of this trip below."
              : "Fill in the details below to add a new trip."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="trip-name">Name</Label>
            <Input
              id="trip-name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="trip-destination">Destination</Label>
            <Input
              id="trip-destination"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="trip-start">Start Date</Label>
              <Input
                id="trip-start"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="trip-end">End Date</Label>
              <Input
                id="trip-end"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="trip-price">Price</Label>
              <Input
                id="trip-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="trip-total-seats">Total Seats</Label>
              <Input
                id="trip-total-seats"
                type="number"
                min="1"
                step="1"
                value={totalSeats}
                onChange={e => setTotalSeats(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="trip-description">Description</Label>
            <Textarea
              id="trip-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="trip-status">Status</Label>
            <select
              id="trip-status"
              className="w-full h-10 rounded-md border border-input px-3 text-sm bg-white"
              value={status}
              onChange={e => setStatus(e.target.value)}
              required
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTripDialog;