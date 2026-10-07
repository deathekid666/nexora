"use client";

import {
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  PackageCheck,
  Phone,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import {
  clearCustomerProfile,
  emptyCustomerProfile,
  readCustomerProfile,
  writeCustomerProfile,
  type CustomerProfile,
} from "@/lib/customer-profile";

type OrderStatus="NOUVEAU"|"CONFIRME"|"EXPEDIE"|"LIVRE"|"ANNULE";
type CustomerOrder={
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
  items:{
    id:string;
    slug:string;
    brand:string;
    name:string;
    variant:string;
    color:string;
    quantity:number;
    unitPriceMad:number;
    lineTotalMad:number;
  }[];
};

const statusSteps=[
  {key:"NOUVEAU",label:"Reçue"},
  {key:"CONFIRME",label:"Confirmée"},
  {key:"EXPEDIE",label:"Expédiée"},
  {key:"LIVRE",label:"Livrée"},
] as const;

function money(value:number){
  return new Intl.NumberFormat("fr-MA").format(value)+" DH";
}

function statusIndex(status:OrderStatus){
  if(status==="ANNULE") return -1;
  return statusSteps.findIndex(step=>step.key===status);
}

export default function AccountPageClient(){
  const [profile,setProfile]=useState<CustomerProfile>(emptyCustomerProfile);
  const [saved,setSaved]=useState(false);
  const [lookup,setLookup]=useState({orderNumber:"",phone:""});
  const [lookupError,setLookupError]=useState("");
  const [loading,setLoading]=useState(false);
  const [order,setOrder]=useState<CustomerOrder|null>(null);

  useEffect(()=>{
    const stored=readCustomerProfile();
    setProfile(stored);
    if(stored.phone) setLookup(current=>({...current,phone:stored.phone}));
  },[]);

  const profileComplete=useMemo(
    ()=>Boolean(profile.name.trim()&&profile.phone.trim()&&profile.city.trim()&&profile.address.trim()),
    [profile]
  );

  const saveProfile=(event:FormEvent)=>{
    event.preventDefault();
    writeCustomerProfile(profile);
    setProfile(readCustomerProfile());
    setSaved(true);
    window.setTimeout(()=>setSaved(false),1800);
  };

  const resetProfile=()=>{
    clearCustomerProfile();
    setProfile(emptyCustomerProfile);
    setLookup(current=>({...current,phone:""}));
    setSaved(false);
  };

  const trackOrder=async(event:FormEvent)=>{
    event.preventDefault();
    setLookupError("");
    setOrder(null);

    if(!lookup.orderNumber.trim()||lookup.phone.replace(/\D/g,"").length<8){
      setLookupError("Entrez le numéro de commande et le téléphone utilisé lors de l’achat.");
      return;
    }

    setLoading(true);
    try{
      const response=await fetch("/api/orders/lookup",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(lookup),
      });
      const payload=await response.json().catch(()=>({}));
      if(!response.ok||!payload?.order){
        setLookupError(payload?.message||"Commande introuvable.");
        return;
      }
      setOrder(payload.order);
    }catch{
      setLookupError("Impossible de vérifier la commande pour le moment.");
    }finally{
      setLoading(false);
    }
  };

  const currentStep=order?statusIndex(order.status):-1;

  return (
    <main className="exact-page account-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="account-hero">
        <div className="exact-shell account-hero-inner">
          <div>
            <span><User size={15}/> ESPACE CLIENT LHAWTA</span>
            <h1>Votre espace client</h1>
            <p>Enregistrez vos coordonnées de livraison sur cet appareil et suivez vos commandes avec votre numéro de commande.</p>
          </div>
          <div className="account-hero-security">
            <ShieldCheck size={24}/>
            <span><b>Simple et privé</b><small>Vos coordonnées enregistrées restent dans ce navigateur.</small></span>
          </div>
        </div>
      </section>

      <section className="exact-shell account-layout">
        <div className="account-main">
          <section className="account-panel">
            <div className="account-panel-head">
              <div>
                <span>MES INFORMATIONS</span>
                <h2>Coordonnées de livraison</h2>
                <p>Ces informations prérempliront votre prochaine commande sur cet appareil.</p>
              </div>
              <div className={profileComplete?"account-profile-state ready":"account-profile-state"}>
                <CheckCircle2 size={16}/>
                <span>{profileComplete?"Profil prêt":"À compléter"}</span>
              </div>
            </div>

            <form className="account-profile-form" onSubmit={saveProfile}>
              <label>
                <span><User size={14}/> Nom complet</span>
                <input
                  value={profile.name}
                  onChange={event=>setProfile({...profile,name:event.target.value})}
                  placeholder="Votre nom"
                />
              </label>
              <label>
                <span><Phone size={14}/> Téléphone</span>
                <input
                  value={profile.phone}
                  onChange={event=>setProfile({...profile,phone:event.target.value})}
                  placeholder="06 XX XX XX XX"
                  inputMode="tel"
                />
              </label>
              <label>
                <span><MapPin size={14}/> Ville</span>
                <input
                  value={profile.city}
                  onChange={event=>setProfile({...profile,city:event.target.value})}
                  placeholder="Casablanca, Rabat, Marrakech..."
                />
              </label>
              <label className="wide">
                <span><MapPin size={14}/> Adresse</span>
                <textarea
                  value={profile.address}
                  onChange={event=>setProfile({...profile,address:event.target.value})}
                  placeholder="Quartier, rue, immeuble, appartement..."
                />
              </label>

              <div className="account-profile-actions">
                <button type="submit"><Save size={15}/>{saved?"Enregistré":"Enregistrer"}</button>
                {(profile.name||profile.phone||profile.city||profile.address)&&(
                  <button type="button" className="secondary" onClick={resetProfile}><RotateCcw size={14}/> Effacer</button>
                )}
              </div>
            </form>
          </section>

          <section className="account-panel account-orders-panel">
            <div className="account-panel-head">
              <div>
                <span>SUIVI DE COMMANDE</span>
                <h2>Où en est ma commande ?</h2>
                <p>Utilisez le numéro LHW reçu à la commande et le même numéro de téléphone.</p>
              </div>
              <PackageCheck size={25}/>
            </div>

            <form className="account-order-lookup" onSubmit={trackOrder}>
              <label>
                <span>Numéro de commande</span>
                <input
                  value={lookup.orderNumber}
                  onChange={event=>setLookup({...lookup,orderNumber:event.target.value})}
                  placeholder="LHW-2026-01001"
                  autoCapitalize="characters"
                />
              </label>
              <label>
                <span>Téléphone</span>
                <input
                  value={lookup.phone}
                  onChange={event=>setLookup({...lookup,phone:event.target.value})}
                  placeholder="06 XX XX XX XX"
                  inputMode="tel"
                />
              </label>
              <button type="submit" disabled={loading}><Search size={15}/>{loading?"Vérification...":"Suivre la commande"}</button>
            </form>

            {lookupError&&<div className="account-order-error">{lookupError}</div>}

            {order&&(
              <div className="account-order-card">
                <div className="account-order-card-head">
                  <div>
                    <small>COMMANDE</small>
                    <h3>{order.orderNumber}</h3>
                    <span>{new Date(order.createdAt).toLocaleDateString("fr-MA",{day:"2-digit",month:"long",year:"numeric"})}</span>
                  </div>
                  <strong className={"account-order-status status-"+order.status.toLowerCase()}>{order.status}</strong>
                </div>

                {order.status==="ANNULE"?(
                  <div className="account-order-cancelled">Cette commande a été annulée.</div>
                ):(
                  <div className="account-order-progress">
                    {statusSteps.map((step,index)=>(
                      <div className={index<=currentStep?"done":""} key={step.key}>
                        <i>{index<currentStep?<CheckCircle2 size={16}/>:index+1}</i>
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="account-order-items">
                  {order.items.map(item=>(
                    <a href={"/products/"+item.slug} key={item.id}>
                      <span><b>{item.brand} {item.name}</b><small>{item.variant} · {item.color} · Qté {item.quantity}</small></span>
                      <strong>{money(item.lineTotalMad)}</strong>
                    </a>
                  ))}
                </div>

                <div className="account-order-summary">
                  <p><span>Livraison</span><b>{order.city}</b></p>
                  <p><span>Paiement</span><b>Paiement à la livraison</b></p>
                  <p className="total"><span>Total</span><strong>{money(order.totalMad)}</strong></p>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="account-side">
          <section>
            <span>ACCÈS RAPIDES</span>
            <a href="/favorites"><Heart size={18}/><div><b>Mes favoris</b><small>Retrouver les produits enregistrés</small></div><ChevronRight size={16}/></a>
            <a href="/cart"><ShoppingCart size={18}/><div><b>Mon panier</b><small>Continuer ma commande</small></div><ChevronRight size={16}/></a>
            <a href="/#products"><PackageCheck size={18}/><div><b>Nouveautés</b><small>Voir les derniers produits</small></div><ChevronRight size={16}/></a>
          </section>

          <section className="account-help">
            <Truck size={21}/>
            <h3>Commande & livraison</h3>
            <p>Le statut affiché ici vient directement de la commande enregistrée par LHAWTA.</p>
            <small>Le suivi transporteur détaillé pourra être ajouté lorsque l’intégration logistique sera connectée.</small>
          </section>
        </aside>
      </section>
    </main>
  );
}
