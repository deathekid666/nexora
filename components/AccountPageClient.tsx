"use client";

import {
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  PackageCheck,
  Phone,
  LogOut,
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

export default function AccountPageClient({isAdmin=false}:{isAdmin?:boolean}){
  const [profile,setProfile]=useState<CustomerProfile>(emptyCustomerProfile);
  const [saved,setSaved]=useState(false);
  const [lookup,setLookup]=useState({orderNumber:"",phone:""});
  const [lookupError,setLookupError]=useState("");
  const [loading,setLoading]=useState(false);
  const [order,setOrder]=useState<CustomerOrder|null>(null);
  const [myOrders,setMyOrders]=useState<CustomerOrder[]>([]);
  const [ordersLoading,setOrdersLoading]=useState(true);

  useEffect(()=>{
    const stored=readCustomerProfile();
    setProfile(stored);
    void (async()=>{
      try{
        const response=await fetch("/api/orders/mine",{cache:"no-store"});
        const payload=await response.json().catch(()=>({}));
        if(response.ok&&Array.isArray(payload.orders)){
          setMyOrders(payload.orders);
          setOrder(payload.orders[0]||null);
        }
      }catch{}finally{setOrdersLoading(false)}
    })();
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

  const resetProfile=async()=>{
    try{await fetch("/api/customer-auth",{method:"DELETE"});}catch{}

    clearCustomerProfile();
    setProfile(emptyCustomerProfile);
    setLookup({orderNumber:"",phone:""});
    setSaved(false);
    setOrder(null);
    setLookupError("");
    window.location.assign("/login");
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
            <p>Retrouvez ici les commandes passées pendant votre connexion, avec leur statut actualisé automatiquement.</p>
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
              </div>
            </form>
          </section>

          <section className="account-panel account-orders-panel">
            <div className="account-panel-head">
              <div>
                <span>SUIVI DE COMMANDE</span>
                <h2>Mes commandes</h2>
                <p>Vos commandes associées à ce compte apparaissent ici automatiquement, sans numéro de commande ni téléphone.</p>
              </div>
              <PackageCheck size={25}/>
            </div>

            {ordersLoading?(
              <div className="account-order-error">Chargement de vos commandes…</div>
            ):myOrders.length===0?(
              <div className="account-order-error">Aucune commande n’est encore associée à ce compte. Les commandes passées pendant votre connexion apparaîtront ici automatiquement. Pour une commande passée avant de vous connecter, utilisez le suivi invité avec le numéro et le téléphone de commande.</div>
            ):(
              <div className="account-order-history">
                {myOrders.map((item)=>{
                  const step=statusIndex(item.status);
                  return <article className="account-order-card" key={item.id}>
                    <div className="account-order-card-head">
                      <div><small>COMMANDE</small><h3>{item.orderNumber}</h3><span>{new Date(item.createdAt).toLocaleDateString("fr-MA",{day:"2-digit",month:"long",year:"numeric"})}</span></div>
                      <strong className={"account-order-status status-"+item.status.toLowerCase()}>{item.status}</strong>
                    </div>
                    {item.status==="ANNULE"?<div className="account-order-cancelled">Cette commande a été annulée.</div>:<div className="account-order-progress">{statusSteps.map((s,index)=><div className={index<=step?"done":""} key={s.key}><i>{index<step?<CheckCircle2 size={16}/>:index+1}</i><span>{s.label}</span></div>)}</div>}
                    <div className="account-order-items">{item.items.map(line=><a href={"/products/"+line.slug} key={line.id}><span><b>{line.brand} {line.name}</b><small>{line.variant} · {line.color} · Qté {line.quantity}</small></span><strong>{money(line.lineTotalMad)}</strong></a>)}</div>
                    <div className="account-order-summary"><p><span>Livraison</span><b>{item.city}</b></p><p><span>Paiement</span><b>Paiement à la livraison</b></p><p className="total"><span>Total</span><strong>{money(item.totalMad)}</strong></p></div>
                  </article>;
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="account-side">
          <section>
            <span>ACCÈS RAPIDES</span>
            {isAdmin&&<a href="/admin/orders" className="account-admin-shortcut"><ShieldCheck size={18}/><div><b>Tableau de bord administrateur</b><small>Commandes, statuts et suivi des livraisons</small></div><ChevronRight size={16}/></a>}
            <a href="/favorites"><Heart size={18}/><div><b>Mes favoris</b><small>Retrouver les produits enregistrés</small></div><ChevronRight size={16}/></a>
            <a href="/cart"><ShoppingCart size={18}/><div><b>Mon panier</b><small>Continuer ma commande</small></div><ChevronRight size={16}/></a>
            <a href="/#products"><PackageCheck size={18}/><div><b>Nouveautés</b><small>Voir les derniers produits</small></div><ChevronRight size={16}/></a>
          </section>

          {(
            <section className="account-signout-panel">
              <div className="account-signout-copy">
                <LogOut size={19}/>
                <span><b>Quitter cet espace</b><small>Effacer vos coordonnées enregistrées sur cet appareil.</small></span>
              </div>
              <button type="button" className="account-signout-button" onClick={resetProfile}><LogOut size={16}/> Se déconnecter</button>
            </section>
          )}

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
