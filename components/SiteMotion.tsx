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

        gsap.to(".line-s26",{y:-8,ease:"none",scrollTrigger:{trigger:".exact-hero",start:"top top",end:"bottom top",scrub:1}});
        gsap.to(".line-xiaomi",{y:6,ease:"none",scrollTrigger:{trigger:".exact-hero",start:"top top",end:"bottom top",scrub:1.05}});
        gsap.to(".line-tab",{y:-7,ease:"none",scrollTrigger:{trigger:".exact-hero",start:"top top",end:"bottom top",scrub:1.1}});
        gsap.to(".line-ps5",{y:7,ease:"none",scrollTrigger:{trigger:".exact-hero",start:"top top",end:"bottom top",scrub:1.15}});
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
