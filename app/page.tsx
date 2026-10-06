"use client";

import {
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  Cable,
  ChevronDown,
  ChevronRight,
  Clock3,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  MessageCircle,
  Monitor,
  RotateCcw,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  Truck,
  Tv,
  Watch,
  Zap,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import LhawtaLogo from "@/components/LhawtaLogo";

const APPLE_IMG="https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg";
const LAPTOP_IMG="https://images.unsplash.com/photo-1782012505157-aca188bd6921?auto=format&fit=crop&w=1800&q=88";
const GAMING_IMG="https://images.unsplash.com/photo-1763258986479-0962883e1747?auto=format&fit=crop&w=1800&q=88";
const TV_IMG="https://images.unsplash.com/photo-1735078254602-b7818942c324?auto=format&fit=crop&w=1800&q=88";

const categories = [
  { name:"Smartphones", icon:Smartphone, sub:"Apple · Samsung · HONOR" },
  { name:"Tablets", icon:Tablet, sub:"iPad · Galaxy Tab · Pad" },
  { name:"Computers", icon:Laptop, sub:"Laptops · Desktops" },
  { name:"TV & Home", icon:Tv, sub:"OLED · QLED · Mini LED" },
  { name:"Gaming", icon:Gamepad2, sub:"PS5 · Xbox · Nintendo" },
  { name:"Audio", icon:Headphones, sub:"Headphones · Speakers" },
  { name:"Wearables", icon:Watch, sub:"Watches · Bands" },
  { name:"Accessories", icon:Cable, sub:"Cases · Chargers · Cables" },
];

const deals = [
  {
    brand:"Apple",
    name:"iPhone 17 Pro Max",
    image:APPLE_IMG,
    price:"14,999 MAD",
    old:"15,499 MAD",
    save:"Save 500 MAD",
    rating:"4.9",
    reviews:"639",
    badge:"Deal",
    href:"/products/iphone-17-pro-max",
  },
  {
    brand:"Samsung",
    name:"Galaxy flagship",
    image:APPLE_IMG,
    price:"13,499 MAD",
    old:"14,499 MAD",
    save:"Save 1,000 MAD",
    rating:"4.8",
    reviews:"999+",
    badge:"Hot",
    href:"#",
  },
  {
    brand:"HONOR",
    name:"Magic flagship",
    image:APPLE_IMG,
    price:"10,999 MAD",
    old:"11,999 MAD",
    save:"Save 1,000 MAD",
    rating:"4.7",
    reviews:"184",
    badge:"Value",
    href:"#",
  },
  {
    brand:"Sony",
    name:"PlayStation 5 Slim",
    image:GAMING_IMG,
    price:"6,299 MAD",
    old:"6,799 MAD",
    save:"Save 500 MAD",
    rating:"4.9",
    reviews:"2.1k",
    badge:"Bestseller",
    href:"#",
  },
];

const compareRows = [
  { brand:"Apple", name:"iPhone 17 Pro Max", camera:"48 MP Pro", display:"6.9″ OLED", chip:"A19 Pro", battery:"All-day", price:"14,999 MAD", tag:"Best all-round" },
  { brand:"Samsung", name:"Galaxy S26 Ultra", camera:"Advanced zoom", display:"AMOLED", chip:"Flagship", battery:"Large", price:"13,499 MAD", tag:"Best zoom" },
  { brand:"HONOR", name:"Magic8 Pro", camera:"Telephoto", display:"OLED", chip:"Flagship", battery:"Large", price:"10,999 MAD", tag:"Best value" },
];

const services = [
  { icon:BadgeCheck, title:"Brand-new products", copy:"New smartphones, tablets and electronics with condition shown clearly." },
  { icon:ShieldCheck, title:"Warranty clarity", copy:"Warranty type and coverage visible before purchase." },
  { icon:Truck, title:"Delivery across Morocco", copy:"Availability and estimated delivery shown before checkout." },
  { icon:RotateCcw, title:"Returns & exchanges", copy:"Clear return policy and eligibility before you buy." },
  { icon:SearchCheck, title:"Buying guidance", copy:"Compare what actually changes camera, battery, gaming and value." },
  { icon:MessageCircle, title:"Shopping support", copy:"Help choosing the right device for your budget and priorities." },
];

export default function Home() {
  return (
    <main className="store-page lhawta-site amazonized">
      <SiteMotion />
      <StoreHeader />

      <div className="lhawta-offer-strip">
        <div><Clock3 size={15}/><strong>Today’s tech deals</strong><span>New smartphones, tablets and electronics</span></div>
        <a href="#deals">Shop deals <ArrowRight size={14}/></a>
      </div>

      <section className="commerce-hero">
        <div className="commerce-hero-copy">
          <span className="lhawta-eyebrow"><Sparkles size={13}/> LHAWTA / MOROCCO</span>
          <h1>New tech.<br/><em>Better deals.</em></h1>
          <p>Brand-new smartphones, tablets and electronics with clear prices, warranty and delivery before checkout.</p>

          <div className="commerce-price-block">
            <span>Deal of the week</span>
            <div><strong>14,999 MAD</strong><del>15,499 MAD</del></div>
            <b>Save 500 MAD</b>
          </div>

          <div className="lhawta-hero-actions">
            <a href="/products/iphone-17-pro-max" className="lhawta-btn-primary">Shop iPhone 17 Pro Max <ShoppingCart size={16}/></a>
            <a href="#compare" className="lhawta-btn-ghost">Compare flagships <ChevronRight size={15}/></a>
          </div>

          <div className="commerce-trust-row">
            <span><BadgeCheck size={15}/>Brand new</span>
            <span><ShieldCheck size={15}/>Warranty</span>
            <span><Truck size={15}/>Morocco delivery</span>
          </div>
        </div>

        <a href="/products/iphone-17-pro-max" className="commerce-hero-media">
          <img src={APPLE_IMG} alt="iPhone 17 Pro Max lineup" />
          <div className="commerce-hero-shade"/>
          <div className="commerce-hero-top">
            <span>NEW / FLAGSHIP</span>
            <b>Brand new</b>
          </div>
          <div className="commerce-hero-bottom">
            <div><small>APPLE</small><strong>iPhone 17 Pro Max</strong></div>
            <div><small>PRICE</small><strong>14,999 MAD</strong></div>
          </div>
        </a>
      </section>

      <section className="commerce-categories">
        {categories.map(({name,icon:Icon,sub})=>(
          <a href="#deals" key={name}>
            <div className="commerce-category-icon"><Icon size={24}/></div>
            <strong>{name}</strong>
            <span>{sub}</span>
          </a>
        ))}
      </section>

      <section className="deal-section" id="deals">
        <div className="commerce-section-head">
          <div>
            <span>TOP DEALS</span>
            <h2>Popular right now.</h2>
          </div>
          <a href="#">See all deals <ArrowRight size={15}/></a>
        </div>

        <div className="deal-grid">
          {deals.map((item)=>(
            <article className="deal-card" key={item.name}>
              <div className="deal-badge">{item.badge}</div>
              <button className="deal-heart" aria-label="Save"><Heart size={18}/></button>
              <a href={item.href} className="deal-media"><img src={item.image} alt={item.name}/></a>
              <div className="deal-body">
                <small>{item.brand}</small>
                <a href={item.href} className="deal-name">{item.name}</a>
                <div className="deal-rating"><Star size={13} fill="currentColor"/><strong>{item.rating}</strong><span>{item.reviews}</span></div>
                <div className="deal-price"><strong>{item.price}</strong><del>{item.old}</del></div>
                <div className="deal-save">{item.save}</div>
                <div className="deal-delivery"><Truck size={14}/><span>Delivery available</span></div>
                <div className="deal-actions">
                  <button><ShoppingCart size={16}/> Add to cart</button>
                  <a href={item.href}>View</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="retail-story-grid">
        <article className="retail-story large">
          <img src={LAPTOP_IMG} alt="Laptop setup"/>
          <div className="retail-story-shade"/>
          <div>
            <span>COMPUTING</span>
            <h3>Work. Study. Create.</h3>
            <p>Compare processor, RAM, battery and display before choosing.</p>
            <a href="#deals">Shop computers <ArrowRight size={14}/></a>
          </div>
        </article>
        <article className="retail-story">
          <img src={GAMING_IMG} alt="Gaming setup"/>
          <div className="retail-story-shade"/>
          <div><span>GAMING</span><h3>Build the setup around play.</h3><a href="#deals">Shop gaming <ArrowRight size={14}/></a></div>
        </article>
        <article className="retail-story">
          <img src={TV_IMG} alt="Modern television"/>
          <div className="retail-story-shade"/>
          <div><span>TV & HOME</span><h3>Choose the panel before the size.</h3><a href="#deals">Shop TV <ArrowRight size={14}/></a></div>
        </article>
      </section>

      <section className="lhawta-compare-section commerce-compare" id="compare">
        <div className="lhawta-compare-heading">
          <div><span>COMPARE / SMARTPHONES</span><h2>Choose with facts,<br/><em>not marketing.</em></h2></div>
          <p>Equivalent specifications side by side, with useful labels that help you decide faster.</p>
        </div>

        <div className="lhawta-compare-panel">
          <div className="lhawta-compare-labels">
            <span>PRODUCT</span><span>CAMERA</span><span>DISPLAY</span><span>CHIP</span><span>BATTERY</span><span>PRICE</span>
          </div>
          {compareRows.map((row,index)=>(
            <a href={index===0?"/products/iphone-17-pro-max":"#"} className="lhawta-compare-row" key={row.name}>
              <div className="lhawta-compare-name">
                <b>{String(index+1).padStart(2,"0")}</b>
                <span><small>{row.brand}</small><strong>{row.name}</strong></span>
                <em>{row.tag}</em>
              </div>
              <span>{row.camera}</span>
              <span>{row.display}</span>
              <span>{row.chip}</span>
              <span>{row.battery}</span>
              <strong>{row.price}</strong>
              <ChevronRight size={17}/>
            </a>
          ))}
        </div>
      </section>

      <section className="lhawta-services-section" id="services">
        <div className="commerce-section-head">
          <div><span>WHY LHAWTA</span><h2>Everything around buying new tech.</h2></div>
          <p>We make product condition, warranty, delivery and buying support obvious before you pay.</p>
        </div>
        <div className="lhawta-services-grid">
          {services.map(({icon:Icon,title,copy},index)=>(
            <article className={index===0?"featured":""} key={title}>
              <div className="lhawta-service-icon"><Icon size={23}/></div>
              <span>0{index+1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <ArrowRight size={16}/>
            </article>
          ))}
        </div>
      </section>

      <section className="lhawta-faq-section" id="faq">
        <div className="lhawta-faq-intro">
          <span>FAQ / BEFORE YOU ORDER</span>
          <h2>Questions should be easy.</h2>
          <p>Quick answers about products, warranty, delivery, returns and compatibility.</p>
          <div className="lhawta-help-card">
            <LhawtaLogo compact />
            <div><small>NEED HELP CHOOSING?</small><strong>Tell us what matters.</strong></div>
            <p>Camera, battery, gaming, display or budget — start there.</p>
            <a href="#compare">Compare products <ArrowRight size={14}/></a>
          </div>
        </div>

        <div className="lhawta-faq-list">
          <details open>
            <summary><span>Are LHAWTA products new?</span><ChevronDown size={18}/></summary>
            <p>Yes. LHAWTA is positioned around brand-new smartphones, tablets and consumer electronics. Product condition is shown clearly on each product page.</p>
          </details>
          <details>
            <summary><span>What products do you sell?</span><ChevronDown size={18}/></summary>
            <p>Smartphones, tablets, computers, TVs, gaming hardware, audio, wearables, accessories and other connected consumer electronics.</p>
          </details>
          <details>
            <summary><span>Do products include a warranty?</span><ChevronDown size={18}/></summary>
            <p>Warranty type, duration and relevant coverage details are shown on each applicable product before checkout.</p>
          </details>
          <details>
            <summary><span>Do you deliver across Morocco?</span><ChevronDown size={18}/></summary>
            <p>Yes. Delivery availability, timing and applicable shipping cost are shown during the buying flow based on destination and product.</p>
          </details>
          <details>
            <summary><span>Can I return or exchange a product?</span><ChevronDown size={18}/></summary>
            <p>Eligible products can be returned or exchanged under the displayed return policy.</p>
          </details>
        </div>
      </section>

      <section className="lhawta-closing">
        <div className="lhawta-newsletter">
          <div>
            <span>LHAWTA / PRIVATE LIST</span>
            <h2>New launches. Restocks. Deals worth opening.</h2>
            <p>No noise — just smartphones, tablets and electronics worth knowing about.</p>
          </div>
          <form>
            <label><small>EMAIL ADDRESS</small><input placeholder="you@example.com"/></label>
            <button type="button">Join the list <ArrowRight size={14}/></button>
          </form>
        </div>

        <footer className="lhawta-footer">
          <div className="lhawta-footer-brand">
            <LhawtaLogo light />
            <p>New tech. Better deals.</p>
            <span>Morocco · MAD</span>
          </div>
          <div className="lhawta-footer-links">
            <div><strong>SHOP</strong><a href="#deals">Smartphones</a><a href="#deals">Tablets</a><a href="#deals">Computers</a><a href="#deals">Gaming</a></div>
            <div><strong>DISCOVER</strong><a href="#compare">Compare</a><a href="#services">Services</a><a href="#">Buying guides</a><a href="#faq">FAQ</a></div>
            <div><strong>SUPPORT</strong><a href="#services">Delivery</a><a href="#services">Warranty</a><a href="#services">Returns</a><a href="#">Contact</a></div>
          </div>
          <div className="lhawta-footer-statement">
            <span>NEW TECH / BETTER DEALS</span>
            <strong>Smartphones. Tablets. Electronics.</strong>
          </div>
          <div className="lhawta-footer-bottom"><span>© 2026 LHAWTA</span><div><a href="#">Privacy</a><a href="#">Terms</a><span>Morocco · MAD</span></div></div>
        </footer>
      </section>
    </main>
  );
}
