"use client";

import {
  BadgeHelp,
  ChevronDown,
  Gamepad2,
  Headphones,
  Heart,
  Menu,
  Monitor,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  Tablet,
  Tv,
  User,
  Watch,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CART_EVENT, cartCount, cartTotal, formatDh, readCart, type CartItem } from "@/lib/cart-client";

const categories=[
  {label:"Smartphones",href:"/category/smartphones",icon:Smartphone},
  {label:"Tablettes",href:"/category/tablettes",icon:Tablet},
  {label:"TV & Home",href:"/category/tv-home",icon:Tv},
  {label:"Gaming",href:"/category/gaming",icon:Gamepad2},
  {label:"Audio",href:"/category/audio",icon:Headphones},
  {label:"Wearables",href:"/category/wearables",icon:Watch},
  {label:"Accessoires",href:"/category/accessoires",icon:ShoppingBag},
];

export default function StoreHeader(){
  const [open,setOpen]=useState(false);
  const [cart,setCart]=useState<CartItem[]>([]);

  useEffect(()=>{
    const sync=()=>setCart(readCart());
    sync();
    window.addEventListener("storage",sync);
    window.addEventListener(CART_EVENT,sync as EventListener);
    return()=>{
      window.removeEventListener("storage",sync);
      window.removeEventListener(CART_EVENT,sync as EventListener);
    };
  },[]);

  const count=useMemo(()=>cartCount(cart),[cart]);
  const total=useMemo(()=>cartTotal(cart),[cart]);

  return (
    <header className="exact-header">
      <div className="exact-topbar">
        <div className="exact-shell exact-topbar-inner">
          <span className="exact-flag">🇲🇦</span>
          <b>LIVRAISON DANS TOUT LE MAROC</b>
          <i/>
          <span>Produits 100% neufs</span>
          <i/>
          <span>Garantie officielle</span>
          <i/>
          <span>Paiement à la livraison disponible</span>
          <div className="exact-help"><BadgeHelp size={15}/><span>Besoin d’aide ?</span><b>06 12 34 56 78</b></div>
        </div>
      </div>

      <div className="exact-mainbar">
        <div className="exact-shell exact-mainbar-inner">
          <a href="/" className="exact-logo">
            <ShoppingCart size={42} strokeWidth={2.5}/>
            <span><strong>LHAWTA</strong><small>TECH FOR A BETTER TOMORROW</small></span>
          </a>

          <label className="exact-search">
            <Search size={17}/>
            <input placeholder="Rechercher un smartphone, une tablette, une PS5, une marque..." />
            <button type="button"><Search size={16}/>Rechercher</button>
          </label>

          <div className="exact-actions">
            <button><User size={20}/><span><b>Mon compte</b><small>Se connecter</small></span></button>
            <button><Heart size={21}/><span><b>Mes favoris</b></span></button>
            <a href="/cart" className="exact-cart"><ShoppingCart size={22}/><em>{count}</em><span><b>Mon panier</b><small>{formatDh(total)}</small></span></a>
            <button className="exact-mobile-toggle" onClick={()=>setOpen(v=>!v)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
          </div>
        </div>
      </div>

      <nav className={open?"exact-nav open":"exact-nav"}>
        <div className="exact-shell exact-nav-inner">
          <a href="/#categories" className="exact-all"><Menu size={17}/>Toutes les catégories</a>
          <div className="exact-nav-cats">
            {categories.map(({label,href,icon:Icon})=>(
              <a href={href} key={label}><Icon size={17}/>{label}</a>
            ))}
          </div>
          <div className="exact-nav-special">
            <a href="/#deals" className="promo"><Tag size={17}/>Promotions</a>
            <a href="/#products" className="new"><Sparkles size={17}/>Nouveautés</a>
          </div>
        </div>
      </nav>

      <div className="site-progress" aria-hidden="true"><span/></div>
    </header>
  );
}
