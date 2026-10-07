"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ClipboardList,
  LogOut,
  PackageCheck,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";

type InventoryRow={
  id:string;
  slug:string;
  brand:string;
  productName:string;
  variant:string;
  color:string;
  physicalQty:number;
  reservedQty:number;
  soldQty:number;
  availableQty:number;
  lowStockThreshold:number;
  lowStock:boolean;
  updatedAt:string;
};

type InventoryMovement={
  id:string;
  inventoryId:string;
  orderId:string|null;
  movementType:"ADJUST"|"RESERVE"|"RELEASE"|"SALE";
  physicalDelta:number;
  reservedDelta:number;
  soldDelta:number;
  actorLabel:string|null;
  reason:string|null;
  createdAt:string;
  slug:string;
  productName:string;
  variant:string;
  color:string;
};

type Draft={
  physicalQty:string;
  lowStockThreshold:string;
  reason:string;
};

function movementLabel(type:InventoryMovement["movementType"]){
  if(type==="RESERVE") return "Réservation";
  if(type==="RELEASE") return "Libération";
  if(type==="SALE") return "Vente livrée";
  return "Ajustement";
}

function signed(value:number){
  if(value===0) return "0";
  return value>0?"+"+value:String(value);
}

function dateTime(value:string){
  try{
    return new Intl.DateTimeFormat("fr-MA",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value));
  }catch{
    return value;
  }
}

function draftFrom(row:InventoryRow):Draft{
  return {
    physicalQty:String(row.physicalQty),
    lowStockThreshold:String(row.lowStockThreshold),
    reason:"",
  };
}

