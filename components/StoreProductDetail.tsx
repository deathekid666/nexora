"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import { ProductVisual } from "@/components/ProductVisual";
import type { StoreProduct } from "@/lib/store-products";
import { addToCart } from "@/lib/cart-client";
import FavoriteButton from "@/components/FavoriteButton";

export default function StoreProductDetail({product}:{product:StoreProduct}){
  const router=useRouter();
  const [imageIndex,setImageIndex]=useState(0);
  const [variant,setVariant]=useState(product.variants[0]||"Standard");
  const [color,setColor]=useState(product.colors[0]||"Standard");
  const [managed,setManaged]=useState<{storage:string;color:string;priceMad:number;compareAtPriceMad:number|null;stock:number}[]|null>(null);
  useEffect(()=>{let live=true;fetch("/api/catalog-options?slug="+encodeURIComponent(product.slug),{cache:"no-store"}).then(r=>r.ok?r.json():null).then(d=>{if(live&&d?.variants?.length)setManaged(d.variants)}).catch(()=>{});return()=>{live=false}},[product.slug]);
  const storageOptions=managed?.length?[...new Set(managed.map(v=>v.storage))]:product.variants;
  const colorOptions=managed?.length?[...new Set(managed.filter(v=>v.storage===variant).map(v=>v.color))]:product.colors;
  const selectedOption=managed?.find(v=>v.storage===variant&&v.color===color);
  const optionPrice=selectedOption?new Intl.NumberFormat("fr-MA").format(selectedOption.priceMad)+" DH":product.price;
  const optionCompareAt=selectedOption?.compareAtPriceMad?new Intl.NumberFormat("fr-MA").format(selectedOption.compareAtPriceMad)+" DH":product.oldPrice;
  useEffect(()=>{if(!managed?.length)return;const current=managed.find(v=>v.storage===variant&&v.color===color);if(!current){setVariant(managed[0].storage);setColor(managed[0].color)}},[managed,variant,color]);
  const selectedImage=product.gallery[imageIndex]||product.gallery[0];
  const selectedUnavailable=Boolean(selectedOption&&selectedOption.stock<1);
  const formatMad=(amount:number)=>new Intl.NumberFormat("fr-MA").format(amount)+" DH";
  const chooseStorage=(item:string)=>{
    setVariant(item);
    if(managed?.length){
      const next=managed.find(v=>v.storage===item&&v.stock>0)||managed.find(v=>v.storage===item);
      if(next)setColor(next.color);
    }
  };

  const addAndGoToCart=()=>{
    if(selectedUnavailable)return;
    addToCart({
      slug:product.slug,
      name:product.name,
      brand:product.brand,
      price:optionPrice,
      variant,
      color,
      qty:1,
      image:product.gallery[0],
    });
    router.push("/cart");
  };

  const categoryHref=useMemo(()=>{
    if(product.category==="Smartphones") return "/category/smartphones";
    if(product.category==="Tablettes") return "/category/tablettes";
    if(product.category==="Gaming") return "/category/gaming";
    return "/";
  },[product.category]);

  return (
    <main className="exact-page product-detail-page">
      <SiteMotion/>
      <StoreHeader/>

      <div className="pdetail-breadcrumb exact-shell">
        <a href="/"><ArrowLeft size={15}/> Accueil</a>
        <ChevronRight size={13}/>
        <a href={categoryHref}>{product.category}</a>
        <ChevronRight size={13}/>
        <span>{product.name}</span>
      </div>

      <section className="pdetail-hero exact-shell">
        <div className="pdetail-gallery">
          <div className="pdetail-main-image">
            <span className="pdetail-badge">{product.badge}</span>
            <FavoriteButton className="pdetail-heart" slug={product.slug} size={19} label={"Ajouter "+product.name+" aux favoris"}/>
            <ProductVisual src={selectedImage} alt={product.name}/>
          </div>

          <div className="pdetail-thumbs">
            {product.gallery.map((src,index)=>(
              <button
                key={src}
                className={index===imageIndex?"active":""}
                onClick={()=>setImageIndex(index)}
                aria-label={`Vue ${index+1}`}
                aria-pressed={index===imageIndex}
              >
                <ProductVisual src={src} alt={`${product.name} vue ${index+1}`}/>
              </button>
            ))}
          </div>
          <small className="pdetail-gallery-note">Images officielles de référence · les couleurs et accessoires peuvent varier selon la version.</small>
        </div>

        <aside className="pdetail-buy">
          <div className="pdetail-title">
            <div className="pdetail-brand-row"><span>{product.brand.toUpperCase()}</span><b>{product.badge}</b></div>
            <h1>{product.name}</h1>
            <p>{product.shortDescription}</p>
            <div className="pdetail-rating"><strong>{product.rating}/5</strong><span>{product.reviewCount}</span><span>·</span><span>{product.category}</span></div>
          </div>

          <div className="pdetail-price" aria-live="polite">
            <strong>{optionPrice}</strong>
            {optionCompareAt&&<del>{optionCompareAt}</del>}
            {selectedOption&&<small className={selectedUnavailable?"catalog-option-stock unavailable":"catalog-option-stock"}>{selectedUnavailable?"Rupture de stock pour cette option":selectedOption.stock+" en stock pour cette option"}</small>}
            <small>Prix affiché à titre de référence pour la boutique LHAWTA.</small>
          </div>

          <div className="pdetail-highlight-grid">
            {product.highlights.map(item=>(
              <div key={item.label}><small>{item.label}</small><strong>{item.value}</strong></div>
            ))}
          </div>

          <div className="pdetail-choice">
            <div className="pdetail-choice-head"><span>Configuration</span><strong>{variant}</strong></div>
            <div className="pdetail-choice-options" role="group" aria-label="Choisir une configuration">
              {storageOptions.map(item=>{
                const option=managed?.find(candidate=>candidate.storage===item&&candidate.stock>0)||managed?.find(candidate=>candidate.storage===item);
                const outOfStock=Boolean(managed?.length&&!managed.some(candidate=>candidate.storage===item&&candidate.stock>0));
                return <button key={item} type="button" className={item===variant?"active":""} aria-pressed={item===variant} aria-label={`${item}${option?", dès "+formatMad(option.priceMad):""}${outOfStock?", indisponible":""}`} onClick={()=>chooseStorage(item)}>
                  <span>{item}</span>{option&&<small>{formatMad(option.priceMad)}</small>}{outOfStock&&<em>Épuisé</em>}
                </button>;
              })}
            </div>
          </div>

          <div className="pdetail-choice">
            <div className="pdetail-choice-head"><span>Couleur</span><strong>{color}</strong></div>
            <div className="pdetail-choice-options color-options" role="group" aria-label="Choisir une couleur">
              {colorOptions.map(item=>{
                const option=managed?.find(candidate=>candidate.storage===variant&&candidate.color===item);
                const outOfStock=Boolean(option&&option.stock<1);
                return <button key={item} type="button" className={item===color?"active":""} aria-pressed={item===color} aria-label={`${item}${option?", "+formatMad(option.priceMad):""}${outOfStock?", indisponible":""}`} onClick={()=>setColor(item)}>
                  <span>{item}</span>{option&&<small>{formatMad(option.priceMad)}</small>}{outOfStock&&<em>Épuisé</em>}
                </button>;
              })}
            </div>
          </div>

          <div className="pdetail-assurance">
            <div><Check size={17}/><span><b>{product.availability}</b><small>Disponibilité affichée avant commande</small></span></div>
            <div><ShieldCheck size={18}/><span><b>{product.warranty}</b><small>Conditions visibles avant achat</small></span></div>
            <div><Truck size={18}/><span><b>Livraison partout au Maroc</b><small>Délai confirmé avant validation</small></span></div>
          </div>

          <div className="pdetail-actions">
            <button className="primary" disabled={selectedUnavailable} onClick={addAndGoToCart}><ShoppingCart size={17}/>{selectedUnavailable?"Option indisponible":"Ajouter au panier"}</button>
            <a className="secondary compare-action" href={"/compare?products="+product.slug}>Comparer</a>
          </div>
        </aside>
      </section>

      <section className="pdetail-description exact-shell">
        <div className="pdetail-description-copy">
          <span>DESCRIPTION DU PRODUIT</span>
          <h2>Tout ce qu’il faut savoir avant d’acheter.</h2>
          <p>{product.longDescription}</p>
        </div>
        <div className="pdetail-benefits">
          <article><BadgeCheck size={23}/><b>Produit neuf</b><span>État et garantie clairement indiqués.</span></article>
          <article><PackageCheck size={23}/><b>Configuration visible</b><span>RAM, stockage et version affichés avant la commande.</span></article>
          <article><Truck size={23}/><b>Livraison Maroc</b><span>Informations de livraison présentées avant paiement.</span></article>
        </div>
      </section>

      <section className="pdetail-specs exact-shell">
        <div className="pdetail-section-head">
          <span>FICHE TECHNIQUE COMPLÈTE</span>
          <h2>Spécifications détaillées</h2>
          <p>Les caractéristiques sont regroupées par usage pour être lisibles sans cacher les détails techniques.</p>
        </div>

        <div className="pdetail-spec-groups">
          {product.specs.map(group=>(
            <article className="pdetail-spec-card" key={group.title}>
              <h3>{group.title}</h3>
              <div>
                {group.rows.map(row=>(
                  <p key={row.label}><span>{row.label}</span><strong>{row.value}</strong></p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pdetail-bottom exact-shell">
        <div>
          <span>Besoin de comparer ?</span>
          <h2>Vérifiez les caractéristiques avant de choisir.</h2>
        </div>
        <div className="pdetail-bottom-actions">
          <a href={"/compare?products="+product.slug}>Comparer ce produit</a>
          <a href={categoryHref}>Voir d’autres {product.category.toLowerCase()}</a>
          <a href="/" className="dark">Retour à LHAWTA</a>
        </div>
      </section>

      {selectedOption&&<div className="pdetail-mobile-buy" aria-live="polite">
        <div><span>{variant} · {color}</span><strong>{optionPrice}</strong></div>
        <button type="button" disabled={selectedUnavailable} onClick={addAndGoToCart}><ShoppingCart size={16}/>{selectedUnavailable?"Indisponible":"Ajouter"}</button>
      </div>}
    </main>
  );
}
