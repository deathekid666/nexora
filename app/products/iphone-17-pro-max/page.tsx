"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Cpu,
  Heart,
  MonitorUp,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import Comparison from "@/components/Comparison";
import { iphone17ProMax } from "@/lib/products";

const APPLE_IMG="https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg";

export default function ProductPage() {
  const [finishIndex,setFinishIndex] = useState(2);
  const [storage,setStorage] = useState("256GB");
  const finish=iphone17ProMax.finishes[finishIndex];

  return (
    <main className="store-page">
      <StoreHeader />

      <div className="product-subnav">
        <div><strong>iPhone 17 Pro Max</strong><span>Smartphones</span></div>
        <nav><a href="#overview">Overview</a><a href="#specs">Specs</a><a href="#compare">Compare</a><button>Buy</button></nav>
      </div>

      <div className="breadcrumbs">
        <a href="/">Home</a><ChevronRight size={13}/><a href="/#phones">Smartphones</a><ChevronRight size={13}/><span>iPhone 17 Pro Max</span>
      </div>

      <section className="product-commerce" id="overview">
        <div className="product-gallery-static">
          <div className="gallery-badge">Official product imagery</div>
          <div className="gallery-main-image">
            <img src={APPLE_IMG} alt="iPhone 17 Pro Max lineup"/>
          </div>
          <div className="gallery-thumbnails">
            <button className="active"><img src={APPLE_IMG} alt="iPhone color lineup"/></button>
            <button><div className="thumb-device front"/></button>
            <button><div className="thumb-device back"/></button>
            <button><div className="thumb-camera"><i/><i/><i/></div></button>
          </div>
        </div>

        <aside className="product-buy-panel">
          <div className="product-title-area">
            <span>APPLE</span>
            <h1>iPhone 17 Pro Max</h1>
            <div className="product-review-line"><Star size={14} fill="currentColor"/><strong>4.9</strong><a href="#">639 reviews</a><span>·</span><span>SKU IP17PM-256</span></div>
          </div>

          <div className="product-price-area">
            <div><strong>14,999 MAD</strong><del>15,499 MAD</del></div>
            <span>Save 500 MAD</span>
            <small>or from 1,250 MAD/month</small>
          </div>

          <div className="purchase-option">
            <div className="purchase-option-head"><span>Choose finish</span><strong>{finish.name}</strong></div>
            <div className="finish-options">
              {iphone17ProMax.finishes.map((item,index)=>(
                <button key={item.name} className={finishIndex===index?"active":""} onClick={()=>setFinishIndex(index)}>
                  <i style={{background:item.hex}}/><span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="purchase-option">
            <div className="purchase-option-head"><span>Choose storage</span><strong>{storage}</strong></div>
            <div className="storage-options">
              {["256GB","512GB","1TB"].map(item=><button key={item} className={storage===item?"active":""} onClick={()=>setStorage(item)}>{item}<small>{item==="256GB"?"14,999 MAD":item==="512GB"?"16,999 MAD":"19,499 MAD"}</small></button>)}
            </div>
          </div>

          <div className="stock-box">
            <div><Check size={17}/><span><strong>In stock</strong><small>Ready to dispatch</small></span></div>
            <div><Truck size={18}/><span><strong>Free delivery</strong><small>Estimated 1–2 business days</small></span></div>
            <div><ShieldCheck size={18}/><span><strong>Official warranty</strong><small>Manufacturer coverage included</small></span></div>
          </div>

          <div className="purchase-actions">
            <button className="cart-primary"><ShoppingCart size={18}/> Add to cart</button>
            <button className="wishlist-secondary"><Heart size={18}/> Save</button>
          </div>
          <button className="buy-direct">Buy now</button>

          <div className="payment-note">Secure checkout · Card · Cash on delivery where available</div>
        </aside>
      </section>

      <section className="product-value-strip">
        <div><MonitorUp size={21}/><span><small>DISPLAY</small><strong>6.9″ Super Retina XDR</strong></span></div>
        <div><Cpu size={21}/><span><small>PERFORMANCE</small><strong>A19 Pro</strong></span></div>
        <div><Camera size={21}/><span><small>CAMERA</small><strong>48 MP Pro system</strong></span></div>
        <div><Zap size={21}/><span><small>CHARGING</small><strong>USB-C</strong></span></div>
      </section>

      <section className="product-editorial">
        <div className="product-editorial-head"><span>PRODUCT HIGHLIGHTS</span><h2>Know what you’re paying for.</h2><p>Important specifications are grouped by how they affect everyday use instead of buried inside a long technical sheet.</p></div>
        <div className="highlight-layout">
          <article className="highlight-card large-highlight camera-highlight">
            <span>CAMERA</span><h3>Built around the shot.</h3><p>48 MP Pro camera hardware with dedicated wide, ultra-wide and telephoto roles.</p>
            <div className="camera-art"><i/><i/><i/></div>
          </article>
          <article className="highlight-card performance-highlight"><span>PERFORMANCE</span><h3>A19 Pro</h3><p>Flagship-class processing for demanding apps, games and imaging.</p><Cpu size={70}/></article>
          <article className="highlight-card display-highlight"><span>DISPLAY</span><h3>6.9″ OLED</h3><p>Large high-refresh display built for media, gaming and everyday clarity.</p><MonitorUp size={70}/></article>
        </div>
      </section>

      <section className="specs-section" id="specs">
        <div className="specs-heading"><span>TECHNICAL SPECIFICATIONS</span><h2>Everything, organized.</h2></div>
        <div className="specs-table">
          <div><strong>Display</strong><span>6.9″ Super Retina XDR OLED</span><span>High refresh rate</span></div>
          <div><strong>Chip</strong><span>A19 Pro</span><span>Flagship CPU / GPU</span></div>
          <div><strong>Rear cameras</strong><span>48 MP Pro camera system</span><span>Wide · Ultra Wide · Telephoto</span></div>
          <div><strong>Zoom</strong><span>Up to 8× optical-quality zoom</span><span>Multiple focal lengths</span></div>
          <div><strong>Connectivity</strong><span>5G · Wi‑Fi · Bluetooth</span><span>USB‑C</span></div>
          <div><strong>Build</strong><span>Premium metal and glass construction</span><span>Water and dust resistance</span></div>
        </div>
        <button className="all-specs-btn">View complete specifications <ChevronDown size={16}/></button>
      </section>

      <section className="product-services">
        <article><Truck size={24}/><h3>Delivery that’s clear.</h3><p>See stock and delivery estimates before checkout.</p></article>
        <article><ShieldCheck size={24}/><h3>Warranty that’s visible.</h3><p>No hidden warranty conditions inside small text.</p></article>
        <article><Heart size={24}/><h3>Save and compare.</h3><p>Shortlist products and compare equivalent specifications.</p></article>
      </section>

      <Comparison />

      <a href="/" className="back-to-store"><ArrowLeft size={16}/> Back to store</a>
    </main>
  );
}
