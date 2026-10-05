"use client";

import { ChevronDown, Heart, MapPin, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";

export default function StoreHeader() {
  const [open, setOpen] = useState(false);

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
        <a href="/" className="store-logo">NEXORA</a>

        <button className="category-menu-button">
          <Menu size={18} />
          Shop
          <ChevronDown size={14} />
        </button>

        <label className="store-search">
          <Search size={19} />
          <input placeholder="What are you looking for?" />
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
      </header>

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
