"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Battery,
  Box,
  Camera,
  ChevronRight,
  Cpu,
  Gamepad2,
  Headphones,
  Laptop,
  Layers,
  Menu,
  MonitorUp,
  Search,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tv,
  Watch,
  X,
} from "lucide-react";
import PhoneExperience, { AnatomyPart } from "@/components/PhoneExperience";
import Comparison from "@/components/Comparison";
import { iphone17ProMax } from "@/lib/products";

const anatomyStages: Array<{
  id: AnatomyPart;
  index: string;
  title: string;
  short: string;
  text: string;
  Icon: typeof Box;
}> = [
  {
    id: "display",
    index: "01",
    title: "Display",
    short: "Glass + OLED",
    text: "Separate the front glass and OLED stack to understand the display where it physically exists.",
    Icon: MonitorUp,
  },
  {
    id: "camera",
    index: "02",
    title: "Camera system",
    short: "Optics + sensors",
    text: "Pull the optical modules away from the chassis and inspect each camera as real hardware.",
    Icon: Camera,
  },
  {
    id: "chip",
    index: "03",
    title: "Performance",
    short: "Logic + SoC",
    text: "Reveal the logic board and isolate the processor so performance specs become spatial, not abstract.",
    Icon: Cpu,
  },
  {
    id: "battery",
    index: "04",
    title: "Battery",
    short: "Cell + charging",
    text: "Expose the battery and wireless charging assembly to connect endurance with the hardware behind it.",
    Icon: Battery,
  },
];

const categories = [
  { title: "Smartphones", meta: "Flagships · Foldables · Value", Icon: Smartphone, className: "category-card category-card-large category-phone" },
  { title: "TV & Display", meta: "OLED · Mini LED · Gaming", Icon: Tv, className: "category-card category-tv" },
  { title: "Computing", meta: "Laptops · Desktops · Monitors", Icon: Laptop, className: "category-card category-laptop" },
  { title: "Gaming", meta: "Consoles · Handhelds · Gear", Icon: Gamepad2, className: "category-card category-gaming" },
  { title: "Wearables", meta: "Watches · Health · Fitness", Icon: Watch, className: "category-card category-wearables" },
  { title: "Audio", meta: "Headphones · Speakers · Mics", Icon: Headphones, className: "category-card category-audio" },
];

const discoveryCards = [
  {
    eyebrow: "CAMERA FIRST",
    title: "Phones built around imaging.",
    copy: "Compare sensor size, focal lengths, stabilization and zoom without digging through spec sheets.",
    tone: "discovery-card discovery-camera",
  },
  {
    eyebrow: "GAMING READY",
    title: "Hardware that can actually push frames.",
    copy: "See display refresh, chipset class, cooling and sustained performance in one place.",
    tone: "discovery-card discovery-gaming",
  },
  {
    eyebrow: "BEST VALUE",
    title: "Spend where it matters.",
    copy: "Filter out marketing noise and compare the hardware that changes the experience.",
    tone: "discovery-card discovery-value",
  },
];

