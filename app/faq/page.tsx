import { ArrowLeft, HelpCircle, MessageCircle, ShieldCheck } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import FaqClient from "@/components/FaqClient";

export default function FaqPage(){
  return (
    <main className="exact-page faq-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="faq-hero">
        <div className="exact-shell faq-hero-inner">
          <div>
            <a href="/"><ArrowLeft size={15}/> Accueil</a>
            <span><HelpCircle size={15}/> CENTRE D’AIDE</span>
            <h1>Questions fréquentes</h1>
            <p>Livraison, paiement, garantie, retours, suivi de commande et fonctionnement du site : les réponses importantes sont regroupées ici.</p>
          </div>
          <aside>
            <ShieldCheck size={25}/>
            <div>
              <b>Des réponses claires</b>
              <small>Nous évitons d’afficher des délais, garanties ou conditions que le site ne peut pas confirmer.</small>
            </div>
            <a href="/account"><MessageCircle size={15}/> Suivre une commande</a>
          </aside>
        </div>
      </section>

      <FaqClient/>
    </main>
  );
}
