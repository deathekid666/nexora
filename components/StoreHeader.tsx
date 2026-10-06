"use client";

import {
  Cable,
  ChevronDown,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  Smartphone,
  Tablet,
  Tv,
  User,
  Watch,
  X,
} from "lucide-react";
import { useState } from "react";
import LhawtaLogo from "@/components/LhawtaLogo";

const departments = [
  { label:"Smartphones", detail:"Apple · Samsung · HONOR · Xiaomi", icon:Smartphone, href:"/#latest" },
  { label:"Tablets", detail:"iPad · Galaxy Tab · HONOR Pad", icon:Tablet, href:"/#latest" },
  { label:"Computers", detail:"Laptops · Desktops · Monitors", icon:Laptop, href:"/#latest" },
  { label:"TV & Home Cinema", detail:"OLED · QLED · Mini LED · Soundbars", icon:Tv, href:"/#latest" },
  { label:"Gaming", detail:"PlayStation · Xbox · Nintendo", icon:Gamepad2, href:"/#latest" },
  { label:"Audio", detail:"Headphones · Speakers · Microphones", icon:Headphones, href:"/#latest" },
  { label:"Wearables", detail:"Watches · Bands · Smart rings", icon:Watch, href:"/#latest" },
  { label:"Accessories", detail:"Chargers · Cases · Cables · Keyboards", icon:Cable, href:"/#latest" },
];

export default function StoreHeader() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      <div className="top-strip lhawta-top-strip">
        <div className="top-strip-inner">
          <span>Brand-new tech only</span>
          <span>Delivery across Morocco</span>
          <span>Warranty shown before checkout</span>
          <span className="top-strip-right">Morocco · MAD</span>
        </div>
      </div>

      <header className="store-header lhawta-header">
        <a href="/" className="store-logo lhawta-header-logo"><LhawtaLogo /></a>

        <button
          className={shopOpen ? "category-menu-button active" : "category-menu-button"}
          onClick={() => setShopOpen(v => !v)}
        >
          <Menu size={18} />
          Shop
          <ChevronDown size={14} />
        </button>

        <label className="store-search lhawta-search">
          <Search size={19} />
          <input placeholder="Search smartphones, tablets, gaming, audio..." />
          <button type="button">Search</button>
        </label>

        <div className="header-delivery">
          <MapPin size={18} />
          <span><small>Deliver to</small><strong>Morocco</strong></span>
        </div>

        <div className="store-actions">
          <button className="store-action" aria-label="Wishlist"><Heart size={19} /><span>Wishlist</span></button>
          <button className="store-action" aria-label="Account"><User size={19} /><span>Account</span></button>
          <button className="store-action cart-action" aria-label="Cart"><ShoppingCart size={19} /><span>Cart</span><b>0</b></button>
          <button className="store-action mobile-only" aria-label="Menu" onClick={() => setOpen(v => !v)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {shopOpen && (
          <div className="mega-menu lhawta-mega-menu">
            <div className="mega-menu-main">
              <div className="mega-menu-heading">
                <span>SHOP LHAWTA</span>
                <strong>Explore by department</strong>
              </div>
              <div className="mega-menu-grid">
                {departments.map(({label,detail,icon:Icon,href})=>(
                  <a href={href} key={label} onClick={()=>setShopOpen(false)}>
                    <div><Icon size={21}/></div>
                    <span><strong>{label}</strong><small>{detail}</small></span>
                  </a>
                ))}
              </div>
            </div>
            <aside className="mega-menu-promo lhawta-mega-promo">
              <LhawtaLogo compact light />
              <span>NEW TECH. CLEAR CHOICES.</span>
              <h3>Flagship phones, properly compared.</h3>
              <p>See what changes the experience before you spend.</p>
              <a href="/#compare">Compare now</a>
            </aside>
          </div>
        )}
      </header>

      <div className="site-progress" aria-hidden="true"><span /></div>

      <nav className={open ? "store-nav open lhawta-nav" : "store-nav lhawta-nav"}>
        <a href="/#latest">Smartphones</a>
        <a href="/#latest">Tablets</a>
        <a href="/#latest">Computers</a>
        <a href="/#latest">TV & Home</a>
        <a href="/#latest">Gaming</a>
        <a href="/#latest">Audio</a>
        <a href="/#latest">Wearables</a>
        <a href="/#services">Services</a>
        <a href="/#faq">FAQ</a>
      </nav>
    </>
  );
}
