import { useState, type ComponentProps, type FormEvent } from "react";
import { toast } from "sonner";
import { hotelsApi, type HotelInput } from "@/api/hotels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseList } from "@/lib/utils";
import type { Hotel } from "@/types";

/** The form's own shape: every field is a string, as the inputs hold them. */
interface HotelFields {
  name: string;
  slug: string;
  city: string;
  country: string;
  address: string;
  starRating: string;
  description: string;
  amenities: string;
}

function initialFields(hotel?: Hotel): HotelFields {
  return {
    name: hotel?.name ?? "",
    slug: hotel?.slug ?? "",
    city: hotel?.city ?? "",
    country: hotel?.country ?? "",
    address: hotel?.address ?? "",
    starRating: String(hotel?.star_rating ?? 4),
    description: hotel?.description ?? "",
    amenities: hotel?.amenities.join(", ") ?? "",
  };
}

export function HotelForm({ hotel, onSaved }: { hotel?: Hotel; onSaved: () => void }) {
  const [fields, setFields] = useState<HotelFields>(() => initialFields(hotel));
  const [saving, setSaving] = useState(false);

  function set<K extends keyof HotelFields>(key: K, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const input: HotelInput = {
      name: fields.name,
      slug: fields.slug,
      city: fields.city,
      country: fields.country,
      address: fields.address,
      description: fields.description,
      starRating: Number(fields.starRating),
      amenities: parseList(fields.amenities),
    };

    try {
      if (hotel) {
        await hotelsApi.update(hotel.id, input);
      } else {
        await hotelsApi.create(input);
        // The trailing card is the "add" slot, so empty it for the next property.
        setFields(initialFields());
      }
      toast.success("Property saved.");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save property.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hotel?.name ?? "Add property"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            name="name"
            value={fields.name}
            onChange={(event) => set("name", event.target.value)}
            required
          />
          <Field
            label="Slug"
            name="slug"
            value={fields.slug}
            onChange={(event) => set("slug", event.target.value)}
            required
          />
          <Field
            label="City"
            name="city"
            value={fields.city}
            onChange={(event) => set("city", event.target.value)}
            required
          />
          <Field
            label="Country"
            name="country"
            value={fields.country}
            onChange={(event) => set("country", event.target.value)}
            required
          />
          <Field
            label="Address"
            name="address"
            value={fields.address}
            onChange={(event) => set("address", event.target.value)}
            required
          />
          <Field
            label="Stars"
            name="starRating"
            type="number"
            min="1"
            max="5"
            value={fields.starRating}
            onChange={(event) => set("starRating", event.target.value)}
            required
          />
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={fields.description}
              onChange={(event) => set("description", event.target.value)}
              required
            />
          </div>
          <Field
            label="Amenities (comma separated)"
            name="amenities"
            value={fields.amenities}
            onChange={(event) => set("amenities", event.target.value)}
            className="sm:col-span-2"
          />
          <Button className="sm:col-span-2" disabled={saving}>
            Save property
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
