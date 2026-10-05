"use client";

import {
  ArrowRight,
  BadgePercent,
  ChevronRight,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  ShieldCheck,
  Smartphone,
  Star,
  Tablet,
  Truck,
  Tv,
  Watch,
  Zap,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";

const APPLE_IMG="https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg";
const LAPTOP_IMG="https://images.unsplash.com/photo-1782012505157-aca188bd6921?auto=format&fit=crop&w=1800&q=85";
const GAMING_IMG="https://images.unsplash.com/photo-1763258986479-0962883e1747?auto=format&fit=crop&w=1800&q=85";
const TV_IMG="https://images.unsplash.com/photo-1735078254602-b7818942c324?auto=format&fit=crop&w=1800&q=85";

const categories = [
  { name:"Smartphones", icon:Smartphone, href:"#latest" },
  { name:"Computers", icon:Laptop, href:"#latest" },
  { name:"TV & Home", icon:Tv, href:"#latest" },
  { name:"Gaming", icon:Gamepad2, href:"#latest" },
  { name:"Audio", icon:Headphones, href:"#latest" },
  { name:"Wearables", icon:Watch, href:"#latest" },
  { name:"Tablets", icon:Tablet, href:"#latest" },
];

const latest = [
  { eyebrow:"APPLE · FLAGSHIP", title:"iPhone 17 Pro Max", copy:"A flagship built around display, camera and performance.", price:"From 14,999 MAD", image:APPLE_IMG, href:"/products/iphone-17-pro-max", light:false },
  { eyebrow:"COMPUTING", title:"Work, without the workstation.", copy:"Find the laptop that fits the way you actually work.", price:"Explore laptops", image:LAPTOP_IMG, href:"#", light:true },
  { eyebrow:"GAMING", title:"Build the setup around play.", copy:"Console, display, latency and audio — considered together.", price:"Explore gaming", image:GAMING_IMG, href:"#", light:false },
  { eyebrow:"TV & HOME", title:"Choose the panel before the size.", copy:"OLED, Mini LED and QLED compared around your room.", price:"Explore TV", image:TV_IMG, href:"#", light:true },
];

const compareRows = [
  { name:"iPhone 17 Pro Max", brand:"Apple", camera:"48 MP Pro", display:"6.9″ OLED", chip:"A19 Pro", price:"14,999 MAD" },
  { name:"Galaxy S26 Ultra", brand:"Samsung", camera:"Advanced zoom", display:"AMOLED", chip:"Flagship", price:"13,499 MAD" },
  { name:"Magic8 Pro", brand:"HONOR", camera:"Telephoto", display:"OLED", chip:"Flagship", price:"10,999 MAD" },
];

export default function Home() {
  return (
    <main className="store-page source-home">
      <SiteMotion />
      <StoreHeader />

      <section className="source-hero">
        <div className="source-hero-copy hero-animate">
          <span className="source-eyebrow">NEXORA / TECHNOLOGY, CLEARLY</span>
          <h1>Buy the product.<br/><em>Understand the choice.</em></h1>
          <p>Discover the devices worth considering, compare what actually changes the experience, and buy with less noise.</p>
          <div className="source-hero-actions">
            <a href="#latest" className="source-btn-dark">Explore the latest <ArrowRight size={16}/></a>
            <a href="#compare" className="source-text-link">Compare flagships <ChevronRight size={15}/></a>
          </div>
          <div className="source-hero-meta">
            <span><b>01</b> Curated products</span>
            <span><b>02</b> Comparable specs</span>
            <span><b>03</b> Clear buying advice</span>
          </div>
        </div>

        <a href="/products/iphone-17-pro-max" className="source-hero-media" data-reveal-scale>
          <img src={APPLE_IMG} alt="iPhone 17 Pro lineup" />
          <div className="source-hero-media-copy">
            <span>EDITOR’S PICK</span>
            <strong>iPhone 17 Pro Max</strong>
            <small>From 14,999 MAD</small>
          </div>
        </a>
      </section>

      <section className="source-categories">
        {categories.map(({name,icon:Icon,href})=>(
          <a href={href} key={name}>
            <span><Icon size={22}/></span>
            <strong>{name}</strong>
          </a>
        ))}
      </section>

      <section className="source-section source-latest" id="latest">
        <div className="source-heading" data-reveal>
          <div><span>THE LATEST</span><h2>Four places to start.</h2></div>
          <p>Large, useful product stories instead of a wall of tiny cards.</p>
        </div>

        <div className="source-latest-rail">
          {latest.map((item,index)=>(
            <a href={item.href} className={"source-latest-card "+(item.light?"is-light":"")} data-reveal-scale key={item.title}>
              <img src={item.image} alt={item.title} />
              <div className="source-latest-shade"/>
              <div className="source-latest-copy">
                <span>{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <strong>{item.price} <ArrowRight size={14}/></strong>
              </div>
              <div className="source-latest-index">0{index+1}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="source-compare" id="compare">
        <div className="source-compare-head" data-reveal>
          <div><span>COMPARE</span><h2>The differences,<br/>without the marketing.</h2></div>
          <p>Equivalent information in the same place. No spec-sheet scavenger hunt.</p>
        </div>

        <div className="source-compare-table" data-reveal-scale>
          <div className="source-compare-labels">
            <span>PRODUCT</span><span>CAMERA</span><span>DISPLAY</span><span>CHIP</span><span>PRICE</span>
          </div>
          {compareRows.map((row,index)=>(
            <a href={index===0?"/products/iphone-17-pro-max":"#"} className="source-compare-row" key={row.name}>
              <div><small>{row.brand}</small><strong>{row.name}</strong></div>
              <span>{row.camera}</span>
              <span>{row.display}</span>
              <span>{row.chip}</span>
              <b>{row.price}</b>
              <ArrowRight size={16}/>
            </a>
          ))}
        </div>
      </section>

      <section className="source-editorial">
        <article className="source-editorial-feature" data-reveal-scale>
          <img src={TV_IMG} alt="Modern living room with television" />
          <div className="source-editorial-overlay"/>
          <div>
            <span>BUYING GUIDE / TV</span>
            <h2>Your room matters as much as the panel.</h2>
            <p>OLED, QLED and Mini LED make different trade-offs. Start with where the screen will live.</p>
            <a href="#">Read the guide <ArrowRight size={15}/></a>
          </div>
        </article>

        <div className="source-editorial-stack">
          <article className="source-editorial-small source-editorial-tech" data-reveal-scale>
            <span>HOW NEXORA THINKS</span>
            <h3>Specs should explain a decision.</h3>
            <p>We group technical information around outcomes: camera, battery, gaming, work and value.</p>
            <a href="#">How comparison works <ArrowRight size={14}/></a>
          </article>
          <article className="source-editorial-small source-editorial-gaming" data-reveal-scale>
            <img src={GAMING_IMG} alt="Gaming controller and keyboard" />
            <div className="source-editorial-overlay"/>
            <div><span>GAMING GUIDE</span><h3>Refresh rate is only half the story.</h3><a href="#">Read guide <ArrowRight size={14}/></a></div>
          </article>
        </div>
      </section>

      <section className="source-services">
        <article data-reveal><Truck size={21}/><strong>Fast delivery</strong><p>Clear stock and delivery windows before checkout.</p></article>
        <article data-reveal><ShieldCheck size={21}/><strong>Official warranty</strong><p>Coverage visible before you make the decision.</p></article>
        <article data-reveal><BadgePercent size={21}/><strong>Real savings</strong><p>Original price, discount and actual value shown together.</p></article>
        <article data-reveal><Zap size={21}/><strong>Easy comparison</strong><p>Equivalent hardware, normalized across brands.</p></article>
      </section>

      <section className="source-newsletter">
        <div><span>NEXORA / PRIVATE LIST</span><h2>Launches and deals worth opening.</h2></div>
        <form><input placeholder="Email address"/><button type="button">Join <ArrowRight size={14}/></button></form>
      </section>

      <footer className="source-footer">
        <div>
          <a href="/" className="source-footer-logo">NEXORA<span>.</span></a>
          <p>Technology shopping made clearer.</p>
        </div>
        <nav><a href="#latest">Latest</a><a href="#compare">Compare</a><a href="#">Buying guides</a><a href="#">Delivery</a><a href="#">Warranty</a></nav>
        <div className="source-footer-bottom"><span>© 2026 NEXORA</span><span>Morocco · MAD</span></div>
      </footer>
    </main>
  );
}
