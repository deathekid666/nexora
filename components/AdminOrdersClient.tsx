"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  LogOut,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import type { OrderStatus, SavedOrder } from "@/lib/order-db";

const STATUS_OPTIONS:[
  {value:"ALL";label:string},
  ...Array<{value:OrderStatus;label:string}>
]=[
  {value:"ALL",label:"Tous les statuts"},
  {value:"NOUVEAU",label:"Nouveau"},
  {value:"CONFIRME",label:"Confirmé"},
  {value:"EXPEDIE",label:"Expédié"},
  {value:"LIVRE",label:"Livré"},
  {value:"ANNULE",label:"Annulé"},
];

const STATUS_LABEL:Record<OrderStatus,string>={
  NOUVEAU:"Nouveau",
  CONFIRME:"Confirmé",
  EXPEDIE:"Expédié",
  LIVRE:"Livré",
  ANNULE:"Annulé",
};

function formatDh(value:number){
  return new Intl.NumberFormat("fr-MA").format(value)+" DH";
}

function dateTime(value:string){
  try{
    return new Intl.DateTimeFormat("fr-MA",{
      dateStyle:"medium",
      timeStyle:"short",
    }).format(new Date(value));
  }catch{
    return value;
  }
}

function whatsappPhone(phone:string){
  let digits=phone.replace(/\D/g,"");
  if(digits.startsWith("00")) digits=digits.slice(2);
  if(digits.startsWith("0")) digits="212"+digits.slice(1);
  return digits;
}

