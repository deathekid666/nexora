"use client";

import {
  ChevronDown,
  CreditCard,
  HelpCircle,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

type FaqItem={
  category:string;
  question:string;
  answer:string;
};

const faqItems:FaqItem[]=[
  {
    category:"Commandes",
    question:"Comment passer une commande sur LHAWTA ?",
    answer:"Ajoutez le produit souhaité au panier, choisissez la configuration disponible, renseignez vos coordonnées de livraison puis confirmez la commande. Le récapitulatif peut ensuite être envoyé à LHAWTA via WhatsApp lorsque le numéro officiel de la boutique est configuré.",
  },
  {
    category:"Commandes",
    question:"Comment suivre ma commande ?",
    answer:"Ouvrez Mon espace, puis utilisez le numéro de commande LHW et le même numéro de téléphone que celui utilisé lors de l’achat. Vous pourrez voir le statut enregistré : reçue, confirmée, expédiée, livrée ou annulée.",
  },
  {
    category:"Paiement",
    question:"Quels moyens de paiement sont disponibles ?",
    answer:"Le parcours actuellement prévu sur LHAWTA met en avant le paiement à la livraison. Les modalités exactes sont confirmées avec la commande avant expédition.",
  },
  {
    category:"Livraison",
    question:"Livrez-vous partout au Maroc ?",
    answer:"Oui, LHAWTA prévoit la livraison au Maroc. Le délai et les éventuels frais sont confirmés avant l’expédition selon la ville, le produit et le service de livraison disponible.",
  },
  {
    category:"Livraison",
    question:"Combien de temps prend la livraison ?",
    answer:"Le délai dépend de la ville, du stock et du transporteur. Nous évitons d’afficher un délai fixe non garanti : le délai applicable est confirmé avant expédition.",
  },
  {
    category:"Produits",
    question:"Les produits sont-ils neufs ?",
    answer:"Le catalogue LHAWTA est présenté comme un catalogue de produits neufs. Les informations détaillées de condition, variante, couleur et disponibilité sont affichées ou confirmées avant commande.",
  },
  {
    category:"Produits",
    question:"Pourquoi certains produits n’ont-ils pas encore de fiche détaillée ?",
    answer:"Certains produits sont déjà référencés dans le catalogue mais leur fiche complète n’est pas encore publiée. Dans ce cas, LHAWTA affiche clairement « Fiche détaillée à venir » au lieu d’inventer des caractéristiques manquantes.",
  },
  {
    category:"Garantie",
    question:"Les produits sont-ils garantis ?",
    answer:"Les informations de garantie sont affichées sur les fiches détaillées lorsqu’elles sont disponibles. Pour un produit sans fiche complète, la garantie doit être confirmée avant la commande.",
  },
  {
    category:"Garantie",
    question:"Que faire si mon produit a un problème après réception ?",
    answer:"Contactez LHAWTA avec votre numéro de commande, le produit concerné et une description du problème. L’équipe pourra ensuite vous indiquer la procédure adaptée selon la garantie et le cas rencontré.",
  },
  {
    category:"Retours",
    question:"Puis-je retourner ou échanger un produit ?",
    answer:"Les conditions de retour ou d’échange dépendent du produit, de son état, de la raison du retour et des conditions applicables à la commande. Contactez LHAWTA avant tout retour afin que la procédure soit confirmée.",
  },
  {
    category:"Prix",
    question:"Comment sont calculées les promotions ?",
    answer:"La page Promotions utilise uniquement les produits dont le catalogue contient un prix actuel et un prix barré supérieur. Le pourcentage et l’économie affichés sont calculés automatiquement à partir de ces deux montants.",
  },
  {
    category:"Prix",
    question:"Les prix affichés peuvent-ils changer ?",
    answer:"Oui. Les prix et disponibilités peuvent évoluer. Le prix affiché sur le site sert de référence au moment de la consultation et la commande est confirmée avant expédition.",
  },
  {
    category:"Compte",
    question:"Dois-je créer un compte pour commander ?",
    answer:"Non. L’espace client actuel permet surtout d’enregistrer vos coordonnées de livraison sur votre navigateur et de suivre une commande. Il ne s’agit pas d’un système de compte avec mot de passe.",
  },
  {
    category:"Compte",
    question:"Où sont enregistrées mes coordonnées dans Mon espace ?",
    answer:"Les coordonnées que vous choisissez d’enregistrer dans Mon espace sont conservées localement dans votre navigateur afin de préremplir vos prochaines commandes sur cet appareil.",
  },
];

const categories=["Toutes","Commandes","Paiement","Livraison","Produits","Garantie","Retours","Prix","Compte"];

export default function FaqClient(){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("Toutes");
  const [open,setOpen]=useState<number[]>([0,1]);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return faqItems.filter(item=>{
      if(category!=="Toutes"&&item.category!==category) return false;
      if(!q) return true;
      return (item.question+" "+item.answer+" "+item.category).toLowerCase().includes(q);
    });
  },[query,category]);

  const toggle=(index:number)=>{
    setOpen(current=>current.includes(index)?current.filter(item=>item!==index):[...current,index]);
  };

  const reset=()=>{
    setQuery("");
    setCategory("Toutes");
  };

  return (
    <>
      <section className="faq-tools exact-shell">
        <label className="faq-search">
          <Search size={17}/>
          <input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Rechercher une question..."/>
          {query&&<button type="button" onClick={()=>setQuery("")}>Effacer</button>}
        </label>

        <div className="faq-category-chips">
          {categories.map(item=>(
            <button type="button" key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="faq-layout exact-shell">
        <div className="faq-list">
          <div className="faq-results-head">
            <div><b>{filtered.length}</b><span>question{filtered.length!==1?"s":""}</span></div>
            {(query||category!=="Toutes")&&<button type="button" onClick={reset}><RotateCcw size={13}/> Réinitialiser</button>}
          </div>

          {filtered.length?filtered.map(item=>{
            const originalIndex=faqItems.indexOf(item);
            const isOpen=open.includes(originalIndex);
            return (
              <article className={isOpen?"faq-item open":"faq-item"} key={item.question}>
                <button type="button" onClick={()=>toggle(originalIndex)} aria-expanded={isOpen}>
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.question}</strong>
                  </span>
                  <ChevronDown size={18}/>
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          }):(
            <div className="faq-empty">
              <Search size={30}/>
              <h2>Aucune question trouvée</h2>
              <p>Essayez un autre mot-clé ou réinitialisez les filtres.</p>
              <button type="button" onClick={reset}><RotateCcw size={14}/> Réinitialiser</button>
            </div>
          )}
        </div>

        <aside className="faq-side">
          <section>
            <HelpCircle size={23}/>
            <h2>Besoin d’aide ?</h2>
            <p>Si votre question n’est pas dans la FAQ, vous pouvez vérifier votre commande depuis Mon espace.</p>
            <a href="/account">Ouvrir Mon espace</a>
          </section>

          <section className="faq-side-points">
            <p><Truck size={17}/><span><b>Livraison Maroc</b><small>Délai confirmé avant expédition</small></span></p>
            <p><CreditCard size={17}/><span><b>Paiement à la livraison</b><small>Modalités confirmées à la commande</small></span></p>
            <p><ShieldCheck size={17}/><span><b>Garantie claire</b><small>Affichée quand l’information est disponible</small></span></p>
            <p><PackageCheck size={17}/><span><b>Suivi de commande</b><small>Numéro LHW + téléphone</small></span></p>
          </section>
        </aside>
      </section>
    </>
  );
}
