export const FAVORITES_KEY="lhawta-favorites-v1";
export const FAVORITES_EVENT="lhawta-favorites-updated";

export function readFavorites():string[]{
  if(typeof window==="undefined") return [];
  try{
    const raw=window.localStorage.getItem(FAVORITES_KEY);
    const parsed=raw?JSON.parse(raw):[];
    return Array.isArray(parsed)?parsed.filter(item=>typeof item==="string"):[];
  }catch{
    return [];
  }
}

export function writeFavorites(slugs:string[]){
  if(typeof window==="undefined") return;
  const unique=[...new Set(slugs)];
  window.localStorage.setItem(FAVORITES_KEY,JSON.stringify(unique));
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT,{detail:unique}));
}

export function isFavorite(slug:string){
  return readFavorites().includes(slug);
}

export function toggleFavorite(slug:string){
  const current=readFavorites();
  const next=current.includes(slug)
    ? current.filter(item=>item!==slug)
    : [...current,slug];
  writeFavorites(next);
  return next.includes(slug);
}
