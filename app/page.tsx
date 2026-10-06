"use client";

import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Camera,
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  Monitor,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  Truck,
  Tv,
  Watch,
  Zap,
} from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import LhawtaLogo from "@/components/LhawtaLogo";

const S26_IMG="https://images.samsung.com/n_africa/smartphones/galaxy-s26-ultra/buy/kv_animated_PC_noText.jpg?imbypass=true";
const XIAOMI17T_IMG="https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-17t-pro/pc/screen01-bg.png";
const HONOR600_IMG="https://www-file.honor.com/content/dam/honor/common/products/honor-600/product/imgs/section-cmf/honor600series-cmf-icon-orange.png";
const REDMI15_IMG="https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-15-pro-plus-5g/pc/1e62d6973df9124095c38d8ed31b142a.jpg";
const TABS11_IMG="https://images.samsung.com/is/image/samsung/p6pim/n_africa/feature/166494293/n_africa-feature--nbsp-548796580?imbypass=true";
const PS5_IMG="https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-edition-left-image-block-01-en-24jun24";
const MOROCCO_BG="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1900&q=88";

const categories=[
  {name:"Smartphones",icon:Smartphone,href:"/category/smartphones"},
  {name:"Tablettes",icon:Tablet,href:"/category/tablettes"},
  {name:"TV & Home",icon:Tv,href:"/category/tv-home"},
  {name:"Gaming",icon:Gamepad2,href:"/category/gaming"},
  {name:"Audio",icon:Headphones,href:"/category/audio"},
  {name:"Wearables",icon:Watch,href:"/category/wearables"},
  {name:"Informatique",icon:Laptop,href:"/category/informatique"},
  {name:"Accessoires",icon:BatteryCharging,href:"/category/accessoires"},
];

const products=[
  {
    badge:"Nouveau", badgeTone:"blue", brand:"SAMSUNG", name:"Galaxy S26 Ultra",
    image:S26_IMG, price:"12 591 DH", oldPrice:"13 990 DH",
    specs:["Écran 6,9″","200 MP grand-angle","5 000 mAh"], stock:"Disponible",
    tag:"Galaxy AI", href:"#"
  },
  {
    badge:"Nouveau", badgeTone:"orange", brand:"XIAOMI", name:"Xiaomi 17T Pro",
    image:XIAOMI17T_IMG, price:"7 990 DH", oldPrice:"",
    specs:["6,83″ AMOLED 144 Hz","Dimensity 9500","7 000 mAh · 100 W"], stock:"Disponible",
    tag:"Leica 5×", href:"#"
  },
  {
    badge:"Nouveau", badgeTone:"green", brand:"HONOR", name:"HONOR 600",
    image:HONOR600_IMG, price:"4 899 DH", oldPrice:"4 999 DH",
    specs:["Caméra 200 MP","Écran 6,57″ AMOLED","Snapdragon 7 Gen 4"], stock:"Disponible",
    tag:"MagicOS 10", href:"#"
  },
  {
    badge:"Top vente", badgeTone:"red", brand:"REDMI", name:"Note 15 Pro+ 5G",
    image:REDMI15_IMG, price:"4 199 DH", oldPrice:"4 640 DH",
    specs:["200 MP OIS","Snapdragon 7s Gen 4","6 500 mAh · 100 W"], stock:"Stock limité",
    tag:"IP69", href:"#"
  },
  {
    badge:"Nouveau", badgeTone:"blue", brand:"SAMSUNG", name:"Galaxy Tab S11 Ultra",
    image:TABS11_IMG, price:"13 990 DH", oldPrice:"",
    specs:["14,6″ Dynamic AMOLED 2X","12 Go + 256 Go","S Pen inclus"], stock:"Disponible",
    tag:"5G", href:"#"
  },
  {
    badge:"Top vente", badgeTone:"red", brand:"SONY", name:"PlayStation 5 · 1 To",
    image:PS5_IMG, price:"8 499 DH", oldPrice:"9 499 DH",
    specs:["SSD 1 To","DualSense","4K gaming"], stock:"Voir disponibilité",
    tag:"PS5", href:"#"
  },
];

const compareRows=[
  {name:"Galaxy S26 Ultra",camera:"200 MP",screen:"6,9″",battery:"5 000 mAh",best:"Photo + AI",price:"12 591 DH"},
  {name:"Xiaomi 17T Pro",camera:"50+50+12 MP",screen:"6,83″ 144 Hz",battery:"7 000 mAh",best:"Zoom + charge",price:"7 990 DH"},
  {name:"HONOR 600",camera:"200 MP",screen:"6,57″ AMOLED",battery:"7 000 mAh",best:"Autonomie",price:"4 899 DH"},
];

