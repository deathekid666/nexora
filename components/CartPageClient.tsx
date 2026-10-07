"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import { ProductVisual } from "@/components/ProductVisual";
import {
  cartTotal,
  formatDh,
  readCart,
  writeCart,
  type CartItem,
} from "@/lib/cart-client";
import { readCustomerProfile, writeCustomerProfile } from "@/lib/customer-profile";
import { inventoryKey, loadInventoryRows } from "@/lib/inventory-client";

const WHATSAPP_NUMBER=(process.env.NEXT_PUBLIC_LHAWTA_WHATSAPP || "").replace(/\D/g,"");
const WHATSAPP_READY=/^\d{10,15}$/.test(WHATSAPP_NUMBER);

export default function CartPageClient(){
  const [items,setItems]=useState<CartItem[]>([]);
  const [customer,setCustomer]=useState({
    name:"",
    phone:"",
    city:"",
    address:"",
    note:"",
  });
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [createdOrder,setCreatedOrder]=useState<string>("");
  const [stockByKey,setStockByKey]=useState<Record<string,number>>({});
  const [stockChecking,setStockChecking]=useState(false);

  useEffect(()=>{
    setItems(readCart());
    const profile=readCustomerProfile();
    if(profile.name||profile.phone||profile.city||profile.address){
      setCustomer(current=>({
        ...current,
        name:profile.name,
        phone:profile.phone,
        city:profile.city,
        address:profile.address,
      }));
    }
  },[]);

  const total=useMemo(()=>cartTotal(items),[items]);
  const count=useMemo(()=>items.reduce((sum,item)=>sum+item.qty,0),[items]);
  const stockSignature=useMemo(
    ()=>[...new Set(items.map(item=>[item.slug,item.variant,item.color].join("|")))].sort().join("~"),
    [items]
  );

  useEffect(()=>{
    let active=true;
    const slugs=[...new Set(items.map(item=>item.slug))];
    if(!slugs.length){
      setStockByKey({});
      setStockChecking(false);
      return;
    }
    setStockChecking(true);
    void Promise.all(slugs.map(async slug=>({slug,rows:await loadInventoryRows(slug)}))).then(results=>{
      if(!active) return;
      const next:Record<string,number>={};
      for(const result of results){
        for(const row of result.rows){
          next[inventoryKey(result.slug,row.variant,row.color)]=row.availableQty;
        }
      }
      setStockByKey(next);
      setStockChecking(false);
    });
    return ()=>{active=false;};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[stockSignature]);

  const update=(next:CartItem[])=>{
    setItems(next);
    writeCart(next);
  };

  const quantity=(index:number,delta:number)=>{
    const item=items[index];
    if(!item) return;
    const available=stockByKey[inventoryKey(item.slug,item.variant,item.color)];
    if(delta>0&&available!==undefined&&item.qty>=available){
      setError("Quantité maximale disponible atteinte pour "+item.name+".");
      return;
    }
    setError("");
    const next=items.map((current,i)=>i===index?{...current,qty:Math.max(1,current.qty+delta)}:current);
    update(next);
  };

  const remove=(index:number)=>{
    update(items.filter((_,i)=>i!==index));
  };

  const orderOnWhatsApp=async(event:FormEvent)=>{
    event.preventDefault();
    setError("");
    setCreatedOrder("");

    if(!items.length){
      setError("Votre panier est vide.");
      return;
    }

    const shortage=items.find(item=>{
      const available=stockByKey[inventoryKey(item.slug,item.variant,item.color)];
      return available!==undefined&&item.qty>available;
    });
    if(shortage){
      setError("Stock insuffisant pour "+shortage.name+". Ajustez la quantité puis réessayez.");
      return;
    }

    if(!WHATSAPP_READY){
      setError("Le numéro WhatsApp de la boutique doit être configuré avant de pouvoir envoyer une commande.");
      return;
    }

    if(!customer.name.trim()||!customer.phone.trim()||!customer.city.trim()||!customer.address.trim()){
      setError("Nom, téléphone, ville et adresse sont obligatoires pour une commande à la livraison.");
      return;
    }

    setSubmitting(true);
    const whatsappWindow=window.open("about:blank","_blank");

    try{
      const response=await fetch("/api/orders",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          customer,
          items:items.map(item=>({
            slug:item.slug,
            variant:item.variant,
            color:item.color,
            qty:item.qty,
          })),
        }),
      });

      const payload=await response.json().catch(()=>({}));
      if(!response.ok||!payload?.order){
        if(whatsappWindow) whatsappWindow.close();
        if(payload?.error==="DATABASE_NOT_CONFIGURED"){
          setError("La base de commandes n’est pas encore connectée à ce preview.");
        }else if(payload?.error==="OUT_OF_STOCK"){
          setError(payload?.message||"Un article n’est plus disponible dans la quantité demandée.");
        }else{
          setError(payload?.message||"Impossible d’enregistrer la commande.");
        }
        return;
      }

      const order=payload.order;
      writeCustomerProfile({
        name:customer.name,
        phone:customer.phone,
        city:customer.city,
        address:customer.address,
      });
      const lines=[
        "Bonjour LHAWTA, je souhaite confirmer cette commande en paiement à la livraison :",
        "",
        "Commande : "+order.orderNumber,
        "",
        ...items.flatMap((item,index)=>[
          (index+1)+". "+item.brand+" "+item.name,
          "   Configuration : "+item.variant,
          "   Couleur : "+item.color,
          "   Quantité : "+item.qty,
          "   Prix : "+item.price,
        ]),
        "",
        "Total : "+formatDh(order.totalMad),
        "",
        "Informations client :",
        "Nom : "+customer.name.trim(),
        "Téléphone : "+customer.phone.trim(),
        "Ville : "+customer.city.trim(),
        "Adresse : "+customer.address.trim(),
        customer.note.trim()?"Note : "+customer.note.trim():"",
        "",
        "Mode de paiement : Paiement à la livraison",
      ].filter(Boolean);

      const url="https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(lines.join("\n"));
      setCreatedOrder(order.orderNumber);

      try{
        window.sessionStorage.setItem("lhawta-last-order-v1",JSON.stringify({
          order,
          phone:customer.phone.trim(),
          whatsappUrl:url,
        }));
      }catch{}

      update([]);
      if(whatsappWindow) whatsappWindow.location.href=url;
      window.location.assign("/order-confirmation?order="+encodeURIComponent(order.orderNumber));
    }catch(error){
      if(whatsappWindow) whatsappWindow.close();
      console.error(error);
      setError("Impossible d’enregistrer la commande. Réessayez.");
    }finally{
      setSubmitting(false);
    }
  };

  return (
    <main className="exact-page cart-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="cart-head exact-shell">
        <a href="/"><ArrowLeft size={15}/>Continuer mes achats</a>
        <span>MON PANIER</span>
        <h1>Votre commande</h1>
        <p>{count} article{count>1?"s":""} · paiement à la livraison disponible.</p>
      </section>

      <section className="cart-layout exact-shell">
        <div className="cart-items">
          {items.length ? items.map((item,index)=>(
            <article className="cart-item" key={[item.slug,item.variant,item.color].join("|")}>
              <a href={"/products/"+item.slug} className="cart-item-image">
                <ProductVisual src={item.image} alt={item.name}/>
              </a>
              <div className="cart-item-copy">
                <span>{item.brand}</span>
                <a href={"/products/"+item.slug}><h2>{item.name}</h2></a>
                <p>{item.variant} · {item.color}</p>
                {(()=>{
                  const available=stockByKey[inventoryKey(item.slug,item.variant,item.color)];
                  return available===undefined
                    ?<small className="cart-stock-line checking">Stock en vérification...</small>
                    :available<=0
                      ?<small className="cart-stock-line out">Rupture de stock</small>
                      :<small className={"cart-stock-line "+(available<=2?"low":"ok")}>{available} disponible(s){available<=2?" · stock faible":""}</small>;
                })()}
                <b>{item.price}</b>
              </div>
              <div className="cart-qty">
                <small>Quantité</small>
                <div>
                  <button onClick={()=>quantity(index,-1)} aria-label="Réduire"><Minus size={14}/></button>
                  <strong>{item.qty}</strong>
                  <button
                    onClick={()=>quantity(index,1)}
                    aria-label="Augmenter"
                    disabled={(()=>{
                      const available=stockByKey[inventoryKey(item.slug,item.variant,item.color)];
                      return available!==undefined&&item.qty>=available;
                    })()}
                  ><Plus size={14}/></button>
                </div>
              </div>
              <button className="cart-remove" onClick={()=>remove(index)} aria-label="Supprimer">
                <Trash2 size={17}/>
              </button>
            </article>
          )) : (
            <div className="cart-empty">
              <ShoppingCart size={34}/>
              <h2>Votre panier est vide</h2>
              <p>Ajoutez un produit pour préparer votre commande.</p>
              <a href="/">Voir les produits</a>
            </div>
          )}
        </div>

        <aside className="cart-checkout">
          <div className="cart-summary">
            <span>RÉCAPITULATIF</span>
            <h2>Total de la commande</h2>
            <p><span>Sous-total</span><strong>{formatDh(total)}</strong></p>
            <p><span>Livraison</span><strong>Confirmée sur WhatsApp</strong></p>
            <div className="cart-total"><span>Total produits</span><strong>{formatDh(total)}</strong></div>
            <div className="cart-cod"><CheckCircle2 size={17}/><div><b>Paiement à la livraison</b><small>Vous payez après confirmation de la commande.</small></div></div>
          </div>

          <form className="cart-form" onSubmit={orderOnWhatsApp}>
            <div className="cart-form-head">
              <span>COMMANDE WHATSAPP</span>
              <h2>Informations de livraison</h2>
              <p>Remplissez vos coordonnées, puis envoyez automatiquement le récapitulatif à LHAWTA sur WhatsApp.</p>
              <small className="cart-required-note"><span>*</span> Champs obligatoires</small>
            </div>

            <label>Nom complet <span className="required-star" aria-hidden="true">*</span><input required value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Votre nom"/></label>
            <label>Téléphone <span className="required-star" aria-hidden="true">*</span><input required value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="06 XX XX XX XX" inputMode="tel"/></label>
            <label>Ville <span className="required-star" aria-hidden="true">*</span><input required value={customer.city} onChange={e=>setCustomer({...customer,city:e.target.value})} placeholder="Casablanca, Rabat, Marrakech..."/></label>
            <label>Adresse de livraison <span className="required-star" aria-hidden="true">*</span><textarea required value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})} placeholder="Quartier, rue, immeuble, appartement..."/></label>
            <label>Note <small>(optionnel)</small><textarea value={customer.note} onChange={e=>setCustomer({...customer,note:e.target.value})} placeholder="Précision sur la livraison..."/></label>

            {createdOrder&&<div className="cart-order-success"><CheckCircle2 size={17}/><span><b>Commande enregistrée</b><small>{createdOrder}</small></span></div>}
            {error&&<div className="cart-error">{error}</div>}

            <button className="cart-whatsapp" type="submit" disabled={!items.length || !WHATSAPP_READY || submitting || stockChecking}>
              {submitting?"Enregistrement...":"Commander sur WhatsApp"}
            </button>
            {!WHATSAPP_READY && <div className="cart-error" role="status">Le WhatsApp officiel de LHAWTA n’est pas encore renseigné. Votre panier reste enregistré ; aucune commande ne sera envoyée à un numéro de démonstration.</div>}

            <div className="cart-trust">
              <p><Truck size={16}/><span><b>Livraison partout au Maroc</b><small>Délai confirmé avant expédition.</small></span></p>
              <p><ShieldCheck size={16}/><span><b>Aucune carte bancaire requise</b><small>Paiement à la livraison.</small></span></p>
            </div>
          </form>
        </aside>
      </section>
    </main>
  );
}
