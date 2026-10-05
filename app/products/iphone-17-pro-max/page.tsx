"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Battery,
  Box,
  Camera,
  Check,
  ChevronRight,
  Cpu,
  Heart,
  MonitorUp,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import PhoneExperience, { AnatomyPart } from "@/components/PhoneExperience";
import Comparison from "@/components/Comparison";
import { iphone17ProMax } from "@/lib/products";

const anatomyStages: Array<{id:AnatomyPart;title:string;text:string;Icon:typeof Box}> = [
  { id:"display", title:"Display", text:"Front glass, OLED panel and support structure.", Icon:MonitorUp },
  { id:"camera", title:"Camera system", text:"Separate optical modules and camera hardware.", Icon:Camera },
  { id:"chip", title:"Performance", text:"Logic board and application processor.", Icon:Cpu },
  { id:"battery", title:"Battery & charging", text:"Battery cell and wireless charging assembly.", Icon:Battery },
];

export default function ProductPage() {
  const [finishIndex,setFinishIndex] = useState(2);
  const [storage,setStorage] = useState("256GB");
  const [anatomyPart,setAnatomyPart] = useState<AnatomyPart>("overview");
  const finish = iphone17ProMax.finishes[finishIndex];
  const active = useMemo(()=>anatomyStages.find(x=>x.id===anatomyPart),[anatomyPart]);

  return (
    <main className="store-page">
      <StoreHeader />

      <div className="breadcrumbs">
        <a href="/">Home</a><ChevronRight size={13}/><a href="/#phones">Smartphones</a><ChevronRight size={13}/><span>iPhone 17 Pro Max</span>
      </div>

      <section className="pdp-main">
        <div className="pdp-gallery">
          <div className="pdp-gallery-toolbar">
            <span>360° interactive view</span>
            <button><Heart size={18}/> Save</button>
          </div>
          <div className="pdp-viewer"><PhoneExperience finish={finish.hex} anatomyPart="overview" mode="hero"/></div>
          <div className="pdp-thumb-row">
            <button className="active">360°</button><button>Front</button><button>Back</button><button>Camera</button>
          </div>
        </div>

        <aside className="pdp-buybox">
          <span className="pdp-brand">APPLE</span>
          <h1>iPhone 17 Pro Max</h1>
          <div className="pdp-rating"><Star size={15} fill="currentColor"/><strong>4.9</strong><a href="#">639 reviews</a><span>·</span><span>SKU: IP17PM-256</span></div>
          <p className="pdp-summary">Flagship iPhone with a 6.9-inch display, A19 Pro performance and a 48 MP Pro camera system.</p>

          <div className="pdp-price-block">
            <strong>14,999 MAD</strong>
            <del>15,499 MAD</del>
            <span>Save 500 MAD</span>
          </div>

          <div className="pdp-option">
            <div className="pdp-option-title"><span>Finish</span><strong>{finish.name}</strong></div>
            <div className="pdp-finishes">
              {iphone17ProMax.finishes.map((item,index)=>(
                <button className={index===finishIndex?"active":""} key={item.name} onClick={()=>setFinishIndex(index)} title={item.name}>
                  <i style={{background:item.hex}}/>
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-option">
            <div className="pdp-option-title"><span>Storage</span><strong>{storage}</strong></div>
            <div className="storage-grid">
              {["256GB","512GB","1TB"].map(s=><button key={s} className={s===storage?"active":""} onClick={()=>setStorage(s)}>{s}</button>)}
            </div>
          </div>

          <div className="delivery-card">
            <div><Truck size={19}/><span><strong>Delivery</strong><small>1–2 business days</small></span><b>Free</b></div>
            <div><ShieldCheck size={19}/><span><strong>Warranty</strong><small>Official manufacturer warranty</small></span></div>
          </div>

          <button className="add-cart"><ShoppingCart size={19}/> Add to cart</button>
          <button className="buy-now">Buy now</button>
        </aside>
      </section>

      <section className="pdp-key-specs">
        {iphone17ProMax.specs.map(spec=>(
          <a key={spec.label} href="#anatomy" onClick={()=>setAnatomyPart(spec.part)}>
            <small>{spec.label}</small><strong>{spec.value}</strong><ChevronRight size={15}/>
          </a>
        ))}
      </section>

      <section className="pdp-story">
        <span>WHY IT STANDS OUT</span>
        <h2>Less marketing. More useful information.</h2>
        <div className="pdp-story-grid">
          <article><strong>6.9″</strong><span>Large OLED display</span></article>
          <article><strong>A19 Pro</strong><span>Flagship performance</span></article>
          <article><strong>48 MP</strong><span>Pro camera system</span></article>
          <article><strong>8×</strong><span>Optical-quality zoom</span></article>
        </div>
      </section>

      <section className="pdp-anatomy" id="anatomy">
        <div className="pdp-anatomy-copy">
          <span className="section-mini-label">INTERACTIVE ANATOMY</span>
          <h2>Explore the hardware inside.</h2>
          <p>{active?.text ?? "Select a component to open the device and see where each specification lives."}</p>
          <div className="pdp-anatomy-tabs">
            <button className={anatomyPart==="overview"?"active":""} onClick={()=>setAnatomyPart("overview")}>Overview</button>
            {anatomyStages.map(({id,title,Icon})=>(
              <button key={id} className={anatomyPart===id?"active":""} onClick={()=>setAnatomyPart(id)}><Icon size={17}/>{title}</button>
            ))}
          </div>
        </div>
        <div className="pdp-anatomy-viewer">
          <PhoneExperience finish={finish.hex} anatomyPart={anatomyPart} mode="anatomy"/>
        </div>
      </section>

      <Comparison />

      <a href="/" className="back-to-store"><ArrowLeft size={16}/> Back to store</a>
    </main>
  );
}
