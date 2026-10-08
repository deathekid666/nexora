"use client";
import {useEffect,useState} from "react";
import StoreHeader from "@/components/StoreHeader";
type Product={slug:string;name:string;price:string};
type Override={slug:string;priceMad:number;stock:number;enabled:boolean};
export default function CatalogAdminClient(){
 const [token,setToken]=useState("");const [input,setInput]=useState("");
 const [products,setProducts]=useState<Product[]>([]);const [entries,setEntries]=useState<Record<string,Override>>({});
 const [notice,setNotice]=useState("");const [busy,setBusy]=useState(false);
 useEffect(()=>{const saved=sessionStorage.getItem("lhawta-admin-token")||"";setInput(saved);if(saved)setToken(saved)},[]);
 async function load(key=token){setBusy(true);setNotice("");try{
 const response=await fetch("/api/catalog-management",{headers:{authorization:"Bearer "+key},cache:"no-store"});
 if(!response.ok)throw Error(response.status===401?"Clé admin incorrecte":"Impossible de charger le catalogue");
 const data=await response.json();setProducts(data.products);
 const next:Record<string,Override>={};for(const p of data.products as Product[]){const found=(data.overrides as Override[]).find(x=>x.slug===p.slug);next[p.slug]=found||{slug:p.slug,priceMad:Number(p.price.replace(/[^0-9]/g,"")),stock:0,enabled:true};}
 setEntries(next);
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 async function save(slug:string){setBusy(true);setNotice("");try{
 const response=await fetch("/api/catalog-management",{method:"PATCH",headers:{"content-type":"application/json",authorization:"Bearer "+token},body:JSON.stringify(entries[slug])});
 if(!response.ok)throw Error("Enregistrement impossible");setNotice("Produit enregistré : "+slug);
 }catch(e){setNotice(e instanceof Error?e.message:"Erreur")}finally{setBusy(false)}}
 return <main className="exact-page"><StoreHeader/><section className="exact-shell" style={{padding:"36px 16px",maxWidth:1000}}>
 <h1>Gestion du catalogue</h1><p>Prix et stock dans Neon. Seuls les administrateurs autorisés peuvent modifier les produits.</p>
 {!token?<form onSubmit={e=>{e.preventDefault();sessionStorage.setItem("lhawta-admin-token",input);setToken(input);void load(input)}}><label>Clé admin <input type="password" value={input} onChange={e=>setInput(e.target.value)}/></label><button type="submit">Se connecter</button></form>:<>
 <button type="button" disabled={busy} onClick={()=>void load()}>Actualiser</button>
 {notice&&<p role="status">{notice}</p>}
 <div style={{display:"grid",gap:14,marginTop:24}}>{products.map(p=>{const v=entries[p.slug];if(!v)return null;return <article key={p.slug} style={{padding:18,border:"1px solid #ddd",borderRadius:12,display:"flex",flexWrap:"wrap",alignItems:"end",gap:16}}>
 <div style={{flex:"1 1 180px"}}><strong>{p.name}</strong><p>{p.slug}</p></div>
 <label>Prix (DH)<input type="number" min="1" value={v.priceMad} onChange={e=>setEntries(old=>({...old,[p.slug]:{...v,priceMad:Number(e.target.value)}}))}/></label>
 <label>Stock<input type="number" min="0" value={v.stock} onChange={e=>setEntries(old=>({...old,[p.slug]:{...v,stock:Number(e.target.value)}}))}/></label>
 <label>Disponible <input type="checkbox" checked={v.enabled} onChange={e=>setEntries(old=>({...old,[p.slug]:{...v,enabled:e.target.checked}}))}/></label>
 <button type="button" disabled={busy} onClick={()=>void save(p.slug)}>Enregistrer</button></article>})}</div>
 </>}
 </section></main>
}
