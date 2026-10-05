"use client";

import {
  ArrowRight,
  BadgePercent,
  ChevronRight,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  Monitor,
  ShieldCheck,
  Smartphone,
  Star,
  Tablet,
  Truck,
  Tv,
  Watch,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";

const categories = [
  { id:"phones", name:"Smartphones", icon:Smartphone, subtitle:"iPhone · Galaxy · HONOR" },
  { id:"tv", name:"TV & Home Cinema", icon:Tv, subtitle:"OLED · QLED · Mini LED" },
  { id:"computing", name:"Computers", icon:Laptop, subtitle:"Laptops · Desktops · Monitors" },
  { id:"gaming", name:"Gaming", icon:Gamepad2, subtitle:"PS5 · Xbox · Nintendo" },
  { id:"audio", name:"Audio", icon:Headphones, subtitle:"Headphones · Speakers" },
  { id:"wearables", name:"Wearables", icon:Watch, subtitle:"Watches · Bands · Rings" },
  { id:"tablets", name:"Tablets", icon:Tablet, subtitle:"iPad · Galaxy Tab · HONOR" },
  { id:"accessories", name:"Accessories", icon:Monitor, subtitle:"Chargers · Cases · Cables" },
];

const products = [
  { brand:"Apple", name:"iPhone 17 Pro Max", rating:"4.9", reviews:"639", price:"14,999 MAD", old:"15,499 MAD", badge:"Bestseller", tone:"silver" },
  { brand:"Samsung", name:"Galaxy S26 Ultra", rating:"4.8", reviews:"999+", price:"13,499 MAD", old:"14,499 MAD", badge:"New", tone:"graphite" },
  { brand:"HONOR", name:"Magic8 Pro", rating:"4.7", reviews:"184", price:"10,999 MAD", old:"11,999 MAD", badge:"Top camera", tone:"blue" },
  { brand:"Sony", name:"PlayStation 5 Slim", rating:"4.9", reviews:"2.1k", price:"6,299 MAD", old:"6,799 MAD", badge:"Popular", tone:"white" },
];

export default function Home() {
  return (
    <main className="store-page">
      <StoreHeader />

      <section className="commerce-hero">
        <div className="commerce-hero-main">
          <div className="commerce-hero-copy">
            <span className="commerce-eyebrow">NEW · FLAGSHIP PHONES</span>
            <h1>Find the right tech.<br/>Understand it before you buy.</h1>
            <p>Shop the biggest electronics categories with clean specs, side-by-side comparison and interactive 3D on selected products.</p>
            <div className="commerce-hero-actions">
              <a href="#trending" className="btn-primary">Shop smartphones <ArrowRight size={17}/></a>
              <a href="/products/iphone-17-pro-max" className="btn-secondary">Explore a phone in 3D</a>
            </div>
          </div>
          <div className="hero-product-stage" aria-hidden="true">
            <div className="hero-product-card hero-phone-card">
              <div className="mock-phone large"><i/><i/><i/></div>
            </div>
            <div className="hero-float-card hero-float-price">
              <small>From</small><strong>14,999 MAD</strong>
            </div>
            <div className="hero-float-card hero-float-compare">
              <small>Compare</small><strong>Camera · Battery · Display</strong>
            </div>
          </div>
        </div>

        <div className="commerce-side-promos">
          <article className="side-promo side-promo-dark">
            <span>GAMING</span>
            <h3>Console season.</h3>
            <p>PS5, Xbox and accessories.</p>
            <a href="#gaming">Shop gaming <ChevronRight size={15}/></a>
          </article>
          <article className="side-promo side-promo-light">
            <span>TV & HOME CINEMA</span>
            <h3>Big screen, better choice.</h3>
            <p>Compare panel type, refresh rate and HDR.</p>
            <a href="#tv">Shop TVs <ChevronRight size={15}/></a>
          </article>
        </div>
      </section>

      <section className="trust-row">
        <div><Truck size={20}/><span><strong>Fast delivery</strong><small>Across Morocco</small></span></div>
        <div><ShieldCheck size={20}/><span><strong>Official warranty</strong><small>Clear warranty details</small></span></div>
        <div><BadgePercent size={20}/><span><strong>Competitive pricing</strong><small>See deals clearly</small></span></div>
        <div><Star size={20}/><span><strong>Compare confidently</strong><small>Normalized specs</small></span></div>
      </section>

      <section className="store-section category-section-store">
        <div className="store-section-heading">
          <div><span>SHOP BY CATEGORY</span><h2>Everything in one place.</h2></div>
          <a href="#">View all categories <ArrowRight size={16}/></a>
        </div>
        <div className="store-category-grid">
          {categories.map(({id,name,icon:Icon,subtitle}) => (
            <a className="store-category-card" href={"#"+id} id={id} key={name}>
              <div className="store-category-icon"><Icon size={29}/></div>
              <strong>{name}</strong>
              <small>{subtitle}</small>
              <ChevronRight size={17}/>
            </a>
          ))}
        </div>
      </section>

      <section className="store-section" id="trending">
        <div className="store-section-heading">
          <div><span>TRENDING NOW</span><h2>Popular picks.</h2></div>
          <a href="#">See all products <ArrowRight size={16}/></a>
        </div>

        <div className="product-grid">
          {products.map((product,index) => (
            <article className="product-card" key={product.name}>
              <div className="product-card-topline">
                <span className="product-badge">{product.badge}</span>
                <button aria-label="Add to wishlist"><Heart size={18}/></button>
              </div>
              <a href={index===0?"/products/iphone-17-pro-max":"#"} className={"product-image product-image-"+product.tone}>
                <div className="mock-phone product-mock"><i/><i/><i/></div>
              </a>
              <div className="product-copy">
                <small className="product-brand">{product.brand}</small>
                <a className="product-name" href={index===0?"/products/iphone-17-pro-max":"#"}>{product.name}</a>
                <div className="product-rating"><Star size={13} fill="currentColor"/><strong>{product.rating}</strong><span>({product.reviews})</span></div>
                <div className="product-price"><strong>{product.price}</strong><del>{product.old}</del></div>
                <label className="compare-check"><input type="checkbox"/> Compare</label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="explore-banner">
        <div>
          <span>EXCLUSIVE TO NEXORA</span>
          <h2>See what’s inside before you buy.</h2>
          <p>Selected flagship products include interactive 360° views and exploded hardware anatomy.</p>
          <a href="/products/iphone-17-pro-max">Explore iPhone 17 Pro Max <ArrowRight size={17}/></a>
        </div>
        <div className="explore-banner-visual">
          <div className="anatomy-layer l1"/>
          <div className="anatomy-layer l2"/>
          <div className="anatomy-layer l3"/>
          <div className="anatomy-layer l4"/>
        </div>
      </section>

      <section className="store-section brand-section">
        <div className="store-section-heading">
          <div><span>TOP BRANDS</span><h2>Shop the names you know.</h2></div>
        </div>
        <div className="brand-grid">
          {["Apple","Samsung","HONOR","Sony","LG","Lenovo","ASUS","Xiaomi"].map(b => <a href="#" key={b}>{b}</a>)}
        </div>
      </section>

      <footer className="commerce-footer">
        <div className="footer-logo">NEXORA</div>
        <div className="commerce-footer-links">
          <div><strong>Shop</strong><a href="#phones">Smartphones</a><a href="#tv">TV</a><a href="#computing">Computers</a><a href="#gaming">Gaming</a></div>
          <div><strong>Help</strong><a href="#">Delivery</a><a href="#">Returns</a><a href="#">Warranty</a><a href="#">Contact</a></div>
          <div><strong>Discover</strong><a href="/products/iphone-17-pro-max">Explore in 3D</a><a href="#">Compare</a><a href="#">Buying guides</a></div>
        </div>
        <div className="commerce-footer-bottom"><span>© 2026 NEXORA</span><span>Morocco · MAD</span></div>
      </footer>
    </main>
  );
}
