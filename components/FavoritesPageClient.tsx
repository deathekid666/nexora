"use client";

import {
  ArrowLeft,
  BarChart3,
  Heart,
  PackageSearch,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import FavoriteButton from "@/components/FavoriteButton";
import { ProductVisual } from "@/components/ProductVisual";
import {
  FAVORITES_EVENT,
  readFavorites,
  writeFavorites,
} from "@/lib/favorites-client";
import { storeProducts } from "@/lib/store-products";

type CatalogFavorite={
  id:string;
  categorySlug:string;
  brand:string;
  name:string;
};

const categoryLabels:Record<string,string>={
  smartphones:"Smartphones",
  tablettes:"Tablettes",
  "tv-home":"TV & Home",
  gaming:"Gaming",
  audio:"Audio",
  wearables:"Wearables",
  informatique:"Informatique",
  accessoires:"Accessoires",
};

const categoryImages:Record<string,string>={
  smartphones:"/api/product-image/galaxy-s26-ultra",
  tablettes:"/api/product-image/galaxy-tab-s11-ultra",
  "tv-home":"https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=86",
  gaming:"/api/product-image/playstation-5",
  audio:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=86",
  wearables:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=86",
  informatique:"https://images.unsplash.com/photo-1782012505157-aca188bd6921?auto=format&fit=crop&w=1200&q=86",
  accessoires:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=86",
};

function parseCatalogFavorite(id:string):CatalogFavorite|null{
  if(!id.startsWith("catalog:")) return null;
  const parts=id.split(":");
  if(parts.length<4) return null;
  const [,categorySlug,brand,...nameParts]=parts;
  return {
    id,
    categorySlug,
    brand,
    name:nameParts.join(":"),
  };
}

export default function FavoritesPageClient(){
  const [slugs,setSlugs]=useState<string[]>([]);

  useEffect(()=>{
    const sync=()=>setSlugs(readFavorites());
    sync();
    window.addEventListener("storage",sync);
    window.addEventListener(FAVORITES_EVENT,sync as EventListener);
    return()=>{
      window.removeEventListener("storage",sync);
      window.removeEventListener(FAVORITES_EVENT,sync as EventListener);
    };
  },[]);

  const items=useMemo(()=>slugs.map(id=>{
    const product=storeProducts[id];
    if(product) return {kind:"product" as const,id,product};
    const catalog=parseCatalogFavorite(id);
    if(catalog) return {kind:"catalog" as const,id,catalog};
    return {kind:"unknown" as const,id};
  }),[slugs]);

  const clearAll=()=>writeFavorites([]);

  return (
    <main className="exact-page favorites-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="favorites-hero">
        <div className="exact-shell favorites-hero-inner">
          <div>
            <a href="/" className="favorites-back"><ArrowLeft size={15}/> Continuer mes achats</a>
            <span className="favorites-eyebrow"><Heart size={14} fill="currentColor"/> MA SÉLECTION LHAWTA</span>
            <h1>Mes favoris</h1>
            <p>Retrouvez les produits que vous avez enregistrés et comparez-les avant de commander.</p>
          </div>
          <aside>
            <strong>{slugs.length}</strong>
            <span>produit{slugs.length!==1?"s":""} enregistré{slugs.length!==1?"s":""}</span>
          </aside>
        </div>
      </section>

      <section className="exact-shell favorites-content">
        {slugs.length>0&&(
          <div className="favorites-toolbar">
            <div>
              <Heart size={17} fill="currentColor"/>
              <span><b>{slugs.length}</b> favori{slugs.length!==1?"s":""}</span>
            </div>
            <button type="button" onClick={clearAll}><Trash2 size={15}/> Tout supprimer</button>
          </div>
        )}

        {slugs.length===0?(
          <div className="favorites-empty">
            <span className="favorites-empty-icon"><Heart size={34}/></span>
            <h2>Votre liste de favoris est vide</h2>
            <p>Ajoutez des produits avec le cœur pour les retrouver ici, même après avoir actualisé la page.</p>
            <a href="/#products"><ShoppingCart size={16}/> Découvrir les nouveautés</a>
          </div>
        ):(
          <div className="favorites-grid">
            {items.map(item=>{
              if(item.kind==="product"){
                const product=item.product;
                return (
                  <article className="favorite-product-card" key={item.id}>
                    <span className="favorite-product-badge">{product.badge}</span>
                    <FavoriteButton className="favorite-product-heart" slug={product.slug} size={18}/>
                    <a href={`/products/${product.slug}`} className="favorite-product-media">
                      <ProductVisual src={product.gallery[0]} alt={product.name}/>
                    </a>
                    <div className="favorite-product-body">
                      <small>{product.brand}</small>
                      <h2><a href={`/products/${product.slug}`} className="product-name-link">{product.name}</a></h2>
                      <p>{product.shortDescription}</p>
                      <ul>
                        {product.highlights.slice(0,3).map(row=>(
                          <li key={row.label}><b>{row.label}</b><span>{row.value}</span></li>
                        ))}
                      </ul>
                      <div className="favorite-product-price">
                        <strong>{product.price}</strong>
                        {product.oldPrice&&<del>{product.oldPrice}</del>}
                      </div>
                      <div className="favorite-product-actions">
                        <a href={`/products/${product.slug}`}><ShoppingCart size={15}/> Voir le produit</a>
                        <a href={`/compare?products=${product.slug}`}><BarChart3 size={15}/> Comparer</a>
                      </div>
                    </div>
                  </article>
                );
              }

              if(item.kind==="catalog"){
                const product=item.catalog;
                return (
                  <article className="favorite-product-card favorite-catalog-card" key={item.id}>
                    <span className="favorite-product-badge">Favori</span>
                    <FavoriteButton className="favorite-product-heart" slug={item.id} size={18}/>
                    <a href={`/category/${product.categorySlug}`} className="favorite-product-media">
                      <ProductVisual
                        src={categoryImages[product.categorySlug]||categoryImages.accessoires}
                        alt={product.name}
                      />
                    </a>
                    <div className="favorite-product-body">
                      <small>{product.brand}</small>
                      <h2><a href={`/category/${product.categorySlug}`} className="product-name-link">{product.name}</a></h2>
                      <p>Produit enregistré depuis la catégorie {categoryLabels[product.categorySlug]||product.categorySlug}.</p>
                      <div className="favorite-catalog-note">
                        <PackageSearch size={15}/>
                        <span>La fiche produit détaillée sera ajoutée au catalogue.</span>
                      </div>
                      <div className="favorite-product-actions single">
                        <a href={`/category/${product.categorySlug}`}><ShoppingCart size={15}/> Voir la catégorie</a>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article className="favorite-product-card favorite-catalog-card" key={item.id}>
                  <FavoriteButton className="favorite-product-heart" slug={item.id} size={18}/>
                  <div className="favorite-unknown">
                    <PackageSearch size={30}/>
                    <h2>Produit enregistré</h2>
                    <p>Cette référence n’est plus disponible dans le catalogue actuel.</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
