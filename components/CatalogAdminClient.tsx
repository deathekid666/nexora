"use client";
import {useEffect,useState,type FormEvent} from "react";
import {catalogs} from "@/lib/category-catalogs";
import StoreHeader from "@/components/StoreHeader";
type Base={slug:string;name:string;price:string};
type Custom={productSlug:string;categorySlug:string;categoryTitle:string;brand:string;name:string;price:string;image:string;stockCount:number};
type Entry={slug:string;priceMad:number;stock:number;enabled:boolean};
const money=(v:string)=>Number(v.replace(/[^0-9]/g,""))||0;
export default function CatalogAdminClient(){
 const [products,setProducts]=useState<Base[]>([]),[custom,setCustom]=useState<Custom[]>([]),[entries,setEntries]=useState<Record<string,Entry>>({});
 const [notice,setNotice]=useState(""),[busy,setBusy]=useState(false);
 const [form,setForm]=useState({name:"",brand:"",categorySlug:"smartphones",priceMad:"",image:"",badge:"",specs:"",stock:"1"});
 async function load(){setBusy(true);setNotice("");try{
  const r=await fetch("/api/catalog-management",{cache:"no-store"}),d=await r.json();
  if(!r.ok)throw Error(d.error||"Impossible de charger le catalogue.");
  setProducts(d.products||[]);setCustom(d.customProducts||[]);
  const next:Record<string,Entry>={};for(const p of d.products||[]){const found=(d.overrides||[]).find((x:Entry)=>x.slug===p.slug);next[p.slug]=found||{slug:p.slug,priceMad:money(p.price),stock:0,enabled:true};}
  setEntries(next);
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 useEffect(()=>{void load()},[]);
 async function save(e:FormEvent){e.preventDefault();setBusy(true);setNotice("");try{
  const r=await fetch("/api/catalog-management",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...form,priceMad:Number(form.priceMad),stock:Number(form.stock),specs:form.specs.split("\n").map(s=>s.trim()).filter(Boolean)})});
  const d=await r.json();if(!r.ok)throw Error(d.error||"Création impossible.");
  setNotice("Produit ajouté au catalogue.");setForm({...form,name:"",brand:"",priceMad:"",image:"",badge:"",specs:""});
  await load();
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 async function remove(slug:string,name:string){if(!window.confirm("Supprimer « "+name+" » du catalogue du site ?"))return;setBusy(true);setNotice("");try{const r=await fetch("/api/catalog-management?slug="+encodeURIComponent(slug),{method:"DELETE"});const d=await r.json();if(!r.ok)throw Error(d.error||"Suppression impossible.");setNotice("Produit supprimé.");await load()}catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 async function saveEntry(entry:Entry){setBusy(true);try{const r=await fetch("/api/catalog-management",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify(entry)});if(!r.ok)throw Error("Mise à jour impossible");setNotice("Prix et stock enregistrés.")}catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 return <main className="exact-page"><StoreHeader/><section className="exact-shell" style={{maxWidth:1100,padding:"36px 16px"}}>
 <nav style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:24}}><a className="admin-analytics-link" href="/admin/orders">Commandes</a><a className="admin-analytics-link" href="/admin/analytics">Historique & analyses</a><a className="admin-analytics-link" href="/admin/catalog" aria-current="page">Catalogue</a></nav>
 <h1>Gestion du catalogue</h1><p>Ajoutez un produit au site ou gérez les références existantes.</p>{notice&&<p role="status">{notice}</p>}
 <section style={{padding:20,border:"1px solid #dbe4f0",borderRadius:14,background:"#fff",marginTop:24}}>
 <h2>Ajouter un produit</h2><form onSubmit={save} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
 <label>Nom du produit<input required minLength={2} maxLength={120} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
 <label>Marque<input required maxLength={80} value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/></label>
 <label>Catégorie<select value={form.categorySlug} onChange={e=>setForm({...form,categorySlug:e.target.value})}>{Object.entries(catalogs).map(([slug,c])=><option key={slug} value={slug}>{c.title}</option>)}</select></label>
 <label>Prix (DH)<input required type="number" min="1" step="1" value={form.priceMad} onChange={e=>setForm({...form,priceMad:e.target.value})}/></label>
 <label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></label>
 <label>URL de l’image (https)<input required type="url" placeholder="https://…" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></label>
 <label>Badge (facultatif)<input maxLength={40} placeholder="Nouveau" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/></label>
 <label style={{gridColumn:"1/-1"}}>Caractéristiques (une par ligne)<textarea rows={3} value={form.specs} onChange={e=>setForm({...form,specs:e.target.value})}/></label>
 <button disabled={busy} type="submit">Publier sur le site</button></form></section>
 <section style={{marginTop:32}}><h2>Mes produits ajoutés ({custom.length})</h2>{custom.map(p=><article key={p.productSlug} style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",padding:16,margin:"12px 0",background:"#fff",border:"1px solid #dbe4f0",borderRadius:12}}>
 <img src={p.image} alt="" width="64" height="64" style={{objectFit:"cover",borderRadius:8}}/><div style={{flex:"1 1 220px"}}><b>{p.brand} {p.name}</b><p>{p.categoryTitle} · {p.price} · Stock {p.stockCount}</p><a href={"/products/"+p.productSlug}>Voir sur le site</a></div><button type="button" disabled={busy} onClick={()=>void remove(p.productSlug,p.name)}>Supprimer</button></article>)}</section>
 <section style={{marginTop:32}}><h2>Produits déjà intégrés ({products.length})</h2><p>Les références d’origine ne peuvent pas être supprimées ici. Vous pouvez modifier leur prix, leur stock et leur visibilité.</p>
 <div style={{display:"grid",gap:10}}>{products.map(p=>{const v=entries[p.slug];if(!v)return null;return <article key={p.slug} style={{display:"flex",gap:12,alignItems:"end",flexWrap:"wrap",padding:14,background:"#fff",border:"1px solid #dbe4f0",borderRadius:12}}>
 <strong style={{flex:"1 1 220px"}}>{p.name}</strong><label>Prix DH<input type="number" min="1" value={v.priceMad} onChange={e=>setEntries({...entries,[p.slug]:{...v,priceMad:Number(e.target.value)}})}/></label><label>Stock<input type="number" min="0" value={v.stock} onChange={e=>setEntries({...entries,[p.slug]:{...v,stock:Number(e.target.value)}})}/></label><label>Visible<input type="checkbox" checked={v.enabled} onChange={e=>setEntries({...entries,[p.slug]:{...v,enabled:e.target.checked}})}/></label><button disabled={busy} onClick={()=>void saveEntry(v)}>Enregistrer</button></article>})}</div>
 </section></section></main>
}
