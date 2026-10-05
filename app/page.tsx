"use client";

import { useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  ChevronRight,
  CircleDollarSign,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  Monitor,
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

const APPLE_IMG="https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg";

const categories = [
  { id:"phones", name:"Smartphones", icon:Smartphone, subtitle:"Apple · Samsung · HONOR" },
  { id:"tv", name:"TV & Home Cinema", icon:Tv, subtitle:"OLED · QLED · Mini LED" },
  { id:"computing", name:"Computers", icon:Laptop, subtitle:"Laptops · Desktops · Monitors" },
  { id:"gaming", name:"Gaming", icon:Gamepad2, subtitle:"PlayStation · Xbox · Nintendo" },
  { id:"audio", name:"Audio", icon:Headphones, subtitle:"Headphones · Speakers · Mics" },
  { id:"wearables", name:"Wearables", icon:Watch, subtitle:"Watches · Bands · Rings" },
  { id:"tablets", name:"Tablets", icon:Tablet, subtitle:"iPad · Galaxy Tab · HONOR" },
  { id:"accessories", name:"Accessories", icon:Monitor, subtitle:"Chargers · Cases · Keyboards" },
];

const products = [
  { brand:"Apple", name:"iPhone 17 Pro Max", rating:"4.9", reviews:"639", price:"14,999 MAD", old:"15,499 MAD", saving:"Save 500", badge:"Bestseller", image:APPLE_IMG, type:"image" },
  { brand:"Samsung", name:"Galaxy S26 Ultra", rating:"4.8", reviews:"999+", price:"13,499 MAD", old:"14,499 MAD", saving:"Save 1,000", badge:"New", tone:"graphite", type:"mock" },
  { brand:"HONOR", name:"Magic8 Pro", rating:"4.7", reviews:"184", price:"10,999 MAD", old:"11,999 MAD", saving:"Save 1,000", badge:"Top camera", tone:"blue", type:"mock" },
  { brand:"Sony", name:"PlayStation 5 Slim", rating:"4.9", reviews:"2.1k", price:"6,299 MAD", old:"6,799 MAD", saving:"Save 500", badge:"Popular", tone:"white", type:"console" },
];

const heroSlides = [
  {
    kicker:"FLAGSHIP SMARTPHONES",
    title:"Choose better. Not just newer.",
    copy:"Compare the phones everyone is talking about, see the specifications that matter and find the right model for your budget.",
    cta:"Shop smartphones",
    href:"#deals",
    secondary:"See iPhone 17 Pro Max",
    secondaryHref:"/products/iphone-17-pro-max",
    type:"phone",
  },
  {
    kicker:"GAMING WEEK",
    title:"Build the setup you actually want.",
    copy:"Consoles, displays, headsets and accessories brought together in one shopping flow — with the specs that affect real gameplay.",
    cta:"Shop gaming",
    href:"#gaming",
    secondary:"See gaming picks",
    secondaryHref:"#deals",
    type:"gaming",
  },
  {
    kicker:"TV & HOME CINEMA",
    title:"Big screen. Clearer choice.",
    copy:"Compare panel type, brightness, refresh rate, ports and room fit without jumping between five different product pages.",
    cta:"Shop TVs",
    href:"#tv",
    secondary:"See buying guide",
    secondaryHref:"#guides",
    type:"tv",
  },
];

const guides = [
  ["PHONE GUIDE","How to choose a smartphone in 2026","Camera, battery, software support and the specs that actually matter."],
  ["TV GUIDE","OLED vs Mini LED vs QLED","Understand brightness, contrast, gaming features and room conditions."],
  ["LAPTOP GUIDE","The right laptop for your work","CPU, GPU, RAM, display and battery explained without jargon."],
];

export default function Home() {
  const [heroIndex,setHeroIndex]=useState(0);
  const slide=heroSlides[heroIndex];

  return (
    <main className="store-page">
      <StoreHeader />

      <section className={"retail-hero retail-hero-"+slide.type}>
        <div className="retail-hero-primary">
          <div className="retail-hero-copy">
            <span className="retail-kicker">{slide.kicker}</span>
            <h1>{slide.title}</h1>
            <p>{slide.copy}</p>
            <div className="retail-hero-actions">
              <a className="retail-primary-btn" href={slide.href}>{slide.cta} <ArrowRight size={17}/></a>
              <a className="retail-link-btn" href={slide.secondaryHref}>{slide.secondary} <ChevronRight size={16}/></a>
            </div>

            <div className="hero-pagination">
              {heroSlides.map((item,index)=>(
                <button key={item.kicker} className={heroIndex===index?"active":""} onClick={()=>setHeroIndex(index)}>
                  <span>{String(index+1).padStart(2,"0")}</span>
                  <b>{item.kicker}</b>
                </button>
              ))}
            </div>
          </div>

          <div className="retail-hero-image">
            {slide.type==="phone" && <img src={APPLE_IMG} alt="iPhone 17 Pro lineup" />}
            {slide.type==="gaming" && <div className="hero-gaming-art"><div className="hero-console"/><div className="hero-controller"><i/><i/></div></div>}
            {slide.type==="tv" && <div className="hero-tv-art"><div className="hero-tv-screen"><span>4K</span></div><div className="hero-soundbar"/></div>}
            <div className="retail-image-chip">
              <small>{slide.type==="phone"?"Editor pick":slide.type==="gaming"?"Gaming essentials":"Best for living rooms"}</small>
              <strong>{slide.type==="phone"?"From 14,999 MAD":slide.type==="gaming"?"Consoles + displays":"OLED · QLED · Mini LED"}</strong>
            </div>
          </div>
        </div>

        <div className="retail-hero-secondary">
          <article className="retail-promo promo-blue">
            <span>SMART PICKS</span>
            <h3>Best camera phones.</h3>
            <p>Compare zoom, low light and video quality.</p>
            <a href="#priority">See picks <ArrowRight size={15}/></a>
            <Sparkles className="promo-watermark" />
          </article>
          <article className="retail-promo promo-warm">
            <span>LIMITED OFFERS</span>
            <h3>Deals worth opening.</h3>
            <p>See the discount and the trade-off at a glance.</p>
            <a href="#deals">Shop deals <ArrowRight size={15}/></a>
            <CircleDollarSign className="promo-watermark" />
          </article>
        </div>
      </section>

      <section className="service-bar">
        <div><Truck size={21}/><span><strong>Fast delivery</strong><small>Across Morocco</small></span></div>
        <div><ShieldCheck size={21}/><span><strong>Official warranty</strong><small>Clear coverage on every item</small></span></div>
        <div><BadgePercent size={21}/><span><strong>Price transparency</strong><small>Deals and savings shown clearly</small></span></div>
        <div><Zap size={21}/><span><strong>Easy comparison</strong><small>Specs normalized across brands</small></span></div>
      </section>

      <section className="retail-section category-showcase">
        <div className="retail-section-head">
          <div><span>SHOP BY CATEGORY</span><h2>Start with what you need.</h2></div>
          <a href="#">All categories <ArrowRight size={16}/></a>
        </div>
        <div className="category-market-grid">
          {categories.map(({id,name,icon:Icon,subtitle})=>(
            <a href={"#"+id} id={id} className="category-market-card" key={name}>
              <div className="category-market-icon"><Icon size={30}/></div>
              <div><strong>{name}</strong><small>{subtitle}</small></div>
              <ChevronRight size={17}/>
            </a>
          ))}
        </div>
      </section>

      <section className="retail-section deals-section" id="deals">
        <div className="retail-section-head">
          <div><span>TOP DEALS</span><h2>Worth your attention.</h2></div>
          <div className="deal-tabs"><button className="active">All</button><button>Phones</button><button>Computing</button><button>Gaming</button></div>
        </div>

        <div className="retail-product-grid">
          {products.map((product,index)=>(
            <article className="retail-product-card" key={product.name}>
              <div className="retail-product-badges"><span>{product.badge}</span><b>{product.saving}</b></div>
              <button className="retail-heart" aria-label="Wishlist"><Heart size={18}/></button>
              <a href={index===0?"/products/iphone-17-pro-max":"#"} className="retail-product-visual">
                {product.type==="image" ? <img src={product.image} alt={product.name}/> :
                 product.type==="console" ? <div className="console-visual"><i/><i/></div> :
                 <div className={"device-visual device-"+product.tone}><i/><i/><i/></div>}
              </a>
              <div className="retail-product-info">
                <small>{product.brand}</small>
                <a href={index===0?"/products/iphone-17-pro-max":"#"} className="retail-product-title">{product.name}</a>
                <div className="retail-rating"><Star size={13} fill="currentColor"/><strong>{product.rating}</strong><span>{product.reviews} reviews</span></div>
                <div className="retail-price"><strong>{product.price}</strong><del>{product.old}</del></div>
                <div className="retail-availability"><i/> In stock · Free delivery</div>
                <div className="retail-card-actions">
                  <button>Add to cart</button>
                  <label><input type="checkbox"/> Compare</label>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="deal-rail">
          <div><span>FLASH DEAL</span><strong>Save up to 1,000 MAD on selected phones</strong><small>While stock lasts</small></div>
          <a href="#">View all offers <ArrowRight size={15}/></a>
        </div>
      </section>

      <section className="campaign-grid">
        <article className="campaign-card campaign-phone">
          <div>
            <span>SMARTPHONE EVENT</span>
            <h2>Trade up without guessing.</h2>
            <p>Compare cameras, battery, displays and software support before you change phones.</p>
            <a href="#phones">Explore smartphones <ArrowRight size={16}/></a>
          </div>
          <div className="campaign-phone-stack"><div/><div/><div/></div>
        </article>
        <article className="campaign-card campaign-compute">
          <div>
            <span>BACK TO PRODUCTIVITY</span>
            <h2>Find the right computer for the job.</h2>
            <p>Study, office, creative work or gaming — filter by the specs your workload needs.</p>
            <a href="#computing">Shop computing <ArrowRight size={16}/></a>
          </div>
          <Laptop className="campaign-icon"/>
        </article>
      </section>

      <section className="retail-section recommendation-section" id="priority">
        <div className="retail-section-head">
          <div><span>SHOP BY PRIORITY</span><h2>What matters most?</h2></div>
        </div>
        <div className="priority-grid">
          <a href="#"><span>01</span><strong>Best camera phones</strong><small>Low light · zoom · video</small><CameraBadge/></a>
          <a href="#"><span>02</span><strong>Best battery life</strong><small>Long days · travel · work</small><BatteryBadge/></a>
          <a href="#"><span>03</span><strong>Best gaming gear</strong><small>High refresh · cooling · latency</small><GamingBadge/></a>
          <a href="#"><span>04</span><strong>Best value</strong><small>Maximum hardware for the price</small><ValueBadge/></a>
        </div>
      </section>

      <section className="editor-picks">
        <div className="editor-picks-head">
          <div><span>EDITOR’S PICKS</span><h2>Three devices we’d start with.</h2></div>
          <p>Not because they are the newest — because they make the strongest case for their price and use case.</p>
        </div>
        <div className="editor-pick-grid">
          <article className="editor-pick editor-pick-featured">
            <div className="editor-pick-copy"><span>BEST ALL-ROUND FLAGSHIP</span><h3>iPhone 17 Pro Max</h3><p>Premium display, strong cameras and long software support.</p><a href="/products/iphone-17-pro-max">See product <ArrowRight size={14}/></a></div>
            <img src={APPLE_IMG} alt="iPhone 17 Pro lineup"/>
          </article>
          <article className="editor-pick"><div className="mini-device graphite"><i/><i/><i/></div><span>BEST ANDROID CAMERA</span><h3>Galaxy S26 Ultra</h3><p>Built for zoom, display quality and power users.</p></article>
          <article className="editor-pick"><div className="mini-device blue"><i/><i/><i/></div><span>BEST VALUE FLAGSHIP</span><h3>HONOR Magic8 Pro</h3><p>Strong hardware at a more aggressive price.</p></article>
        </div>
      </section>

      <section className="retail-section guide-section" id="guides">
        <div className="retail-section-head">
          <div><span>BUYING GUIDES</span><h2>Make sense of the specs.</h2></div>
          <a href="#">View all guides <ArrowRight size={16}/></a>
        </div>
        <div className="guide-grid">
          {guides.map(([tag,title,copy],index)=>(
            <article className={"guide-card guide-"+index} key={title}>
              <span>{tag}</span>
              <div><h3>{title}</h3><p>{copy}</p><a href="#">Read guide <ArrowRight size={14}/></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="retail-section brand-section">
        <div className="retail-section-head"><div><span>TOP BRANDS</span><h2>Shop your favorites.</h2></div></div>
        <div className="brand-market-grid">
          {["Apple","Samsung","HONOR","Sony","LG","Xiaomi","Lenovo","ASUS","JBL","Logitech"].map(b=><a href="#" key={b}>{b}</a>)}
        </div>
      </section>

      <section className="newsletter-block">
        <div><span>NEXORA UPDATES</span><h2>Deals, launches and buying advice.</h2></div>
        <form><input placeholder="Your email address"/><button type="button">Subscribe</button></form>
      </section>

      <footer className="retail-footer">
        <div className="retail-footer-top">
          <div><a href="/" className="retail-footer-logo">NEXORA<span>.</span></a><p>Technology shopping made clearer.</p></div>
          <div><strong>Shop</strong><a href="#phones">Smartphones</a><a href="#tv">TV & Home Cinema</a><a href="#computing">Computers</a><a href="#gaming">Gaming</a></div>
          <div><strong>Customer care</strong><a href="#">Delivery</a><a href="#">Returns</a><a href="#">Warranty</a><a href="#">Contact us</a></div>
          <div><strong>Discover</strong><a href="#">Compare</a><a href="#guides">Buying guides</a><a href="#deals">Deals</a><a href="#">New releases</a></div>
        </div>
        <div className="retail-footer-bottom"><span>© 2026 NEXORA</span><span>Morocco · MAD</span></div>
      </footer>
    </main>
  );
}

function CameraBadge(){return <div className="priority-art priority-camera"><i/><i/><i/></div>}
function BatteryBadge(){return <div className="priority-art priority-battery"><b/></div>}
function GamingBadge(){return <div className="priority-art priority-gaming"><i/><i/></div>}
function ValueBadge(){return <div className="priority-art priority-value">MAD</div>}