export default function Home() {
  const [finishIndex, setFinishIndex] = useState(2);
  const [anatomyPart, setAnatomyPart] = useState<AnatomyPart>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const finish = iphone17ProMax.finishes[finishIndex];
  const activeCopy = useMemo(
    () => anatomyStages.find((stage) => stage.id === anatomyPart),
    [anatomyPart]
  );

  return (
    <main className="site">
      <div className="utility-bar">
        <span>Built for a better way to shop technology.</span>
        <span className="utility-right">Morocco · MAD</span>
      </div>

      <header className="site-header">
        <a href="#" className="brand" aria-label="Nexora home">
          NEXORA<span className="brand-dot">.</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <a href="#featured">Featured</a>
          <a href="#anatomy">Explore in 3D</a>
          <a href="#compare">Compare</a>
        </nav>

        <div className="header-actions">
          <button className="search-pill" aria-label="Search">
            <Search size={17} />
            <span>Search products</span>
            <kbd>⌘K</kbd>
          </button>
          <button className="header-icon" aria-label="Shopping bag">
            <ShoppingBag size={19} />
          </button>
          <button
            className="header-icon mobile-menu-trigger"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            <a href="#shop" onClick={() => setMobileMenuOpen(false)}>Shop</a>
            <a href="#featured" onClick={() => setMobileMenuOpen(false)}>Featured</a>
            <a href="#anatomy" onClick={() => setMobileMenuOpen(false)}>Explore in 3D</a>
            <a href="#compare" onClick={() => setMobileMenuOpen(false)}>Compare</a>
          </nav>
        )}
      </header>

      <section className="market-hero">
        <div className="market-hero-copy">
          <span className="hero-label"><Sparkles size={14} /> A technology store you can understand</span>
          <h1>Don’t just buy the spec sheet.</h1>
          <p>
            Discover, compare and explore the hardware inside the devices you use every day.
          </p>
          <div className="market-hero-actions">
            <a className="primary-cta" href="#shop">Explore the store <ArrowRight size={17} /></a>
            <a className="secondary-cta" href="#anatomy">See how 3D works</a>
          </div>
          <div className="hero-proof">
            <span><b>01</b> Real specifications</span>
            <span><b>02</b> Side-by-side comparison</span>
            <span><b>03</b> Interactive anatomy</span>
          </div>
        </div>

        <div className="market-hero-visual">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-showcase-card hero-card-back">
            <span>Compare</span>
            <strong>3 devices</strong>
          </div>
          <div className="hero-showcase-card hero-card-front">
            <span>Explore inside</span>
            <strong>Display · Camera · Chip · Battery</strong>
          </div>
          <div className="hero-device-shell" aria-hidden="true">
            <div className="hero-device-camera">
              <i /><i /><i />
            </div>
            <div className="hero-device-logo">N</div>
          </div>
          <div className="hero-visual-caption">
            <span>THE STORE BECOMES THE EXPLAINER</span>
            <p>Every product page can move from beauty shot to hardware story.</p>
          </div>
        </div>
      </section>

      <section className="category-strip" aria-label="Quick categories">
        <a href="#shop"><Smartphone size={15} /> Phones</a>
        <a href="#shop"><Tv size={15} /> TV</a>
        <a href="#shop"><Laptop size={15} /> Computing</a>
        <a href="#shop"><Gamepad2 size={15} /> Gaming</a>
        <a href="#shop"><Watch size={15} /> Wearables</a>
        <a href="#shop"><Headphones size={15} /> Audio</a>
      </section>

      <section className="shop-section section-pad" id="shop">
        <div className="editorial-heading">
          <div>
            <span className="section-index">01 / SHOP</span>
            <h2>Everything tech.<br />Organized like it should be.</h2>
          </div>
          <p>
            One visual language across phones, televisions, computers, gaming,
            wearables and accessories — with specifications normalized for comparison.
          </p>
        </div>

        <div className="category-bento">
          {categories.map(({ title, meta, Icon, className }, index) => (
            <article className={className} key={title}>
              <div className="category-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight size={18} />
              </div>
              <div className="category-art" aria-hidden="true">
                <Icon />
              </div>
              <div className="category-copy">
                <h3>{title}</h3>
                <p>{meta}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-section section-pad" id="featured">
        <div className="featured-heading">
          <div>
            <span className="section-index light-index">02 / FEATURED</span>
            <h2>One flagship.<br />Three ways to understand it.</h2>
          </div>
          <p>
            Start with the product. Compare the essentials. Then open the hardware
            and see why the specifications matter.
          </p>
        </div>

        <div className="featured-stage">
          <div className="featured-info">
            <div className="featured-title-row">
              <div>
                <span className="featured-brand">APPLE</span>
                <h3>iPhone 17 Pro Max</h3>
              </div>
              <span className="live-badge">360° LIVE</span>
            </div>

            <p className="featured-copy">
              Drag the model. Change the finish. Jump directly from a specification
              into the hardware layer behind it.
            </p>

            <div className="finish-control">
              <div className="finish-control-header">
                <span>Finish</span>
                <strong>{finish.name}</strong>
              </div>
              <div className="finish-row">
                {iphone17ProMax.finishes.map((item, index) => (
                  <button
                    key={item.name}
                    aria-label={item.name}
                    title={item.name}
                    className={index === finishIndex ? "finish active" : "finish"}
                    onClick={() => setFinishIndex(index)}
                  >
                    <span style={{ background: item.hex }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="featured-actions">
              <a href="#anatomy" className="primary-cta inverse">
                Explore inside <Layers size={17} />
              </a>
              <a href="#compare" className="featured-text-link">
                Compare <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <div className="featured-viewer">
            <div className="viewer-topline">
              <span>PRODUCT VIEW</span>
              <span>DRAG TO ROTATE</span>
            </div>
            <PhoneExperience finish={finish.hex} anatomyPart="overview" mode="hero" />
          </div>
        </div>

        <div className="spec-rail">
          {iphone17ProMax.specs.map((spec, index) => (
            <a
              key={spec.label}
              href="#anatomy"
              onClick={() => setAnatomyPart(spec.part)}
              className="spec-rail-item"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{spec.label}</small>
              <strong>{spec.value}</strong>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className="anatomy-section" id="anatomy">
        <div className="anatomy-intro section-pad">
          <div>
            <span className="section-index dark-index">03 / EXPLORE INSIDE</span>
            <h2>Specs become physical.</h2>
          </div>
          <p>
            Instead of burying technical information in a table, NEXORA attaches it
            to the component that creates it.
          </p>
        </div>

        <div className="anatomy-experience">
          <div className="anatomy-copy-panel">
            <div className="anatomy-step">
              <span>{activeCopy?.index ?? "00"}</span>
              <small>{activeCopy ? activeCopy.short : "Assembled device"}</small>
            </div>

            <h3>{activeCopy?.title ?? "Complete device"}</h3>
            <p>
              {activeCopy?.text ??
                "Start assembled, then choose a hardware layer to move from product design into the engineering underneath."}
            </p>

            <div className="anatomy-controls" role="tablist" aria-label="Hardware anatomy">
              <button
                className={anatomyPart === "overview" ? "anatomy-tab active" : "anatomy-tab"}
                onClick={() => setAnatomyPart("overview")}
              >
                <span>00</span>
                <strong>Overview</strong>
              </button>

              {anatomyStages.map(({ id, index, title, Icon }) => (
                <button
                  key={id}
                  className={anatomyPart === id ? "anatomy-tab active" : "anatomy-tab"}
                  onClick={() => setAnatomyPart(id)}
                >
                  <span>{index}</span>
                  <Icon size={18} />
                  <strong>{title}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="anatomy-viewport">
            <div className="anatomy-viewer-header">
              <span>INTERACTIVE HARDWARE MODEL</span>
              <div><i /> LIVE 3D</div>
            </div>
            <PhoneExperience finish={finish.hex} anatomyPart={anatomyPart} mode="anatomy" />
          </div>
        </div>
      </section>

      <section className="discovery-section section-pad">
        <div className="editorial-heading compact-heading">
          <div>
            <span className="section-index">04 / DISCOVER</span>
            <h2>Shop by what matters to you.</h2>
          </div>
        </div>

        <div className="discovery-grid">
          {discoveryCards.map((card) => (
            <article className={card.tone} key={card.title}>
              <span>{card.eyebrow}</span>
              <div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <button aria-label={"Explore " + card.title}>
                  Explore <ArrowUpRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Comparison />

      <section className="promise-section section-pad">
        <div className="promise-title">
          <span className="section-index">06 / NEXORA</span>
          <h2>A better interface for buying technology.</h2>
        </div>

        <div className="promise-grid">
          <article>
            <span>01</span>
            <h3>Understand first.</h3>
            <p>Technical specifications are translated into visual, comparable information.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Compare fairly.</h3>
            <p>Equivalent hardware is compared against equivalent hardware across brands.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Explore physically.</h3>
            <p>Flagship products can be rotated, opened and inspected through interactive 3D.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Choose confidently.</h3>
            <p>Design, specifications, variants and purchase decisions live in one coherent flow.</p>
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-block">
            <a href="#" className="footer-brand">NEXORA<span>.</span></a>
            <p>Explore technology before you buy it.</p>
          </div>

          <div className="footer-columns">
            <div>
              <strong>Shop</strong>
              <a href="#shop">Smartphones</a>
              <a href="#shop">TV & Display</a>
              <a href="#shop">Computing</a>
              <a href="#shop">Gaming</a>
            </div>
            <div>
              <strong>Explore</strong>
              <a href="#anatomy">3D anatomy</a>
              <a href="#compare">Compare</a>
              <a href="#featured">Featured</a>
            </div>
            <div>
              <strong>About</strong>
              <a href="#">NEXORA</a>
              <a
                href="https://sketchfab.com/3d-models/realistic-smartphone-3d-model-77e5794dde144965b5bd4aeab9cb50e8"
                target="_blank"
                rel="noreferrer"
              >
                3D model credit
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 NEXORA</span>
          <span>Prototype storefront · Morocco</span>
        </div>
      </footer>
    </main>
  );
}
