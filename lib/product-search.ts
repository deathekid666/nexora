import { allCatalogProducts, type AllCatalogProduct } from "@/lib/category-catalogs";
import { storeProducts } from "@/lib/store-products";

export type SearchProduct={
  slug:string;
  brand:string;
  name:string;
  category:string;
  badge:string;
  shortDescription:string;
  price:string;
  oldPrice?:string;
  image:string;
  highlights:{label:string;value:string}[];
  compareSlug?:string;
  searchText:string;
};

function normalize(value:string){
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g," ")
    .trim();
}

const aliases:Record<string,string[]>={
  "playstation-5":["PS5","Play Station 5","Sony PS5","console Sony"],
};

function detailedSearchText(slug:string){
  const product=storeProducts[slug];
  if(!product) return "";

  return [
    product.slug,
    ...(aliases[product.slug]||[]),
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
  ].join(" ");
}

function catalogToSearchProduct(product:AllCatalogProduct):SearchProduct{
  const detailed=product.detailSlug?storeProducts[product.detailSlug]:undefined;

  if(detailed){
    return {
      slug:product.productSlug,
      brand:detailed.brand,
      name:detailed.name,
      category:detailed.category,
      badge:detailed.badge,
      shortDescription:detailed.shortDescription,
      price:detailed.price,
      oldPrice:detailed.oldPrice,
      image:detailed.gallery[0],
      highlights:detailed.highlights.slice(0,3),
      compareSlug:detailed.slug,
      searchText:[
        detailedSearchText(detailed.slug),
        product.name,
        product.categoryTitle,
        ...product.specs,
      ].join(" "),
    };
  }

  return {
    slug:product.productSlug,
    brand:product.brand,
    name:product.name,
    category:product.categoryTitle,
    badge:product.badge||"Catalogue",
    shortDescription:product.specs.join(" · "),
    price:product.price,
    oldPrice:product.old,
    image:product.image,
    highlights:product.specs.slice(0,3).map((value,index)=>({
      label:"Caractéristique "+(index+1),
      value,
    })),
    searchText:[
      product.productSlug,
      product.brand,
      product.name,
      product.categoryTitle,
      product.badge||"",
      ...product.specs,
    ].join(" "),
  };
}

export const searchableProducts:SearchProduct[]=allCatalogProducts.map(catalogToSearchProduct);

export function searchStoreProducts(query:string){
  const normalized=normalize(query);
  if(!normalized) return [];

  const terms=normalized.split(/\s+/).filter(Boolean);

  return searchableProducts
    .map(product=>{
      const haystack=normalize(product.searchText);
      const compactHaystack=haystack.replace(/\s+/g,"");
      const name=normalize(product.name);
      const brand=normalize(product.brand);
      const category=normalize(product.category);

      if(!terms.every(term=>haystack.includes(term)||compactHaystack.includes(term.replace(/\s+/g,"")))) return null;

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
    .filter((item):item is {product:SearchProduct;score:number}=>item!==null)
    .sort((a,b)=>b.score-a.score||a.product.name.localeCompare(b.product.name))
    .map(item=>item.product);
}
