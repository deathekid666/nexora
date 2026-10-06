"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Check, ChevronDown, X } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import { ProductVisual } from "@/components/ProductVisual";
import { storeProducts, type StoreProduct } from "@/lib/store-products";

function normalizeSection(title:string){
  const t=title.toLowerCase();
  if(t.includes("écran")) return "Écran";
  if(t.includes("performance")||t.includes("mémoire")) return "Performances & mémoire";
  if(t.includes("photo")||t.includes("caméra")||t.includes("appareil")) return "Appareil photo";
  if(t.includes("batterie")||t.includes("dimension")||t.includes("design")||t.includes("résistance")) return "Batterie, design & dimensions";
  if(t.includes("connect")) return "Connectivité";
  if(t.includes("stockage")) return "Stockage";
  if(t.includes("expérience")) return "Expérience";
  return title;
}

function productRows(product:StoreProduct){
  const map=new Map<string,Map<string,string>>();
  for(const group of product.specs){
    const section=normalizeSection(group.title);
    if(!map.has(section)) map.set(section,new Map());
    const rows=map.get(section)!;
    for(const row of group.rows) rows.set(row.label,row.value);
  }
  return map;
}

function selectorOptions(category:string,exclude?:string){
  return Object.values(storeProducts)
    .filter(p=>p.category===category && p.slug!==exclude)
    .sort((a,b)=>a.name.localeCompare(b.name));
}

export default function ComparePageClient({
  initialSlugs,
}:{
  initialSlugs:string[];
}){
  const initialProducts=initialSlugs.map(s=>storeProducts[s]).filter(Boolean);
  const initialCategory=initialProducts[0]?.category || "Smartphones";

  const [leftSlug,setLeftSlug]=useState(initialProducts[0]?.slug || selectorOptions(initialCategory)[0]?.slug || "");
  const [rightSlug,setRightSlug]=useState(
    initialProducts[1]?.category===initialCategory
      ? initialProducts[1].slug
      : selectorOptions(initialCategory,leftSlug)[0]?.slug || ""
  );
  const [differencesOnly,setDifferencesOnly]=useState(false);

  const left=storeProducts[leftSlug];
  const right=storeProducts[rightSlug];
  const category=left?.category || initialCategory;

  const sameCategoryOptions=useMemo(
    ()=>Object.values(storeProducts).filter(p=>p.category===category),
    [category]
  );

  const leftRows=left?productRows(left):new Map<string,Map<string,string>>();
  const rightRows=right?productRows(right):new Map<string,Map<string,string>>();

  const sections=useMemo(()=>{
    const set=new Set<string>();
    for(const key of leftRows.keys()) set.add(key);
    for(const key of rightRows.keys()) set.add(key);
    return [...set];
  },[leftSlug,rightSlug]);

  const changeLeft=(slug:string)=>{
    const p=storeProducts[slug];
    if(!p) return;
    setLeftSlug(slug);
    if(!right || right.category!==p.category || right.slug===slug){
      setRightSlug(selectorOptions(p.category,slug)[0]?.slug || "");
    }
  };

  const changeRight=(slug:string)=>{
    const p=storeProducts[slug];
    if(!p || !left || p.category!==left.category || p.slug===left.slug) return;
    setRightSlug(slug);
  };

  return (
    <main className="exact-page compare-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="compare-head exact-shell">
        <div>
          <span>COMPARAISON LHAWTA</span>
          <h1>Comparer deux {category.toLowerCase()}</h1>
          <p>Une vue côte à côte inspirée des comparateurs techniques : mêmes catégories, mêmes lignes, différences immédiatement visibles.</p>
        </div>
        <label className="compare-diff-toggle">
          <input type="checkbox" checked={differencesOnly} onChange={e=>setDifferencesOnly(e.target.checked)}/>
          <span><Check size={13}/>Afficher uniquement les différences</span>
        </label>
      </section>

      <section className="compare-picker exact-shell">
        <CompareProductPicker
          product={left}
          options={sameCategoryOptions.filter(p=>p.slug!==rightSlug)}
          onChange={changeLeft}
          side="Produit 1"
        />
        <div className="compare-vs"><ArrowLeftRight size={19}/><b>VS</b></div>
        <CompareProductPicker
          product={right}
          options={sameCategoryOptions.filter(p=>p.slug!==leftSlug)}
          onChange={changeRight}
          side="Produit 2"
        />
      </section>

      {left&&right ? (
        <section className="compare-table-wrap exact-shell">
          <div className="compare-sticky-products">
            <div/>
            <a href={"/products/"+left.slug}><ProductVisual src={left.gallery[0]} alt={left.name}/><span>{left.brand}</span><b>{left.name}</b><strong>{left.price}</strong></a>
            <a href={"/products/"+right.slug}><ProductVisual src={right.gallery[0]} alt={right.name}/><span>{right.brand}</span><b>{right.name}</b><strong>{right.price}</strong></a>
          </div>

          <div className="compare-table">
            {sections.map(section=>{
              const leftSection=leftRows.get(section)||new Map<string,string>();
              const rightSection=rightRows.get(section)||new Map<string,string>();
              const labels=[...new Set([...leftSection.keys(),...rightSection.keys()])];
              const visibleLabels=differencesOnly
                ? labels.filter(label=>(leftSection.get(label)||"—")!==(rightSection.get(label)||"—"))
                : labels;
              if(!visibleLabels.length) return null;

              return (
                <div className="compare-section" key={section}>
                  <h2>{section}</h2>
                  {visibleLabels.map(label=>{
                    const a=leftSection.get(label)||"—";
                    const b=rightSection.get(label)||"—";
                    const different=a!==b;
                    return (
                      <div className={"compare-row "+(different?"different":"same")} key={label}>
                        <span>{label}</span>
                        <strong>{a}</strong>
                        <strong>{b}</strong>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="compare-empty exact-shell">
          <X size={24}/><h2>Il faut deux produits de la même catégorie.</h2>
        </section>
      )}
    </main>
  );
}

function CompareProductPicker({
  product,
  options,
  onChange,
  side,
}:{
  product?:StoreProduct;
  options:StoreProduct[];
  onChange:(slug:string)=>void;
  side:string;
}){
  return (
    <article className="compare-picker-card">
      <small>{side}</small>
      {product&&(
        <div className="compare-picker-product">
          <ProductVisual src={product.gallery[0]} alt={product.name}/>
          <div><span>{product.brand}</span><h2>{product.name}</h2><b>{product.price}</b></div>
        </div>
      )}
      <label>
        <span>Changer de produit</span>
        <div className="compare-select-shell">
          <select value={product?.slug||""} onChange={e=>onChange(e.target.value)}>
            {options.concat(product?[product]:[]).sort((a,b)=>a.name.localeCompare(b.name)).map(p=>(
              <option key={p.slug} value={p.slug}>{p.brand} {p.name}</option>
            ))}
          </select>
          <ChevronDown size={15}/>
        </div>
      </label>
    </article>
  );
}
