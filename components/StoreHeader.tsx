"use client";

import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  ["Smartphones","/category/smartphones"],
  ["Tablettes","/category/tablettes"],
  ["Informatique","/category/informatique"],
  ["TV & Home","/category/tv-home"],
  ["Gaming","/category/gaming"],
  ["Audio","/category/audio"],
  ["Wearables","/category/wearables"],
  ["Accessoires","/category/accessoires"],
  ["Marques","#brands"],
  ["Promos","#deals"],
];

export default function StoreHeader(){
  const [open,setOpen]=useState(false);

  return (
    <header className="ref-header-shell">
      <div className="ref-header-main">
        <a href="/" className="ref-wordmark">LHAWTA</a>

        <label className="ref-search">
          <Search size={16}/>
          <input placeholder="Rechercher iPhone, Samsung, tablette, laptop..." />
        </label>

        <div className="ref-header-actions">
          <button aria-label="Favoris"><Heart size={18}/></button>
          <button aria-label="Compte"><User size={18}/></button>
          <button className="ref-cart" aria-label="Panier"><ShoppingCart size={19}/><b>2</b></button>
          <button className="ref-country"><span>🇲🇦</span><strong>Maroc (MAD)</strong><ChevronDown size={12}/></button>
          <button className="ref-mobile-toggle" onClick={()=>setOpen(v=>!v)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
        </div>
      </div>

      <div className={open?"ref-header-nav open":"ref-header-nav"}>
        <nav>
          {navItems.map(([label,href])=>(
            <a href={href} key={label}>{label}{!["Marques","Promos"].includes(label)&&<ChevronDown size={10}/>}</a>
          ))}
        </nav>
        <div className="ref-header-support">
          <a href="#faq">Support</a>
          <a href="#footer">Suivre commande</a>
        </div>
      </div>
    </header>
  );
}
