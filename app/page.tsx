"use client";

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
import SiteMotion from "@/components/SiteMotion";

const APPLE_IMG="https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg";

const categories = [
  { id:"phones", name:"Smartphones", icon:Smartphone, subtitle:"Flagships · Foldables · Value" },
  { id:"tv", name:"TV & Home Cinema", icon:Tv, subtitle:"OLED · QLED · Mini LED" },
  { id:"computing", name:"Computing", icon:Laptop, subtitle:"Laptops · Desktops · Monitors" },
  { id:"gaming", name:"Gaming", icon:Gamepad2, subtitle:"Console · PC · Accessories" },
  { id:"audio", name:"Audio", icon:Headphones, subtitle:"Headphones · Speakers · Mics" },
  { id:"wearables", name:"Wearables", icon:Watch, subtitle:"Watches · Bands · Rings" },
  { id:"tablets", name:"Tablets", icon:Tablet, subtitle:"iPad · Galaxy Tab · HONOR" },
  { id:"accessories", name:"Accessories", icon:Monitor, subtitle:"Chargers · Cases · Keyboards" },
];

const products = [
  { brand:"Apple", name:"iPhone 17 Pro Max", rating:"4.9", reviews:"639", price:"14,999 MAD", old:"15,499 MAD", saving:"-500", badge:"Bestseller", image:APPLE_IMG, type:"image", href:"/products/iphone-17-pro-max" },
  { brand:"Samsung", name:"Galaxy S26 Ultra", rating:"4.8", reviews:"999+", price:"13,499 MAD", old:"14,499 MAD", saving:"-1,000", badge:"New", tone:"graphite", type:"mock", href:"#" },
  { brand:"HONOR", name:"Magic8 Pro", rating:"4.7", reviews:"184", price:"10,999 MAD", old:"11,999 MAD", saving:"-1,000", badge:"Camera pick", tone:"blue", type:"mock", href:"#" },
  { brand:"Sony", name:"PlayStation 5 Slim", rating:"4.9", reviews:"2.1k", price:"6,299 MAD", old:"6,799 MAD", saving:"-500", badge:"Popular", type:"console", href:"#" },
];

const guides = [
  ["PHONE GUIDE","How to choose a smartphone in 2026","Camera, battery, software support and the specs that actually matter."],
  ["TV GUIDE","OLED vs Mini LED vs QLED","Brightness, contrast, gaming features and the room you actually watch in."],
  ["LAPTOP GUIDE","The right laptop for your work","CPU, GPU, RAM, display and battery explained around real workloads."],
];

