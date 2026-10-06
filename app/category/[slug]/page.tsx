import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import StoreHeader from "@/components/StoreHeader";
import SiteMotion from "@/components/SiteMotion";
import CategoryCatalogClient, { type CategoryProduct } from "@/components/CategoryCatalogClient";

const IMAGES={
  samsung:"/api/product-image/galaxy-s26-ultra",
  xiaomi:"/api/product-image/xiaomi-17t-pro",
  honor:"/api/product-image/honor-600",
  redmi:"/api/product-image/redmi-note-15-pro-plus-5g",
  tablet:"/api/product-image/galaxy-tab-s11-ultra",
  ps5:"/api/product-image/playstation-5",
  tv:"https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=86",
  gaming:"https://images.unsplash.com/photo-1763258986479-0962883e1747?auto=format&fit=crop&w=1200&q=86",
  audio:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=86",
  wearable:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=86",
  laptop:"https://images.unsplash.com/photo-1782012505157-aca188bd6921?auto=format&fit=crop&w=1200&q=86",
  accessory:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=86",
};

const catalogs:Record<string,{title:string;eyebrow:string;copy:string;accent:string;products:CategoryProduct[]}> = {
  smartphones:{
    title:"Smartphones",
    eyebrow:"MOBILE / LHAWTA",
    copy:"Uniquement des smartphones neufs. Filtrez par marque, appareil photo, batterie, écran, stockage et budget.",
    accent:"Les nouveautés Samsung, Xiaomi, HONOR et plus",
    products:[
      {brand:"Samsung",name:"Galaxy S26 Ultra",image:IMAGES.samsung,price:"12 591 DH",old:"13 990 DH",rating:"4.9",specs:["6,9″","200 MP","5 000 mAh"],badge:"Nouveau"},
      {brand:"Xiaomi",name:"Xiaomi 17T Pro",image:IMAGES.xiaomi,price:"7 990 DH",rating:"4.8",specs:["6,83″ 144 Hz","Dimensity 9500","7 000 mAh"],badge:"Nouveau"},
      {brand:"HONOR",name:"HONOR 600",image:IMAGES.honor,price:"4 899 DH",old:"4 999 DH",rating:"4.7",specs:["200 MP","AMOLED","Snapdragon 7 Gen 4"]},
      {brand:"REDMI",name:"Note 15 Pro+ 5G",image:IMAGES.redmi,price:"4 199 DH",old:"4 640 DH",rating:"4.8",specs:["200 MP OIS","6 500 mAh","100 W"],badge:"Top vente"},
    ],
  },
  tablettes:{
    title:"Tablettes",
    eyebrow:"TABLETTES / LHAWTA",
    copy:"Tablettes neuves pour le travail, les études, le divertissement et la création.",
    accent:"Galaxy Tab, Xiaomi Pad, HONOR Pad et iPad",
    products:[
      {brand:"Samsung",name:"Galaxy Tab S11 Ultra",image:IMAGES.tablet,price:"13 990 DH",rating:"4.9",specs:["14,6″ AMOLED 2X","12 Go + 256 Go","S Pen inclus"],badge:"Nouveau"},
      {brand:"Samsung",name:"Galaxy Tab S11",image:IMAGES.tablet,price:"9 990 DH",rating:"4.8",specs:["AMOLED","256 Go","Galaxy AI"]},
      {brand:"Xiaomi",name:"Xiaomi Pad",image:IMAGES.tablet,price:"4 490 DH",rating:"4.7",specs:["Grand écran","Wi‑Fi","Multimédia"]},
      {brand:"HONOR",name:"HONOR Pad",image:IMAGES.tablet,price:"3 490 DH",rating:"4.6",specs:["Écran haute résolution","Grande batterie","MagicOS"]},
    ],
  },
  "tv-home":{
    title:"TV & Home",
    eyebrow:"MAISON / LHAWTA",
    copy:"Téléviseurs et équipements maison neufs, organisés par technologie d’écran et usage.",
    accent:"OLED · QLED · Mini LED · Home cinema",
    products:[
      {brand:"Samsung",name:"Neo QLED 4K",image:IMAGES.tv,price:"11 990 DH",rating:"4.8",specs:["Mini LED","4K","Smart TV"],badge:"Premium"},
      {brand:"LG",name:"OLED evo",image:IMAGES.tv,price:"12 990 DH",rating:"4.9",specs:["OLED","120 Hz","Dolby Vision"]},
      {brand:"TCL",name:"Mini LED TV",image:IMAGES.tv,price:"8 490 DH",rating:"4.7",specs:["Mini LED","4K","Google TV"]},
      {brand:"Samsung",name:"QLED 4K",image:IMAGES.tv,price:"7 990 DH",rating:"4.7",specs:["QLED","HDR","SmartThings"]},
    ],
  },
  gaming:{
    title:"Gaming",
    eyebrow:"GAMING / LHAWTA",
    copy:"Consoles, contrôleurs et accessoires gaming neufs pour construire votre setup.",
    accent:"PlayStation · Xbox · Nintendo · accessoires",
    products:[
      {brand:"Sony",name:"PlayStation 5 · 1 To",image:IMAGES.ps5,price:"8 499 DH",old:"9 499 DH",rating:"4.9",specs:["SSD 1 To","DualSense","4K gaming"],badge:"Top vente"},
      {brand:"Sony",name:"DualSense",image:IMAGES.gaming,price:"899 DH",rating:"4.9",specs:["Retour haptique","Gâchettes adaptatives","Sans fil"]},
      {brand:"Gaming",name:"Moniteur 165 Hz",image:IMAGES.gaming,price:"2 799 DH",rating:"4.7",specs:["165 Hz","Faible latence","HDR"]},
      {brand:"Gaming",name:"Casque gaming",image:IMAGES.gaming,price:"699 DH",rating:"4.6",specs:["Spatial audio","Micro","Sans fil"]},
    ],
  },
  audio:{
    title:"Audio",
    eyebrow:"AUDIO / LHAWTA",
    copy:"Écouteurs, casques et enceintes neufs pour musique, appels, gaming et voyage.",
    accent:"ANC · Sans fil · Hi‑Res · Spatial audio",
    products:[
      {brand:"Sony",name:"Casque sans fil premium",image:IMAGES.audio,price:"3 990 DH",rating:"4.9",specs:["ANC","Hi‑Res","Longue autonomie"],badge:"Premium"},
      {brand:"Samsung",name:"Galaxy Buds",image:IMAGES.audio,price:"1 790 DH",rating:"4.7",specs:["ANC","Galaxy AI","Compact"]},
      {brand:"JBL",name:"Enceinte Bluetooth",image:IMAGES.audio,price:"1 290 DH",rating:"4.8",specs:["Portable","Étanche","Bluetooth"]},
      {brand:"Xiaomi",name:"Buds Pro",image:IMAGES.audio,price:"899 DH",rating:"4.6",specs:["ANC","Sans fil","Multipoint"]},
    ],
  },
  wearables:{
    title:"Wearables",
    eyebrow:"WEARABLES / LHAWTA",
    copy:"Montres et bracelets connectés neufs pour sport, santé, notifications et autonomie.",
    accent:"Montres · Bracelets · Santé · Sport",
    products:[
      {brand:"Samsung",name:"Galaxy Watch",image:IMAGES.wearable,price:"3 490 DH",rating:"4.8",specs:["GPS","Santé","Wear OS"],badge:"Nouveau"},
      {brand:"HONOR",name:"HONOR Watch",image:IMAGES.wearable,price:"1 990 DH",rating:"4.7",specs:["AMOLED","Sport","Autonomie"]},
      {brand:"Xiaomi",name:"Smart Band",image:IMAGES.wearable,price:"599 DH",rating:"4.7",specs:["Fitness","Sommeil","Compact"]},
      {brand:"Huawei",name:"Watch Fit",image:IMAGES.wearable,price:"1 499 DH",rating:"4.7",specs:["GPS","AMOLED","Sport"]},
    ],
  },
  informatique:{
    title:"Informatique",
    eyebrow:"INFORMATIQUE / LHAWTA",
    copy:"PC portables, moniteurs et équipements neufs pour travail, études et création.",
    accent:"PC portables · Moniteurs · Productivité",
    products:[
      {brand:"Laptop",name:"Ultrabook 14″",image:IMAGES.laptop,price:"9 990 DH",rating:"4.8",specs:["16 Go RAM","512 Go SSD","14″"]},
      {brand:"Laptop",name:"Creator 16″",image:IMAGES.laptop,price:"14 990 DH",rating:"4.8",specs:["GPU dédié","1 To SSD","16″"],badge:"Performance"},
      {brand:"Monitor",name:"Moniteur 27″ 4K",image:IMAGES.laptop,price:"3 490 DH",rating:"4.7",specs:["4K","USB‑C","IPS"]},
      {brand:"Laptop",name:"Étudiant 15″",image:IMAGES.laptop,price:"6 990 DH",rating:"4.6",specs:["16 Go RAM","512 Go SSD","Wi‑Fi 6"]},
    ],
  },
  accessoires:{
    title:"Accessoires",
    eyebrow:"ACCESSOIRES / LHAWTA",
    copy:"Chargeurs, câbles, protections et accessoires neufs pour compléter votre équipement.",
    accent:"Charge · Protection · Connectique · Mobilité",
    products:[
      {brand:"Charge",name:"Chargeur rapide 65 W",image:IMAGES.accessory,price:"499 DH",rating:"4.8",specs:["USB‑C","PD","65 W"],badge:"Essentiel"},
      {brand:"Charge",name:"Câble USB‑C",image:IMAGES.accessory,price:"149 DH",rating:"4.7",specs:["USB‑C","Charge rapide","Renforcé"]},
      {brand:"Mobile",name:"Coque premium",image:IMAGES.accessory,price:"299 DH",rating:"4.6",specs:["Protection","Grip","Compatible sans fil"]},
      {brand:"Mobile",name:"Batterie externe",image:IMAGES.accessory,price:"599 DH",rating:"4.7",specs:["20 000 mAh","USB‑C","Charge rapide"]},
    ],
  },
};

export function generateStaticParams(){
  return Object.keys(catalogs).map(slug=>({slug}));
}

export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const category=catalogs[slug];
  if(!category) notFound();

  return (
    <main className="lhawta-sketch-site category-page">
      <SiteMotion/>
      <StoreHeader/>

      <section className="category-hero">
        <div>
          <a href="/" className="category-back"><ArrowLeft size={15}/> Accueil</a>
          <span>{category.eyebrow}</span>
          <h1>{category.title}</h1>
          <p>{category.copy}</p>
        </div>
        <aside>
          <small>CATÉGORIE</small>
          <strong>{category.accent}</strong>
          <span>{category.products.length} produits en vedette</span>
        </aside>
      </section>

      <CategoryCatalogClient slug={slug} products={category.products}/>
    </main>
  );
}
