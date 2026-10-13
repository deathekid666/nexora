"use client";
import {useEffect,useState,type FormEvent} from "react";
import {catalogs,type CatalogVariant} from "@/lib/category-catalogs";
import StoreHeader from "@/components/StoreHeader";
import styles from "@/app/admin/catalog/catalog-admin.module.css";
type Base={slug:string;name:string;price:string};
type Custom={productSlug:string;categorySlug:string;categoryTitle:string;brand:string;name:string;price:string;image:string;stockCount:number;variants:CatalogVariant[]};
type Entry={slug:string;priceMad:number;stock:number;enabled:boolean;variants:DraftVariant[]};
type DraftVariant={storage:string;color:string;priceMad:string;compareAtPriceMad:string;stock:string};
type Managed={slug:string;name:string;brand:string;category:string;image:string;price:string;oldPrice?:string;variants:{storage:string;color:string;priceMad:number;compareAtPriceMad:number|null;stock:number}[];enabled:boolean};
const money=(v:string)=>Number(v.replace(/[^0-9]/g,""))||0;
const emptyVariant=():DraftVariant=>({storage:"128 Go",color:"Noir",priceMad:"",compareAtPriceMad:"",stock:"1"});
export default function CatalogAdminClient(){
 const [products,setProducts]=useState<Base[]>([]),[custom,setCustom]=useState<Custom[]>([]),[entries,setEntries]=useState<Record<string,Entry>>({}),[managed,setManaged]=useState<Managed[]>([]);
 const [notice,setNotice]=useState(""),[busy,setBusy]=useState(false);
 const [form,setForm]=useState({name:"",brand:"",categorySlug:"smartphones",image:"",badge:"",specs:""});
 const [variants,setVariants]=useState<DraftVariant[]>([emptyVariant()]);
 async function load(){setBusy(true);setNotice("");try{
  const r=await fetch("/api/catalog-management",{cache:"no-store"}),d=await r.json();
  if(!r.ok)throw Error(d.error||"Impossible de charger le catalogue.");
  setProducts(d.products||[]);setCustom(d.customProducts||[]);setManaged(d.managedProducts||[]);
  const next:Record<string,Entry>={};for(const p of d.products||[]){const found=(d.overrides||[]).find((x:Entry)=>x.slug===p.slug);const managedProduct=(d.managedProducts||[]).find((x:Managed)=>x.slug===p.slug);next[p.slug]=found||{slug:p.slug,priceMad:money(p.price),stock:0,enabled:true};if(managedProduct)next[p.slug]={...next[p.slug],enabled:managedProduct.enabled,variants:managedProduct.variants.map((v:{storage:string;color:string;priceMad:number;compareAtPriceMad:number|null;stock:number})=>({storage:v.storage,color:v.color,priceMad:String(v.priceMad),compareAtPriceMad:v.compareAtPriceMad?String(v.compareAtPriceMad):"",stock:String(v.stock)}))};}
  setEntries(next);
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 useEffect(()=>{void load()},[]);
 async function save(e:FormEvent){e.preventDefault();setBusy(true);setNotice("");try{
  const r=await fetch("/api/catalog-management",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...form,variants:variants.map(v=>({storage:v.storage,color:v.color,priceMad:Number(v.priceMad),compareAtPriceMad:v.compareAtPriceMad?Number(v.compareAtPriceMad):null,stock:Number(v.stock)})),specs:form.specs.split("\n").map(s=>s.trim()).filter(Boolean)})});
  const d=await r.json();if(!r.ok)throw Error(d.error||"Création impossible.");
  setNotice("Produit publié sur le site.");setForm({...form,name:"",brand:"",image:"",badge:"",specs:""});setVariants([emptyVariant()]);
  await load();
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 async function remove(slug:string,name:string){if(!window.confirm("Supprimer « "+name+" » du catalogue du site ?"))return;setBusy(true);setNotice("");try{const r=await fetch("/api/catalog-management?slug="+encodeURIComponent(slug),{method:"DELETE"});const d=await r.json();if(!r.ok)throw Error(d.error||"Suppression impossible.");setNotice("Produit supprimé.");await load()}catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 async function saveEntry(entry:Entry){setBusy(true);try{const r=await fetch("/api/catalog-management",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({...entry,variants:entry.variants.map(v=>({storage:v.storage,color:v.color,priceMad:Number(v.priceMad),compareAtPriceMad:v.compareAtPriceMad?Number(v.compareAtPriceMad):null,stock:Number(v.stock)}))})});const d=await r.json();if(!r.ok)throw Error(d.error||"Mise à jour impossible");setNotice("Options, prix et stocks enregistrés.");await load()}catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 const setVariant=(index:number,key:keyof DraftVariant,value:string)=>setVariants(current=>current.map((v,i)=>i===index?{...v,[key]:value}:v));
 return <main className={styles.page}><StoreHeader/><section className={styles.wrap}>
 <nav className={styles.nav}><a href="/admin">Admin Panel</a><a href="/admin/orders">Commandes</a><a href="/admin/analytics">Historique & analyses</a><a href="/admin/catalog" aria-current="page">Produits</a></nav>
 <div className={styles.heading}><span className={styles.kicker}>ADMIN PANEL · PRODUITS</span><h1>Gestion des produits</h1><p>Publiez des produits et gérez leurs options, leurs stocks et leurs promotions.</p></div>
 {notice&&<p className={styles.notice} role="status">{notice}</p>}
 <section className={styles.panel}><div className={styles.panelHead}><div><span className={styles.sectionTag}>NOUVELLE FICHE</span><h2>Ajouter un produit</h2><p>Ajoutez une ligne par combinaison de stockage et de couleur.</p></div></div>
 <form onSubmit={save} className={styles.form}>
 <div className={styles.field}><label htmlFor="product-name">Nom du produit</label><input id="product-name" required minLength={2} maxLength={120} placeholder="Ex. Galaxy S26 Ultra" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
 <div className={styles.field}><label htmlFor="product-brand">Marque</label><input id="product-brand" required maxLength={80} placeholder="Samsung" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/></div>
 <div className={styles.field}><label htmlFor="product-category">Catégorie</label><select id="product-category" value={form.categorySlug} onChange={e=>setForm({...form,categorySlug:e.target.value})}>{Object.entries(catalogs).map(([slug,c])=><option key={slug} value={slug}>{c.title}</option>)}</select></div>
 <div className={styles.field}><label htmlFor="product-image">Image du produit</label><input id="product-image" required type="url" placeholder="https://…" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></div>
 <div className={styles.field}><label htmlFor="product-badge">Badge (facultatif)</label><input id="product-badge" maxLength={40} placeholder="Nouveau, Promo…" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/></div>
 <div className={styles.field+" "+styles.wide}><label htmlFor="product-specs">Caractéristiques (une par ligne)</label><textarea id="product-specs" rows={3} placeholder={"Écran AMOLED\n256 Go de stockage"} value={form.specs} onChange={e=>setForm({...form,specs:e.target.value})}/></div>
 <div className={styles.variantsHead}><div><h3>Options et prix</h3><p>Chaque combinaison peut avoir son propre prix et son stock.</p></div><button className={styles.secondaryButton} type="button" onClick={()=>setVariants(v=>[...v,emptyVariant()])}>+ Ajouter une option</button></div>
 <div className={styles.variantList}>{variants.map((v,i)=><div className={styles.variantRow} key={i}>
 <div className={styles.field}><label>Stockage / taille</label><input required maxLength={50} placeholder="256 Go" value={v.storage} onChange={e=>setVariant(i,"storage",e.target.value)}/></div>
 <div className={styles.field}><label>Couleur</label><input required maxLength={50} placeholder="Noir" value={v.color} onChange={e=>setVariant(i,"color",e.target.value)}/></div>
 <div className={styles.field}><label>Prix de vente (DH)</label><input required type="number" min="1" step="1" placeholder="8999" value={v.priceMad} onChange={e=>setVariant(i,"priceMad",e.target.value)}/></div>
 <div className={styles.field}><label>Prix avant promo (DH)</label><input type="number" min="1" step="1" placeholder="Facultatif" value={v.compareAtPriceMad} onChange={e=>setVariant(i,"compareAtPriceMad",e.target.value)}/></div>
 <div className={styles.field}><label>Stock</label><input required type="number" min="0" step="1" value={v.stock} onChange={e=>setVariant(i,"stock",e.target.value)}/></div>
 <button className={styles.removeOption} type="button" aria-label="Supprimer cette option" disabled={variants.length===1} onClick={()=>setVariants(v=>v.filter((_,n)=>n!==i))}>×</button>
 </div>)}</div>
 <div className={styles.formActions}><button className={styles.primaryButton} disabled={busy} type="submit">{busy?"Publication…":"Publier le produit"}</button><span>Les prix de promotion sont affichés sur la fiche produit.</span></div>
 </form></section>
 <section className={styles.listSection}><div className={styles.listHeading}><div><span className={styles.sectionTag}>VOTRE CATALOGUE</span><h2>Produits publiés <small>{custom.length}</small></h2></div><button className={styles.secondaryButton} type="button" disabled={busy} onClick={()=>void load()}>Actualiser</button></div>
 {custom.length===0?<div className={styles.empty}><strong>Aucun produit ajouté pour le moment</strong><span>Les produits que vous publiez apparaîtront ici et sur le site.</span></div>:<div className={styles.productList}>{custom.map(p=><article key={p.productSlug} className={styles.productCard}>
 <img src={p.image} alt="" width="72" height="72"/><div className={styles.productInfo}><strong>{p.brand} {p.name}</strong><span>{p.categoryTitle} · Dès {p.price} · Stock {p.stockCount}</span><small>{p.variants.length} option{p.variants.length===1?"":"s"} · {p.variants.filter(v=>v.compareAtPriceMad).length} en promotion</small><a href={"/products/"+p.productSlug}>Voir sur le site</a></div><button className={styles.deleteButton} type="button" disabled={busy} onClick={()=>void remove(p.productSlug,p.name)}>Supprimer</button></article>)}</div>}
 </section>
 <section className={styles.listSection}><div className={styles.listHeading}><div><span className={styles.sectionTag}>RÉFÉRENCES DU SITE</span><h2>Produits déjà intégrés <small>{products.length}</small></h2><p>Modifiez les combinaisons, ajoutez des couleurs ou stockages, puis définissez prix, promotions et stock pour chaque option.</p></div></div>
 <div className={styles.builtInList}>{managed.map(p=>{const entry=entries[p.slug];if(!entry)return null;return <article key={p.slug} className={styles.builtInEditor}>
  <div className={styles.builtInTop}><div><strong>{p.brand} {p.name}</strong><span>{p.category} · {p.variants.length} options</span></div><label className={styles.toggle}>Visible sur le site<input type="checkbox" checked={entry.enabled} onChange={e=>setEntries({...entries,[p.slug]:{...entry,enabled:e.target.checked}})}/></label></div>
  <div className={styles.existingVariants}>{entry.variants.map((v,i)=><div key={i} className={styles.existingVariantRow}>
   <label>Stockage / version<input value={v.storage} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,storage:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Couleur<input value={v.color} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,color:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Prix DH<input type="number" min="1" value={v.priceMad} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,priceMad:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Prix avant promo<input type="number" min="1" placeholder="Facultatif" value={v.compareAtPriceMad} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,compareAtPriceMad:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <label>Stock<input type="number" min="0" value={v.stock} onChange={e=>{const variants=entry.variants.map((x,j)=>j===i?{...x,stock:e.target.value}:x);setEntries({...entries,[p.slug]:{...entry,variants}})}}/></label>
   <button type="button" className={styles.removeOption} aria-label="Retirer cette option" disabled={entry.variants.length<=1} onClick={()=>setEntries({...entries,[p.slug]:{...entry,variants:entry.variants.filter((_,j)=>j!==i)}})}>×</button>
  </div>)}</div>
  <div className={styles.builtInActions}><button type="button" className={styles.secondaryButton} onClick={()=>setEntries({...entries,[p.slug]:{...entry,variants:[...entry.variants,{storage:"Nouvelle option",color:"Noir",priceMad:String(entry.priceMad),compareAtPriceMad:"",stock:"0"}]}})}>+ Ajouter stockage / couleur</button><button type="button" className={styles.primaryButton} disabled={busy} onClick={()=>void saveEntry(entry)}>Enregistrer les modifications</button></div>
 </article>})}</div>
 </section></main>;
}
