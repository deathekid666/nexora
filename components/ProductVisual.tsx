"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageOff } from "lucide-react";

const cutoutCache = new Map<string,string>();

function colorDistance(r:number,g:number,b:number,br:number,bg:number,bb:number){
  return Math.sqrt((r-br)**2+(g-bg)**2+(b-bb)**2);
}

function removeConnectedLightBackground(ctx:CanvasRenderingContext2D,w:number,h:number){
  const image=ctx.getImageData(0,0,w,h);
  const d=image.data;

  const samples:number[][]=[];
  const pick=(x:number,y:number)=>{
    const i=(y*w+x)*4;
    samples.push([d[i],d[i+1],d[i+2],d[i+3]]);
  };

  const span=Math.max(2,Math.floor(Math.min(w,h)*0.025));
  for(let y=0;y<span;y++){
    for(let x=0;x<span;x++){
      pick(x,y);
      pick(w-1-x,y);
      pick(x,h-1-y);
      pick(w-1-x,h-1-y);
    }
  }

  const opaque=samples.filter(s=>s[3]>20);
  if(!opaque.length) return image;

  const bg=opaque.reduce((a,s)=>[a[0]+s[0],a[1]+s[1],a[2]+s[2]], [0,0,0]).map(v=>v/opaque.length);
  const [br,bgC,bb]=bg;
  const brightness=(br+bgC+bb)/3;

  // Only strip a genuinely light, near-neutral connected backdrop.
  if(brightness<188 || Math.max(br,bgC,bb)-Math.min(br,bgC,bb)>42) return image;

  const seen=new Uint8Array(w*h);
  const q=new Int32Array(w*h);
  let head=0,tail=0;

  const matches=(idx:number)=>{
    const p=idx*4;
    if(d[p+3]<8) return true;
    const lum=(d[p]+d[p+1]+d[p+2])/3;
    return lum>158 && colorDistance(d[p],d[p+1],d[p+2],br,bgC,bb)<72;
  };

  const push=(idx:number)=>{
    if(idx<0||idx>=w*h||seen[idx]||!matches(idx)) return;
    seen[idx]=1;
    q[tail++]=idx;
  };

  for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
  for(let y=1;y<h-1;y++){push(y*w);push(y*w+w-1);}

  while(head<tail){
    const idx=q[head++];
    const x=idx%w;
    const y=(idx/w)|0;
    if(x>0) push(idx-1);
    if(x<w-1) push(idx+1);
    if(y>0) push(idx-w);
    if(y<h-1) push(idx+w);
  }

  for(let idx=0;idx<w*h;idx++){
    if(seen[idx]) d[idx*4+3]=0;
  }

  // Feather only the newly-transparent edge to avoid hard halos.
  const alpha=new Uint8ClampedArray(w*h);
  for(let idx=0;idx<w*h;idx++) alpha[idx]=d[idx*4+3];
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const idx=y*w+x;
      if(alpha[idx]===0) continue;
      const nearTransparent=
        alpha[idx-1]===0||alpha[idx+1]===0||
        alpha[idx-w]===0||alpha[idx+w]===0;
      if(!nearTransparent) continue;
      const p=idx*4;
      const lum=(d[p]+d[p+1]+d[p+2])/3;
      if(lum>185) d[p+3]=Math.min(d[p+3],150);
    }
  }

  return image;
}

export function HeroProductVisual({
  src,
  alt,
  className="",
}:{
  src:string;
  alt:string;
  className?:string;
}){
  const [resolved,setResolved]=useState(()=>cutoutCache.get(src)??src);
  const [failed,setFailed]=useState(false);
  const mounted=useRef(true);

  useEffect(()=>{
    mounted.current=true;
    const cached=cutoutCache.get(src);
    if(cached){
      setResolved(cached);
      return ()=>{mounted.current=false;};
    }

    const image=new Image();
    image.decoding="async";
    image.crossOrigin="anonymous";

    image.onload=()=>{
      try{
        const maxSide=920;
        const scale=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight));
        const w=Math.max(1,Math.round(image.naturalWidth*scale));
        const h=Math.max(1,Math.round(image.naturalHeight*scale));
        const canvas=document.createElement("canvas");
        canvas.width=w;
        canvas.height=h;
        const ctx=canvas.getContext("2d",{willReadFrequently:true});
        if(!ctx) throw new Error("Canvas unavailable");
        ctx.drawImage(image,0,0,w,h);
        const cleaned=removeConnectedLightBackground(ctx,w,h);
        ctx.putImageData(cleaned,0,0);

        canvas.toBlob(blob=>{
          if(!blob){
            if(mounted.current) setResolved(src);
            return;
          }
          const url=URL.createObjectURL(blob);
          cutoutCache.set(src,url);
          if(mounted.current) setResolved(url);
        },"image/webp",0.94);
      }catch{
        if(mounted.current) setResolved(src);
      }
    };

    image.onerror=()=>{
      if(mounted.current) setFailed(true);
    };

    image.src=src;
    return()=>{mounted.current=false;};
  },[src]);

  if(failed){
    return <span className={"product-visual-fallback "+className}><ImageOff size={24}/></span>;
  }

  return <img className={className} src={resolved} alt={alt} draggable={false}/>;
}

export function ProductVisual({
  src,
  alt,
  className="",
}:{
  src:string;
  alt:string;
  className?:string;
}){
  const [failed,setFailed]=useState(false);
  const label=useMemo(()=>alt.trim().slice(0,42),[alt]);

  if(failed){
    return (
      <span className={"product-visual-fallback "+className} aria-label={label}>
        <ImageOff size={22}/>
        <small>{label}</small>
      </span>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>;
}
