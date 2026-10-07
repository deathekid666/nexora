export type CartItem={
  slug:string;
  name:string;
  brand:string;
  price:string;
  variant:string;
  color:string;
  qty:number;
  image:string;
};

export const CART_KEY="lhawta-cart-v1";
export const CART_EVENT="lhawta-cart-updated";

export function parsePrice(value:string){
  const n=Number(value.replace(/[^0-9]/g,""));
  return Number.isFinite(n)?n:0;
}

export function formatDh(value:number){
  return new Intl.NumberFormat("fr-MA").format(value)+" DH";
}

export function readCart():CartItem[]{
  if(typeof window==="undefined") return [];
  try{
    const raw=window.localStorage.getItem(CART_KEY);
    const parsed=raw?JSON.parse(raw):[];
    return Array.isArray(parsed)?parsed:[];
  }catch{
    return [];
  }
}

export function writeCart(items:CartItem[]){
  if(typeof window==="undefined") return;
  window.localStorage.setItem(CART_KEY,JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT,{detail:items}));
}

export function addToCart(item:CartItem){
  const current=readCart();
  const key=(x:CartItem)=>[x.slug,x.variant,x.color].join("|");
  const found=current.find(x=>key(x)===key(item));
  if(found) found.qty+=Math.max(1,item.qty||1);
  else current.push({...item,qty:Math.max(1,item.qty||1)});
  writeCart(current);
  return current;
}

export function cartCount(items:CartItem[]){
  return items.reduce((sum,item)=>sum+item.qty,0);
}

export function cartTotal(items:CartItem[]){
  return items.reduce((sum,item)=>sum+parsePrice(item.price)*item.qty,0);
}
