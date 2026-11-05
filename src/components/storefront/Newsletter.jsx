import { useState } from "react";
import { Flower2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NEWSLETTER_STORAGE_KEY } from "@/lib/config";
import Reveal from "@/components/storefront/Reveal";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, trimmed);
    } catch {
      /* storage unavailable */
    }
    toast.success("You are on the list. Newsletter delivery is coming soon.");
    setEmail("");
  };

  return (
    <section className="container pb-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-[26px] bg-[#F7DFE5] px-6 py-8 sm:px-9 lg:px-12 lg:py-10">
        <Flower2
          className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 text-brand-rose/25"
          strokeWidth={0.55}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -bottom-28 left-1/2 h-56 w-56 rounded-full bg-white/40 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/70 text-brand-rose-deep">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-rose-deep">
                Stay in the glow
              </p>
              <h2 className="mt-1 font-display text-[30px] font-medium leading-tight text-brand-ink sm:text-4xl">
                Join the Glowora list
              </h2>
              <p className="mt-1.5 text-xs text-brand-ink/55">
                New formulas, restocks and private rituals. No noise.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="h-11 border-white/80 bg-white text-brand-ink placeholder:text-brand-muted/60"
              aria-label="Email address"
            />
            <Button type="submit" className="h-11 shrink-0 px-5">
              Subscribe
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Newsletter;