export default function AdminOrdersClient(){
  const [token,setToken]=useState("");
  const [tokenInput,setTokenInput]=useState("");
  const [orders,setOrders]=useState<SavedOrder[]>([]);
  const [search,setSearch]=useState("");
  const [activeSearch,setActiveSearch]=useState("");
  const [status,setStatus]=useState<"ALL"|OrderStatus>("ALL");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [expanded,setExpanded]=useState<string>("");

  useEffect(()=>{
    const saved=window.sessionStorage.getItem("lhawta-admin-token")||"";
    if(saved){
      setToken(saved);
      setTokenInput(saved);
    }
  },[]);

  const fetchOrders=async(nextToken=token,nextSearch=activeSearch,nextStatus=status)=>{
    if(!nextToken) return;
    setLoading(true);
    setError("");
    try{
      const qs=new URLSearchParams();
      if(nextSearch) qs.set("search",nextSearch);
      if(nextStatus!=="ALL") qs.set("status",nextStatus);
      const response=await fetch("/api/orders?"+qs.toString(),{
        cache:"no-store",
        headers:{authorization:"Bearer "+nextToken},
      });
      const payload=await response.json().catch(()=>({}));
      if(response.status===401){
        setError("Clé admin incorrecte.");
        setOrders([]);
        return;
      }
      if(payload?.error==="DATABASE_NOT_CONFIGURED"){
        setError("La base Neon des commandes n’est pas encore connectée à ce preview.");
        setOrders([]);
        return;
      }
      if(!response.ok){
        setError("Impossible de charger les commandes.");
        return;
      }
      setOrders(Array.isArray(payload.orders)?payload.orders:[]);
    }catch{
      setError("Impossible de joindre le serveur des commandes.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(token) void fetchOrders(token,activeSearch,status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,status]);

  const login=(event:FormEvent)=>{
    event.preventDefault();
    const value=tokenInput.trim();
    if(!value) return;
    window.sessionStorage.setItem("lhawta-admin-token",value);
    setToken(value);
  };

  const logout=()=>{
    window.sessionStorage.removeItem("lhawta-admin-token");
    setToken("");
    setTokenInput("");
    setOrders([]);
    setError("");
  };

  const runSearch=(event:FormEvent)=>{
    event.preventDefault();
    setActiveSearch(search.trim());
    void fetchOrders(token,search.trim(),status);
  };

  const updateStatus=async(order:SavedOrder,nextStatus:OrderStatus)=>{
    setError("");
    try{
      const response=await fetch("/api/orders/"+order.id,{
        method:"PATCH",
        headers:{
          "content-type":"application/json",
          authorization:"Bearer "+token,
        },
        body:JSON.stringify({status:nextStatus}),
      });
      const payload=await response.json().catch(()=>({}));
      if(!response.ok||!payload.order){
        setError("Impossible de modifier le statut de "+order.orderNumber+".");
        return;
      }
      setOrders(current=>current.map(item=>item.id===order.id?payload.order:item));
    }catch{
      setError("Impossible de modifier cette commande.");
    }
  };

  const metrics=useMemo(()=>{
    const totalValue=orders.reduce((sum,order)=>sum+order.totalMad,0);
    const delivered=orders.filter(order=>order.status==="LIVRE").reduce((sum,order)=>sum+order.totalMad,0);
    const newCount=orders.filter(order=>order.status==="NOUVEAU").length;
    const itemCount=orders.reduce((sum,order)=>sum+order.items.reduce((n,item)=>n+item.quantity,0),0);
    return {totalValue,delivered,newCount,itemCount};
  },[orders]);

  if(!token){
    return (
      <main className="exact-page admin-orders-page">
        <SiteMotion/>
        <StoreHeader/>
        <section className="admin-login exact-shell">
          <div className="admin-login-card">
            <ShieldCheck size={34}/>
            <span>ADMIN LHAWTA</span>
            <h1>Gestion des commandes</h1>
            <p>Entrez la clé admin du preview pour accéder aux commandes COD.</p>
            <form onSubmit={login}>
              <label>Clé admin
                <input
                  type="password"
                  value={tokenInput}
                  onChange={e=>setTokenInput(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Clé du preview"
                />
              </label>
              <button type="submit">Ouvrir le dashboard</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="exact-page admin-orders-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="admin-orders-head exact-shell">
        <div>
          <span>ADMIN LHAWTA</span>
          <h1>Commandes COD</h1>
          <p>Suivez les commandes, contactez les clients et mettez à jour leur statut.</p>
        </div>
        <div className="admin-head-actions">
          <button onClick={()=>void fetchOrders()} disabled={loading}><RefreshCw size={15}/>{loading?"Actualisation...":"Actualiser"}</button>
          <button onClick={logout}><LogOut size={15}/>Quitter</button>
        </div>
      </section>

      <section className="admin-metrics exact-shell">
        <article><ClipboardList size={21}/><span><small>Commandes affichées</small><b>{orders.length}</b></span></article>
        <article><PackageCheck size={21}/><span><small>Nouvelles</small><b>{metrics.newCount}</b></span></article>
        <article><CircleDollarSign size={21}/><span><small>Valeur affichée</small><b>{formatDh(metrics.totalValue)}</b></span></article>
        <article><Truck size={21}/><span><small>CA livré</small><b>{formatDh(metrics.delivered)}</b></span></article>
      </section>

      <section className="admin-toolbar exact-shell">
        <form onSubmit={runSearch} className="admin-search">
          <Search size={16}/>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Commande, nom, téléphone ou ville..."
          />
          <button type="submit">Rechercher</button>
        </form>
        <label className="admin-status-filter">
          <select value={status} onChange={e=>setStatus(e.target.value as "ALL"|OrderStatus)}>
            {STATUS_OPTIONS.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
          <ChevronDown size={15}/>
        </label>
      </section>

      {error&&<div className="admin-error exact-shell">{error}</div>}

      <section className="admin-orders-list exact-shell">
        {loading&&!orders.length ? (
          <div className="admin-empty">Chargement des commandes...</div>
        ) : orders.length ? orders.map(order=>{
          const isOpen=expanded===order.id;
          const phone=whatsappPhone(order.phone);
          const message=encodeURIComponent("Bonjour "+order.customerName+", concernant votre commande LHAWTA "+order.orderNumber+" :");
          return (
            <article className="admin-order-card" key={order.id}>
              <div className="admin-order-main">
                <button className="admin-order-id" onClick={()=>setExpanded(isOpen?"":order.id)}>
                  <span>{order.orderNumber}</span>
                  <small>{dateTime(order.createdAt)}</small>
                </button>

                <div className="admin-customer">
                  <b>{order.customerName}</b>
                  <span>{order.phone} · {order.city}</span>
                </div>

                <div className="admin-order-value">
                  <b>{formatDh(order.totalMad)}</b>
                  <span>{order.items.reduce((sum,item)=>sum+item.quantity,0)} article(s)</span>
                </div>

                <label className={"admin-status status-"+order.status.toLowerCase()}>
                  <select value={order.status} onChange={e=>void updateStatus(order,e.target.value as OrderStatus)}>
                    {STATUS_OPTIONS.filter(option=>option.value!=="ALL").map(option=>(
                      <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14}/>
                </label>

                <a className="admin-whatsapp" href={"https://wa.me/"+phone+"?text="+message} target="_blank" rel="noreferrer">
                  <MessageCircle size={16}/>WhatsApp
                </a>
              </div>

              {isOpen&&(
                <div className="admin-order-details">
                  <div className="admin-order-items">
                    <h3>Produits</h3>
                    {order.items.map(item=>(
                      <div key={item.id}>
                        <span><b>{item.brand} {item.name}</b><small>{item.variant} · {item.color}</small></span>
                        <span>{item.quantity} × {formatDh(item.unitPriceMad)}</span>
                        <strong>{formatDh(item.lineTotalMad)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="admin-delivery">
                    <h3>Livraison</h3>
                    <p><span>Téléphone</span><b>{order.phone}</b></p>
                    <p><span>Ville</span><b>{order.city}</b></p>
                    <p><span>Adresse</span><b>{order.address}</b></p>
                    {order.note&&<p><span>Note</span><b>{order.note}</b></p>}
                    <p><span>Paiement</span><b>Paiement à la livraison</b></p>
                  </div>
                </div>
              )}
            </article>
          );
        }) : (
          <div className="admin-empty">
            <CheckCircle2 size={27}/>
            <h2>Aucune commande trouvée</h2>
            <p>Les nouvelles commandes COD apparaîtront ici.</p>
          </div>
        )}
      </section>
    </main>
  );
}
