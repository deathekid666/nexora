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
import { FAVORITES_EVENT, readFavorites } from "@/lib/favorites-client";
import { searchStoreProducts } from "@/lib/product-search";

const categories=[
  {label:"Smartphones",href:"/category/smartphones",icon:Smartphone},
  {label:"Tablettes",href:"/category/tablettes",icon:Tablet},
  {label:"TV & Home",href:"/category/tv-home",icon:Tv},
  {label:"Gaming",href:"/category/gaming",icon:Gamepad2},
  {label:"Audio",href:"/category/audio",icon:Headphones},
  {label:"Wearables",href:"/category/wearables",icon:Watch},
  {label:"Informatique",href:"/category/informatique",icon:Monitor},
  {label:"Accessoires",href:"/category/accessoires",icon:ShoppingBag},
];

export default function StoreHeader(){
  const [open,setOpen]=useState(false);
  const [cart,setCart]=useState<CartItem[]>([]);
  const [favoriteCount,setFavoriteCount]=useState(0);
  const [query,setQuery]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);

  useEffect(()=>{
    const syncCart=()=>setCart(readCart());
    const syncFavorites=()=>setFavoriteCount(readFavorites().length);
    const syncAll=()=>{syncCart();syncFavorites();};
    syncAll();
    const initialQuery=new URLSearchParams(window.location.search).get("q");
    if(initialQuery) setQuery(initialQuery);
    window.addEventListener("storage",syncAll);
    window.addEventListener(CART_EVENT,syncCart as EventListener);
    window.addEventListener(FAVORITES_EVENT,syncFavorites as EventListener);
    return()=>{
      window.removeEventListener("storage",syncAll);
      window.removeEventListener(CART_EVENT,syncCart as EventListener);
      window.removeEventListener(FAVORITES_EVENT,syncFavorites as EventListener);
    };
  },[]);

  const count=useMemo(()=>cartCount(cart),[cart]);
  const total=useMemo(()=>cartTotal(cart),[cart]);
  const suggestions=useMemo(()=>query.trim()?searchStoreProducts(query).slice(0,5):[],[query]);

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
          <a href="/faq" className="exact-help"><BadgeHelp size={15}/><span>Besoin d’aide ?</span><b>FAQ</b></a>
        </div>
      </div>

      <div className="exact-mainbar">
        <div className="exact-shell exact-mainbar-inner">
          <a href="/" className="exact-logo">
            <ShoppingCart size={42} strokeWidth={2.5}/>
            <span><strong>LHAWTA</strong><small>TECH FOR A BETTER TOMORROW</small></span>
          </a>

          <form
            className="exact-search-wrap"
            action="/search"
            method="get"
            onSubmit={event=>{if(!query.trim()) event.preventDefault();}}
            onFocus={()=>setSearchOpen(true)}
            onBlur={()=>window.setTimeout(()=>setSearchOpen(false),120)}
          >
            <div className="exact-search">
              <Search size={17}/>
              <input
                name="q"
                value={query}
                onChange={event=>{setQuery(event.target.value);setSearchOpen(true);}}
                onKeyDown={event=>{if(event.key==="Escape") setSearchOpen(false);}}
                placeholder="Rechercher un smartphone, une tablette, une PS5, une marque..."
                autoComplete="off"
                aria-label="Rechercher un produit"
              />
              <button type="submit"><Search size={16}/>Rechercher</button>
            </div>

            {searchOpen&&query.trim()&&(
              <div className="exact-search-suggestions">
                {suggestions.length>0?(
                  <>
                    {suggestions.map(product=>(
                      <a href={`/products/${product.slug}`} className="exact-search-suggestion" key={product.slug}>
                        <span className="exact-search-suggestion-media"><img src={product.image} alt=""/></span>
                        <span className="exact-search-suggestion-copy">
                          <small>{product.brand} · {product.category}</small>
                          <b>{product.name}</b>
                          <em>{product.price}</em>
                        </span>
                      </a>
                    ))}
                    <a className="exact-search-all" href={`/search?q=${encodeURIComponent(query.trim())}`}>
                      Voir tous les résultats pour « {query.trim()} »
                    </a>
                  </>
                ):(
                  <div className="exact-search-noresult">
                    <Search size={17}/>
                    <span>Aucun produit trouvé pour « {query.trim()} »</span>
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="exact-actions">
            <a href="/account" className="exact-account"><User size={20}/><span><b>Mon espace</b><small>Profil & commandes</small></span></a>
            <a href="/favorites" className="exact-favorites" title="Voir mes favoris"><Heart size={21} fill={favoriteCount?"currentColor":"none"}/>{favoriteCount>0&&<em>{favoriteCount}</em>}<span><b>Mes favoris</b><small>{favoriteCount} enregistré{favoriteCount>1?"s":""}</small></span></a>
            <a href="https://wa.me/212703730086" target="_blank" rel="noopener noreferrer" aria-label="Contacter LHAWTA sur WhatsApp" title="Commander et poser une question sur WhatsApp"><Headphones size={21}/><span><b>WhatsApp</b><small>+212 703 730 086</small></span></a>
            <a href="/cart" className="exact-cart"><ShoppingCart size={22}/><em>{count}</em><span><b>Mon panier</b><small>{formatDh(total)}</small></span></a>
            <button type="button" className="exact-mobile-toggle" aria-label={open?"Fermer le menu":"Ouvrir le menu"} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{open?<X size={20}/>:<Menu size={20}/>}</button>
          </div>
        </div>
      </div>

      <nav className={open?"exact-nav open":"exact-nav"}>
        <div className="exact-shell exact-nav-inner">
          <a href="/products" className="exact-all"><Menu size={17}/>Toutes les catégories</a>
          <div className="exact-nav-cats">
            {categories.map(({label,href,icon:Icon})=>(
              <a href={href} key={label}><Icon size={17}/>{label}</a>
            ))}
          </div>
          <div className="exact-nav-special">
            <a href="/promotions" className="promo"><Tag size={17}/>Promotions</a>
            <a href="/new-arrivals" className="new"><Sparkles size={17}/>Nouveautés</a>
          </div>
        </div>
      </nav>

      <div className="site-progress" aria-hidden="true"><span/></div>
    </header>
  );
}
