"use client";

import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";

export default function StoreHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="top-strip">
        <span>Free delivery from 500 MAD</span>
        <span>Official warranty · Easy returns</span>
      </div>

      <header className="store-header">
        <a href="/" className="store-logo">NEXORA</a>

        <button className="category-menu-button">
          <Menu size={18} />
          Categories
        </button>

        <label className="store-search">
          <Search size={18} />
          <input placeholder="Search smartphones, TVs, laptops, consoles..." />
          <span>⌘ K</span>
        </label>

        <div className="store-actions">
          <button className="store-action"><User size={18} /><span>Account</span></button>
          <button className="store-action"><ShoppingCart size={18} /><span>Cart</span></button>
          <button className="store-action mobile-only" onClick={() => setOpen(v => !v)}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <nav className={open ? "store-nav open" : "store-nav"}>
        <a href="/#phones">Smartphones</a>
        <a href="/#tv">TV & Home Cinema</a>
        <a href="/#computing">Computers & Tablets</a>
        <a href="/#gaming">Gaming</a>
        <a href="/#audio">Audio</a>
        <a href="/#wearables">Wearables</a>
        <a href="/#accessories">Accessories</a>
        <a href="/#deals" className="nav-deal">Deals</a>
      </nav>
    </>
  );
}
