"use client";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Battery,
  Camera,
  ChevronLeft,
  ChevronRight,
  Headphones,
  HelpCircle,
  Monitor,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Tablet,
  Tag,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import { ProductVisual } from "@/components/ProductVisual";
import FavoriteButton from "@/components/FavoriteButton";
import { allCatalogProducts } from "@/lib/category-catalogs";
import { loadInventorySummaryMap, type PublicInventorySummary } from "@/lib/inventory-client";

const MOROCCO_BG="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=2400&q=92";
const S26_IMG="/api/product-image/galaxy-s26-ultra";
const XIAOMI17T_IMG="/api/product-image/xiaomi-17t-pro";
const HONOR_IMG="/api/product-image/honor-600";
const REDMI_IMG="/api/product-image/redmi-note-15-pro-plus-5g";
const TAB_IMG="/api/product-image/galaxy-tab-s11-ultra";
const PS5_IMG="/api/product-image/playstation-5";

const promotionProducts=allCatalogProducts
  .filter(product=>product.old)
  .slice(0,4);

const products=[
  {slug:"galaxy-s26-ultra",badge:"Nouveau",tone:"blue",brand:"SAMSUNG",name:"Galaxy S26 Ultra",img:S26_IMG,specs:[["display","6.9″ Display"],["camera","200 MP main camera"],["battery","5000 mAh battery"]],price:"13 999 DH"},
  {slug:"xiaomi-17t-pro",badge:"Top vente",tone:"red",brand:"XIAOMI",name:"Xiaomi 17T Pro",img:XIAOMI17T_IMG,specs:[["display","6.83″ 144 Hz AMOLED"],["chip","MediaTek Dimensity 9500"],["battery","7000 mAh"]],price:"8 999 DH"},
  {slug:"honor-600",badge:"Nouveau",tone:"blue",brand:"HONOR",name:"HONOR 600",img:HONOR_IMG,specs:[["camera","200 MP camera"],["display","6.57″ display"],["battery","7000 mAh battery"]],price:"7 999 DH"},
  {slug:"redmi-note-15-pro-plus-5g",badge:"Disponible",tone:"green",brand:"REDMI",name:"Note 15 Pro+ 5G",img:REDMI_IMG,specs:[["camera","200 MP camera"],["chip","Snapdragon 7s Gen 4"],["battery","6500 mAh"]],price:"5 999 DH"},
  {slug:"galaxy-tab-s11-ultra",badge:"Nouveau",tone:"blue",brand:"SAMSUNG",name:"Galaxy Tab S11 Ultra",img:TAB_IMG,specs:[["display","14.6″ Dynamic AMOLED 2X"],["pen","S Pen"],["memory","12 GB + 256 GB"]],price:"11 999 DH"},
  {slug:"playstation-5",badge:"Top vente",tone:"red",brand:"SONY",name:"PlayStation 5",img:PS5_IMG,specs:[["storage","1 TB SSD"],["controller","DualSense"],["gaming","4K gaming"]],price:"6 999 DH"},
];

function SpecIcon({type}:{type:string}){
  if(type==="camera") return <Camera size={13}/>;
  if(type==="battery") return <Battery size={13}/>;
  if(type==="display") return <Monitor size={13}/>;
  if(type==="gaming"||type==="controller") return <ShoppingCart size={13}/>;
  if(type==="storage"||type==="memory") return <PackageCheck size={13}/>;
  return <BarChart3 size={13}/>;
}