export default function Home() {
  return (
    <main className="store-page luxe-store">
      <SiteMotion />
      <StoreHeader />

      <section className="luxe-hero">
        <img className="luxe-hero-media" data-parallax src={APPLE_IMG} alt="iPhone 17 Pro lineup" />
        <div className="luxe-hero-shade" />
        <div className="luxe-hero-content hero-animate">
          <span className="luxe-kicker"><Sparkles size={13}/> NEXORA EDIT / OCTOBER</span>
          <h1>Technology,<br/><em>beautifully</em> understood.</h1>
          <p>One place to discover, compare and buy the devices that matter — without drowning in spec sheets.</p>
          <div className="luxe-hero-actions">
            <a href="#edit" className="luxe-primary">Shop the edit <ArrowRight size={17}/></a>
            <a href="/products/iphone-17-pro-max" className="luxe-secondary">Explore iPhone 17 Pro Max</a>
          </div>
        </div>

        <div className="luxe-hero-note" data-reveal-scale>
          <span>EDITOR’S PICK</span>
          <strong>iPhone 17 Pro Max</strong>
          <small>Best all-round flagship</small>
          <b>14,999 MAD</b>
        </div>

        <div className="luxe-hero-bottom">
          <div><span>01</span><strong>Compare clearly</strong></div>
          <div><span>02</span><strong>Shop confidently</strong></div>
          <div><span>03</span><strong>See what matters</strong></div>
        </div>
      </section>

      <section className="brand-marquee" aria-label="Brands">
        <div className="brand-marquee-track">
          {["APPLE","SAMSUNG","HONOR","SONY","LG","XIAOMI","LENOVO","ASUS","JBL","LOGITECH","APPLE","SAMSUNG","HONOR","SONY","LG","XIAOMI","LENOVO","ASUS","JBL","LOGITECH"].map((brand,index)=><span key={brand+index}>{brand}</span>)}
        </div>
      </section>

      <section className="luxe-section" id="edit">
        <div className="luxe-section-head" data-reveal>
          <div><span>CURATED NOW</span><h2>Shop the edit.</h2></div>
          <p>The products worth your attention right now — selected for a reason, not just because they are new.</p>
        </div>

        <div className="luxe-product-rail">
          {products.map((product,index)=>(
            <article className={"luxe-product-card "+(index===0?"featured":"")} data-reveal-scale key={product.name}>
              <div className="luxe-product-top">
                <span>{product.badge}</span>
                <button aria-label="Save"><Heart size={18}/></button>
              </div>
              <a href={product.href} className="luxe-product-media">
                {product.type==="image" ? <img src={product.image} alt={product.name}/> :
                product.type==="console" ? <div className="console-visual luxe-console"><i/><i/></div> :
                <div className={"device-visual device-"+product.tone+" luxe-device"}><i/><i/><i/></div>}
              </a>
              <div className="luxe-product-copy">
                <div className="luxe-product-brand">{product.brand}</div>
                <a href={product.href} className="luxe-product-name">{product.name}</a>
                <div className="luxe-rating"><Star size={12} fill="currentColor"/><strong>{product.rating}</strong><span>{product.reviews}</span></div>
                <div className="luxe-product-price"><strong>{product.price}</strong><del>{product.old}</del><b>{product.saving} MAD</b></div>
                <div className="luxe-product-actions"><button>Add to cart</button><label><input type="checkbox"/> Compare</label></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="luxe-category-stage">
        <div className="luxe-section-head inverse" data-reveal>
          <div><span>EXPLORE</span><h2>Shop by world.</h2></div>
          <p>Not an endless department list. Start with the kind of technology you actually care about.</p>
        </div>

        <div className="luxe-category-grid">
          {categories.slice(0,6).map(({id,name,icon:Icon,subtitle},index)=>(
            <a href={"#"+id} id={id} className={"luxe-category-card cat-"+index} data-reveal-scale key={name}>
              <div className="luxe-category-index">0{index+1}</div>
              <Icon className="luxe-category-icon" />
              <div><h3>{name}</h3><p>{subtitle}</p></div>
              <ArrowRight size={18}/>
            </a>
          ))}
        </div>
      </section>

      <section className="luxe-compare-story" data-reveal>
        <div className="luxe-compare-copy">
          <span>COMPARE BETTER</span>
          <h2>Stop comparing marketing.<br/>Compare the hardware.</h2>
          <p>Normalize the important specifications across brands and see the difference without scanning twenty tabs.</p>
          <a href="#">Open comparison <ArrowRight size={16}/></a>
        </div>
        <div className="luxe-compare-board">
          <div className="compare-board-head"><span>FLAGSHIP CAMERA PHONES</span><b>3 selected</b></div>
          {[
            ["01","iPhone 17 Pro Max","48 MP Pro","A19 Pro","14,999 MAD"],
            ["02","Galaxy S26 Ultra","Advanced zoom","Flagship","13,499 MAD"],
            ["03","HONOR Magic8 Pro","Telephoto","Flagship","10,999 MAD"],
          ].map(row=>(
            <div className="compare-board-row" key={row[1]}>
              <span>{row[0]}</span><strong>{row[1]}</strong><small>{row[2]}</small><small>{row[3]}</small><b>{row[4]}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="luxe-campaigns">
        <article className="luxe-campaign campaign-a" data-reveal-scale>
          <div><span>SMARTPHONE EVENT</span><h2>Flagship without the fog.</h2><p>Camera, battery, display and software support — explained around real use.</p><a href="#phones">Explore phones <ArrowRight size={16}/></a></div>
          <div className="campaign-phone-stack"><div/><div/><div/></div>
        </article>
        <article className="luxe-campaign campaign-b" data-reveal-scale>
          <div><span>GAMING</span><h2>Build around the experience.</h2><p>High refresh, low latency, the right console and the gear that actually changes play.</p><a href="#gaming">Shop gaming <ArrowRight size={16}/></a></div>
          <Gamepad2 className="luxe-campaign-icon"/>
        </article>
      </section>

      <section className="luxe-section priority-section">
        <div className="luxe-section-head" data-reveal>
          <div><span>SHOP BY PRIORITY</span><h2>What matters to you?</h2></div>
          <p>Start with the outcome, not the model number.</p>
        </div>
        <div className="luxe-priority-grid">
          <a href="#"><span>01</span><CameraBadge/><strong>Best camera phones</strong><small>Low light · zoom · video</small></a>
          <a href="#"><span>02</span><BatteryBadge/><strong>Best battery life</strong><small>Long days · travel · work</small></a>
          <a href="#"><span>03</span><GamingBadge/><strong>Best gaming gear</strong><small>Refresh · cooling · latency</small></a>
          <a href="#"><span>04</span><ValueBadge/><strong>Best value</strong><small>Maximum hardware for the money</small></a>
        </div>
      </section>

      <section className="luxe-guide-section" id="guides">
        <div className="luxe-section-head inverse" data-reveal>
          <div><span>NEXORA GUIDES</span><h2>Make sense of the specs.</h2></div>
          <a href="#">View all guides <ArrowRight size={16}/></a>
        </div>
        <div className="luxe-guide-grid">
          {guides.map(([tag,title,copy],index)=>(
            <article className={"luxe-guide-card guide-tone-"+index} data-reveal-scale key={title}>
              <span>{tag}</span>
              <div><h3>{title}</h3><p>{copy}</p><a href="#">Read the guide <ArrowRight size={14}/></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="luxe-service-grid">
        <article data-reveal><Truck size={22}/><strong>Fast delivery</strong><p>Clear availability and delivery windows before checkout.</p></article>
        <article data-reveal><ShieldCheck size={22}/><strong>Official warranty</strong><p>Coverage shown clearly, not buried after purchase.</p></article>
        <article data-reveal><BadgePercent size={22}/><strong>Real savings</strong><p>Original price, discount and value shown together.</p></article>
        <article data-reveal><Zap size={22}/><strong>Easy comparison</strong><p>Equivalent specs across brands, side by side.</p></article>
      </section>

      <section className="newsletter-block luxe-newsletter">
        <div><span>NEXORA / PRIVATE LIST</span><h2>Launches, drops and deals worth opening.</h2></div>
        <form><input placeholder="Email address"/><button type="button">Join the list</button></form>
      </section>

      <footer className="retail-footer luxe-footer">
        <div className="retail-footer-top">
          <div><a href="/" className="retail-footer-logo">NEXORA<span>.</span></a><p>Technology shopping made clearer.</p></div>
          <div><strong>Shop</strong><a href="#phones">Smartphones</a><a href="#tv">TV & Home Cinema</a><a href="#computing">Computers</a><a href="#gaming">Gaming</a></div>
          <div><strong>Customer care</strong><a href="#">Delivery</a><a href="#">Returns</a><a href="#">Warranty</a><a href="#">Contact us</a></div>
          <div><strong>Discover</strong><a href="#">Compare</a><a href="#guides">Buying guides</a><a href="#edit">The edit</a><a href="#">New releases</a></div>
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
