export type PublicInventoryRow={
  slug:string;
  variant:string;
  color:string;
  availableQty:number;
  lowStock:boolean;
};

export type PublicInventorySummary={
  slug:string;
  availableQty:number;
  inStock:boolean;
  lowStock:boolean;
};

export function inventoryKey(slug:string,variant:string,color:string){
  return [slug,variant,color].join("|");
}

export async function loadInventoryRows(slug:string):Promise<PublicInventoryRow[]>{
  try{
    const response=await fetch("/api/inventory?slug="+encodeURIComponent(slug),{cache:"no-store"});
    const payload=await response.json().catch(()=>({}));
    return response.ok&&Array.isArray(payload.inventory)?payload.inventory:[];
  }catch{
    return [];
  }
}

export async function loadInventorySummaryMap(slugs:string[]):Promise<Record<string,PublicInventorySummary>>{
  const unique=[...new Set(slugs.filter(Boolean))];
  if(!unique.length) return {};
  try{
    const response=await fetch("/api/inventory?slugs="+encodeURIComponent(unique.join(",")),{cache:"no-store"});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok||!Array.isArray(payload.inventory)) return {};
    return Object.fromEntries(payload.inventory.map((item:PublicInventorySummary)=>[item.slug,item]));
  }catch{
    return {};
  }
}
