"use client";

import {
  ChevronDown,
  RotateCcw,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { ProductVisual } from "@/components/ProductVisual";
import { catalogProductSlug, productDetailSlugs, type CategoryProduct } from "@/lib/category-catalogs";
import { loadInventorySummaryMap, type PublicInventorySummary } from "@/lib/inventory-client";

type QuickFilter="all"|"new"|"best"|"stock";
type PriceFilter="under2000"|"2000to5000"|"over5000";
type SortMode="relevance"|"price-asc"|"price-desc"|"rating-desc"|"name";

function numericPrice(price:string){
  return Number(price.replace(/[^0-9]/g,""))||0;
}

export default function CategoryCatalogClient({
  slug,
  products,
}:{
  slug:string;
  products:CategoryProduct[];
}){
  const [quick,setQuick]=useState<QuickFilter>("all");
  const [brands,setBrands]=useState<string[]>([]);
  const [prices,setPrices]=useState<PriceFilter[]>([]);
  const [sort,setSort]=useState<SortMode>("relevance");
  const [showFilters,setShowFilters]=useState(false);
  const [stock,setStock]=useState<Record<string,PublicInventorySummary>>({});
  const [stockReady,setStockReady]=useState(false);

  const productSlugs=useMemo(
    ()=>products.map(product=>catalogProductSlug({
      name:product.name,
      categorySlug:slug,
      detailSlug:productDetailSlugs[product.name],
    })),
    [products,slug]
  );

  useEffect(()=>{
    let active=true;
    setStockReady(false);
    void loadInventorySummaryMap(productSlugs).then(map=>{
      if(!active) return;
      setStock(map);
      setStockReady(true);
    });
    return ()=>{active=false;};
  },[productSlugs]);

  const availableBrands=useMemo(
    ()=>[...new Set(products.map(product=>product.brand))].sort((a,b)=>a.localeCompare(b)),
    [products]
  );

  const filtered=useMemo(()=>{
    const result=products.filter(product=>{
      const badge=(product.badge||"").toLowerCase();
      const price=numericPrice(product.price);
      const productSlug=catalogProductSlug({
        name:product.name,
        categorySlug:slug,
        detailSlug:productDetailSlugs[product.name],
      });
      const stockState=stock[productSlug];
      const inStock=stockState?stockState.inStock:stockReady?false:product.stock!==false;

      if(quick==="new"&&!badge.includes("nouveau")) return false;
      if(quick==="best"&&!badge.includes("top vente")) return false;
      if(quick==="stock"&&!inStock) return false;

      if(brands.length&&!brands.includes(product.brand)) return false;

      if(prices.length){
        const match=prices.some(filter=>{
          if(filter==="under2000") return price<2000;
          if(filter==="2000to5000") return price>=2000&&price<=5000;
          return price>5000;
        });
        if(!match) return false;
      }

      return true;
    });

    if(sort==="price-asc") return [...result].sort((a,b)=>numericPrice(a.price)-numericPrice(b.price));
    if(sort==="price-desc") return [...result].sort((a,b)=>numericPrice(b.price)-numericPrice(a.price));
    if(sort==="rating-desc") return [...result].sort((a,b)=>Number(b.rating)-Number(a.rating));
    if(sort==="name") return [...result].sort((a,b)=>a.name.localeCompare(b.name));
    return result;
  },[products,quick,brands,prices,sort,slug,stock,stockReady]);

  const toggleBrand=(brand:string)=>{
    setBrands(current=>current.includes(brand)?current.filter(item=>item!==brand):[...current,brand]);
  };

  const togglePrice=(price:PriceFilter)=>{
    setPrices(current=>current.includes(price)?current.filter(item=>item!==price):[...current,price]);
  };

  const reset=()=>{
    setQuick("all");
    setBrands([]);
    setPrices([]);
    setSort("relevance");
  };

  const activeFilterCount=brands.length+prices.length+(quick==="all"?0:1);

  return (
    <>
      <section className="category-toolbar">
        <div className="category-filter-pills">
          <button type="button" className={quick==="all"?"active":""} onClick={()=>setQuick("all")}>Tous</button>
          <button type="button" className={quick==="new"?"active":""} onClick={()=>setQuick("new")}>Nouveautés</button>
          <button type="button" className={quick==="best"?"active":""} onClick={()=>setQuick("best")}>Meilleures ventes</button>
          <button type="button" className={quick==="stock"?"active":""} onClick={()=>setQuick("stock")}>En stock</button>
        </div>

        <div className="category-toolbar-right">
          <button
            type="button"
            className={showFilters||activeFilterCount?"category-filter-trigger active":""}
            onClick={()=>setShowFilters(value=>!value)}
          >
            <SlidersHorizontal size={15}/> Filtres
            {activeFilterCount>0&&<em>{activeFilterCount}</em>}
          </button>

          <label className="category-sort">
            <span>Trier :</span>
            <select value={sort} onChange={event=>setSort(event.target.value as SortMode)}>
              <option value="relevance">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating-desc">Mieux notés</option>
              <option value="name">Nom A–Z</option>
            </select>
            <ChevronDown size={14}/>
          </label>
        </div>
      </section>

      <section className="category-catalog">
        <aside className={showFilters?"category-sidebar is-open":"category-sidebar"}>
          <div className="category-sidebar-head">
            <strong>Filtrer</strong>
            {activeFilterCount>0&&(
              <button type="button" onClick={reset}><RotateCcw size={13}/> Réinitialiser</button>
            )}
          </div>

          <div>
            <span>Marque</span>
            {availableBrands.map(brand=>(
              <label key={brand}>
                <input
                  type="checkbox"
                  checked={brands.includes(brand)}
                  onChange={()=>toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>

          <div>
            <span>Prix</span>
            <label>
              <input type="checkbox" checked={prices.includes("under2000")} onChange={()=>togglePrice("under2000")}/>
              Moins de 2 000 DH
            </label>
            <label>
              <input type="checkbox" checked={prices.includes("2000to5000")} onChange={()=>togglePrice("2000to5000")}/>
              2 000 – 5 000 DH
            </label>
            <label>
              <input type="checkbox" checked={prices.includes("over5000")} onChange={()=>togglePrice("over5000")}/>
              Plus de 5 000 DH
            </label>
          </div>

          <div>
            <span>Disponibilité</span>
            <label>
              <input
                type="checkbox"
                checked={quick==="stock"}
                onChange={()=>setQuick(current=>current==="stock"?"all":"stock")}
              />
              En stock
            </label>
            <label>
              <input
                type="checkbox"
                checked={quick==="new"}
                onChange={()=>setQuick(current=>current==="new"?"all":"new")}
              />
              Nouveautés
            </label>
          </div>
        </aside>

        <div className="category-results">
          <div className="category-results-summary">
            <span><b>{filtered.length}</b> produit{filtered.length!==1?"s":""}</span>
            {activeFilterCount>0&&<button type="button" onClick={reset}><RotateCcw size={13}/> Effacer les filtres</button>}
          </div>

          {filtered.length===0?(
            <div className="category-empty-state">
              <SlidersHorizontal size={28}/>
              <h2>Aucun produit ne correspond</h2>
              <p>Modifiez ou réinitialisez les filtres pour afficher d’autres produits.</p>
              <button type="button" onClick={reset}><RotateCcw size={14}/> Réinitialiser</button>
            </div>
          ):(
            <div className="category-grid">
              {filtered.map(product=>{
                const detailSlug=productDetailSlugs[product.name];
                const productSlug=catalogProductSlug({name:product.name,categorySlug:slug,detailSlug});
                const detailHref=`/products/${productSlug}`;
                const stockState=stock[productSlug];
                const stockClass=!stockReady?"checking":stockState?.inStock?(stockState.lowStock?"low":"ok"):"out";
                const stockText=!stockReady?"Stock en vérification":stockState?.inStock?(stockState.lowStock?"Stock faible":"En stock"):"Rupture de stock";
                return (
                  <article className="category-product-card" key={product.name}>
                    {product.badge&&<span className="category-badge">{product.badge}</span>}
                    <FavoriteButton className="category-wish" slug={detailSlug||("catalog:"+slug+":"+product.brand+":"+product.name)} size={18} label={"Ajouter "+product.name+" aux favoris"}/>
                    <a href={detailHref} className="category-product-media"><ProductVisual src={product.image} alt={product.name}/></a>
                    <div className="category-product-body">
                      <small>{product.brand}</small>
                      <h2><a href={detailHref} className="product-name-link">{product.name}</a></h2>
                      <div className="category-rating"><Star size={13} fill="currentColor"/><b>{product.rating}</b><span>avis</span></div>
                      <ul>{product.specs.map(spec=><li key={spec}>{spec}</li>)}</ul>
                      <div className={"catalog-stock-pill "+stockClass}>{stockText}</div>
                      <div className="category-delivery"><Truck size={14}/> Livraison disponible</div>
                      <div className="category-price"><strong>{product.price}</strong>{product.old&&<del>{product.old}</del>}</div>
                      <div className="category-actions">
                        <a href={detailHref}><ShoppingCart size={15}/> Voir le produit</a>
                        {detailSlug?<a className="category-compare-link" href={`/compare?products=${detailSlug}`}>Comparer</a>:<button disabled title="Fiche technique complète requise">Comparer</button>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
