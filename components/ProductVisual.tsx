"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageOff } from "lucide-react";

const cutoutCache = new Map<string,string>();

function colorDistance(r:number,g:number,b:number,br:number,bg:number,bb:number){
  return Math.sqrt((r-br)**2+(g-bg)**2+(b-bb)**2);
}

function keepLargestOpaqueComponent(source:HTMLCanvasElement){
  const ctx=source.getContext("2d",{willReadFrequently:true});
  if(!ctx) return source;

  const {width:w,height:h}=source;
  const image=ctx.getImageData(0,0,w,h);
  const d=image.data;
  const seen=new Uint8Array(w*h);
  const queue=new Int32Array(w*h);
  let best:number[]=[];
  const threshold=22;

  for(let start=0;start<w*h;start++){
    if(seen[start]||d[start*4+3]<=threshold) continue;

    let head=0,tail=0;
    const component:number[]=[];
    seen[start]=1;
    queue[tail++]=start;

    while(head<tail){
      const idx=queue[head++];
      component.push(idx);
      const x=idx%w;
      const y=(idx/w)|0;

      const push=(next:number)=>{
        if(next<0||next>=w*h||seen[next]||d[next*4+3]<=threshold) return;
        seen[next]=1;
        queue[tail++]=next;
      };

      if(x>0) push(idx-1);
      if(x<w-1) push(idx+1);
      if(y>0) push(idx-w);
      if(y<h-1) push(idx+w);
    }

    if(component.length>best.length) best=component;
  }

  if(!best.length) return source;

  const keep=new Uint8Array(w*h);
  for(const idx of best) keep[idx]=1;

  for(let idx=0;idx<w*h;idx++){
    if(!keep[idx]) d[idx*4+3]=0;
  }

  ctx.putImageData(image,0,0);
  return source;
}

function trimTransparentCanvas(source:HTMLCanvasElement){
  const ctx=source.getContext("2d",{willReadFrequently:true});
  if(!ctx) return source;

  const {width:w,height:h}=source;
  const data=ctx.getImageData(0,0,w,h).data;
  let minX=w,minY=h,maxX=-1,maxY=-1;

  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      if(data[(y*w+x)*4+3]>14){
        if(x<minX) minX=x;
        if(x>maxX) maxX=x;
        if(y<minY) minY=y;
        if(y>maxY) maxY=y;
      }
    }
  }

  if(maxX<minX||maxY<minY) return source;

  const boxW=maxX-minX+1;
  const boxH=maxY-minY+1;
  const pad=Math.max(2,Math.round(Math.max(boxW,boxH)*.018));
  const sx=Math.max(0,minX-pad);
  const sy=Math.max(0,minY-pad);
  const sw=Math.min(w-sx,boxW+pad*2);
  const sh=Math.min(h-sy,boxH+pad*2);

  if(sw>w*.96&&sh>h*.96) return source;

  const out=document.createElement("canvas");
  out.width=sw;
  out.height=sh;
  const outCtx=out.getContext("2d");
  if(!outCtx) return source;
  outCtx.drawImage(source,sx,sy,sw,sh,0,0,sw,sh);
  return out;
}

function removeConnectedBackdrop(ctx:CanvasRenderingContext2D,w:number,h:number){
  const image=ctx.getImageData(0,0,w,h);
  const d=image.data;
  const samples:number[][]=[];

  const pick=(x:number,y:number)=>{
    const i=(y*w+x)*4;
    if(d[i+3]>18) samples.push([d[i],d[i+1],d[i+2]]);
  };

  const span=Math.max(3,Math.floor(Math.min(w,h)*0.035));
  for(let y=0;y<span;y++){
    for(let x=0;x<span;x++){
      pick(x,y);
      pick(w-1-x,y);
      pick(x,h-1-y);
      pick(w-1-x,h-1-y);
    }
  }

  if(!samples.length) return image;

  const mean=samples.reduce((a,s)=>[a[0]+s[0],a[1]+s[1],a[2]+s[2]],[0,0,0]).map(v=>v/samples.length);
  const avgSpread=samples.reduce((sum,s)=>sum+colorDistance(s[0],s[1],s[2],mean[0],mean[1],mean[2]),0)/samples.length;

  // Only treat the edge as a removable backdrop when the corners are reasonably coherent.
  if(avgSpread>58) return image;

  const anchors=[
    samples[0],
    samples[Math.floor(samples.length*.25)]||samples[0],
    samples[Math.floor(samples.length*.5)]||samples[0],
    samples[Math.floor(samples.length*.75)]||samples[0],
    samples[samples.length-1]||samples[0],
    mean,
  ];

  const seen=new Uint8Array(w*h);
  const q=new Int32Array(w*h);
  let head=0,tail=0;

  const isBackdrop=(idx:number)=>{
    const p=idx*4;
    if(d[p+3]<8) return true;
    const r=d[p],g=d[p+1],b=d[p+2];
    let min=Infinity;
    for(const a of anchors) min=Math.min(min,colorDistance(r,g,b,a[0],a[1],a[2]));
    return min<86;
  };

  const push=(idx:number)=>{
    if(idx<0||idx>=w*h||seen[idx]||!isBackdrop(idx)) return;
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

  const alpha=new Uint8ClampedArray(w*h);
  for(let idx=0;idx<w*h;idx++) alpha[idx]=d[idx*4+3];

  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const idx=y*w+x;
      if(alpha[idx]===0) continue;
      const edge=
        alpha[idx-1]===0||alpha[idx+1]===0||
        alpha[idx-w]===0||alpha[idx+w]===0;
      if(edge) d[idx*4+3]=Math.min(d[idx*4+3],175);
    }
  }

  return image;
}

export function HeroProductVisual({
  src,
  alt,
  className="",
  isolateLargest=false,
}:{
  src:string;
  alt:string;
  className?:string;
  isolateLargest?:boolean;
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
        const maxSide=960;
        const scale=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight));
        const w=Math.max(1,Math.round(image.naturalWidth*scale));
        const h=Math.max(1,Math.round(image.naturalHeight*scale));
        const canvas=document.createElement("canvas");
        canvas.width=w;
        canvas.height=h;
        const ctx=canvas.getContext("2d",{willReadFrequently:true});
        if(!ctx) throw new Error("Canvas unavailable");
        ctx.drawImage(image,0,0,w,h);
        const cleaned=removeConnectedBackdrop(ctx,w,h);
        ctx.putImageData(cleaned,0,0);
        if(isolateLargest) keepLargestOpaqueComponent(canvas);
        const output=trimTransparentCanvas(canvas);

        output.toBlob(blob=>{
          if(!blob){
            if(mounted.current) setResolved(src);
            return;
          }
          const url=URL.createObjectURL(blob);
          cutoutCache.set(src,url);
          if(mounted.current) setResolved(url);
        },"image/webp",0.95);
      }catch{
        if(mounted.current) setResolved(src);
      }
    };

    image.onerror=()=>{
      if(mounted.current) setFailed(true);
    };

    image.src=src;
    return()=>{mounted.current=false;};
  },[src,isolateLargest]);

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
