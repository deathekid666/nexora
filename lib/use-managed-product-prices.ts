"use client";
import {useEffect,useState} from "react";
type Variant={storage:string;color:string;priceMad:number;compareAtPriceMad:number|null;stock:number};
export type PublicManagedProduct={slug:string;price:string;oldPrice?:string;enabled:boolean;variants:Variant[]};
export function useManagedProductPrices(){
 const [products,setProducts]=useState<Record<string,PublicManagedProduct>>({});
 useEffect(()=>{let live=true;fetch("/api/catalog-options",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(data=>{
   if(!live||!Array.isArray(data?.products))return;
   const next:Record<string,PublicManagedProduct>={};
   for(const product of data.products as PublicManagedProduct[])next[product.slug]=product;
   setProducts(next);
  }).catch(()=>{});
  return()=>{live=false};
 },[]);
 return products;
}
