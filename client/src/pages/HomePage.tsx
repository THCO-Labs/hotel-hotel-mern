import { ArrowRight, CalendarClock, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchForm } from "@/components/search-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { appConfig } from "@/config/app-config";

const features = [
  {
    icon: ShieldCheck,
    title: "Reserve without paying",
    text: "Book with your name and email. Payment happens at the hotel—nothing is charged online.",
  },
  {
    icon: CalendarClock,
    title: "Free cancellation",
    text: "Plans change. Manage eligible reservations from your booking page.",
  },
  {
    icon: Leaf,
    title: "Forest-side stays",
    text: "Hand-picked stays for scenery, quiet, and comfort—from city lodges to remote cabins.",
  },
];

export default function HomePage() {
  return (
    <>
      <section
        data-builder-id="homepage.hero"
        className="relative overflow-hidden bg-gradient-to-b from-brand-100 via-background to-background py-20 text-center dark:from-brand-950 sm:py-28"
      >
        <div className="container">
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="size-3.5" />
            {appConfig.tagline}
          </Badge>
          <h1
            data-builder-id="homepage.hero.title"
            className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
          >
            Find your quiet corner <span className="text-primary">of the world</span>
          </h1>
          <p data-builder-id="homepage.hero.description" className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            {appConfig.description}
          </p>
          <div className="mx-auto mt-10 max-w-5xl">
            <SearchForm />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Instant confirmation · No online payment · Simple booking management
          </p>
        </div>
      </section>

      <section className="container py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Why {appConfig.name}</h2>
          <p className="mt-3 text-muted-foreground">Simple, honest booking so you can spend more time outside.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-semibold">Your next escape is a search away</h2>
          <p className="mt-4 text-brand-100">Browse verified stays and reserve in minutes.</p>
          <Button asChild size="lg" className="mt-8 bg-white text-brand-800 hover:bg-brand-50">
            <Link to="/search">
              Start searching <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
