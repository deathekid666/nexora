"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FAVORITES_EVENT,
  isFavorite,
  toggleFavorite,
} from "@/lib/favorites-client";

export default function FavoriteButton({
  slug,
  className="",
  size=18,
  label,
}:{
  slug:string;
  className?:string;
  size?:number;
  label?:string;
}){
  const [active,setActive]=useState(false);

  useEffect(()=>{
    const sync=()=>setActive(isFavorite(slug));
    sync();
    window.addEventListener("storage",sync);
    window.addEventListener(FAVORITES_EVENT,sync as EventListener);
    return()=>{
      window.removeEventListener("storage",sync);
      window.removeEventListener(FAVORITES_EVENT,sync as EventListener);
    };
  },[slug]);

  const toggle=()=>{
    setActive(toggleFavorite(slug));
  };

  return (
    <button
      type="button"
      className={(className+" favorite-toggle "+(active?"is-favorite":"")).trim()}
      onClick={toggle}
      aria-pressed={active}
      aria-label={active?"Retirer des favoris":label||"Ajouter aux favoris"}
      title={active?"Retirer des favoris":"Ajouter aux favoris"}
    >
      <Heart size={size} fill={active?"currentColor":"none"}/>
    </button>
  );
}
