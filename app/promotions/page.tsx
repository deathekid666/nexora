import {
  ArrowLeft,
  BarChart3,
  Percent,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Truck,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import FavoriteButton from "@/components/FavoriteButton";
import { ProductVisual } from "@/components/ProductVisual";
import { allCatalogProducts } from "@/lib/category-catalogs";

function moneyToNumber(value:string){
  return Number(value.replace(/[^0-9]/g,""))||0;
}

function discountInfo(price:string,old:string){
  const current=moneyToNumber(price);
  const previous=moneyToNumber(old);
  const saving=Math.max(0,previous-current);
  const percent=previous>0?Math.round((saving/previous)*100):0;
  return {saving,percent};
}

function formatDh(value:number){
  return new Intl.NumberFormat("fr-MA").format(value)+" DH";
}

export default function PromotionsPage(){
  const promotions=allCatalogProducts
    .filter(product=>product.old&&moneyToNumber(product.old)>moneyToNumber(product.price))
    .map(product=>({
      ...product,
      discount:discountInfo(product.price,product.old!),
    }))
    .sort((a,b)=>b.discount.percent-a.discount.percent);

  const best=promotions[0];

  return (
    <main className="exact-page promotions-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="promotions-hero">
        <div className="exact-shell promotions-hero-inner">
          <div>
            <a href="/products"><ArrowLeft size={15}/> Retour au catalogue</a>
            <span><Tag size={14}/> OFFRES LHAWTA</span>
            <h1>Promotions</h1>
            <p>Les produits qui affichent actuellement une baisse de prix dans notre catalogue, sans faux compte à rebours ni remise inventée.</p>
          </div>

          {best&&(
            <aside>
              <span>MEILLEURE REMISE ACTUELLE</span>
              <strong>-{best.discount.percent}%</strong>
              <b>{best.brand} {best.name}</b>
              <small>Économie affichée : {formatDh(best.discount.saving)}</small>
            </aside>
          )}
        </div>
      </section>

      <section className="exact-shell promotions-trust">
        <div><Percent size={18}/><span><b>Remises calculées</b><small>À partir du prix actuel et du prix barré du catalogue.</small></span></div>
        <div><Truck size={18}/><span><b>Livraison au Maroc</b><small>Disponibilité confirmée avant expédition.</small></span></div>
        <div><ShieldCheck size={18}/><span><b>Aucune fausse urgence</b><small>Nous n’affichons pas de minuteur artificiel.</small></span></div>
      </section>

      <section className="exact-shell promotions-content">
        <div className="promotions-head">
          <div>
            <span>OFFRES ACTUELLES</span>
            <h2>{promotions.length} produit{promotions.length!==1?"s":""} avec prix réduit</h2>
          </div>
          <a href="/products">Voir tout le catalogue</a>
        </div>

        {promotions.length?(
          <div className="promotions-grid">
            {promotions.map(product=>{
              const detailHref="/products/"+product.productSlug;
              const favoriteSlug=product.detailSlug||("catalog:"+product.categorySlug+":"+product.brand+":"+product.name);
              return (
                <article className="promotion-card" key={product.categorySlug+"-"+product.name}>
                  <span className="promotion-discount">-{product.discount.percent}%</span>
                  <FavoriteButton className="promotion-heart" slug={favoriteSlug} size={18} label={"Ajouter "+product.name+" aux favoris"}/>

                  <a href={detailHref} className="promotion-media">
                    <ProductVisual src={product.image} alt={product.name}/>
                  </a>

                  <div className="promotion-body">
                    <div className="promotion-meta">
                      <a href={"/category/"+product.categorySlug}>{product.categoryTitle}</a>
                      <span>{product.brand}</span>
                    </div>

                    <h2><a className="product-name-link" href={detailHref}>{product.name}</a></h2>

                    <ul>{product.specs.slice(0,3).map(spec=><li key={spec}>{spec}</li>)}</ul>

                    <div className="promotion-saving">
                      <span>Vous économisez</span>
                      <b>{formatDh(product.discount.saving)}</b>
                    </div>

                    <div className="promotion-price">
                      <strong>{product.price}</strong>
                      <del>{product.old}</del>
                    </div>

                    <div className="promotion-actions">
                      <a className="primary" href={detailHref}><ShoppingCart size={15}/>Voir le produit</a>
                      {product.detailSlug&&<a href={"/compare?products="+product.detailSlug}><BarChart3 size={15}/>Comparer</a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ):(
          <div className="promotions-empty">
            <Tag size={30}/>
            <h2>Aucune promotion affichée actuellement</h2>
            <p>Le catalogue reste disponible avec les prix actuels.</p>
            <a href="/products">Voir les produits</a>
          </div>
        )}

        <p className="promotions-note">Les économies affichées correspondent uniquement à la différence entre le prix actuel et le prix barré renseignés dans le catalogue LHAWTA.</p>
      </section>
    </main>
  );
}
