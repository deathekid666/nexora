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
  { id: "display", index: "01", title: "Display", text: "Separate the front glass and connect the display specification to the physical panel.", Icon: MonitorUp },
  { id: "camera", index: "02", title: "Camera system", text: "Pull the camera system forward and identify the optical hardware behind each camera spec.", Icon: Camera },
  { id: "chip", index: "03", title: "Performance", text: "Reveal the logic board and highlight the processor, instead of hiding it in a table.", Icon: Cpu },
  { id: "battery", index: "04", title: "Battery & charging", text: "Expose the battery layer and connect endurance, charging and thermal information.", Icon: Battery },
];

export default function Home() {
  const [finishIndex, setFinishIndex] = useState(2);
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

      <div className="product-bar">
        <strong>iPhone 17 Pro Max</strong>
        <nav>
          <a href="#phones">Overview</a>
          <a href="#anatomy">Inside</a>
          <a href="#compare">Compare</a>
          <button>Buy</button>
        </nav>
      </div>

      <section className="hero" id="phones">
        <div className="hero-glow" />
        <div className="hero-copy">
          <span className="eyebrow">iPhone 17 Pro Max</span>
          <h1>Built to be explored.</h1>
          <p className="hero-tagline">
            See the device first. Then open the technology inside it.
          </p>

          <div className="hero-actions">
            <button className="light-button">View buying options</button>
            <a className="ghost-button" href="#compare">Compare <ChevronRight size={17} /></a>
          </div>

          <div className="finish-picker">
            <span>Finish <b>{finish.name}</b></span>
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
        </div>

        <div className="hero-device">
          <div className="hero-device-label">
            <span>INTERACTIVE VIEW</span>
            <small>Drag the phone gently to inspect the finish.</small>
          </div>
          <PhoneExperience finish={finish.hex} anatomyPart="overview" mode="hero" />
        </div>
      </section>

      <section className="quick-specs">
        {iphone17ProMax.specs.map((spec) => (
          <a key={spec.label} href="#anatomy" onClick={() => setAnatomyPart(spec.part)} className="quick-spec">
            <span>{spec.label}</span>
            <strong>{spec.value}</strong>
            <ChevronRight size={16} />
          </a>
        ))}
      </section>

      <section className="anatomy section-shell" id="anatomy">
        <div className="section-kicker">EXPLORE THE HARDWARE</div>
        <h2>Specifications, attached to the parts that create them.</h2>
        <p className="section-lead">
          The hero now uses a real GLB product asset. The anatomy view is a separate technical assembly,
          so every layer can move independently without destroying the exterior product model.
        </p>

        <div className="anatomy-layout">
          <div className="anatomy-stage">
            <PhoneExperience finish={finish.hex} anatomyPart={anatomyPart} mode="anatomy" />
            <div className="anatomy-caption">
              <span>{activeCopy ? activeCopy.title : "Complete device"}</span>
              <strong>{activeCopy ? activeCopy.text : "Select a component to open the device."}</strong>
            </div>
          </div>

          <div className="anatomy-list">
            <button
              className={anatomyPart === "overview" ? "anatomy-button active" : "anatomy-button"}
              onClick={() => setAnatomyPart("overview")}
            >
              <span className="stage-number">00</span>
              <div><strong>Complete device</strong><small>Return every layer to its assembled position.</small></div>
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
          <h2>The same exploration model scales beyond phones.</h2>
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
        <span>Phase 1 · Product experience · <a href="https://sketchfab.com/3d-models/realistic-smartphone-3d-model-77e5794dde144965b5bd4aeab9cb50e8" target="_blank" rel="noreferrer">3D base model: LukeModels75 · CC BY 4.0</a></span>
      </footer>
    </main>
  );
}