export default function Home(){
  const productTrackRef=useRef<HTMLDivElement>(null);
  const [stock,setStock]=useState<Record<string,PublicInventorySummary>>({});
  const [stockReady,setStockReady]=useState(false);
  const stockSlugs=useMemo(
    ()=>[...new Set([...products.map(product=>product.slug),...promotionProducts.map(product=>product.productSlug)])],
    []
  );

  useEffect(()=>{
    let active=true;
    void loadInventorySummaryMap(stockSlugs).then(map=>{
      if(!active) return;
      setStock(map);
      setStockReady(true);
    });
    return ()=>{active=false;};
  },[stockSlugs]);
  const scrollProducts=(direction:-1|1)=>{
    const track=productTrackRef.current;
    if(!track) return;
    track.scrollBy({left:direction*Math.max(280,track.clientWidth*.72),behavior:"smooth"});
  };

  return (
    <main className="exact-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="exact-hero">
        <img className="exact-hero-bg" src={MOROCCO_BG} alt="Marrakech"/>
        <div className="exact-hero-overlay"/>
        <div className="exact-shell exact-hero-inner">
          <div className="exact-hero-copy">
            <span>NOUVEAUTÉS</span>
            <h1>Nouveautés au Maroc —</h1>
            <h2>Octobre 2026</h2>
            <p>Les derniers smartphones, tablettes, consoles et accessoires sont disponibles chez LHAWTA. Comparez les specs, les prix et profitez de la livraison partout au Maroc.</p>
            <div className="exact-hero-buttons">
              <a href="/new-arrivals">Découvrir les nouveautés <ArrowRight size={16}/></a>
              <a href="/products">Voir tous les produits</a>
            </div>
          </div>

          <div className="exact-product-lineup" aria-hidden="true">
            <img className="hero-lineup-image" src="/hero-lineup.webp" alt="" draggable={false}/>
          </div>

          <div className="exact-hero-script">
            La technologie<br/>à vos côtés,<br/><b>au Maroc</b>
          </div>

          <div className="exact-location-badge">
            <span>●</span><div><b>LIVRAISON PARTOUT</b><small>AU MAROC</small></div><em>🇲🇦</em>
          </div>

        </div>
      </section>

      <section className="exact-shell exact-trust">
        <div><ShieldCheck size={27}/><span><b>Produits 100% neufs</b><small>Garantie officielle constructeur</small></span></div>
        <div><Truck size={27}/><span><b>Livraison partout au Maroc</b><small>Rapide et sécurisée</small></span></div>
        <div><PackageCheck size={27}/><span><b>Paiement à la livraison</b><small>Espèces ou carte</small></span></div>
        <div><Headphones size={27}/><span><b>Service client réactif</b><small>06 12 34 56 78 · 7j/7</small></span></div>
      </section>

      <section className="exact-shell exact-products" id="products">
        <div className="exact-products-head">
          <div><h2>Nos dernières nouveautés</h2><i/></div>
          <div className="exact-slider-controls"><a href="/new-arrivals">Voir tout <ArrowRight size={14}/></a><button type="button" aria-label="Produits précédents" onClick={()=>scrollProducts(-1)}><ChevronLeft size={15}/></button><button type="button" aria-label="Produits suivants" onClick={()=>scrollProducts(1)}><ChevronRight size={15}/></button></div>
        </div>

        <div className="exact-product-grid" ref={productTrackRef}>
          {products.map((p)=>{
            const stockState=stock[p.slug];
            const stockClass=!stockReady?"checking":stockState?.inStock?(stockState.lowStock?"low":"ok"):"out";
            const stockText=!stockReady?"Stock en vérification":stockState?.inStock?(stockState.lowStock?"Stock faible":"En stock"):"Rupture de stock";
            return (
            <article className="exact-card" key={p.name}>
              <span className={"exact-badge "+p.tone}>{p.badge}</span>
              <FavoriteButton className="exact-heart" slug={p.slug} size={16} label={"Ajouter "+p.name+" aux favoris"}/>
              <div className="exact-card-media"><ProductVisual src={p.img} alt={p.name}/></div>
              <div className="exact-card-body">
                <small>{p.brand}</small>
                <h3><a href={`/products/${p.slug}`} className="product-name-link">{p.name}</a></h3>
                <ul>
                  {p.specs.map(([type,label])=><li key={label}><SpecIcon type={type}/><span>{label}</span></li>)}
                </ul>
                <div className={"catalog-stock-pill "+stockClass}>{stockText}</div>
                <strong className="exact-price">{p.price}</strong>
                <div className="exact-card-actions">
                  <a href={`/products/${p.slug}`}><ShoppingCart size={14}/>Voir le produit</a>
                  <a className="compare-card-link" href={`/compare?products=${p.slug}`}><BarChart3 size={14}/>Comparer</a>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <section className="exact-shell home-deals" id="deals">
        <div className="home-deals-head">
          <div>
            <span><Tag size={15}/> BONS PLANS</span>
            <h2>Promotions du moment</h2>
            <p>Uniquement les produits qui ont actuellement un prix barré dans le catalogue.</p>
          </div>
          <a href="/promotions">Voir toutes les promotions <ArrowRight size={14}/></a>
        </div>

        <div className="home-deals-grid">
          {promotionProducts.map(product=>{
            const stockState=stock[product.productSlug];
            const stockClass=!stockReady?"checking":stockState?.inStock?(stockState.lowStock?"low":"ok"):"out";
            const stockText=!stockReady?"Stock en vérification":stockState?.inStock?(stockState.lowStock?"Stock faible":"En stock"):"Rupture de stock";
            return (
            <article className="home-deal-card" key={product.categorySlug+"-"+product.name}>
              <span className="home-deal-badge">PROMO</span>
              <FavoriteButton
                className="home-deal-heart"
                slug={product.detailSlug||("catalog:"+product.categorySlug+":"+product.brand+":"+product.name)}
                size={17}
                label={"Ajouter "+product.name+" aux favoris"}
              />
              <a href={"/products/"+product.productSlug} className="home-deal-media">
                <ProductVisual src={product.image} alt={product.name}/>
              </a>
              <div className="home-deal-copy">
                <small>{product.brand} · {product.categoryTitle}</small>
                <h3>
                  <a
                    href={"/products/"+product.productSlug}
                    className="product-name-link"
                  >
                    {product.name}
                  </a>
                </h3>
                <div className={"catalog-stock-pill "+stockClass}>{stockText}</div>
                <div className="home-deal-price">
                  <strong>{product.price}</strong>
                  <del>{product.old}</del>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <section className="exact-shell home-faq-cta">
        <div>
          <span><HelpCircle size={17}/> BESOIN D’AIDE ?</span>
          <h2>Une question avant de commander ?</h2>
          <p>Livraison, paiement, garantie, retours, suivi de commande et fonctionnement du site.</p>
        </div>
        <a href="/faq">Consulter la FAQ <ArrowRight size={14}/></a>
      </section>

      <section className="exact-shell exact-afterfold">
        <div><BadgeCheck size={22}/><span><b>Choisir plus vite</b><small>Prix, specs et disponibilité réunis.</small></span></div>
        <div><Truck size={22}/><span><b>Livraison Maroc</b><small>Options visibles avant paiement.</small></span></div>
        <div><ShieldCheck size={22}/><span><b>Achat rassurant</b><small>Garantie et condition clairement affichées.</small></span></div>
      </section>
    </main>
  );
}
