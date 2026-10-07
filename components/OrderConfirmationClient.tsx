"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";

type OrderStatus="NOUVEAU"|"CONFIRME"|"EXPEDIE"|"LIVRE"|"ANNULE";

type OrderItem={
  id:string;
  slug:string;
  brand:string;
  name:string;
  variant:string;
  color:string;
  quantity:number;
  unitPriceMad:number;
  lineTotalMad:number;
};

type SavedOrder={
  id:string;
  orderNumber:string;
  status:OrderStatus;
  customerName:string;
  phone:string;
  city:string;
  address:string;
  note:string|null;
  subtotalMad:number;
  shippingMad:number;
  totalMad:number;
  paymentMethod:string;
  source:string;
  createdAt:string;
  updatedAt:string;
  items:OrderItem[];
};

type StoredConfirmation={
  order:SavedOrder;
  phone:string;
  whatsappUrl?:string;
};

const statusCopy:Record<OrderStatus,{label:string;detail:string}>={
  NOUVEAU:{label:"Commande reçue",detail:"Votre commande a bien été enregistrée et attend la confirmation de LHAWTA."},
  CONFIRME:{label:"Commande confirmée",detail:"Votre commande est confirmée et sera préparée pour l’expédition."},
  EXPEDIE:{label:"Commande expédiée",detail:"Votre commande a quitté la préparation et est en cours d’acheminement."},
  LIVRE:{label:"Commande livrée",detail:"La commande est indiquée comme livrée."},
  ANNULE:{label:"Commande annulée",detail:"Cette commande a été annulée."},
};

function money(value:number){
  return new Intl.NumberFormat("fr-MA").format(value)+" DH";
}

export default function OrderConfirmationClient(){
  const [stored,setStored]=useState<StoredConfirmation|null>(null);
  const [ready,setReady]=useState(false);
  const [requestedOrder,setRequestedOrder]=useState("");

  useEffect(()=>{
    const queryOrder=new URLSearchParams(window.location.search).get("order")?.trim()||"";
    setRequestedOrder(queryOrder);

    try{
      const raw=window.sessionStorage.getItem("lhawta-last-order-v1");
      if(raw){
        const parsed=JSON.parse(raw) as StoredConfirmation;
        if(parsed?.order?.orderNumber&&(!queryOrder||parsed.order.orderNumber===queryOrder)){
          setStored(parsed);
        }
      }
    }catch{}

    setReady(true);
  },[]);

  const order=stored?.order||null;
  const status=order?statusCopy[order.status]:null;
  const itemCount=useMemo(
    ()=>order?.items.reduce((sum,item)=>sum+item.quantity,0)||0,
    [order]
  );

  return (
    <main className="exact-page order-confirmation-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="order-confirmation-hero">
        <div className="exact-shell">
          <div className="order-confirmation-icon"><CheckCircle2 size={34}/></div>
          <span>COMMANDE ENREGISTRÉE</span>
          <h1>Merci pour votre commande.</h1>
          <p>Votre demande a bien été transmise à LHAWTA. Conservez votre numéro de commande pour suivre son avancement.</p>
        </div>
      </section>

      <section className="exact-shell order-confirmation-layout">
        {!ready?(
          <div className="order-confirmation-loading">Chargement de votre commande…</div>
        ):order&&status?(
          <>
            <div className="order-confirmation-main">
              <section className="order-confirmation-card order-confirmation-summary">
                <div className="order-confirmation-card-head">
                  <div>
                    <span>NUMÉRO DE COMMANDE</span>
                    <h2>{order.orderNumber}</h2>
                    <small>{new Date(order.createdAt).toLocaleString("fr-MA",{dateStyle:"long",timeStyle:"short"})}</small>
                  </div>
                  <div className={"order-confirmation-status status-"+order.status.toLowerCase()}>
                    <PackageCheck size={18}/>
                    <span><b>{status.label}</b><small>{status.detail}</small></span>
                  </div>
                </div>

                <div className="order-confirmation-items">
                  <div className="order-confirmation-section-title">
                    <span>ARTICLES</span>
                    <strong>{itemCount} article{itemCount>1?"s":""}</strong>
                  </div>
                  {order.items.map(item=>(
                    <a href={"/products/"+item.slug} className="order-confirmation-item" key={item.id}>
                      <div>
                        <span>{item.brand}</span>
                        <h3>{item.name}</h3>
                        <p>{item.variant} · {item.color} · Qté {item.quantity}</p>
                      </div>
                      <strong>{money(item.lineTotalMad)}</strong>
                    </a>
                  ))}
                </div>

                <div className="order-confirmation-total">
                  <p><span>Sous-total</span><b>{money(order.subtotalMad)}</b></p>
                  <p><span>Livraison</span><b>{order.shippingMad?money(order.shippingMad):"À confirmer"}</b></p>
                  <div><span>Total produits</span><strong>{money(order.totalMad)}</strong></div>
                </div>
              </section>

              <section className="order-confirmation-card order-confirmation-delivery">
                <div className="order-confirmation-section-title">
                  <span>LIVRAISON & PAIEMENT</span>
                  <Truck size={19}/>
                </div>
                <div className="order-confirmation-info-grid">
                  <article><User size={18}/><div><small>Client</small><b>{order.customerName}</b></div></article>
                  <article><Phone size={18}/><div><small>Téléphone</small><b>{order.phone}</b></div></article>
                  <article><MapPin size={18}/><div><small>Ville</small><b>{order.city}</b></div></article>
                  <article className="wide"><MapPin size={18}/><div><small>Adresse de livraison</small><b>{order.address}</b></div></article>
                  <article><CreditCard size={18}/><div><small>Paiement</small><b>Paiement à la livraison</b></div></article>
                  <article><PackageCheck size={18}/><div><small>Statut</small><b>{status.label}</b></div></article>
                </div>
                {order.note&&<div className="order-confirmation-note"><small>NOTE CLIENT</small><p>{order.note}</p></div>}
              </section>
            </div>

            <aside className="order-confirmation-side">
              <section>
                <span>PROCHAINES ÉTAPES</span>
                <h3>Votre commande est bien enregistrée.</h3>
                <p>LHAWTA confirmera les détails de livraison avant expédition. Le paiement reste à la livraison.</p>
                <a href={"/account"} className="primary">Suivre ma commande <ArrowRight size={15}/></a>
                <a href="/products">Continuer mes achats <ShoppingBag size={15}/></a>
                {stored?.whatsappUrl&&(
                  <a href={stored.whatsappUrl} target="_blank" rel="noreferrer">
                    Ouvrir WhatsApp <MessageCircle size={15}/>
                  </a>
                )}
              </section>
            </aside>
          </>
        ):(
          <div className="order-confirmation-missing">
            <PackageCheck size={34}/>
            <span>CONFIRMATION DE COMMANDE</span>
            <h2>{requestedOrder||"Commande enregistrée"}</h2>
            <p>Les détails de cette commande ne sont plus disponibles dans cet onglet. Vous pouvez la retrouver depuis votre espace client avec le numéro de commande et le téléphone utilisés lors de l’achat.</p>
            <div>
              <a href="/account" className="primary">Suivre la commande</a>
              <a href="/products">Continuer mes achats</a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
