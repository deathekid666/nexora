"use client";

import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import FavoriteButton from "@/components/FavoriteButton";
import { ProductVisual } from "@/components/ProductVisual";
import type { AllCatalogProduct } from "@/lib/category-catalogs";
import { addToCart } from "@/lib/cart-client";

export default function CatalogProductDetail({product}:{product:AllCatalogProduct}){
  const router=useRouter();
  const categoryHref="/category/"+product.categorySlug;
  const favoriteSlug=product.detailSlug||("catalog:"+product.categorySlug+":"+product.brand+":"+product.name);

  const addAndGoToCart=()=>{
    addToCart({
      slug:product.productSlug,
      name:product.name,
      brand:product.brand,
      price:product.price,
      variant:"Standard",
      color:"Standard",
      qty:1,
      image:product.image,
    });
    router.push("/cart");
  };

  return (
    <main className="exact-page product-detail-page catalog-product-detail">
      <SiteMotion/>
      <StoreHeader/>

      <div className="pdetail-breadcrumb exact-shell">
        <a href="/"><ArrowLeft size={15}/> Accueil</a>
        <ChevronRight size={13}/>
        <a href={categoryHref}>{product.categoryTitle}</a>
        <ChevronRight size={13}/>
        <span>{product.name}</span>
      </div>

      <section className="pdetail-hero exact-shell">
        <div className="pdetail-gallery">
          <div className="pdetail-main-image">
            {product.badge&&<span className="pdetail-badge">{product.badge}</span>}
            <FavoriteButton className="pdetail-heart" slug={favoriteSlug} size={19} label={"Ajouter "+product.name+" aux favoris"}/>
            <ProductVisual src={product.image} alt={product.name}/>
          </div>
          <small className="pdetail-gallery-note">Visuel catalogue de référence. Les couleurs, dimensions apparentes et accessoires peuvent varier selon la version.</small>
        </div>

        <aside className="pdetail-buy">
          <div className="pdetail-title">
            <div className="pdetail-brand-row"><span>{product.brand.toUpperCase()}</span>{product.badge&&<b>{product.badge}</b>}</div>
            <h1>{product.name}</h1>
            <p>Retrouvez ici les informations actuellement disponibles dans le catalogue LHAWTA pour ce produit.</p>
            <div className="pdetail-rating">
              <Star size={14} fill="currentColor"/>
              <strong>{product.rating}/5</strong>
              <span>·</span>
              <span>{product.categoryTitle}</span>
            </div>
          </div>

          <div className="pdetail-price">
            <strong>{product.price}</strong>
            {product.old&&<del>{product.old}</del>}
            <small>Prix actuellement affiché dans le catalogue LHAWTA.</small>
          </div>

          <div className="pdetail-highlight-grid">
            {product.specs.slice(0,4).map((spec,index)=>(
              <div key={spec}><small>Caractéristique {index+1}</small><strong>{spec}</strong></div>
            ))}
          </div>

          <div className="pdetail-assurance">
            <div><BadgeCheck size={18}/><span><b>{product.stock===false?"Disponibilité à confirmer":"Disponible au catalogue"}</b><small>Statut affiché selon les données catalogue actuelles.</small></span></div>
            <div><Truck size={18}/><span><b>Livraison au Maroc</b><small>Les modalités sont confirmées avant validation de commande.</small></span></div>
            <div><ShieldCheck size={18}/><span><b>Informations transparentes</b><small>Aucune caractéristique supplémentaire n’est inventée sur cette fiche.</small></span></div>
          </div>

          <div className="catalog-detail-actions">
            <button className="primary" type="button" onClick={addAndGoToCart}><ShoppingCart size={16}/> Ajouter au panier</button>
            <a className="secondary" href={categoryHref}>Voir d’autres {product.categoryTitle}</a>
          </div>
        </aside>
      </section>

      <section className="pdetail-description exact-shell">
        <div className="pdetail-description-copy">
          <span>INFORMATIONS PRODUIT</span>
          <h2>Une fiche dédiée pour chaque référence.</h2>
          <p>Cette page présente uniquement les informations déjà enregistrées pour {product.brand} {product.name}. La fiche pourra être enrichie lorsque des données produit plus détaillées seront ajoutées au catalogue.</p>
        </div>
        <div className="pdetail-benefits">
          <article><PackageCheck size={23}/><b>Produit identifié</b><span>Cette référence dispose maintenant de sa propre URL produit.</span></article>
          <article><BadgeCheck size={23}/><b>Données catalogue</b><span>Prix, notation et caractéristiques proviennent du catalogue actuel.</span></article>
          <article><Truck size={23}/><b>Navigation simple</b><span>Retournez à la catégorie ou au catalogue complet en un clic.</span></article>
        </div>
      </section>

      <section className="pdetail-specs exact-shell">
        <div className="pdetail-section-head">
          <span>CARACTÉRISTIQUES DISPONIBLES</span>
          <h2>Ce que le catalogue indique actuellement</h2>
          <p>Ces informations sont volontairement limitées aux données déjà présentes dans LHAWTA.</p>
        </div>

        <div className="pdetail-spec-groups catalog-detail-specs">
          <article className="pdetail-spec-card">
            <h3>Résumé</h3>
            <div>
              <p><span>Marque</span><strong>{product.brand}</strong></p>
              <p><span>Catégorie</span><strong>{product.categoryTitle}</strong></p>
              <p><span>Note</span><strong>{product.rating}/5</strong></p>
              <p><span>Prix</span><strong>{product.price}</strong></p>
            </div>
          </article>
          <article className="pdetail-spec-card">
            <h3>Caractéristiques</h3>
            <div>
              {product.specs.map((spec,index)=>(
                <p key={spec}><span>Spécification {index+1}</span><strong>{spec}</strong></p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="pdetail-bottom exact-shell">
        <div>
          <span>CONTINUER À EXPLORER</span>
          <h2>Découvrez d’autres produits de la même catégorie.</h2>
        </div>
        <div className="pdetail-bottom-actions">
          <a href={categoryHref}>Voir {product.categoryTitle}</a>
          <a href="/products" className="dark">Tous les produits</a>
        </div>
      </section>
    </main>
  );
}
