import { storeProducts, type StoreProduct } from "@/lib/store-products";

function normalize(value:string){
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g," ")
    .trim();
}

function searchableText(product:StoreProduct){
  return normalize([
    product.brand,
    product.name,
    product.category,
    product.badge,
    product.shortDescription,
    product.longDescription,
    product.availability,
    product.warranty,
    ...product.variants,
    ...product.colors,
    ...product.highlights.flatMap(item=>[item.label,item.value]),
    ...product.specs.flatMap(section=>[
      section.title,
      ...section.rows.flatMap(row=>[row.label,row.value]),
    ]),
  ].join(" "));
}

export function searchStoreProducts(query:string){
  const normalized=normalize(query);
  if(!normalized) return [];

  const terms=normalized.split(/\s+/).filter(Boolean);

  return Object.values(storeProducts)
    .map(product=>{
      const haystack=searchableText(product);
      const name=normalize(product.name);
      const brand=normalize(product.brand);
      const category=normalize(product.category);

      if(!terms.every(term=>haystack.includes(term))) return null;

      let score=0;
      for(const term of terms){
        if(name===term) score+=12;
        if(name.startsWith(term)) score+=8;
        if(name.includes(term)) score+=6;
        if(brand===term||brand.startsWith(term)) score+=5;
        if(category.includes(term)) score+=3;
        if(haystack.includes(term)) score+=1;
      }

      return {product,score};
    })
    .filter((item):item is {product:StoreProduct;score:number}=>item!==null)
    .sort((a,b)=>b.score-a.score||a.product.name.localeCompare(b.product.name))
    .map(item=>item.product);
}