export default function Home(){
  return (
    <main className="lhawta-sketch-site">
      <SiteMotion/>
      <StoreHeader/>

      <section className="sketch-hero premium-hero" id="latest">
        <div className="premium-hero-copy">
          <span className="premium-kicker"><Sparkles size={13}/> NOUVEAUTÉS MAROC · OCTOBRE 2026</span>
          <h1>La tech qui mérite<br/><em>votre argent.</em></h1>
          <p>Les nouveaux smartphones, tablettes et consoles — avec prix, specs, garantie et disponibilité clairement affichés avant l’achat.</p>

          <div className="premium-hero-actions">
            <a href="#products" className="premium-primary">Voir les nouveautés <ArrowRight size={16}/></a>
            <a href="#compare" className="premium-secondary">Comparer les produits <ChevronRight size={15}/></a>
          </div>

          <div className="premium-proof">
            <span><BadgeCheck size={15}/><b>100% neuf</b></span>
            <span><ShieldCheck size={15}/><b>Garantie claire</b></span>
            <span><Truck size={15}/><b>Livraison Maroc</b></span>
          </div>
        </div>

        <div className="premium-showcase">
          <a href="/category/smartphones" className="hero-product-card hero-product-main">
            <div className="hero-product-card-head">
              <span>SAMSUNG · NOUVEAU</span>
              <b>Galaxy AI</b>
            </div>
            <div className="hero-product-visual">
              <img src={S26_IMG} alt="Samsung Galaxy S26 Ultra"/>
            </div>
            <div className="hero-product-card-foot">
              <div><small>Galaxy S26 Ultra</small><strong>12 591 DH</strong></div>
              <span>200 MP · 6,9″ · 5 000 mAh</span>
            </div>
          </a>

          <div className="hero-side-stack">
            <a href="/category/smartphones" className="hero-product-card hero-product-small hero-xiaomi">
              <div className="hero-product-card-head"><span>XIAOMI</span><b>Nouveau</b></div>
              <div className="hero-product-visual"><img src={XIAOMI17T_IMG} alt="Xiaomi 17T Pro"/></div>
              <div className="hero-product-card-foot">
                <div><small>Xiaomi 17T Pro</small><strong>7 990 DH</strong></div>
                <span>Leica 5× · 144 Hz · 100 W</span>
              </div>
            </a>

            <a href="/category/gaming" className="hero-product-card hero-product-small hero-ps5">
              <div className="hero-product-card-head"><span>SONY</span><b>Top vente</b></div>
              <div className="hero-product-visual"><img src={PS5_IMG} alt="PlayStation 5"/></div>
              <div className="hero-product-card-foot">
                <div><small>PlayStation 5 · 1 To</small><strong>8 499 DH</strong></div>
                <span>SSD 1 To · DualSense · 4K</span>
              </div>
            </a>
          </div>
        </div>

        <div className="premium-hero-orbit premium-orbit-one"/>
        <div className="premium-hero-orbit premium-orbit-two"/>
      </section>

      <section className="sketch-trust-strip premium-trust-strip">
        <div><ShieldCheck size={23}/><span><b>Produits 100% neufs</b><small>Condition affichée clairement</small></span></div>
        <div><Truck size={23}/><span><b>Livraison partout au Maroc</b><small>Disponibilité avant paiement</small></span></div>
        <div><ShoppingCart size={23}/><span><b>Paiement flexible</b><small>Options visibles au checkout</small></span></div>
        <div><Headphones size={23}/><span><b>Support réactif</b><small>Aide avant et après achat</small></span></div>
      </section>

      <section className="sketch-category-strip premium-category-strip">
        {categories.map(({name,icon:Icon,href})=>(
          <a href={href} key={name}><span className="premium-cat-icon"><Icon size={20}/></span><strong>{name}</strong><ChevronRight size={13}/></a>
        ))}
      </section>

      <section className="sketch-products-section" id="products">
        <div className="sketch-section-head">
          <div><span>NOUVEAUTÉS & BEST-SELLERS</span><h2>Nos dernières nouveautés</h2></div>
          <a href="#">Voir tout <ArrowRight size={14}/></a>
        </div>

        <div className="sketch-product-grid">
          {products.map((p)=>(
            <article className="sketch-product-card" key={p.name}>
              <div className={"sketch-product-badge "+p.badgeTone}>{p.badge}</div>
              <button className="sketch-wish"><Heart size={18}/></button>
              <a href={p.href} className="sketch-product-media">
                <img src={p.image} alt={p.name}/>
                <span>{p.tag}</span>
              </a>
              <div className="sketch-product-body">
                <small>{p.brand}</small>
                <h3>{p.name}</h3>
                <ul>{p.specs.map(s=><li key={s}>{s}</li>)}</ul>
                <div className="sketch-stock"><span/> {p.stock}</div>
                <div className="sketch-product-price"><strong>{p.price}</strong>{p.oldPrice&&<del>{p.oldPrice}</del>}</div>
                <div className="sketch-product-actions">
                  <button><ShoppingCart size={15}/> Voir détails</button>
                  <button className="outline">Comparer</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sketch-promos" id="promos">
        <article className="sketch-promo-card promo-phone">
          <img src={S26_IMG} alt="Galaxy S26 Ultra"/>
          <div><span>SMARTPHONES</span><h3>Le flagship du moment.</h3><p>Galaxy S26 Ultra : 200 MP, écran 6,9″ et Galaxy AI.</p><a href="#products">Voir les smartphones <ArrowRight size={14}/></a></div>
        </article>
        <article className="sketch-promo-card promo-xiaomi">
          <img src={XIAOMI17T_IMG} alt="Xiaomi 17T Pro"/>
          <div><span>CHARGE & ZOOM</span><h3>Xiaomi 17T Pro.</h3><p>Leica 5×, Dimensity 9500, 7 000 mAh et charge 100 W.</p><a href="#products">Découvrir <ArrowRight size={14}/></a></div>
        </article>
        <article className="sketch-promo-card promo-gaming">
          <img src={PS5_IMG} alt="PlayStation 5"/>
          <div><span>GAMING</span><h3>PS5 1 To.</h3><p>SSD ultra rapide, DualSense et jeu 4K.</p><a href="#products">Voir le gaming <ArrowRight size={14}/></a></div>
        </article>
      </section>

      <section className="sketch-compare" id="compare">
        <div className="sketch-compare-copy">
          <span>COMPARATEUR LHAWTA</span>
          <h2>Comparez ce qui change vraiment.</h2>
          <p>Caméra, écran, batterie, performance et prix — dans le même format, sans chercher entre plusieurs fiches.</p>
        </div>
        <div className="sketch-compare-table">
          <div className="sketch-compare-labels"><span>Produit</span><span>Caméra</span><span>Écran</span><span>Batterie</span><span>Idéal pour</span><span>Prix</span></div>
          {compareRows.map(r=>(
            <div className="sketch-compare-row" key={r.name}>
              <strong>{r.name}</strong><span>{r.camera}</span><span>{r.screen}</span><span>{r.battery}</span><b>{r.best}</b><em>{r.price}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="sketch-services" id="services">
        <div className="sketch-section-head">
          <div><span>SERVICES</span><h2>Achetez sans mauvaise surprise.</h2></div>
          <p>Condition, garantie, disponibilité et livraison sont visibles avant le paiement.</p>
        </div>
        <div className="sketch-services-grid">
          <article><BadgeCheck size={24}/><h3>Produits neufs</h3><p>Chaque fiche indique clairement l’état du produit et sa variante.</p></article>
          <article><ShieldCheck size={24}/><h3>Garantie claire</h3><p>Type et durée de garantie affichés avant l’achat.</p></article>
          <article><Truck size={24}/><h3>Livraison Maroc</h3><p>Disponibilité et estimation avant de finaliser la commande.</p></article>
          <article><RotateCcw size={24}/><h3>Retours & échanges</h3><p>Conditions simples, lisibles et accessibles.</p></article>
          <article><Camera size={24}/><h3>Comparaison utile</h3><p>Les différences techniques expliquées par usage réel.</p></article>
          <article><Zap size={24}/><h3>Nouveautés suivies</h3><p>Les lancements Samsung, Xiaomi, HONOR, Sony et plus.</p></article>
        </div>
      </section>

      <section className="sketch-faq" id="faq">
        <div className="sketch-faq-intro"><span>FAQ</span><h2>Avant de commander.</h2><p>Les réponses essentielles sur les produits, la garantie et la livraison.</p></div>
        <div className="sketch-faq-list">
          <details open><summary><span>Les produits LHAWTA sont-ils neufs ?</span><ChevronDown size={18}/></summary><p>Oui. LHAWTA se concentre sur des smartphones, tablettes et produits électroniques neufs. L’état est affiché sur chaque fiche.</p></details>
          <details><summary><span>Livrez-vous partout au Maroc ?</span><ChevronDown size={18}/></summary><p>Oui. Les options et délais disponibles s’affichent avant la validation de la commande.</p></details>
          <details><summary><span>Comment fonctionne la garantie ?</span><ChevronDown size={18}/></summary><p>Le type de garantie et sa durée sont indiqués sur la fiche du produit afin d’éviter toute ambiguïté.</p></details>
          <details><summary><span>Comment choisir entre deux smartphones ?</span><ChevronDown size={18}/></summary><p>Utilisez le comparateur LHAWTA pour confronter appareil photo, écran, batterie, puce, stockage et prix.</p></details>
        </div>
      </section>

      <footer className="sketch-footer">
        <div><LhawtaLogo light/><p>La tech, plus simple à choisir.</p></div>
        <nav><a href="#products">Nouveautés</a><a href="#compare">Comparer</a><a href="#services">Services</a><a href="#faq">FAQ</a></nav>
        <span>© 2026 LHAWTA · Maroc · MAD</span>
      </footer>
    </main>
  )
}
