import {
  ArrowLeft,
  BarChart3,
  Search,
  ShoppingCart,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import FavoriteButton from "@/components/FavoriteButton";
import { ProductVisual } from "@/components/ProductVisual";
import { searchStoreProducts } from "@/lib/product-search";

export default async function SearchPage({
  searchParams,
}:{
  searchParams:Promise<{q?:string|string[]}>;
}){
  const params=await searchParams;
  const raw=Array.isArray(params.q)?params.q[0]:params.q;
  const query=(raw||"").trim();
  const products=query?searchStoreProducts(query):[];

  return (
    <main className="exact-page search-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="search-page-hero">
        <div className="exact-shell search-page-hero-inner">
          <a href="/" className="search-page-back"><ArrowLeft size={15}/> Accueil</a>
          <span className="search-page-eyebrow"><Search size={14}/> RECHERCHE LHAWTA</span>
          <h1>{query?<>Résultats pour <b>« {query} »</b></>:"Rechercher un produit"}</h1>
          <p>
            {query
              ? `${products.length} produit${products.length!==1?"s":""} trouvé${products.length!==1?"s":""} dans le catalogue actuel.`
              : "Utilisez la barre de recherche pour trouver un produit, une marque, une catégorie ou une caractéristique."}
          </p>
        </div>
      </section>

      <section className="exact-shell search-page-content">
        {!query?(
          <div className="search-page-empty">
            <span><Search size={34}/></span>
            <h2>Que recherchez-vous ?</h2>
            <p>Essayez par exemple : Samsung, PS5, tablette, 200 MP, 7000 mAh ou AMOLED.</p>
          </div>
        ):products.length===0?(
          <div className="search-page-empty">
            <span><Search size={34}/></span>
            <h2>Aucun produit trouvé</h2>
            <p>Essayez un nom plus court, une marque ou une caractéristique différente.</p>
            <a href="/#products">Voir les nouveautés</a>
          </div>
        ):(
          <>
            <div className="search-results-head">
              <div><b>{products.length}</b><span>résultat{products.length!==1?"s":""}</span></div>
              <a href="/#products">Voir toutes les nouveautés</a>
            </div>

            <div className="search-results-grid">
              {products.map(product=>(
                <article className="search-result-card" key={product.slug}>
                  <span className="search-result-badge">{product.badge}</span>
                  <FavoriteButton className="search-result-heart" slug={product.slug} size={18} label={"Ajouter "+product.name+" aux favoris"}/>
                  <a href={`/products/${product.slug}`} className="search-result-media">
                    <ProductVisual src={product.image} alt={product.name}/>
                  </a>
                  <div className="search-result-body">
                    <small>{product.brand} · {product.category}</small>
                    <h2><a className="product-name-link" href={`/products/${product.slug}`}>{product.name}</a></h2>
                    <p>{product.shortDescription}</p>
                    <ul>
                      {product.highlights.slice(0,3).map(item=>(
                        <li key={item.label}><span>{item.label}</span><b>{item.value}</b></li>
                      ))}
                    </ul>
                    <div className="search-result-price">
                      <strong>{product.price}</strong>
                      {product.oldPrice&&<del>{product.oldPrice}</del>}
                    </div>
                    <div className="search-result-actions">
                      <a href={`/products/${product.slug}`}><ShoppingCart size={15}/> Voir le produit</a>
                      {product.compareSlug&&<a href={`/compare?products=${product.compareSlug}`}><BarChart3 size={15}/> Comparer</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