export default function AdminInventoryClient(){
  const [authenticated,setAuthenticated]=useState(false);
  const [sessionChecking,setSessionChecking]=useState(true);
  const [adminEmail,setAdminEmail]=useState("");
  const [emailInput,setEmailInput]=useState("");
  const [accessKey,setAccessKey]=useState("");
  const [inventory,setInventory]=useState<InventoryRow[]>([]);
  const [movements,setMovements]=useState<InventoryMovement[]>([]);
  const [drafts,setDrafts]=useState<Record<string,Draft>>({});
  const [search,setSearch]=useState("");
  const [activeSearch,setActiveSearch]=useState("");
  const [lowStockOnly,setLowStockOnly]=useState(false);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState("");
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");

  useEffect(()=>{
    const check=async()=>{
      try{
        const response=await fetch("/api/admin/session",{cache:"no-store"});
        const payload=await response.json().catch(()=>({}));
        if(response.ok&&payload?.email){
          setAuthenticated(true);
          setAdminEmail(payload.email);
          setEmailInput(payload.email);
        }
      }finally{
        setSessionChecking(false);
      }
    };
    void check();
  },[]);

  const fetchInventory=async(nextSearch=activeSearch,nextLowStock=lowStockOnly)=>{
    if(!authenticated) return;
    setLoading(true);
    setError("");
    try{
      const qs=new URLSearchParams();
      if(nextSearch) qs.set("search",nextSearch);
      if(nextLowStock) qs.set("lowStock","1");
      const response=await fetch("/api/inventory?"+qs.toString(),{cache:"no-store"});
      const payload=await response.json().catch(()=>({}));
      if(response.status===401){
        setAuthenticated(false);
        setError("Session admin expirée.");
        return;
      }
      if(!response.ok){
        setError("Impossible de charger le stock.");
        return;
      }
      const rows=Array.isArray(payload.inventory)?payload.inventory:[];
      setInventory(rows);
      setMovements(Array.isArray(payload.movements)?payload.movements:[]);
      setDrafts(current=>{
        const next={...current};
        for(const row of rows){
          if(!next[row.id]) next[row.id]=draftFrom(row);
        }
        return next;
      });
    }catch{
      setError("Impossible de joindre le service de stock.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(authenticated) void fetchInventory(activeSearch,lowStockOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[authenticated,lowStockOnly]);

  const login=async(event:FormEvent)=>{
    event.preventDefault();
    setError("");
    setLoading(true);
    try{
      const response=await fetch("/api/admin/session",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({email:emailInput.trim(),accessKey}),
      });
      const payload=await response.json().catch(()=>({}));
      if(!response.ok||!payload?.email){
        setError(payload?.message||"Connexion admin impossible.");
        return;
      }
      setAuthenticated(true);
      setAdminEmail(payload.email);
      setAccessKey("");
    }catch{
      setError("Impossible de joindre le service d’authentification.");
    }finally{
      setLoading(false);
    }
  };

  const logout=async()=>{
    try{await fetch("/api/admin/session",{method:"DELETE"});}catch{}
    setAuthenticated(false);
    setAdminEmail("");
    setInventory([]);
    setMovements([]);
  };

  const runSearch=(event:FormEvent)=>{
    event.preventDefault();
    const value=search.trim();
    setActiveSearch(value);
    void fetchInventory(value,lowStockOnly);
  };

  const setDraft=(id:string,field:keyof Draft,value:string)=>{
    const row=inventory.find(item=>item.id===id);
    if(!row) return;
    setDrafts(current=>({
      ...current,
      [id]:{
        ...(current[id]||draftFrom(row)),
        [field]:value,
      },
    }));
  };

  const saveRow=async(row:InventoryRow)=>{
    const draft=drafts[row.id]||draftFrom(row);
    setSaving(row.id);
    setError("");
    setNotice("");
    try{
      const response=await fetch("/api/inventory",{
        method:"PATCH",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          id:row.id,
          physicalQty:Number(draft.physicalQty)||0,
          lowStockThreshold:Number(draft.lowStockThreshold)||0,
          reason:draft.reason.trim()||"Ajustement manuel",
        }),
      });
      const payload=await response.json().catch(()=>({}));
      if(!response.ok||!payload?.item){
        setError(payload?.message||"Impossible d’enregistrer ce stock.");
        return;
      }
      const updated=payload.item as InventoryRow;
      setInventory(current=>current.map(item=>item.id===row.id?updated:item));
      setDrafts(current=>({...current,[row.id]:draftFrom(updated)}));
      setNotice("Stock enregistré : "+updated.productName+" · "+updated.variant+" · "+updated.color);
      void fetchInventory(activeSearch,lowStockOnly);
    }catch{
      setError("Impossible de mettre à jour ce stock.");
    }finally{
      setSaving("");
    }
  };

  const metrics=useMemo(()=>({
    skuCount:inventory.length,
    lowStock:inventory.filter(row=>row.lowStock).length,
    physical:inventory.reduce((sum,row)=>sum+row.physicalQty,0),
    reserved:inventory.reduce((sum,row)=>sum+row.reservedQty,0),
    sold:inventory.reduce((sum,row)=>sum+row.soldQty,0),
  }),[inventory]);

  if(sessionChecking){
    return (
      <main className="exact-page admin-inventory-page">
        <SiteMotion/><StoreHeader/>
        <section className="admin-login exact-shell">
          <div className="admin-login-card"><ShieldCheck size={34}/><span>ADMIN LHAWTA</span><h1>Vérification de la session</h1><p>Connexion sécurisée en cours...</p></div>
        </section>
      </main>
    );
  }

  if(!authenticated){
    return (
      <main className="exact-page admin-inventory-page">
        <SiteMotion/><StoreHeader/>
        <section className="admin-login exact-shell">
          <div className="admin-login-card">
            <ShieldCheck size={34}/>
            <span>ADMIN LHAWTA</span>
            <h1>Gestion du stock</h1>
            <p>Connectez-vous avec votre email administrateur et la clé d’accès LHAWTA.</p>
            <form onSubmit={login}>
              <label>Email administrateur<input type="email" value={emailInput} onChange={e=>setEmailInput(e.target.value)} autoComplete="username" required/></label>
              <label>Clé d’accès<input type="password" value={accessKey} onChange={e=>setAccessKey(e.target.value)} autoComplete="current-password" required/></label>
              {error&&<div className="admin-error">{error}</div>}
              <button type="submit" disabled={loading}>{loading?"Connexion...":"Ouvrir le stock"}</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="exact-page admin-inventory-page">
      <SiteMotion/><StoreHeader/>

      <section className="admin-orders-head exact-shell">
        <div>
          <span>ADMIN LHAWTA</span>
          <h1>Stock & inventaire</h1>
          <p>Gérez le stock physique, les réservations COD, les ventes livrées et les seuils d’alerte.</p>
          <small className="admin-session-email">Connecté : {adminEmail}</small>
        </div>
        <div className="admin-head-actions">
          <a href="/admin/orders"><ClipboardList size={15}/>Commandes</a>
          <button onClick={()=>void fetchInventory(activeSearch,lowStockOnly)} disabled={loading}><RefreshCw size={15}/>{loading?"Actualisation...":"Actualiser"}</button>
          <button onClick={logout}><LogOut size={15}/>Quitter</button>
        </div>
      </section>

      <section className="inventory-metrics exact-shell">
        <article><Boxes size={21}/><span><small>SKU affichés</small><b>{metrics.skuCount}</b></span></article>
        <article className={metrics.lowStock?"warning":""}><AlertTriangle size={21}/><span><small>Stock faible / rupture</small><b>{metrics.lowStock}</b></span></article>
        <article><PackageCheck size={21}/><span><small>Stock physique</small><b>{metrics.physical}</b></span></article>
        <article><ShoppingBag size={21}/><span><small>Réservé</small><b>{metrics.reserved}</b></span></article>
        <article><CheckCircle2 size={21}/><span><small>Vendu / livré</small><b>{metrics.sold}</b></span></article>
      </section>

      <section className="inventory-toolbar exact-shell">
        <form onSubmit={runSearch}>
          <Search size={16}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Produit, marque, configuration ou couleur..."/>
          <button type="submit">Rechercher</button>
        </form>
        <label className={lowStockOnly?"active":""}>
          <input type="checkbox" checked={lowStockOnly} onChange={e=>setLowStockOnly(e.target.checked)}/>
          <AlertTriangle size={15}/>
          Stock faible uniquement
        </label>
      </section>

      {error&&<div className="admin-error exact-shell">{error}</div>}
      {notice&&<div className="admin-shipping-notice exact-shell"><CheckCircle2 size={17}/>{notice}</div>}

      <section className="inventory-layout exact-shell">
        <div className="inventory-list">
          {loading&&!inventory.length?(
            <div className="admin-empty">Chargement du stock...</div>
          ):inventory.length?inventory.map(row=>{
            const draft=drafts[row.id]||draftFrom(row);
            return (
              <article className={row.lowStock?"inventory-row low":"inventory-row"} key={row.id}>
                <div className="inventory-product">
                  <span>{row.brand}</span>
                  <b>{row.productName}</b>
                  <small>{row.variant} · {row.color}</small>
                </div>
                <div className="inventory-balances">
                  <p><span>Physique</span><b>{row.physicalQty}</b></p>
                  <p><span>Réservé</span><b>{row.reservedQty}</b></p>
                  <p className={row.availableQty<=0?"danger":row.lowStock?"warning":""}><span>Disponible</span><b>{row.availableQty}</b></p>
                  <p><span>Vendu</span><b>{row.soldQty}</b></p>
                </div>
                <div className="inventory-edit">
                  <label><span>Stock physique</span><input type="number" min={row.reservedQty} value={draft.physicalQty} onChange={e=>setDraft(row.id,"physicalQty",e.target.value)}/></label>
                  <label><span>Seuil alerte</span><input type="number" min="0" value={draft.lowStockThreshold} onChange={e=>setDraft(row.id,"lowStockThreshold",e.target.value)}/></label>
                  <label className="reason"><span>Raison</span><input value={draft.reason} onChange={e=>setDraft(row.id,"reason",e.target.value)} placeholder="Réception fournisseur, correction..."/></label>
                  <button onClick={()=>void saveRow(row)} disabled={saving===row.id}><Save size={14}/>{saving===row.id?"...":"Enregistrer"}</button>
                </div>
              </article>
            );
          }):(
            <div className="admin-empty"><Boxes size={28}/><h2>Aucun SKU trouvé</h2><p>Modifiez la recherche ou le filtre de stock faible.</p></div>
          )}
        </div>

        <aside className="inventory-movements">
          <div className="inventory-movements-head">
            <span>MOUVEMENTS RÉCENTS</span>
            <h2>Historique du stock</h2>
            <p>Réservations, libérations, ventes livrées et ajustements manuels.</p>
          </div>
          <div className="inventory-movement-list">
            {movements.length?movements.map(move=>(
              <article key={move.id}>
                <div>
                  <b>{movementLabel(move.movementType)}</b>
                  <small>{dateTime(move.createdAt)}</small>
                </div>
                <strong>{move.productName}</strong>
                <span>{move.variant} · {move.color}</span>
                <p>
                  {move.physicalDelta!==0&&<em>Phys. {signed(move.physicalDelta)}</em>}
                  {move.reservedDelta!==0&&<em>Rés. {signed(move.reservedDelta)}</em>}
                  {move.soldDelta!==0&&<em>Vendu {signed(move.soldDelta)}</em>}
                </p>
                <small>{move.reason||"—"}{move.actorLabel?" · "+move.actorLabel:""}</small>
              </article>
            )):<div className="inventory-no-movement">Aucun mouvement pour le moment.</div>}
          </div>
        </aside>
      </section>
    </main>
  );
}
