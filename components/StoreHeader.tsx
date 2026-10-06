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
  Sparkles,
  Tablet,
  Tag,
  Tv,
  User,
  Watch,
  X,
} from "lucide-react";
import { useState } from "react";
import LhawtaLogo from "@/components/LhawtaLogo";

const departments = [
  { label:"Smartphones", detail:"Samsung · Xiaomi · HONOR · Apple", icon:Smartphone, href:"/#latest" },
  { label:"Tablettes", detail:"Galaxy Tab · iPad · Xiaomi Pad", icon:Tablet, href:"/#latest" },
  { label:"TV & Home", detail:"OLED · QLED · Mini LED", icon:Tv, href:"/#latest" },
  { label:"Gaming", detail:"PlayStation · Xbox · Nintendo", icon:Gamepad2, href:"/#latest" },
  { label:"Audio", detail:"Écouteurs · Casques · Enceintes", icon:Headphones, href:"/#latest" },
  { label:"Wearables", detail:"Montres · Bracelets", icon:Watch, href:"/#latest" },
  { label:"Informatique", detail:"PC portables · Moniteurs", icon:Laptop, href:"/#latest" },
  { label:"Accessoires", detail:"Coques · Chargeurs · Câbles", icon:Cable, href:"/#latest" },
];

export default function StoreHeader() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      <div className="sketch-topbar">
        <div className="sketch-topbar-inner">
          <span>🇲🇦</span>
          <b>LIVRAISON DANS TOUT LE MAROC</b>
          <i/>
          <span>Produits 100% neufs</span>
          <i/>
          <span>Garantie affichée avant achat</span>
          <i/>
          <span>Paiement à la livraison disponible</span>
          <span className="sketch-topbar-help">Besoin d’aide ? <strong>06 12 34 56 78</strong></span>
        </div>
      </div>

      <header className="sketch-main-header">
        <a href="/" className="sketch-logo"><LhawtaLogo /></a>

        <label className="sketch-search">
          <Search size={19}/>
          <input placeholder="Rechercher un smartphone, une tablette, une PS5, une marque..." />
          <button type="button">Rechercher</button>
        </label>

        <div className="sketch-header-actions">
          <button><User size={20}/><span><small>Mon compte</small><b>Se connecter</b></span></button>
          <button><Heart size={21}/><span><b>Mes favoris</b></span></button>
          <button className="sketch-cart"><ShoppingCart size={22}/><span><small>Mon panier</small><b>0 DH</b></span><em>0</em></button>
          <button className="sketch-mobile-menu" onClick={()=>setOpen(v=>!v)}>{open?<X size={21}/>:<Menu size={21}/>}</button>
        </div>
      </header>

      <nav className={open?"sketch-nav open":"sketch-nav"}>
        <button className={shopOpen?"sketch-all active":"sketch-all"} onClick={()=>setShopOpen(v=>!v)}>
          <Menu size={17}/> Toutes les catégories <ChevronDown size={14}/>
        </button>
        <a href="/#latest"><Smartphone size={17}/> Smartphones</a>
        <a href="/#latest"><Tablet size={17}/> Tablettes</a>
        <a href="/#latest"><Tv size={17}/> TV & Home</a>
        <a href="/#latest"><Gamepad2 size={17}/> Gaming</a>
        <a href="/#latest"><Headphones size={17}/> Audio</a>
        <a href="/#latest"><Watch size={17}/> Wearables</a>
        <a href="/#latest"><Cable size={17}/> Accessoires</a>
        <a href="/#promos" className="sketch-promo"><Tag size={17}/> Promotions</a>
        <a href="/#latest" className="sketch-new"><Sparkles size={17}/> Nouveautés</a>

        {shopOpen && (
          <div className="sketch-mega">
            {departments.map(({label,detail,icon:Icon,href})=>(
              <a href={href} key={label} onClick={()=>setShopOpen(false)}>
                <span><Icon size={20}/></span>
                <div><b>{label}</b><small>{detail}</small></div>
              </a>
            ))}
          </div>
        )}
      </nav>

      <div className="site-progress" aria-hidden="true"><span /></div>
    </>
  );
}
