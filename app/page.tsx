"use client";

import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Box,
  Cable,
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Headphones,
  Laptop,
  MessageCircle,
  RotateCcw,
  SearchCheck,
  ShieldCheck,
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

const HERO_PNG="/images/lhawta-iphone-trio.png";
const APPLE_IMG="https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg";
const LAPTOP_IMG="https://images.unsplash.com/photo-1782012505157-aca188bd6921?auto=format&fit=crop&w=1800&q=88";
const GAMING_IMG="https://images.unsplash.com/photo-1763258986479-0962883e1747?auto=format&fit=crop&w=1800&q=88";
const TV_IMG="https://images.unsplash.com/photo-1735078254602-b7818942c324?auto=format&fit=crop&w=1800&q=88";

const categories = [
  { name:"Smartphones", icon:Smartphone },
  { name:"Tablets", icon:Tablet },
  { name:"Computers", icon:Laptop },
  { name:"TV", icon:Tv },
  { name:"Gaming", icon:Gamepad2 },
  { name:"Audio", icon:Headphones },
  { name:"Wearables", icon:Watch },
  { name:"Accessories", icon:Cable },
];

const latest = [
  {
    eyebrow:"APPLE · NEW",
    title:"iPhone 17 Pro Max",
    copy:"Flagship camera, display and performance in one premium device.",
    price:"14,999 MAD",
    old:"15,499 MAD",
    image:APPLE_IMG,
    href:"/products/iphone-17-pro-max",
    tone:"dark",
    tag:"Bestseller",
  },
  {
    eyebrow:"COMPUTING",
    title:"Portable power, properly chosen.",
    copy:"Compare CPU, GPU, battery and display before choosing your next laptop.",
    price:"Explore laptops",
    image:LAPTOP_IMG,
    href:"#",
    tone:"light",
    tag:"Work & study",
  },
  {
    eyebrow:"GAMING",
    title:"Build the setup around play.",
    copy:"Console, display, audio and latency — considered as one experience.",
    price:"Explore gaming",
    image:GAMING_IMG,
    href:"#",
    tone:"dark",
    tag:"Gaming",
  },
  {
    eyebrow:"TV & HOME",
    title:"Choose the panel before the size.",
    copy:"OLED, Mini LED and QLED compared around your room and how you watch.",
    price:"Explore TV",
    image:TV_IMG,
    href:"#",
    tone:"light",
    tag:"Home",
  },
];

const compareRows = [
  { brand:"Apple", name:"iPhone 17 Pro Max", camera:"48 MP Pro", display:"6.9″ OLED", chip:"A19 Pro", battery:"All-day", price:"14,999 MAD", tag:"Best all-round" },
  { brand:"Samsung", name:"Galaxy S26 Ultra", camera:"Advanced zoom", display:"AMOLED", chip:"Flagship", battery:"Large", price:"13,499 MAD", tag:"Best zoom" },
  { brand:"HONOR", name:"Magic8 Pro", camera:"Telephoto", display:"OLED", chip:"Flagship", battery:"Large", price:"10,999 MAD", tag:"Best value" },
];

const services = [
  { icon:BadgeCheck, title:"Brand-new products", copy:"New smartphones, tablets and electronics with product condition shown clearly before purchase." },
  { icon:ShieldCheck, title:"Warranty clarity", copy:"Warranty type and coverage are visible on the product page before you order." },
  { icon:Truck, title:"Delivery across Morocco", copy:"Availability, delivery estimate and shipping cost are shown before checkout." },
  { icon:RotateCcw, title:"Returns & exchanges", copy:"Eligible products follow a clearly displayed return and exchange policy." },
  { icon:SearchCheck, title:"Buying guidance", copy:"Compare the specifications that actually affect camera, battery, gaming, work and value." },
  { icon:MessageCircle, title:"Shopping support", copy:"Get help choosing the right phone, tablet or device for your priorities and budget." },
];

