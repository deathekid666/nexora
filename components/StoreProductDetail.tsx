"use client";

import { useMemo, useState } from "react";
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
  const selectedImage=product.gallery[imageIndex]||product.gallery[0];

  const addAndGoToCart=()=>{
    addToCart({
      slug:product.slug,
      name:product.name,
      brand:product.brand,
      price:product.price,
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

          <div className="pdetail-price">
            <strong>{product.price}</strong>
            {product.oldPrice&&<del>{product.oldPrice}</del>}
            <small>Prix affiché à titre de référence pour la boutique LHAWTA.</small>
          </div>

          <div className="pdetail-highlight-grid">
            {product.highlights.map(item=>(
              <div key={item.label}><small>{item.label}</small><strong>{item.value}</strong></div>
            ))}
          </div>

          <div className="pdetail-choice">
            <div className="pdetail-choice-head"><span>Configuration</span><strong>{variant}</strong></div>
            <div className="pdetail-choice-options">
              {product.variants.map(item=>(
                <button key={item} className={item===variant?"active":""} onClick={()=>setVariant(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="pdetail-choice">
            <div className="pdetail-choice-head"><span>Couleur</span><strong>{color}</strong></div>
            <div className="pdetail-choice-options color-options">
              {product.colors.map(item=>(
                <button key={item} className={item===color?"active":""} onClick={()=>setColor(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="pdetail-assurance">
            <div><Check size={17}/><span><b>{product.availability}</b><small>Disponibilité affichée avant commande</small></span></div>
            <div><ShieldCheck size={18}/><span><b>{product.warranty}</b><small>Conditions visibles avant achat</small></span></div>
            <div><Truck size={18}/><span><b>Livraison partout au Maroc</b><small>Délai confirmé avant validation</small></span></div>
          </div>

          <div className="pdetail-actions">
            <button className="primary" onClick={addAndGoToCart}><ShoppingCart size={17}/>Ajouter au panier</button>
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
    </main>
  );
}
