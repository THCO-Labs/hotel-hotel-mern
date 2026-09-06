import { useState, type ComponentProps, type FormEvent } from "react";
import { toast } from "sonner";
import { roomsApi, type RoomInput } from "@/api/rooms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseList } from "@/lib/utils";
import type { Room } from "@/types";

type HotelOption = { id: string; name: string };

/** The form's own shape: every field is a string, as the inputs hold them. */
interface RoomFields {
  hotelId: string;
  name: string;
  type: string;
  capacity: string;
  price: string;
  amenities: string;
}

function initialFields(hotels: HotelOption[], room?: Room): RoomFields {
  return {
    // An empty "add" card still needs a hotel selected, so fall back to the first option.
    hotelId: room?.hotel_id ?? hotels[0]?.id ?? "",
    name: room?.name ?? "",
    type: room?.type ?? "",
    capacity: String(room?.capacity ?? 2),
    price: room ? String(room.price_per_night) : "",
    amenities: room?.amenities.join(", ") ?? "",
  };
}

export function RoomForm({ room, hotels, onSaved }: { room?: Room; hotels: HotelOption[]; onSaved: () => void }) {
  const [fields, setFields] = useState<RoomFields>(() => initialFields(hotels, room));
  const [saving, setSaving] = useState(false);

  function set<K extends keyof RoomFields>(key: K, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const input: RoomInput = {
      hotelId: fields.hotelId,
      name: fields.name,
      type: fields.type,
      capacity: Number(fields.capacity),
      pricePerNight: Number(fields.price),
      amenities: parseList(fields.amenities),
    };

    try {
      if (room) {
        await roomsApi.update(room.id, input);
      } else {
        await roomsApi.create(input);
        // The trailing card is the "add" slot, so empty it for the next room.
        setFields(initialFields(hotels));
      }
      toast.success("Room saved.");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save room.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room?.name ?? "Add room"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Hotel</Label>
            <select
              name="hotelId"
              value={fields.hotelId}
              onChange={(event) => set("hotelId", event.target.value)}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Room name"
            name="name"
            value={fields.name}
            onChange={(event) => set("name", event.target.value)}
            required
          />
          <Field
            label="Type"
            name="type"
            value={fields.type}
            onChange={(event) => set("type", event.target.value)}
            required
          />
          <Field
            label="Capacity"
            name="capacity"
            type="number"
            min="1"
            value={fields.capacity}
            onChange={(event) => set("capacity", event.target.value)}
            required
          />
          <Field
            label="Nightly rate"
            name="price"
            type="number"
            min="0"
            value={fields.price}
            onChange={(event) => set("price", event.target.value)}
            required
          />
          <Field
            label="Amenities (comma separated)"
            name="amenities"
            value={fields.amenities}
            onChange={(event) => set("amenities", event.target.value)}
            className="sm:col-span-2"
          />
          <Button className="sm:col-span-2" disabled={saving}>
            Save room
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, className, ...props }: { label: string } & ComponentProps<typeof Input>) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}
