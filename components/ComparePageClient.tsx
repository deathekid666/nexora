"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
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

function productsForCategory(category:string,exclude?:string){
  return Object.values(storeProducts)
    .filter(p=>p.category===category && p.slug!==exclude)
    .sort((a,b)=>a.brand.localeCompare(b.brand)||a.name.localeCompare(b.name));
}

export default function ComparePageClient({initialSlugs}:{initialSlugs:string[]}){
  const router=useRouter();
  const initialProducts=initialSlugs.map(s=>storeProducts[s]).filter(Boolean);
  const initialCategory=initialProducts[0]?.category || "Smartphones";

  const [leftSlug,setLeftSlug]=useState(
    initialProducts[0]?.slug || productsForCategory(initialCategory)[0]?.slug || ""
  );
  const [rightSlug,setRightSlug]=useState(
    initialProducts[1]?.category===initialCategory ? initialProducts[1].slug : ""
  );
  const [differencesOnly,setDifferencesOnly]=useState(false);

  const left=storeProducts[leftSlug];
  const right=storeProducts[rightSlug];
  const category=left?.category || initialCategory;

  const sameCategoryProducts=useMemo(
    ()=>productsForCategory(category),
    [category]
  );

  useEffect(()=>{
    const selected=[leftSlug,rightSlug].filter(Boolean);
    const query=selected.length?"?products="+selected.join(","):"";
    router.replace("/compare"+query,{scroll:false});
  },[leftSlug,rightSlug,router]);

  const leftRows=left?productRows(left):new Map<string,Map<string,string>>();
  const rightRows=right?productRows(right):new Map<string,Map<string,string>>();

  const sections=useMemo(()=>{
    if(!left||!right) return [];
    const set=new Set<string>();
    for(const key of leftRows.keys()) set.add(key);
    for(const key of rightRows.keys()) set.add(key);
    return [...set];
  },[leftSlug,rightSlug,left,right]);

  const changeLeft=(slug:string)=>{
    const next=storeProducts[slug];
    if(!next) return;
    setLeftSlug(slug);
    if(right && (right.category!==next.category || right.slug===slug)) setRightSlug("");
  };

  const changeRight=(slug:string)=>{
    const next=storeProducts[slug];
    if(!next||!left||next.category!==left.category||next.slug===left.slug) return;
    setRightSlug(slug);
  };

  return (
    <main className="exact-page compare-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="compare-head exact-shell">
        <div>
          <span>COMPARAISON TECHNIQUE</span>
          <h1>Comparer {category.toLowerCase()}</h1>
          <p>Choisissez deux produits de la même catégorie et comparez leurs caractéristiques ligne par ligne.</p>
        </div>
        {left&&right&&(
          <label className="compare-diff-toggle">
            <input type="checkbox" checked={differencesOnly} onChange={e=>setDifferencesOnly(e.target.checked)}/>
            <span><Check size={13}/>Différences uniquement</span>
          </label>
        )}
      </section>

      <section className="compare-gsm-picker exact-shell">
        <CompareProductPicker
          product={left}
          options={sameCategoryProducts.filter(p=>p.slug!==rightSlug)}
          onChange={changeLeft}
          title="Produit 1"
          prompt="Choisir le premier produit"
          lockedCategory={category}
        />

        <div className="compare-gsm-vs">VS</div>

        <CompareProductPicker
          product={right}
          options={sameCategoryProducts.filter(p=>p.slug!==leftSlug)}
          onChange={changeRight}
          onClear={right?()=>setRightSlug(""):undefined}
          title="Comparer avec"
          prompt="Rechercher un autre produit"
          lockedCategory={category}
          empty={!right}
        />
      </section>

      {!right&&(
        <section className="compare-awaiting exact-shell">
          <div>
            <Plus size={24}/>
            <h2>Ajoutez un deuxième produit</h2>
            <p>Seuls les produits de la catégorie <b>{category}</b> sont proposés, pour garder une comparaison cohérente.</p>
          </div>
        </section>
      )}

      {left&&right&&(
        <section className="compare-table-wrap exact-shell">
          <div className="compare-sticky-products">
            <div className="compare-label-cell">Spécifications</div>
            <a href={"/products/"+left.slug}>
              <ProductVisual src={left.gallery[0]} alt={left.name}/>
              <span>{left.brand}</span>
              <b>{left.name}</b>
              <strong>{left.price}</strong>
            </a>
            <a href={"/products/"+right.slug}>
              <ProductVisual src={right.gallery[0]} alt={right.name}/>
              <span>{right.brand}</span>
              <b>{right.name}</b>
              <strong>{right.price}</strong>
            </a>
          </div>

          <div className="compare-table">
            <div className="compare-section compare-summary-section">
              <h2>Général</h2>
              {[
                ["Prix",left.price,right.price],
                ["Note",left.rating+"/5 · "+left.reviewCount,right.rating+"/5 · "+right.reviewCount],
                ["Disponibilité",left.availability,right.availability],
                ["Garantie",left.warranty,right.warranty],
              ].filter(row=>!differencesOnly||row[1]!==row[2]).map(row=>(
                <div className={"compare-row "+(row[1]!==row[2]?"different":"same")} key={row[0]}>
                  <span>{row[0]}</span><strong>{row[1]}</strong><strong>{row[2]}</strong>
                </div>
              ))}
            </div>

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
      )}
    </main>
  );
}

