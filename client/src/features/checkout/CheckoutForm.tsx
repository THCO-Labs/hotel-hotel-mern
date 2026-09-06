import { useState, type ComponentProps, type FormEvent } from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { ApiError } from "@/api/client";
import { reservationsApi } from "@/api/reservations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { todayIso } from "@/lib/dates";
import type { HotelWithRooms, Reservation, Room } from "@/types";

interface CheckoutFormProps {
  hotel: HotelWithRooms;
  room: Room;
  defaults: { checkIn: string; checkOut: string; guests: number };
  onBooked: (reservation: Reservation) => void;
}

/**
 * Guest details form. The server action this replaced re-checked availability
 * before writing, so the API stays the authority on conflicts: everything here
 * is presentation, and rejections come back as an `ApiError`.
 */
export function CheckoutForm({ hotel, room, defaults, onBooked }: CheckoutFormProps) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  // Kept as strings so clearing a field does not snap back to 0 / NaN.
  const [guests, setGuests] = useState(String(defaults.guests));
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      const reservation = await reservationsApi.create({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: Number(guests),
        guestName,
        guestEmail,
        guestPhone: guestPhone || undefined,
        notes: notes || undefined,
      });
      onBooked(reservation);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
        setFieldErrors(cause.fieldErrors ?? {});
      } else {
        setError(cause instanceof Error ? cause.message : "Unable to create reservation");
      }
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="border-destructive/30 bg-destructive/5 text-destructive flex gap-2 rounded-lg border p-4 text-sm">
          <AlertCircle className="size-4" />
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="guestName"
          label="Full name"
          required
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          error={fieldErrors.guestName?.[0]}
        />
        <Field
          name="guestEmail"
          label="Email"
          type="email"
          required
          value={guestEmail}
          onChange={(event) => setGuestEmail(event.target.value)}
          error={fieldErrors.guestEmail?.[0]}
        />
        <Field
          name="guestPhone"
          label="Phone (optional)"
          value={guestPhone}
          onChange={(event) => setGuestPhone(event.target.value)}
          error={fieldErrors.guestPhone?.[0]}
        />
        <Field
          name="guests"
          label="Guests"
          type="number"
          min={1}
          max={room.capacity}
          required
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
          error={fieldErrors.guests?.[0]}
        />
        <Field
          name="checkIn"
          label="Check-in"
          type="date"
          min={todayIso()}
          required
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          error={fieldErrors.checkIn?.[0]}
        />
        <Field
          name="checkOut"
          label="Check-out"
          type="date"
          min={checkIn || todayIso()}
          required
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          error={fieldErrors.checkOut?.[0]}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Requests (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Accessibility, arrival time, or other requests"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        {fieldErrors.notes?.[0] && <p className="text-destructive text-xs">{fieldErrors.notes[0]}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Confirming…" : "Confirm reservation"}
      </Button>
      <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
        <ShieldCheck className="text-primary size-4" />
        Your availability is checked again before confirmation.
      </p>
    </form>
  );
}

/**
 * Typed rather than the original's `[key: string]: unknown` bag, so the
 * controlled `value`/`onChange` pair type-checks.
 */
function Field({
  label,
  name,
  error,
  ...props
}: ComponentProps<"input"> & { label: string; name: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
