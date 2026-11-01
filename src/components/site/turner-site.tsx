import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { CITIES, LINKS, MAIL, NEWSLETTER, PRACTICES, ROLES } from "@/lib/site-data";

const NAV = [
  { href: "#index", label: "Index" },
  { href: "#practice", label: "Practice" },
  { href: "#signal", label: "Signal" },
  { href: "#contact", label: "Contact" },
];

function useNow(zone: string) {
  const [label, setLabel] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const tick = () => setLabel(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [zone]);
  return label;
}

function CityClock({
  city,
  code,
  zone,
}: {
  city: string;
  code: string;
  zone: string;
}) {
  const time = useNow(zone);
  return (
            <div className="group flex min-h-28 flex-col justify-between border-b border-line px-4 py-5 transition-colors duration-300 last:border-b-0 hover:bg-bone/5 sm:px-5 lg:border-b-0 lg:border-l lg:first:border-l-0">
      <div className="flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
        <span>{code}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-copper opacity-70 transition-transform duration-300 group-hover:scale-150" />
      </div>
      <p className="font-display text-3xl leading-none tracking-tight text-bone tabular-nums sm:text-4xl">
        {time}
      </p>
      <p className="text-sm text-bone/80">{city}</p>
    </div>
  );
}

export function TurnerSite() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(0);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("js");
    const nodes = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18 },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRole((n) => (n + 1) % ROLES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty("--scroll", String(p));
    };
    const onMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function copyMail() {
    void navigator.clipboard?.writeText(MAIL).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const note = String(data.get("note") || "").trim();
    const subject = encodeURIComponent(name ? `Note from ${name}` : "Note");
    const body = encodeURIComponent(note);
    setSent(true);
    window.location.href = `mailto:${MAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="relative min-h-screen bg-ink text-bone">
      <div className="spotlight pointer-events-none fixed inset-0 z-0" aria-hidden />

      <div
        className="fixed top-0 right-0 left-0 z-50 h-px origin-left bg-copper"
        style={{ transform: "scaleX(var(--scroll, 0))" }}
        aria-hidden
      />

      <header className="fixed top-0 right-0 left-0 z-40 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="font-display text-xl tracking-tight text-bone">
            WAT
          </a>
          <nav className="hidden items-center gap-8 text-xs tracking-kicker uppercase md:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-bone/80 transition-colors hover:text-bone">
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="press text-xs tracking-kicker text-bone uppercase md:hidden"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {open ? (
        <div id="menu" className="fixed inset-0 z-30 flex flex-col justify-end bg-ink px-6 pt-20 pb-12 md:hidden">
          <nav className="flex flex-col">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="fade-up border-t border-line py-4 font-display text-5xl tracking-tight"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}

      <main id="top">
        <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pt-24 pb-8 sm:px-8">
          <div className="field pointer-events-none absolute inset-x-0 top-0 opacity-60" aria-hidden />
          <div className="fade-up flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
            <span>Infinitum Corporation</span>
            <span className="hidden sm:inline">CEO</span>
          </div>

          <div className="mt-6 grid items-end gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <h1 className="font-display text-hero text-bone">
                <span className="rise d1 block">William</span>
                <span className="rise aaron d2 block italic">Aaron</span>
                <span className="rise d3 block">Turner</span>
              </h1>
            </div>

            <figure className="fade-up d4 relative lg:col-span-4 lg:mb-3">
              <div className="absolute -top-3 -right-3 h-full w-full border border-copper/80" aria-hidden />
              <div className="float-y relative overflow-hidden bg-ink">
                <img
                  src="/portrait/william.png"
                  alt="William Aaron Turner"
                  className="aspect-portrait w-full object-cover object-top grayscale"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
                <span>Portrait</span>
                <span className="inline-flex items-center gap-2">
                  <span className="spin-slow inline-block h-3 w-3 rounded-full border border-copper border-t-transparent" />
                  Live
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="draw mt-8 h-px w-full bg-line" />

          <div className="fade-up d5 mt-6 grid gap-8 lg:grid-cols-12">
            <p className="max-w-xl text-lg leading-relaxed text-bone/90 lg:col-span-6">
              Businessman, IT security and irregular warfare specialist. Founder of Infinitum
              Corporation — consultant, developer, operator, and private military contractor.
            </p>
            <div className="flex flex-col justify-between gap-6 lg:col-span-6 lg:items-end">
              <p className="h-7 text-sm tracking-kicker text-copper uppercase" aria-live="polite">
                {ROLES[role]}
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href="#contact"
                  className="press inline-flex min-h-11 items-center bg-bone px-5 text-sm tracking-wide text-ink"
                >
                  Open a channel
                </a>
                <a
                  href={LINKS[0].href}
                  className="press inline-flex min-h-11 items-center border border-line px-5 text-sm tracking-wide text-bone hover:border-copper"
                >
                  Infinitum
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between pt-10 text-xs tracking-kicker text-muted uppercase">
            <span className="inline-flex items-center gap-3">
              <span className="pulse-line inline-block h-8 w-px origin-bottom bg-copper" />
              Scroll
            </span>
            <span>DC — Beijing</span>
          </div>
        </section>

        <div className="overflow-hidden border-y border-line">
          <div className="marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1}>
                {CITIES.map((city) => (
                  <span
                    key={`${copy}-${city.code}`}
                    className="flex items-center gap-6 px-6 py-4 text-sm tracking-kicker text-bone/80 uppercase"
                  >
                    {city.city}
                    <span className="text-copper">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section id="practice" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div data-reveal className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-display text-display">Practice</h2>
            <p className="max-w-xs text-right text-sm leading-relaxed text-muted">
              Four ways the work shows up. Same desk. Different weather.
            </p>
          </div>
          <ul className="border-t border-line">
            {PRACTICES.map((item) => (
              <li key={item.index} data-reveal className="border-b border-line">
                <button
                  type="button"
                  className="grid w-full grid-cols-12 items-start gap-4 py-7 text-left"
                  aria-expanded={active === Number(item.index) - 1}
                  onClick={() => setActive(Number(item.index) - 1)}
                >
                  <span className="col-span-2 font-display text-xl text-copper sm:col-span-1">{item.index}</span>
                  <span className="col-span-10 font-display text-4xl tracking-tight sm:col-span-4 sm:text-5xl">
                    {item.title}
                  </span>
                  <span
                    className={`col-span-12 text-base leading-relaxed text-muted transition-opacity duration-300 sm:col-span-7 sm:pt-3 ${
                      active === Number(item.index) - 1 ? "opacity-100" : "opacity-55"
                    }`}
                  >
                    {item.body}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section id="signal" className="border-y border-line">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div data-reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-display">Signal</h2>
              <p className="text-sm tracking-kicker text-muted uppercase">Six clocks. One name.</p>
            </div>
            <div data-reveal className="grid border border-line sm:grid-cols-2 lg:grid-cols-3">
              {CITIES.map((city) => (
                <CityClock key={city.code} {...city} />
              ))}
            </div>
          </div>
        </section>

        <section id="index" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div data-reveal className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-display">Index</h2>
            <span className="text-xs tracking-kicker text-muted uppercase">{LINKS.length} doors</span>
          </div>
          <ul className="border-t border-line">
            {LINKS.map((link) => (
              <li key={link.href} data-reveal>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="row-link grid min-h-16 grid-cols-12 items-center gap-x-3 gap-y-1 border-b border-line py-5"
                >
                  <span className="col-span-2 font-display text-lg text-copper sm:col-span-1">{link.index}</span>
                  <span className="col-span-10 text-xl tracking-tight sm:col-span-5 sm:text-2xl">{link.title}</span>
                  <span className="col-span-8 text-sm text-muted sm:col-span-4">{link.subtitle}</span>
                  <span className="col-span-4 flex items-center justify-end gap-2 text-xs tracking-kicker text-muted uppercase sm:col-span-2">
                    {link.meta}
                    <ArrowUpRight className="arrow h-4 w-4 text-bone" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="border-t border-line">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
            <div data-reveal className="lg:col-span-6">
              <p className="text-xs tracking-kicker text-muted uppercase">Contact</p>
              <h2 className="mt-4 font-display text-display">Open a channel.</h2>
              <button
                type="button"
                onClick={copyMail}
                className="press mt-8 block text-left text-lg text-bone underline decoration-copper decoration-1 underline-offset-8 hover:text-copper sm:text-2xl"
              >
                {MAIL}
              </button>
              <p className="mt-3 h-5 text-sm text-muted" aria-live="polite">
                {copied ? "Copied." : "Tap the address to copy."}
              </p>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted">
                Newsletter desk:{" "}
                <a className="text-bone underline decoration-line underline-offset-4 hover:decoration-copper" href={`mailto:${NEWSLETTER}`}>
                  {NEWSLETTER}
                </a>
              </p>
            </div>

            <form data-reveal onSubmit={onSubmit} className="flex flex-col gap-6 lg:col-span-6">
              <label className="flex flex-col gap-2 text-xs tracking-kicker text-muted uppercase">
                Name
                <input
                  name="name"
                  required
                  autoComplete="name"
                  className="min-h-12 border-b border-line bg-transparent text-base tracking-normal text-bone normal-case outline-none placeholder:text-muted/60 focus:border-copper"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs tracking-kicker text-muted uppercase">
                Note
                <textarea
                  name="note"
                  required
                  rows={4}
                  className="resize-none border-b border-line bg-transparent py-2 text-base tracking-normal text-bone normal-case outline-none placeholder:text-muted/60 focus:border-copper"
                  placeholder="What should I know?"
                />
              </label>
              <button
                type="submit"
                className="press mt-2 inline-flex min-h-12 items-center justify-center bg-copper px-6 text-sm tracking-wide text-ink"
              >
                {sent ? "Opening mail…" : "Send the note"}
              </button>
              <p className="text-sm leading-relaxed text-muted">
                This opens your mail app. Nothing is stored on this page.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs tracking-kicker text-muted uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>William Aaron Turner</span>
          <span>Infinitum Corporation</span>
          <a href="#top" className="text-bone hover:text-copper">
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