export default function Home() {
  return (
    <main className="store-page lhawta-site">
      <SiteMotion />
      <StoreHeader />

      <section className="lhawta-hero">
        <div className="lhawta-hero-grid">
          <div className="lhawta-hero-copy">
            <span className="lhawta-eyebrow"><Sparkles size={13}/> LHAWTA / MOROCCO</span>
            <h1>New tech.<br/><em>Clear choices.</em></h1>
            <p>Brand-new smartphones, tablets and electronics — with the specs, warranty, price and delivery information you need before you buy.</p>

            <div className="lhawta-hero-actions">
              <a href="#latest" className="lhawta-btn-primary">Shop new arrivals <ArrowRight size={16}/></a>
              <a href="#compare" className="lhawta-btn-ghost">Compare flagships <ChevronRight size={15}/></a>
            </div>

            <div className="lhawta-hero-proof">
              <span><BadgeCheck size={15}/><b>Brand new</b></span>
              <span><ShieldCheck size={15}/><b>Warranty</b></span>
              <span><Truck size={15}/><b>Morocco delivery</b></span>
            </div>
          </div>

          <a href="/products/iphone-17-pro-max" className="lhawta-hero-product lhawta-hero-product-png">
            <img src={HERO_PNG} alt="iPhone 17 Pro Max lineup" />
            <div className="lhawta-hero-overlay"/>
            <div className="lhawta-hero-product-top">
              <span>NEW / FLAGSHIP</span>
              <b>Brand new</b>
            </div>
            <div className="lhawta-hero-product-bottom">
              <div><small>APPLE</small><strong>iPhone 17 Pro Max</strong></div>
              <div><small>FROM</small><strong>14,999 MAD</strong></div>
            </div>
            <div className="lhawta-blue-line"/>
          </a>
        </div>

        <div className="lhawta-category-dock">
          {categories.map(({name,icon:Icon},index)=>(
            <a href="#latest" key={name}>
              <div><Icon size={23}/></div>
              <strong>{name}</strong>
              <span>0{index+1}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="lhawta-latest-section" id="latest">
        <div className="lhawta-section-heading">
          <div>
            <span>NEW ARRIVALS</span>
            <h2>Start with what’s worth seeing.</h2>
          </div>
          <p>Big product stories, real prices and clear reasons to choose — not an endless wall of tiny cards.</p>
        </div>

        <div className="lhawta-horizontal-shell">
          <div className="lhawta-horizontal-track">
            {latest.map((item,index)=>(
              <a href={item.href} className={"lhawta-feature-card tone-"+item.tone} key={item.title}>
                <img src={item.image} alt={item.title}/>
                <div className="lhawta-feature-shade"/>
                <div className="lhawta-feature-top">
                  <span>{item.eyebrow}</span>
                  <b>{item.tag}</b>
                </div>
                <div className="lhawta-feature-copy">
                  <span>0{index+1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <div className="lhawta-feature-price">
                    <strong>{item.price}</strong>
                    {item.old && <del>{item.old}</del>}
                    <ArrowRight size={16}/>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="lhawta-merch-section">
        <article className="lhawta-merch-main">
          <img src={APPLE_IMG} alt="Premium smartphone lineup"/>
          <div className="lhawta-merch-overlay"/>
          <div className="lhawta-merch-copy">
            <span>SMARTPHONE EDIT</span>
            <h2>Buy the phone.<br/>Understand the reason.</h2>
            <p>Camera, battery, display, performance and price — compared in the same language.</p>
            <a href="#compare">Compare smartphones <ArrowRight size={15}/></a>
          </div>
          <div className="lhawta-merch-badge"><BatteryCharging size={18}/><span><small>SHOP BY PRIORITY</small><strong>Battery · Camera · Gaming</strong></span></div>
        </article>

        <div className="lhawta-merch-side">
          <article className="lhawta-mini-story lhawta-mini-blue">
            <Laptop size={86}/>
            <div><span>COMPUTING</span><h3>Work. Study. Create.</h3><p>Find the machine that fits the workload.</p><a href="#latest">Shop computing <ArrowRight size={14}/></a></div>
          </article>
          <article className="lhawta-mini-story lhawta-mini-black">
            <Gamepad2 size={92}/>
            <div><span>GAMING</span><h3>Build for the experience.</h3><p>Refresh, latency, performance and audio.</p><a href="#latest">Shop gaming <ArrowRight size={14}/></a></div>
          </article>
        </div>
      </section>

      <section className="lhawta-compare-section" id="compare">
        <div className="lhawta-compare-heading">
          <div><span>COMPARE / SMARTPHONES</span><h2>Difference,<br/><em>without the noise.</em></h2></div>
          <p>Equivalent specifications side by side, with useful labels instead of a meaningless overall score.</p>
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
        <div className="lhawta-section-heading">
          <div><span>SERVICES</span><h2>Everything around buying new tech.</h2></div>
          <p>LHAWTA is designed as a new-electronics store, not a classifieds marketplace. Product condition, warranty and buying support are part of the experience.</p>
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
          <p>Quick answers about new products, delivery, warranty, returns and compatibility.</p>

          <div className="lhawta-help-card">
            <LhawtaLogo compact />
            <div><small>NEED HELP CHOOSING?</small><strong>Tell us what matters.</strong></div>
            <p>Camera, battery, gaming, work, display or budget — start there.</p>
            <a href="#compare">Compare products <ArrowRight size={14}/></a>
          </div>
        </div>

        <div className="lhawta-faq-list">
          <details open>
            <summary><span>Are LHAWTA products new?</span><ChevronDown size={18}/></summary>
            <p>Yes. LHAWTA is positioned around brand-new smartphones, tablets and consumer electronics. Product condition is shown clearly on the product page.</p>
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
            <p>Eligible products can be returned or exchanged under the displayed return policy, including the applicable condition requirements and return window.</p>
          </details>
          <details>
            <summary><span>How do I choose between similar phones?</span><ChevronDown size={18}/></summary>
            <p>Use LHAWTA comparison to line up equivalent camera, display, battery, processor, storage, connectivity and price information, then choose around your priorities.</p>
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
            <p>New tech. Clear choices.</p>
            <span>Morocco · MAD</span>
          </div>

          <div className="lhawta-footer-links">
            <div><strong>SHOP</strong><a href="#latest">Smartphones</a><a href="#latest">Tablets</a><a href="#latest">Computers</a><a href="#latest">Gaming</a></div>
            <div><strong>DISCOVER</strong><a href="#compare">Compare</a><a href="#services">Services</a><a href="#">Buying guides</a><a href="#faq">FAQ</a></div>
            <div><strong>SUPPORT</strong><a href="#services">Delivery</a><a href="#services">Warranty</a><a href="#services">Returns</a><a href="#">Contact</a></div>
          </div>

          <div className="lhawta-footer-statement">
            <span>NEW TECH / CLEAR CHOICES</span>
            <strong>Smartphones. Tablets. Electronics.</strong>
          </div>

          <div className="lhawta-footer-bottom"><span>© 2026 LHAWTA</span><div><a href="#">Privacy</a><a href="#">Terms</a><span>Morocco · MAD</span></div></div>
        </footer>
      </section>
    </main>
  );
}
