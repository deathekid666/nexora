"use client";

import {
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  Box,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  MessageCircle,
  RotateCcw,
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
          <div className="source-hero-float source-hero-float-top">
            <small>CONDITION</small>
            <strong>Brand new</strong>
          </div>
          <div className="source-hero-float source-hero-float-bottom">
            <small>BUY WITH CONFIDENCE</small>
            <strong>Warranty shown clearly</strong>
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

        <div className="source-latest-rail-wrap">
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
          <div className="source-rail-fade source-rail-fade-left"/>
          <div className="source-rail-fade source-rail-fade-right"/>
        </div>
      </section>

      <section className="source-compare" id="compare">
        <div className="source-compare-head" data-reveal>
          <div><span>COMPARE</span><h2>The differences,<br/>without the marketing.</h2></div>
          <p>Equivalent information in the same place. No spec-sheet scavenger hunt.</p>
        </div>

        <div className="source-compare-shell" data-reveal-scale>
          <div className="source-compare-topline">
            <span>3 devices selected</span>
            <span>Normalized specifications</span>
          </div>
          <div className="source-compare-table">
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


      <section className="retail-services-section" id="services">
        <div className="retail-services-head" data-reveal>
          <div>
            <span>SERVICES</span>
            <h2>Everything around buying new tech.</h2>
          </div>
          <p>NEXORA is built for new smartphones, tablets and consumer electronics — with clear product condition, warranty, delivery and buying support before you pay.</p>
        </div>

        <div className="retail-services-grid">
          <article className="retail-service-featured" data-reveal>
            <div className="retail-service-icon"><BadgeCheck size={23}/></div>
            <span>01</span>
            <h3>Brand-new products</h3>
            <p>Our catalog focuses on new smartphones, tablets, wearables, audio, gaming, computing and connected devices. Product condition is shown clearly on each listing.</p>
          </article>
          <article data-reveal>
            <div className="retail-service-icon"><ShieldCheck size={23}/></div>
            <span>02</span>
            <h3>Warranty made clear</h3>
            <p>Warranty type and coverage are shown with the product so you know what support comes with the device before ordering.</p>
          </article>
          <article data-reveal>
            <div className="retail-service-icon"><Truck size={23}/></div>
            <span>03</span>
            <h3>Delivery across Morocco</h3>
            <p>See availability, delivery estimates and any applicable shipping cost before checkout instead of discovering them after payment.</p>
          </article>
          <article data-reveal>
            <div className="retail-service-icon"><RotateCcw size={23}/></div>
            <span>04</span>
            <h3>Returns & exchanges</h3>
            <p>Eligible products can be returned or exchanged according to the displayed return policy, with the applicable conditions shown before purchase.</p>
          </article>
          <article data-reveal>
            <div className="retail-service-icon"><CreditCard size={23}/></div>
            <span>05</span>
            <h3>Secure payment</h3>
            <p>Available payment options are presented at checkout with a clear order summary, total price and delivery information.</p>
          </article>
          <article data-reveal>
            <div className="retail-service-icon"><MessageCircle size={23}/></div>
            <span>06</span>
            <h3>Buying guidance</h3>
            <p>Compare devices by camera, battery, display, performance, connectivity and price so you can choose the right product instead of the loudest marketing.</p>
          </article>
        </div>
      </section>

      <section className="retail-faq-section" id="faq">
        <div className="retail-faq-intro" data-reveal>
          <span>FAQ</span>
          <h2>Before you order.</h2>
          <p>Quick answers about new products, delivery, warranty, returns and compatibility.</p>
          <a href="#latest">Browse products <ArrowRight size={15}/></a>

          <div className="retail-faq-support-card">
            <span>SHOPPING SUPPORT</span>
            <strong>Need help choosing?</strong>
            <p>Start with what matters most: camera, battery, display, gaming, work or price.</p>
            <div>
              <b>Smartphones</b><b>Tablets</b><b>Wearables</b><b>Audio</b>
            </div>
          </div>
        </div>

        <div className="retail-faq-list">
          <details data-reveal>
            <summary><span>Are NEXORA products new?</span><ChevronDown size={18}/></summary>
            <p>Yes. NEXORA is positioned around new consumer electronics. The condition of each product is displayed on its product page so there is no ambiguity before purchase.</p>
          </details>
          <details data-reveal>
            <summary><span>What kinds of products do you sell?</span><ChevronDown size={18}/></summary>
            <p>The catalog is designed for smartphones, tablets, wearables, audio products, gaming hardware, computers, TVs, accessories and other connected consumer electronics.</p>
          </details>
          <details data-reveal>
            <summary><span>Do products include a warranty?</span><ChevronDown size={18}/></summary>
            <p>Warranty information is shown per product. The product page should state the warranty type, duration and any relevant coverage details before you add the item to your cart.</p>
          </details>
          <details data-reveal>
            <summary><span>Do you deliver across Morocco?</span><ChevronDown size={18}/></summary>
            <p>Yes. Delivery availability, timing and any shipping charge are shown during the buying flow based on the product and destination.</p>
          </details>
          <details data-reveal>
            <summary><span>Can I return or exchange a product?</span><ChevronDown size={18}/></summary>
            <p>Eligible products can be returned or exchanged under NEXORA's return policy. Condition requirements, return windows and exceptions should be displayed clearly before checkout.</p>
          </details>
          <details data-reveal>
            <summary><span>How do I know which phone or tablet is right for me?</span><ChevronDown size={18}/></summary>
            <p>Use NEXORA comparison to evaluate equivalent specifications side by side — including display, cameras, battery, processor, connectivity, storage and price — then choose based on your priorities.</p>
          </details>
          <details data-reveal>
            <summary><span>Can I check compatibility before buying?</span><ChevronDown size={18}/></summary>
            <p>Yes. Product pages are intended to show practical compatibility information such as SIM type, mobile network support, charging standard, ports and important ecosystem requirements.</p>
          </details>
          <details data-reveal>
            <summary><span>What happens if a product is out of stock?</span><ChevronDown size={18}/></summary>
            <p>Stock status should be visible on the product page. When available, an out-of-stock product can be marked for restock notification or preorder instead of appearing as immediately purchasable.</p>
          </details>
        </div>
      </section>


      <section className="closing-stage">
        <div className="closing-glow closing-glow-a"/>
        <div className="closing-glow closing-glow-b"/>

        <section className="source-services closing-services">
          <article data-reveal><Box size={21}/><strong>Brand-new products</strong><p>Smartphones, tablets and electronics with product condition shown clearly.</p></article>
          <article data-reveal><ShieldCheck size={21}/><strong>Warranty clarity</strong><p>Coverage and warranty type visible before you order.</p></article>
          <article data-reveal><BadgePercent size={21}/><strong>Clear pricing</strong><p>Original price, discount and total cost shown together.</p></article>
          <article data-reveal><Zap size={21}/><strong>Easy comparison</strong><p>Equivalent hardware and features normalized across brands.</p></article>
        </section>

        <section className="source-newsletter closing-newsletter" data-reveal-scale>
          <div className="closing-newsletter-copy">
            <span>NEXORA / PRIVATE LIST</span>
            <h2>Launches, restocks and deals worth opening.</h2>
            <p>No noise. Just new smartphones, tablets and electronics worth knowing about.</p>
          </div>
          <form>
            <label>
              <span>Email address</span>
              <input placeholder="you@example.com"/>
            </label>
            <button type="button">Join the list <ArrowRight size={14}/></button>
          </form>
          <div className="newsletter-orbit orbit-one"/>
          <div className="newsletter-orbit orbit-two"/>
        </section>

        <footer className="source-footer closing-footer">
          <div className="closing-footer-top">
            <div className="closing-footer-brand">
              <a href="/" className="source-footer-logo">NEXORA<span>.</span></a>
              <p>Technology shopping made clearer.</p>
              <div className="closing-footer-market">
                <span>Morocco</span>
                <b>MAD</b>
              </div>
            </div>

            <div className="closing-footer-column">
              <strong>Shop</strong>
              <a href="#latest">Smartphones</a>
              <a href="#latest">Tablets</a>
              <a href="#latest">Computers</a>
              <a href="#latest">TV & Home</a>
            </div>

            <div className="closing-footer-column">
              <strong>Discover</strong>
              <a href="#compare">Compare</a>
              <a href="#services">Services</a>
              <a href="#">Buying guides</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="closing-footer-column">
              <strong>Customer care</strong>
              <a href="#services">Delivery</a>
              <a href="#services">Warranty</a>
              <a href="#services">Returns</a>
              <a href="#">Contact</a>
            </div>
          </div>

          <div className="closing-footer-statement">
            <span>NEW TECH / CLEAR CHOICES</span>
            <strong>Smartphones. Tablets. Electronics.</strong>
          </div>

          <div className="source-footer-bottom">
            <span>© 2026 NEXORA</span>
            <div><a href="#">Privacy</a><a href="#">Terms</a><span>Morocco · MAD</span></div>
          </div>
        </footer>
      </section>
    </main>
  );
}
