import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import FavoriteButton from "@/components/FavoriteButton";
import { ProductVisual } from "@/components/ProductVisual";
import { allCatalogProducts } from "@/lib/category-catalogs";

export default function NewArrivalsPage(){
  const products=allCatalogProducts.filter(product=>
    (product.badge||"").toLowerCase().includes("nouveau")
  );

  const categories=[...new Set(products.map(product=>product.categoryTitle))];

  return (
    <main className="exact-page new-arrivals-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="new-arrivals-hero">
        <div className="exact-shell new-arrivals-hero-inner">
          <div>
            <a href="/"><ArrowLeft size={15}/> Accueil</a>
            <span><Sparkles size={15}/> NOUVEAUTÉS LHAWTA</span>
            <h1>Les nouveautés du catalogue</h1>
            <p>Cette page regroupe uniquement les produits actuellement marqués « Nouveau » dans le catalogue LHAWTA.</p>
            <div className="new-arrivals-hero-actions">
              <a href="#new-arrivals-grid">Voir les nouveautés <ArrowRight size={14}/></a>
              <a href="/products">Tout le catalogue</a>
            </div>
          </div>

          <aside>
            <strong>{products.length}</strong>
            <span>nouveauté{products.length!==1?"s":""} actuellement mise{products.length!==1?"s":""} en avant</span>
            <div>
              <p><BadgeCheck size={15}/> Produits neufs</p>
              <p><Truck size={15}/> Livraison au Maroc</p>
              <p><Sparkles size={15}/> Marquage issu du catalogue actuel</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="exact-shell new-arrivals-summary">
        <div>
          <span>CATÉGORIES CONCERNÉES</span>
          <strong>{categories.join(" · ")}</strong>
        </div>
        <a href="/products">Explorer les 32 produits <ArrowRight size={14}/></a>
      </section>

      <section className="exact-shell new-arrivals-content" id="new-arrivals-grid">
        <div className="new-arrivals-heading">
          <div>
            <span>À DÉCOUVRIR</span>
            <h2>Nouveaux produits mis en avant</h2>
          </div>
          <small>{products.length} produit{products.length!==1?"s":""}</small>
        </div>

        {products.length?(
          <div className="new-arrivals-grid">
            {products.map(product=>{
              const href=product.detailSlug?"/products/"+product.detailSlug:"/category/"+product.categorySlug;
              const favoriteSlug=product.detailSlug||("catalog:"+product.categorySlug+":"+product.brand+":"+product.name);
              return (
                <article className="new-arrival-card" key={product.categorySlug+"-"+product.name}>
                  <span className="new-arrival-badge"><Sparkles size={12}/> Nouveau</span>
                  <FavoriteButton className="new-arrival-heart" slug={favoriteSlug} size={18} label={"Ajouter "+product.name+" aux favoris"}/>

                  <a href={href} className="new-arrival-media">
                    <ProductVisual src={product.image} alt={product.name}/>
                  </a>

                  <div className="new-arrival-body">
                    <div className="new-arrival-meta">
                      <a href={"/category/"+product.categorySlug}>{product.categoryTitle}</a>
                      <span>{product.brand}</span>
                    </div>

                    <h2><a className="product-name-link" href={href}>{product.name}</a></h2>

                    <div className="new-arrival-rating">
                      <Star size={13} fill="currentColor"/>
                      <b>{product.rating}</b>
                      <span>avis</span>
                    </div>

                    <ul>{product.specs.slice(0,3).map(spec=><li key={spec}>{spec}</li>)}</ul>

                    <div className="new-arrival-price">
                      <strong>{product.price}</strong>
                      {product.old&&<del>{product.old}</del>}
                    </div>

                    <div className="new-arrival-actions">
                      <a className="primary" href={href}><ShoppingCart size={15}/>{product.detailSlug?"Voir le produit":"Voir la catégorie"}</a>
                      {product.detailSlug&&<a href={"/compare?products="+product.detailSlug}><BarChart3 size={15}/>Comparer</a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ):(
          <div className="new-arrivals-empty">
            <Sparkles size={32}/>
            <h2>Aucune nouveauté marquée actuellement</h2>
            <p>Le catalogue complet reste accessible.</p>
            <a href="/products">Voir tous les produits</a>
          </div>
        )}
      </section>
    </main>
  );
}
