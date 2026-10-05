"use client";

import {
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
  Tv,
  User,
  Watch,
  X,
} from "lucide-react";
import { useState } from "react";

const departments = [
  { label:"Smartphones", detail:"Apple · Samsung · HONOR · Xiaomi", icon:Smartphone, href:"/#phones" },
  { label:"TV & Home Cinema", detail:"OLED · QLED · Mini LED · Soundbars", icon:Tv, href:"/#tv" },
  { label:"Computers", detail:"Laptops · Desktops · Monitors", icon:Laptop, href:"/#computing" },
  { label:"Gaming", detail:"PlayStation · Xbox · Nintendo", icon:Gamepad2, href:"/#gaming" },
  { label:"Audio", detail:"Headphones · Speakers · Microphones", icon:Headphones, href:"/#audio" },
  { label:"Wearables", detail:"Watches · Bands · Smart rings", icon:Watch, href:"/#wearables" },
];

export default function StoreHeader() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      <div className="top-strip">
        <div className="top-strip-inner">
          <span>Free delivery from 500 MAD</span>
          <span>30-day returns</span>
          <span>Official warranty</span>
          <span className="top-strip-right">Morocco · MAD</span>
        </div>
      </div>

      <header className="store-header">
        <a href="/" className="store-logo">NEXORA<span>.</span></a>

        <button className={shopOpen ? "category-menu-button active" : "category-menu-button"} onClick={() => setShopOpen(v => !v)}>
          <Menu size={18} />
          Shop
          <ChevronDown size={14} />
        </button>

        <label className="store-search">
          <Search size={19} />
          <input placeholder="Search phones, TVs, laptops, gaming and more" />
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
          <div className="mega-menu">
            <div className="mega-menu-main">
              <div className="mega-menu-heading">
                <span>SHOP ALL</span>
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
            <aside className="mega-menu-promo">
              <span>THIS WEEK</span>
              <h3>Flagship phones, better compared.</h3>
              <p>See the models people are choosing and the trade-offs that matter.</p>
              <a href="/#deals">Shop the edit</a>
            </aside>
          </div>
        )}
      </header>

      <div className="site-progress" aria-hidden="true"><span /></div>

      <nav className={open ? "store-nav open" : "store-nav"}>
        <a href="/#phones">Smartphones</a>
        <a href="/#tv">TV & Home Cinema</a>
        <a href="/#computing">Computers</a>
        <a href="/#tablets">Tablets</a>
        <a href="/#gaming">Gaming</a>
        <a href="/#audio">Audio</a>
        <a href="/#wearables">Wearables</a>
        <a href="/#accessories">Accessories</a>
        <a href="/#deals" className="nav-deal">Deals</a>
      </nav>
    </>
  );
}