function CompareProductPicker({
  product,
  options,
  onChange,
  onClear,
  title,
  prompt,
  lockedCategory,
  empty=false,
}:{
  product?:StoreProduct;
  options:StoreProduct[];
  onChange:(slug:string)=>void;
  onClear?:()=>void;
  title:string;
  prompt:string;
  lockedCategory:string;
  empty?:boolean;
}){
  const [query,setQuery]=useState("");
  const [open,setOpen]=useState(empty);

  useEffect(()=>{
    if(empty) setOpen(true);
  },[empty]);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return options;
    return options.filter(p=>
      p.name.toLowerCase().includes(q)||
      p.brand.toLowerCase().includes(q)
    );
  },[options,query]);

  const pick=(slug:string)=>{
    onChange(slug);
    setQuery("");
    setOpen(false);
  };

  return (
    <article className={"compare-gsm-card "+(empty?"is-empty":"")}>
      <div className="compare-gsm-card-head">
        <div><small>{title}</small><span>{lockedCategory}</span></div>
        {onClear&&<button onClick={onClear} aria-label="Retirer le produit"><X size={16}/></button>}
      </div>

      {product ? (
        <div className="compare-gsm-selected">
          <ProductVisual src={product.gallery[0]} alt={product.name}/>
          <div>
            <span>{product.brand}</span>
            <h2>{product.name}</h2>
            <b>{product.price}</b>
          </div>
        </div>
      ) : (
        <div className="compare-gsm-placeholder">
          <Plus size={25}/>
          <strong>{prompt}</strong>
          <span>{lockedCategory} uniquement</span>
        </div>
      )}

      <button className="compare-search-trigger" onClick={()=>setOpen(v=>!v)}>
        <Search size={15}/>
        <span>{product?"Changer de produit":prompt}</span>
      </button>

      {open&&(
        <div className="compare-search-panel">
          <label>
            <Search size={15}/>
            <input
              autoFocus
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder={"Rechercher dans "+lockedCategory.toLowerCase()+"..."}
            />
            {query&&<button onClick={()=>setQuery("")} aria-label="Effacer"><X size={14}/></button>}
          </label>

          <div className="compare-search-results">
            {filtered.length ? filtered.map(p=>(
              <button key={p.slug} onClick={()=>pick(p.slug)}>
                <ProductVisual src={p.gallery[0]} alt={p.name}/>
                <span><small>{p.brand}</small><b>{p.name}</b><em>{p.price}</em></span>
              </button>
            )) : (
              <div className="compare-no-results">Aucun produit correspondant.</div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
