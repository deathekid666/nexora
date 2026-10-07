"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion(){
  useLayoutEffect(()=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx=gsap.context(()=>{
      const intro=gsap.timeline({defaults:{ease:"power3.out"}});

      intro
        .from(".exact-topbar",{autoAlpha:0,y:-8,duration:.26})
        .from(".exact-mainbar",{autoAlpha:0,y:-10,duration:.34},"-=.12")
        .from(".exact-nav",{autoAlpha:0,y:-8,duration:.28},"-=.18")
        .from(".exact-hero-copy>*",{autoAlpha:0,y:16,duration:.42,stagger:.055},"-=.02")
        .from(".exact-product-lineup img",{autoAlpha:0,y:20,scale:.96,duration:.5,stagger:.045},"-=.26")
        .from(".exact-location-badge",{autoAlpha:0,x:16,duration:.35},"-=.2")
        .from(".exact-trust>div",{autoAlpha:0,y:10,duration:.34,stagger:.045},"-=.12");

      gsap.from(".exact-card",{
        autoAlpha:0,
        y:18,
        scale:.988,
        duration:.5,
        stagger:.045,
        ease:"power3.out",
        scrollTrigger:{
          trigger:".exact-product-grid",
          start:"top 90%",
          once:true,
        },
      });

      const mm=gsap.matchMedia();
      mm.add("(min-width: 901px)",()=>{
        gsap.to(".exact-hero-bg",{
          scale:1.055,
          yPercent:-2.5,
          ease:"none",
          scrollTrigger:{
            trigger:".exact-hero",
            start:"top top",
            end:"bottom top",
            scrub:1,
          },
        });


        const hero=document.querySelector<HTMLElement>(".exact-hero");
        const lineup=document.querySelector<HTMLElement>(".exact-product-lineup");
        if(!hero||!lineup) return;

        const moveX=gsap.quickTo(lineup,"x",{duration:.55,ease:"power3.out"});
        const moveY=gsap.quickTo(lineup,"y",{duration:.55,ease:"power3.out"});
        const tiltX=gsap.quickTo(lineup,"rotationX",{duration:.65,ease:"power3.out"});
        const tiltY=gsap.quickTo(lineup,"rotationY",{duration:.65,ease:"power3.out"});

        const onPointerMove=(event:PointerEvent)=>{
          const rect=hero.getBoundingClientRect();
          const nx=((event.clientX-rect.left)/rect.width-.5)*2;
          const ny=((event.clientY-rect.top)/rect.height-.5)*2;
          moveX(nx*5);
          moveY(ny*2.5);
          tiltY(nx*1.5);
          tiltX(-ny*.75);
        };

        const resetDepth=()=>{
          moveX(0);
          moveY(0);
          tiltX(0);
          tiltY(0);
        };

        hero.addEventListener("pointermove",onPointerMove);
        hero.addEventListener("pointerleave",resetDepth);

        return()=>{
          hero.removeEventListener("pointermove",onPointerMove);
          hero.removeEventListener("pointerleave",resetDepth);
          resetDepth();
        };
      });

      const progress=document.querySelector<HTMLElement>(".site-progress>span");
      if(progress){
        ScrollTrigger.create({
          start:0,
          end:"max",
          onUpdate:self=>{
            gsap.set(progress,{scaleX:self.progress,transformOrigin:"left center"});
          },
        });
      }
    });

    ScrollTrigger.refresh();
    return()=>ctx.revert();
  },[]);

  return null;
}
