"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingBag, ChevronRight, Box, Camera, Cpu, Battery, MonitorUp } from "lucide-react";
import PhoneExperience, { AnatomyPart } from "@/components/PhoneExperience";
import Comparison from "@/components/Comparison";
import { iphone17ProMax } from "@/lib/products";

const anatomyStages: Array<{
  id: AnatomyPart;
  index: string;
  title: string;
  text: string;
  Icon: typeof Box;
}> = [
  { id: "display", index: "01", title: "Display", text: "Move the front glass forward and explain the display where it actually sits.", Icon: MonitorUp },
  { id: "camera", index: "02", title: "Camera system", text: "Separate the camera cluster and connect every lens to its camera specification.", Icon: Camera },
  { id: "chip", index: "03", title: "Performance", text: "Reveal the logic board and highlight the processor instead of hiding it in a spec table.", Icon: Cpu },
  { id: "battery", index: "04", title: "Battery & charging", text: "Expose the battery layer and connect charging, endurance and thermal information.", Icon: Battery },
];

export default function Home() {
  const [finishIndex, setFinishIndex] = useState(0);
  const [anatomyPart, setAnatomyPart] = useState<AnatomyPart>("overview");
  const finish = iphone17ProMax.finishes[finishIndex];

  const activeCopy = useMemo(
    () => anatomyStages.find((stage) => stage.id === anatomyPart),
    [anatomyPart]
  );

  return (
    <main>
      <header className="site-header">
        <a href="#" className="brand">NEXORA</a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#phones">Smartphones</a>
          <a href="#categories">TV</a>
          <a href="#categories">Computing</a>
          <a href="#categories">Gaming</a>
          <a href="#categories">IoT</a>
          <a href="#categories">Accessories</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search"><Search size={18} /></button>
          <button className="icon-button dark" aria-label="Cart"><ShoppingBag size={18} /></button>
        </div>
      </header>

      <section className="hero" id="phones">
        <div className="hero-glow" />
        <div className="hero-copy">
          <span className="eyebrow">{iphone17ProMax.eyebrow}</span>
          <h1>{iphone17ProMax.name}</h1>
          <p className="hero-tagline">{iphone17ProMax.tagline}</p>
          <p className="prototype-note">{iphone17ProMax.note}</p>
          <div className="hero-actions">
            <button className="light-button">View buying options</button>
            <a className="ghost-button" href="#compare">Compare <ChevronRight size={17} /></a>
          </div>

          <div className="finish-picker">
            <span>Finish · {finish.name}</span>
            <div className="finish-row">
              {iphone17ProMax.finishes.map((item, index) => (
                <button
                  key={item.name}
                  aria-label={item.name}
                  className={index === finishIndex ? "finish active" : "finish"}
                  onClick={() => setFinishIndex(index)}
                >
                  <span style={{ background: item.hex }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-device">
          <PhoneExperience finish={finish.hex} anatomyPart={anatomyPart} />
        </div>
      </section>

      <section className="quick-specs">
        {iphone17ProMax.specs.map((spec) => (
          <button key={spec.label} onClick={() => setAnatomyPart(spec.part)} className="quick-spec">
            <span>{spec.label}</span>
            <strong>{spec.value}</strong>
          </button>
        ))}
      </section>

      <section className="anatomy section-shell">
        <div className="section-kicker">INTERACTIVE ANATOMY</div>
        <h2>Specs should point to the hardware.</h2>
        <p className="section-lead">
          Instead of making customers decode a giant specification table, each technical detail can
          open the part of the device that produces it.
        </p>

        <div className="anatomy-layout">
          <div className="anatomy-stage">
            <PhoneExperience finish={finish.hex} anatomyPart={anatomyPart} />
            <div className="anatomy-caption">
              <span>{activeCopy ? activeCopy.title : "Complete device"}</span>
              <strong>{activeCopy ? activeCopy.text : "Choose a layer to inspect the product."}</strong>
            </div>
          </div>

          <div className="anatomy-list">
            <button
              className={anatomyPart === "overview" ? "anatomy-button active" : "anatomy-button"}
              onClick={() => setAnatomyPart("overview")}
            >
              <span className="stage-number">00</span>
              <div><strong>Complete device</strong><small>Return all layers to their assembled position.</small></div>
            </button>
            {anatomyStages.map(({ id, index, title, text, Icon }) => (
              <button
                key={id}
                className={anatomyPart === id ? "anatomy-button active" : "anatomy-button"}
                onClick={() => setAnatomyPart(id)}
              >
                <span className="stage-number">{index}</span>
                <Icon size={20} />
                <div><strong>{title}</strong><small>{text}</small></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Comparison />

      <section className="category-section section-shell" id="categories">
        <div>
          <span className="section-kicker">ONE SYSTEM · EVERY CATEGORY</span>
          <h2>The anatomy engine is reusable.</h2>
        </div>
        <div className="category-grid">
          {[
            ["Smartphones", "display · cameras · SoC · battery"],
            ["TVs", "panel · processor · speakers · I/O"],
            ["Laptops", "CPU · GPU · memory · SSD · cooling"],
            ["Consoles", "APU · SSD · thermal system · controller"],
            ["Wearables", "sensors · display · chipset · battery"],
            ["Accessories", "drivers · switches · sensors · connectivity"],
          ].map(([name, description]) => (
            <article key={name}>
              <div className="category-icon"><Box size={21} /></div>
              <h3>{name}</h3>
              <p>{description}</p>
              <ChevronRight size={18} />
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div><strong>NEXORA</strong><span>Explore technology before you buy.</span></div>
        <span>Prototype · Phase 1</span>
      </footer>
    </main>
  );
}
