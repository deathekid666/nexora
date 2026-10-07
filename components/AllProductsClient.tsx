"use client";

import {
  BarChart3,
  ChevronDown,
  Grid3X3,
  RotateCcw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { ProductVisual } from "@/components/ProductVisual";
import {
  catalogs,
  type AllCatalogProduct,
} from "@/lib/category-catalogs";

type PriceFilter="under1000"|"1000to5000"|"over5000";
type SortMode="relevance"|"price-asc"|"price-desc"|"rating-desc"|"name";

function numericPrice(price:string){
  return Number(price.replace(/[^0-9]/g,""))||0;
}

function normalize(value:string){
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g," ")
    .trim();
}

export default function AllProductsClient({products}:{products:AllCatalogProduct[]}){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("all");
  const [brands,setBrands]=useState<string[]>([]);
  const [prices,setPrices]=useState<PriceFilter[]>([]);
  const [sort,setSort]=useState<SortMode>("relevance");
  const [showFilters,setShowFilters]=useState(false);

  const availableBrands=useMemo(
    ()=>[...new Set(products.map(product=>product.brand))].sort((a,b)=>a.localeCompare(b)),
    [products]
  );

  const categoryEntries=useMemo(
    ()=>Object.entries(catalogs).map(([slug,item])=>({
      slug,
      title:item.title,
      count:item.products.length,
    })),
    []
  );

  const filtered=useMemo(()=>{
    const normalizedQuery=normalize(query);
    const terms=normalizedQuery.split(/\s+/).filter(Boolean);

    const result=products.filter(product=>{
      if(category!=="all"&&product.categorySlug!==category) return false;
      if(brands.length&&!brands.includes(product.brand)) return false;

      const price=numericPrice(product.price);
      if(prices.length){
        const matches=prices.some(filter=>{
          if(filter==="under1000") return price<1000;
          if(filter==="1000to5000") return price>=1000&&price<=5000;
          return price>5000;
        });
        if(!matches) return false;
      }

      if(terms.length){
        const haystack=normalize([
          product.brand,
          product.name,
          product.categoryTitle,
          product.badge||"",
          ...product.specs,
        ].join(" "));
        if(!terms.every(term=>haystack.includes(term))) return false;
      }

      return true;
    });

    if(sort==="price-asc") return [...result].sort((a,b)=>numericPrice(a.price)-numericPrice(b.price));
    if(sort==="price-desc") return [...result].sort((a,b)=>numericPrice(b.price)-numericPrice(a.price));
    if(sort==="rating-desc") return [...result].sort((a,b)=>Number(b.rating)-Number(a.rating));
    if(sort==="name") return [...result].sort((a,b)=>a.name.localeCompare(b.name));
    return result;
  },[products,query,category,brands,prices,sort]);

  const toggleBrand=(brand:string)=>{
    setBrands(current=>current.includes(brand)?current.filter(item=>item!==brand):[...current,brand]);
  };

  const togglePrice=(price:PriceFilter)=>{
    setPrices(current=>current.includes(price)?current.filter(item=>item!==price):[...current,price]);
  };

  const reset=()=>{
    setQuery("");
    setCategory("all");
    setBrands([]);
    setPrices([]);
    setSort("relevance");
  };

  const activeFilterCount=(category==="all"?0:1)+brands.length+prices.length+(query.trim()?1:0);

  return (
    <>
      <section className="all-products-categories exact-shell">
        <button
          type="button"
          className={category==="all"?"active":""}
          onClick={()=>setCategory("all")}
        >
          <Grid3X3 size={17}/>
          <span><b>Tout</b><small>{products.length} produits</small></span>
        </button>
        {categoryEntries.map(item=>(
          <button
            type="button"
            className={category===item.slug?"active":""}
            onClick={()=>setCategory(item.slug)}
            key={item.slug}
          >
            <span><b>{item.title}</b><small>{item.count} produits</small></span>
          </button>
        ))}
      </section>

      <section className="all-products-toolbar">
        <div className="exact-shell all-products-toolbar-inner">
          <label className="all-products-search">
            <Search size={17}/>
            <input
              value={query}
              onChange={event=>setQuery(event.target.value)}
              placeholder="Rechercher dans tout le catalogue..."
            />
            {query&&<button type="button" onClick={()=>setQuery("")}>Effacer</button>}
          </label>

          <button
            type="button"
            className={showFilters||activeFilterCount?"all-products-filter-button active":""}
            onClick={()=>setShowFilters(value=>!value)}
          >
            <SlidersHorizontal size={15}/> Filtres
            {activeFilterCount>0&&<em>{activeFilterCount}</em>}
          </button>

          <label className="all-products-sort">
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

      <section className="exact-shell all-products-layout">
        <aside className={showFilters?"all-products-sidebar is-open":"all-products-sidebar"}>
          <div className="all-products-sidebar-head">
            <div><SlidersHorizontal size={16}/><strong>Filtrer</strong></div>
            {activeFilterCount>0&&<button type="button" onClick={reset}><RotateCcw size={13}/> Tout effacer</button>}
          </div>

          <div className="all-products-filter-group">
            <span>Catégorie</span>
            <label>
              <input type="radio" name="catalog-category" checked={category==="all"} onChange={()=>setCategory("all")}/>
              Tous les produits
            </label>
            {categoryEntries.map(item=>(
              <label key={item.slug}>
                <input
                  type="radio"
                  name="catalog-category"
                  checked={category===item.slug}
                  onChange={()=>setCategory(item.slug)}
                />
                <span>{item.title}</span>
                <small>{item.count}</small>
              </label>
            ))}
          </div>

          <div className="all-products-filter-group">
            <span>Marque</span>
            {availableBrands.map(brand=>(
              <label key={brand}>
                <input type="checkbox" checked={brands.includes(brand)} onChange={()=>toggleBrand(brand)}/>
                {brand}
              </label>
            ))}
          </div>

          <div className="all-products-filter-group">
            <span>Prix</span>
            <label><input type="checkbox" checked={prices.includes("under1000")} onChange={()=>togglePrice("under1000")}/> Moins de 1 000 DH</label>
            <label><input type="checkbox" checked={prices.includes("1000to5000")} onChange={()=>togglePrice("1000to5000")}/> 1 000 – 5 000 DH</label>
            <label><input type="checkbox" checked={prices.includes("over5000")} onChange={()=>togglePrice("over5000")}/> Plus de 5 000 DH</label>
          </div>
        </aside>

        <div className="all-products-results">
          <div className="all-products-results-head">
            <div>
              <b>{filtered.length}</b>
              <span>produit{filtered.length!==1?"s":""}</span>
              {category!=="all"&&<small>dans {catalogs[category]?.title}</small>}
            </div>
            {activeFilterCount>0&&<button type="button" onClick={reset}><RotateCcw size={13}/> Réinitialiser</button>}
          </div>

          {filtered.length===0?(
            <div className="all-products-empty">
              <Search size={32}/>
              <h2>Aucun produit trouvé</h2>
              <p>Essayez une autre recherche ou retirez certains filtres.</p>
              <button type="button" onClick={reset}><RotateCcw size={14}/> Réinitialiser le catalogue</button>
            </div>
          ):(
            <div className="all-products-grid">
              {filtered.map(product=>{
                const favoriteSlug=product.detailSlug||("catalog:"+product.categorySlug+":"+product.brand+":"+product.name);
                const productHref="/products/"+product.productSlug;
                return (
                  <article className="all-product-card" key={product.categorySlug+"-"+product.name}>
                    {product.badge&&<span className="all-product-badge">{product.badge}</span>}
                    <FavoriteButton className="all-product-heart" slug={favoriteSlug} size={18} label={"Ajouter "+product.name+" aux favoris"}/>

                    <a href={productHref} className="all-product-media">
                      <ProductVisual src={product.image} alt={product.name}/>
                    </a>

                    <div className="all-product-body">
                      <div className="all-product-meta">
                        <a href={"/category/"+product.categorySlug}>{product.categoryTitle}</a>
                        <span>{product.brand}</span>
                      </div>

                      <h2>
                        <a href={productHref} className="product-name-link">{product.name}</a>
                      </h2>

                      <div className="all-product-rating">
                        <Star size={13} fill="currentColor"/>
                        <b>{product.rating}</b>
                        <span>avis</span>
                      </div>

                      <ul>{product.specs.slice(0,3).map(spec=><li key={spec}>{spec}</li>)}</ul>

                      <div className="all-product-delivery"><Truck size={14}/> Livraison disponible au Maroc</div>

                      <div className="all-product-price">
                        <strong>{product.price}</strong>
                        {product.old&&<del>{product.old}</del>}
                      </div>

                      <div className="all-product-actions">
                        <a className="primary" href={productHref}>
                          <ShoppingCart size={15}/>
                          Voir le produit
                        </a>
                        {product.detailSlug?(
                          <a className="secondary" href={"/compare?products="+product.detailSlug}><BarChart3 size={15}/> Comparer</a>
                        ):(
                          <span className="all-product-catalog-note">Fiche détaillée à venir</span>
                        )}
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
