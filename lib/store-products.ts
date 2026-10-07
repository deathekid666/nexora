export type StoreProduct = {
  slug:string;
  brand:string;
  name:string;
  category:string;
  price:string;
  oldPrice?:string;
  badge:string;
  shortDescription:string;
  longDescription:string;
  rating:string;
  reviewCount:string;
  availability:string;
  warranty:string;
  highlights:{label:string;value:string}[];
  variants:string[];
  colors:string[];
  gallery:string[];
  specs:{title:string;rows:{label:string;value:string}[]}[];
};

const gallery=(slug:string)=>[0,1,2,3].map(view=>`/api/product-image/${slug}?view=${view}`);

export const storeProducts:Record<string,StoreProduct>={
  "galaxy-s26-ultra":{
    slug:"galaxy-s26-ultra",
    brand:"Samsung",
    name:"Galaxy S26 Ultra",
    category:"Smartphones",
    price:"13 999 DH",
    oldPrice:"14 999 DH",
    badge:"Nouveau",
    shortDescription:"Le flagship Samsung pensé pour la photo, l’IA, le multitâche et le grand écran.",
    longDescription:"Le Galaxy S26 Ultra combine un écran 6,9 pouces, un système photo 200 MP, le S Pen et une plateforme Snapdragon optimisée pour Galaxy. Cette fiche regroupe les informations utiles avant achat : dimensions, mémoire, stockage, batterie, appareil photo, connectivité et résistance.",
    rating:"4.9",
    reviewCount:"128 avis",
    availability:"En stock",
    warranty:"Garantie officielle constructeur",
    highlights:[
      {label:"Écran",value:"6,9″"},
      {label:"Caméra principale",value:"200 MP"},
      {label:"Batterie",value:"5 000 mAh"},
      {label:"Poids",value:"214 g"},
    ],
    variants:["256 Go / 12 Go","512 Go / 12 Go","1 To / 16 Go"],
    colors:["Violet","Bleu","Noir","Blanc"],
    gallery:gallery("galaxy-s26-ultra"),
    specs:[
      {title:"Écran",rows:[
        {label:"Taille",value:"6,9 pouces"},
        {label:"Fonction",value:"Privacy Display intégré"},
      ]},
      {title:"Performances & mémoire",rows:[
        {label:"Processeur",value:"Snapdragon 8 Elite Gen 5 for Galaxy (3 nm)"},
        {label:"Mémoire",value:"12 Go ou 16 Go selon capacité"},
        {label:"Stockage",value:"256 Go / 512 Go / 1 To"},
      ]},
      {title:"Appareil photo",rows:[
        {label:"Principal",value:"200 MP, f/1.4"},
        {label:"Ultra grand-angle",value:"50 MP, f/1.9"},
        {label:"Téléobjectif",value:"50 MP, f/2.9"},
      ]},
      {title:"Batterie & design",rows:[
        {label:"Batterie",value:"5 000 mAh"},
        {label:"Charge",value:"Super Fast Charging 3.0"},
        {label:"Épaisseur",value:"7,9 mm"},
        {label:"Poids",value:"214 g"},
        {label:"Résistance",value:"IP68"},
      ]},
    ],
  },

  "xiaomi-17t-pro":{
    slug:"xiaomi-17t-pro",
    brand:"Xiaomi",
    name:"Xiaomi 17T Pro",
    category:"Smartphones",
    price:"8 999 DH",
    badge:"Top vente",
    shortDescription:"Flagship Xiaomi avec imagerie Leica, écran AMOLED 144 Hz et batterie silicium-carbone 7 000 mAh.",
    longDescription:"Le Xiaomi 17T Pro vise la performance et la photo avec le Dimensity 9500, un écran AMOLED 1.5K à 144 Hz et un système Leica comprenant un téléobjectif périscopique 115 mm. Il prend aussi en charge la charge filaire 100 W et la charge sans fil 50 W.",
    rating:"4.8",
    reviewCount:"96 avis",
    availability:"En stock",
    warranty:"Garantie constructeur",
    highlights:[
      {label:"Écran",value:"6,83″ 144 Hz"},
      {label:"Puce",value:"Dimensity 9500"},
      {label:"Batterie",value:"7 000 mAh"},
      {label:"Charge",value:"100 W + 50 W"},
    ],
    variants:["12 Go + 256 Go","12 Go + 512 Go"],
    colors:["Noir","Violet profond","Bleu profond"],
    gallery:gallery("xiaomi-17t-pro"),
    specs:[
      {title:"Écran",rows:[
        {label:"Type",value:"AMOLED 6,83 pouces"},
        {label:"Résolution",value:"2772 × 1280 (1.5K), 447 ppp"},
        {label:"Rafraîchissement",value:"Jusqu’à 144 Hz"},
        {label:"Luminosité max.",value:"3 500 nits"},
        {label:"Protection",value:"Corning Gorilla Glass 7i"},
      ]},
      {title:"Performances",rows:[
        {label:"Processeur",value:"MediaTek Dimensity 9500, 3 nm"},
        {label:"GPU",value:"Mali G1-Ultra"},
        {label:"RAM",value:"12 Go LPDDR5X 9600 Mbps"},
        {label:"Stockage",value:"UFS 4.1, 256 ou 512 Go"},
      ]},
      {title:"Appareil photo",rows:[
        {label:"Principal Leica",value:"50 MP, 23 mm, f/1.67, OIS"},
        {label:"Téléobjectif périscopique",value:"50 MP, 115 mm, f/3.0, OIS"},
        {label:"Ultra grand-angle",value:"12 MP, 15 mm, 120°"},
        {label:"Selfie",value:"32 MP"},
        {label:"Vidéo",value:"Jusqu’à 8K 30 i/s et 4K 120 i/s"},
      ]},
      {title:"Batterie & dimensions",rows:[
        {label:"Batterie",value:"7 000 mAh silicium-carbone"},
        {label:"Charge filaire",value:"100 W HyperCharge"},
        {label:"Charge sans fil",value:"50 W HyperCharge"},
        {label:"Dimensions",value:"162,2 × 77,5 × 8,25 mm"},
        {label:"Poids",value:"219 g"},
      ]},
    ],
  },

  "honor-600":{
    slug:"honor-600",
    brand:"HONOR",
    name:"HONOR 600",
    category:"Smartphones",
    price:"7 999 DH",
    badge:"Nouveau",
    shortDescription:"Smartphone photo 200 MP avec grande batterie, écran 120 Hz et design fin.",
    longDescription:"Le HONOR 600 met l’accent sur le portrait, la photographie de nuit et l’autonomie. Il associe un capteur principal 200 MP avec OIS, un écran très lumineux à 120 Hz, une batterie 7 000 mAh sur les variantes commercialisées dans plusieurs marchés de la région et la charge HONOR SuperCharge 80 W.",
    rating:"4.7",
    reviewCount:"74 avis",
    availability:"Disponible",
    warranty:"Garantie constructeur",
    highlights:[
      {label:"Caméra",value:"200 MP OIS"},
      {label:"Écran",value:"120 Hz"},
      {label:"Batterie",value:"7 000 mAh"},
      {label:"Charge",value:"80 W"},
    ],
    variants:["8 Go + 256 Go","12 Go + 256 Go"],
    colors:["Orange","Golden White","Noir"],
    gallery:gallery("honor-600"),
    specs:[
      {title:"Écran",rows:[
        {label:"Rafraîchissement",value:"120 Hz"},
        {label:"HDR peak brightness",value:"Jusqu’à 8 000 nits"},
        {label:"Densité",value:"458 ppp"},
        {label:"Couleurs",value:"1,07 milliard, DCI-P3"},
      ]},
      {title:"Performances",rows:[
        {label:"Processeur",value:"Snapdragon 7 Gen 4"},
        {label:"RAM / stockage",value:"8 ou 12 Go RAM, 256 Go selon version"},
      ]},
      {title:"Appareil photo",rows:[
        {label:"Principal",value:"200 MP, capteur 1/1,4″, OIS"},
        {label:"Ultra grand-angle",value:"12 MP, 112°"},
        {label:"Selfie",value:"50 MP, f/2.0"},
      ]},
      {title:"Batterie & résistance",rows:[
        {label:"Batterie",value:"7 000 mAh (selon marché)"},
        {label:"Charge filaire",value:"80 W HONOR SuperCharge"},
        {label:"Charge inversée",value:"27 W filaire"},
        {label:"Résistance",value:"IP68 / IP69 / IP69K"},
        {label:"Poids",value:"190 g"},
        {label:"Épaisseur",value:"7,8 mm"},
      ]},
    ],
  },

  "redmi-note-15-pro-plus-5g":{
    slug:"redmi-note-15-pro-plus-5g",
    brand:"REDMI",
    name:"Note 15 Pro+ 5G",
    category:"Smartphones",
    price:"5 999 DH",
    badge:"Disponible",
    shortDescription:"200 MP OIS, écran AMOLED 1.5K et batterie 6 500 mAh avec HyperCharge 100 W.",
    longDescription:"Le REDMI Note 15 Pro+ 5G combine un écran CrystalRes AMOLED 6,83 pouces, le Snapdragon 7s Gen 4, une caméra principale 200 MP avec stabilisation optique et une batterie 6 500 mAh. C’est un modèle orienté endurance, photo et rapport équipement/prix.",
    rating:"4.8",
    reviewCount:"105 avis",
    availability:"En stock",
    warranty:"Garantie constructeur",
    highlights:[
      {label:"Caméra",value:"200 MP OIS"},
      {label:"Écran",value:"6,83″ 120 Hz"},
      {label:"Batterie",value:"6 500 mAh"},
      {label:"Charge",value:"100 W"},
    ],
    variants:["8 Go + 256 Go","12 Go + 512 Go"],
    colors:["Noir","Bleu","Moka"],
    gallery:gallery("redmi-note-15-pro-plus-5g"),
    specs:[
      {title:"Écran",rows:[
        {label:"Type",value:"AMOLED CrystalRes 6,83 pouces"},
        {label:"Résolution",value:"2772 × 1280 (1.5K), 447 ppp"},
        {label:"Rafraîchissement",value:"Jusqu’à 120 Hz"},
        {label:"Luminosité max.",value:"3 200 nits"},
        {label:"Protection",value:"Gorilla Glass Victus 2"},
      ]},
      {title:"Performances",rows:[
        {label:"Processeur",value:"Snapdragon 7s Gen 4, 4 nm"},
        {label:"RAM",value:"8 ou 12 Go LPDDR4X"},
        {label:"Stockage",value:"256 ou 512 Go UFS 2.2"},
      ]},
      {title:"Appareil photo",rows:[
        {label:"Principal",value:"200 MP, f/1.7, OIS"},
        {label:"Ultra grand-angle",value:"8 MP, f/2.2"},
        {label:"Selfie",value:"32 MP"},
        {label:"Vidéo arrière",value:"4K à 30 i/s"},
      ]},
      {title:"Batterie & dimensions",rows:[
        {label:"Batterie",value:"6 500 mAh"},
        {label:"Charge",value:"HyperCharge 100 W"},
        {label:"Dimensions",value:"163,34 × 78,31 × 8,19 mm (Noir/Bleu)"},
        {label:"Poids",value:"207,1 g (Noir/Bleu)"},
      ]},
    ],
  },

  "galaxy-tab-s11":{
    slug:"galaxy-tab-s11",
    brand:"Samsung",
    name:"Galaxy Tab S11",
    category:"Tablettes",
    price:"9 990 DH",
    badge:"Disponible",
    shortDescription:"Tablette 11 pouces Dynamic AMOLED 2X avec S Pen, 12 Go de RAM et batterie 8 400 mAh.",
    longDescription:"La Galaxy Tab S11 propose un format plus compact que la version Ultra tout en conservant un écran Dynamic AMOLED 2X, le S Pen, 12 Go de mémoire, l’extension microSD jusqu’à 2 To et une batterie 8 400 mAh. Elle est pensée pour le travail, la prise de notes et le multimédia.",
    rating:"4.8",
    reviewCount:"18 avis",
    availability:"Disponible",
    warranty:"Garantie constructeur Samsung",
    highlights:[
      {label:"Écran",value:"11″ AMOLED 2X"},
      {label:"Mémoire",value:"12 Go"},
      {label:"Batterie",value:"8 400 mAh"},
      {label:"Stylet",value:"S Pen"},
    ],
    variants:["12 Go + 128 Go","12 Go + 512 Go"],
    colors:["Gris","Argent"],
    gallery:gallery("galaxy-tab-s11"),
    specs:[
      {title:"Écran",rows:[
        {label:"Taille",value:"11,0 pouces"},
        {label:"Résolution",value:"2560 × 1600 (WQXGA)"},
        {label:"Technologie",value:"Dynamic AMOLED 2X"},
        {label:"S Pen",value:"Pris en charge"},
      ]},
      {title:"Performances & mémoire",rows:[
        {label:"CPU",value:"Octa-Core · jusqu’à 3,73 GHz"},
        {label:"RAM",value:"12 Go"},
        {label:"Stockage",value:"128 Go / 512 Go selon version"},
        {label:"Extension",value:"microSD jusqu’à 2 To"},
      ]},
      {title:"Appareil photo",rows:[
        {label:"Caméra arrière",value:"13 MP avec autofocus"},
        {label:"Caméra avant",value:"12 MP"},
        {label:"Vidéo",value:"UHD 4K à 30 i/s"},
      ]},
      {title:"Connectivité",rows:[
        {label:"Wi‑Fi",value:"Wi‑Fi 6E · 2,4 / 5 / 6 GHz"},
        {label:"Bluetooth",value:"5.4"},
        {label:"USB",value:"USB 3.2 Gen 1 Type-C"},
      ]},
      {title:"Batterie & dimensions",rows:[
        {label:"Batterie",value:"8 400 mAh"},
        {label:"Lecture vidéo",value:"Jusqu’à 18 h"},
        {label:"Dimensions",value:"165,3 × 253,8 × 5,5 mm"},
        {label:"Poids",value:"469 g (Wi‑Fi) / 471 g (5G)"},
      ]},
    ],
  },

  "galaxy-tab-s11-ultra":{
    slug:"galaxy-tab-s11-ultra",
    brand:"Samsung",
    name:"Galaxy Tab S11 Ultra",
    category:"Tablettes",
    price:"11 999 DH",
    badge:"Nouveau",
    shortDescription:"Grande tablette 14,6 pouces Dynamic AMOLED 2X avec S Pen, 12 Go de RAM et batterie 11 600 mAh.",
    longDescription:"La Galaxy Tab S11 Ultra vise le travail, le dessin et le multimédia sur un très grand écran. Elle combine un écran Dynamic AMOLED 2X 14,6 pouces, le S Pen, jusqu’à 2 To d’extension microSD sur la version 5G, une batterie 11 600 mAh et une connectivité Wi‑Fi 7 compatible 2,4/5/6 GHz.",
    rating:"4.8",
    reviewCount:"43 avis",
    availability:"En stock",
    warranty:"Garantie officielle Samsung",
    highlights:[
      {label:"Écran",value:"14,6″ AMOLED 2X"},
      {label:"Mémoire",value:"12 Go + 256 Go"},
      {label:"Batterie",value:"11 600 mAh"},
      {label:"Stylet",value:"S Pen"},
    ],
    variants:["12 Go + 256 Go","12 Go + 512 Go","1 To"],
    colors:["Gris","Argent"],
    gallery:gallery("galaxy-tab-s11-ultra"),
    specs:[
      {title:"Écran",rows:[
        {label:"Taille",value:"14,6 pouces"},
        {label:"Résolution",value:"2960 × 1848 (WQXGA+)"},
        {label:"Technologie",value:"Dynamic AMOLED 2X"},
        {label:"S Pen",value:"Pris en charge"},
      ]},
      {title:"Mémoire & stockage",rows:[
        {label:"RAM",value:"12 Go sur la version 256 Go"},
        {label:"Stockage",value:"256 Go / 512 Go / 1 To selon version"},
        {label:"Extension",value:"microSD jusqu’à 2 To"},
      ]},
      {title:"Caméras & connectivité",rows:[
        {label:"Caméras arrière",value:"13 MP + 8 MP"},
        {label:"Caméra avant",value:"12 MP"},
        {label:"Vidéo",value:"UHD 4K à 30 i/s"},
        {label:"Wi‑Fi",value:"Wi‑Fi a/b/g/n/ac/ax/be, 2,4/5/6 GHz"},
        {label:"Bluetooth",value:"5.4"},
        {label:"USB",value:"USB 3.2 Gen 1 Type-C"},
      ]},
      {title:"Batterie & dimensions",rows:[
        {label:"Batterie",value:"11 600 mAh"},
        {label:"Lecture vidéo",value:"Jusqu’à 23 h"},
        {label:"Dimensions",value:"208,5 × 326,3 × 5,1 mm"},
        {label:"Poids",value:"695 g (5G)"},
      ]},
    ],
  },

  "playstation-5":{
    slug:"playstation-5",
    brand:"Sony",
    name:"PlayStation 5",
    category:"Gaming",
    price:"6 999 DH",
    badge:"Top vente",
    shortDescription:"Console PS5 avec SSD 1 To, architecture AMD personnalisée, mémoire GDDR6 et manette DualSense.",
    longDescription:"La PlayStation 5 est conçue autour d’un SSD personnalisé très rapide, d’un processeur AMD Zen 2 et d’un GPU RDNA. La console standard actuelle propose 1 To de stockage et s’accompagne de l’écosystème DualSense pour le retour haptique et les gâchettes adaptatives.",
    rating:"4.9",
    reviewCount:"221 avis",
    availability:"En stock",
    warranty:"Garantie vendeur / constructeur selon circuit",
    highlights:[
      {label:"Stockage",value:"1 To SSD"},
      {label:"Mémoire",value:"16 Go GDDR6"},
      {label:"CPU",value:"AMD Zen 2, 8 cœurs"},
      {label:"GPU",value:"10 TFLOPS RDNA"},
    ],
    variants:["PS5 1 To","PS5 Digital Edition"],
    colors:["Blanc / Noir"],
    gallery:gallery("playstation-5"),
    specs:[
      {title:"Performances",rows:[
        {label:"CPU",value:"x86-64 AMD Ryzen Zen 2, 8 cœurs / 16 threads"},
        {label:"GPU",value:"AMD Radeon RDNA, 10 TFLOPS"},
        {label:"Mémoire",value:"16 Go GDDR6"},
      ]},
      {title:"Stockage & extension",rows:[
        {label:"SSD",value:"1 To Custom SSD sur la console standard actuelle"},
        {label:"Extension",value:"Connecteur M.2 SSD (Key M)"},
      ]},
      {title:"Connectique",rows:[
        {label:"USB-A",value:"2 × SuperSpeed USB 10 Gbit/s"},
        {label:"USB-C",value:"1 × Hi-Speed + 1 × SuperSpeed USB 10 Gbit/s"},
        {label:"Lecteur",value:"Lecteur de disque sur la version standard"},
      ]},
      {title:"Expérience de jeu",rows:[
        {label:"Contrôleur",value:"DualSense"},
        {label:"Vidéo",value:"Sortie 4K selon jeu et affichage"},
        {label:"Audio",value:"Tempest 3D AudioTech sur contenus compatibles"},
      ]},
    ],
  },
};

export const featuredProductSlugs=Object.keys(storeProducts);

export function getStoreProduct(slug:string){
  return storeProducts[slug];
}
