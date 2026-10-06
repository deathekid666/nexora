"use client";

import {
  ArrowRight,
  BadgeCheck,
  Box,
  ChevronDown,
  Clock3,
  Headphones,
  Heart,
  Laptop,
  LockKeyhole,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
  Tablet,
  Truck,
  Tv,
  Watch,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";

const HERO_PRODUCT="https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-color-lineup-250909_inline.jpg.large_2x.jpg";
const S26_IMG="https://images.samsung.com/n_africa/smartphones/galaxy-s26-ultra/buy/kv_animated_PC_noText.jpg?imbypass=true";
const XIAOMI17T_IMG="https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-17t-pro/pc/screen01-bg.png";
const REDMI15_IMG="https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-15-pro-plus-5g/pc/1e62d6973df9124095c38d8ed31b142a.jpg";
const TABS11_IMG="https://images.samsung.com/is/image/samsung/p6pim/n_africa/feature/166494293/n_africa-feature--nbsp-548796580?imbypass=true";
const PS5_IMG="https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-edition-left-image-block-01-en-24jun24";
const AUDIO_IMG="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=86";
const LAPTOP_IMG="https://images.unsplash.com/photo-1782012505157-aca188bd6921?auto=format&fit=crop&w=1000&q=88";
const TV_IMG="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=86";
const WATCH_IMG="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=86";
const ROCKS_BG="https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=2200&q=90";

const categories=[
  {label:"Smartphones",href:"/category/smartphones",icon:Smartphone,img:S26_IMG},
  {label:"Tablettes",href:"/category/tablettes",icon:Tablet,img:TABS11_IMG},
  {label:"Informatique",href:"/category/informatique",icon:Laptop,img:LAPTOP_IMG},
  {label:"TV & Home",href:"/category/tv-home",icon:Tv,img:TV_IMG},
  {label:"Gaming",href:"/category/gaming",icon:ShoppingCart,img:PS5_IMG},
  {label:"Audio",href:"/category/audio",icon:Headphones,img:AUDIO_IMG},
  {label:"Wearables",href:"/category/wearables",icon:Watch,img:WATCH_IMG},
  {label:"Accessoires",href:"/category/accessoires",icon:PackageCheck,img:AUDIO_IMG},
];

const products=[
  {brand:"Samsung",name:"Galaxy S26 Ultra",img:S26_IMG,badge:"Nouveau",rating:"4.9",reviews:"639",price:"12 591 MAD",old:"13 990 MAD",colors:["#d8d5ce","#6e7378","#20242a"]},
  {brand:"Xiaomi",name:"Xiaomi 17T Pro",img:XIAOMI17T_IMG,badge:"Nouveau",rating:"4.8",reviews:"408",price:"7 990 MAD",old:"",colors:["#17191e","#d9d9d5","#704b36"]},
  {brand:"Samsung",name:"Galaxy Tab S11 Ultra",img:TABS11_IMG,badge:"Nouveau",rating:"4.8",reviews:"624",price:"13 990 MAD",old:"",colors:["#2e3237","#b8b7b2"]},
  {brand:"REDMI",name:"Note 15 Pro+ 5G",img:REDMI15_IMG,badge:"-10%",rating:"4.8",reviews:"541",price:"4 199 MAD",old:"4 640 MAD",colors:["#482f58","#1c1f23","#d5d2cb"]},
  {brand:"Sony",name:"PlayStation 5 · 1 To",img:PS5_IMG,badge:"Nouveau",rating:"4.9",reviews:"296",price:"8 499 MAD",old:"9 499 MAD",colors:["#f0f0ed","#101115"]},
  {brand:"Sony",name:"WH-1000XM5",img:AUDIO_IMG,badge:"-15%",rating:"4.8",reviews:"813",price:"4 249 MAD",old:"4 999 MAD",colors:["#b8b0a3","#202124"]},
];

const deals=[
  {badge:"-20%",name:"Galaxy flagship",img:S26_IMG,old:"11 999 MAD",price:"9 599 MAD"},
  {badge:"-15%",name:"Smartwatch premium",img:WATCH_IMG,old:"3 499 MAD",price:"2 974 MAD"},
  {badge:"-25%",name:"Audio Pro",img:AUDIO_IMG,old:"3 999 MAD",price:"2 999 MAD"},
  {badge:"-10%",name:"Tablet 10th Gen",img:TABS11_IMG,old:"4 999 MAD",price:"4 499 MAD"},
];

const faqs=[
  "Les produits sont-ils neufs et originaux ?",
  "Quelle garantie proposez-vous ?",
  "Livrez-vous partout au Maroc ?",
  "Puis-je retourner ou échanger un produit ?",
  "Quels moyens de paiement acceptez-vous ?",
  "Combien de temps prend la livraison ?",
];

export default function Home(){
  return (
    <main className="ref-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="ref-hero">
        <img className="ref-hero-bg" src={ROCKS_BG} alt=""/>
        <div className="ref-hero-wash"/>

        <div className="ref-hero-copy">
          <span className="ref-pill">Nouveauté</span>
          <h1>Galaxy S26 Ultra</h1>
          <h2>Le nouveau flagship, bien choisi.</h2>
          <p>Produit neuf · Garantie affichée · Livraison partout au Maroc</p>
          <div className="ref-hero-actions">
            <a href="/category/smartphones" className="ref-btn-dark">Acheter <ArrowRight size={14}/></a>
            <a href="#compare" className="ref-btn-light">Comparer <span>▥</span></a>
          </div>
        </div>

        <div className="ref-hero-product">
          <img src={S26_IMG} alt="Samsung Galaxy S26 Ultra"/>
        </div>

        <a href="/category/smartphones" className="ref-hero-buycard">
          <strong>Galaxy S26 Ultra</strong>
          <div className="ref-stars"><span>★★★★★</span><small>(4.9)</small></div>
          <p>À partir de <b>12 591 MAD</b></p>
          <div className="ref-colors"><i/><i/><i/><i/></div>
          <em>Disponible maintenant</em>
          <small>Livraison en 1–3 jours</small>
          <b className="ref-buy-arrow">→</b>
        </a>

        <div className="ref-hero-benefits">
          <div><ShieldCheck size={20}/><span><b>Garantie officielle</b><small>100% neuf</small></span></div>
          <div><Truck size={20}/><span><b>Livraison rapide</b><small>Partout au Maroc</small></span></div>
          <div><LockKeyhole size={20}/><span><b>Paiement sécurisé</b><small>Plusieurs options</small></span></div>
          <div><RotateCcw size={20}/><span><b>Retours faciles</b><small>14 jours</small></span></div>
        </div>
      </section>

      <section className="ref-category-strip">
        {categories.map(({label,href,img})=>(
          <a href={href} key={label}>
            <div><img src={img} alt=""/></div>
            <span>{label}</span>
          </a>
        ))}
        <a href="#deals" className="ref-deal-cat"><div><b>%</b></div><span>Promos</span></a>
      </section>

      <section className="ref-products">
        <div className="ref-section-title">
          <div><h2>Nouveautés de la semaine</h2><p>Les derniers smartphones, tablettes et produits tech.</p></div>
          <a href="/category/smartphones">Voir tous les produits <ArrowRight size={13}/></a>
        </div>

        <div className="ref-product-grid">
          {products.map(p=>(
            <article className="ref-product-card" key={p.name}>
              <div className={"ref-product-badge "+(p.badge.startsWith("-")?"sale":"")}>{p.badge}</div>
              <button className="ref-heart" aria-label="Ajouter aux favoris"><Heart size={15}/></button>
              <a href="#" className="ref-product-img"><img src={p.img} alt={p.name}/></a>
              <div className="ref-product-body">
                <small>{p.brand}</small>
                <h3>{p.name}</h3>
                <div className="ref-product-rating"><span>★★★★★</span><small>{p.rating} ({p.reviews})</small></div>
                <div className="ref-product-price">{p.old&&<del>{p.old}</del>}<strong>{p.price}</strong></div>
                <div className="ref-card-bottom">
                  <div className="ref-swatch">{p.colors.map((c,i)=><i key={i} style={{background:c}}/>)}</div>
                  <button><ShoppingCart size={15}/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ref-deals" id="deals">
        <div className="ref-deals-copy">
          <span>OFFRE LIMITÉE</span>
          <h2>Les deals tech du jour</h2>
          <p>De bons produits. De meilleurs prix.</p>
          <a href="#">Voir toutes les offres</a>
          <div className="ref-countdown">
            <small>Se termine dans</small>
            <div><b>02</b><span>Jours</span></div>
            <div><b>14</b><span>Heures</span></div>
            <div><b>36</b><span>Min</span></div>
            <div><b>20</b><span>Sec</span></div>
          </div>
        </div>

        <div className="ref-deal-cards">
          {deals.map(d=>(
            <article key={d.name}>
              <span>{d.badge}</span>
              <img src={d.img} alt={d.name}/>
              <h3>{d.name}</h3>
              <del>{d.old}</del>
              <strong>{d.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="ref-compare" id="compare">
        <div className="ref-compare-copy">
          <span>COMPARER</span>
          <h2>Trouvez le bon téléphone pour vous.</h2>
          <p>Comparez specs, performances, caméra, batterie et plus, côte à côte.</p>
          <a href="/category/smartphones">Commencer la comparaison</a>
        </div>

        <div className="ref-compare-phones">
          <div><img src={S26_IMG} alt="Galaxy S26 Ultra"/><b>Galaxy S26 Ultra</b></div>
          <span>VS</span>
          <div><img src={XIAOMI17T_IMG} alt="Xiaomi 17T Pro"/><b>Xiaomi 17T Pro</b></div>
          <span>VS</span>
          <div><img src={REDMI15_IMG} alt="REDMI Note 15 Pro+"/><b>REDMI Note 15 Pro+</b></div>
        </div>

        <div className="ref-compare-points">
          <div><i>▱</i><span><b>Voir les vraies différences</b><small>Pas seulement les chiffres</small></span></div>
          <div><i>◇</i><span><b>Mettre l’essentiel en avant</b><small>Caméra, batterie, écran…</small></span></div>
          <div><i>▰</i><span><b>Choisir avec confiance</b><small>Simple et clair</small></span></div>
        </div>
      </section>

      <section className="ref-why">
        <h2>Pourquoi acheter chez LHAWTA ?</h2>
        <p>Une meilleure façon d’acheter votre prochain appareil.</p>
        <div className="ref-why-grid">
          <article><Box size={22}/><span><b>100% produits neufs</b><small>Sources officielles</small></span></article>
          <article><ShieldCheck size={22}/><span><b>Garantie incluse</b><small>Tranquillité d’esprit</small></span></article>
          <article><Truck size={22}/><span><b>Livraison rapide</b><small>Partout au Maroc</small></span></article>
          <article><RotateCcw size={22}/><span><b>Retours faciles</b><small>14 jours</small></span></article>
          <article><LockKeyhole size={22}/><span><b>Paiement sécurisé</b><small>Plusieurs options</small></span></article>
        </div>
      </section>

      <section className="ref-brand-help" id="brands">
        <div className="ref-brands">
          <h2>Marques populaires</h2>
          <p>Achetez vos marques préférées.</p>
          <div>
            {["Apple","Samsung","mi","Google","SONY","Lenovo","hp"].map(b=><a href="#" key={b}>{b}</a>)}
            <a href="#">Voir tout →</a>
          </div>
        </div>
        <aside className="ref-help-card">
          <div><h3>Besoin d’aide pour choisir ?</h3><p>Nos experts sont là pour vous aider à trouver le bon smartphone, tablette ou accessoire.</p><a href="#faq">Obtenir de l’aide</a></div>
          <img src={S26_IMG} alt="Produits tech"/>
        </aside>
      </section>

      <section className="ref-faq" id="faq">
        <div><h2>Questions fréquentes</h2><p>Réponses rapides aux questions courantes.</p></div>
        <div className="ref-faq-grid">
          {faqs.map((q,i)=>(
            <details key={q}>
              <summary><span>{q}</span><b>+</b></summary>
              <p>{i===0?"Oui. LHAWTA se concentre sur des produits neufs et la condition est affichée clairement avant l’achat.":i===1?"La garantie applicable est indiquée sur chaque fiche produit avant le checkout.":i===2?"Oui, les options de livraison au Maroc sont présentées avant validation de la commande.":"Les conditions et options applicables sont indiquées clairement dans le parcours d’achat."}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="ref-newsletter">
        <div><h2>Restez informé</h2><p>Soyez le premier au courant des nouveautés, offres exclusives et bons plans.</p></div>
        <form><input placeholder="Votre adresse e-mail"/><button type="button">S’abonner</button></form>
        <div className="ref-news-points">
          <span>◔ <b>Nouveautés</b><small>Dernières sorties</small></span>
          <span>◇ <b>Offres exclusives</b><small>Réservées aux membres</small></span>
          <span>▥ <b>Guides d’achat</b><small>Conseils & comparatifs</small></span>
        </div>
      </section>

      <footer className="ref-footer" id="footer">
        <div className="ref-footer-brand"><strong>LHAWTA</strong><p>Nouvelle tech. Choix clairs.</p><small>Smartphones, tablettes et électronique pour un quotidien plus intelligent.</small><div>◉ &nbsp; f &nbsp; ▶ &nbsp; ♪</div></div>
        <div><b>Boutique</b><a href="/category/smartphones">Smartphones</a><a href="/category/tablettes">Tablettes</a><a href="/category/informatique">Ordinateurs</a><a href="/category/tv-home">TV & Home</a><a href="/category/gaming">Gaming</a><a href="/category/audio">Audio</a></div>
        <div><b>Découvrir</b><a href="#products">Nouveautés</a><a href="#products">Meilleures ventes</a><a href="#deals">Promos</a><a href="#brands">Marques</a><a href="#compare">Comparateur</a><a href="#">Guides</a></div>
        <div><b>Service client</b><a href="#faq">Centre d’aide</a><a href="#">Suivre commande</a><a href="#">Retours & échanges</a><a href="#">Garantie</a><a href="#faq">FAQ</a><a href="#">Contact</a></div>
        <div className="ref-footer-country"><b>🇲🇦 Maroc (MAD)⌄</b><p>Paiement sécurisé</p><span>VISA &nbsp; ●● &nbsp; 💳</span><small>Conditions · Confidentialité · Cookies</small><em>© 2026 LHAWTA. Tous droits réservés.</em></div>
      </footer>
    </main>
  );
}
