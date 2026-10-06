"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion(){
  useLayoutEffect(()=>{
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced) return;

    const ctx=gsap.context(()=>{
      const intro=gsap.timeline({defaults:{ease:"power3.out"}});
      intro
        .from(".ref-header-main",{autoAlpha:0,y:-10,duration:.38})
        .from(".ref-header-nav",{autoAlpha:0,y:-6,duration:.28},"-=.18")
        .from(".ref-hero-copy > *",{autoAlpha:0,y:18,duration:.46,stagger:.06},"-=.04")
        .from(".ref-hero-product",{autoAlpha:0,y:24,scale:.96,duration:.7},"-=.32")
        .from(".ref-hero-buycard",{autoAlpha:0,x:22,y:8,scale:.98,duration:.52},"-=.38")
        .from(".ref-hero-benefits>div",{autoAlpha:0,y:10,duration:.36,stagger:.06},"-=.18")
        .from(".ref-category-strip a",{autoAlpha:0,y:12,duration:.4,stagger:.035},"-=.08");

      gsap.to(".ref-hero-bg",{
        scale:1.075,
        yPercent:-4,
        ease:"none",
        scrollTrigger:{
          trigger:".ref-hero",
          start:"top top",
          end:"bottom top",
          scrub:1.05,
        },
      });

      gsap.to(".ref-hero-product",{
        y:-18,
        ease:"none",
        scrollTrigger:{
          trigger:".ref-hero",
          start:"top top",
          end:"bottom top",
          scrub:1.1,
        },
      });

      gsap.to(".ref-hero-buycard",{
        y:10,
        ease:"none",
        scrollTrigger:{
          trigger:".ref-hero",
          start:"top top",
          end:"bottom top",
          scrub:1.18,
        },
      });

      const groups=[
        [".ref-product-card",".ref-product-grid"],
        [".ref-deal-cards article",".ref-deals"],
        [".ref-compare-phones>div",".ref-compare"],
        [".ref-why-grid article",".ref-why"],
        [".ref-brands>div a",".ref-brand-help"],
        [".ref-help-card",".ref-brand-help"],
        [".ref-faq details",".ref-faq"],
      ] as const;

      groups.forEach(([selector,trigger])=>{
        if(!document.querySelector(trigger)) return;
        gsap.from(selector,{
          autoAlpha:0,
          y:18,
          scale:.985,
          duration:.55,
          stagger:.05,
          ease:"power3.out",
          scrollTrigger:{trigger,start:"top 90%",once:true},
        });
      });

      if(document.querySelector(".ref-deals")){
        const tl=gsap.timeline({
          scrollTrigger:{trigger:".ref-deals",start:"top 86%",once:true},
        });
        tl
          .from(".ref-deals-copy>*",{autoAlpha:0,x:-18,duration:.45,stagger:.045,ease:"power3.out"})
          .from(".ref-deal-cards",{autoAlpha:0,x:20,duration:.5,ease:"power3.out"},"-=.28");
      }

      if(document.querySelector(".ref-compare")){
        const tl=gsap.timeline({
          scrollTrigger:{trigger:".ref-compare",start:"top 86%",once:true},
        });
        tl
          .from(".ref-compare-copy>*",{autoAlpha:0,x:-16,duration:.42,stagger:.045,ease:"power3.out"})
          .from(".ref-compare-phones>*",{autoAlpha:0,y:16,duration:.4,stagger:.06,ease:"power3.out"},"-=.25")
          .from(".ref-compare-points>div",{autoAlpha:0,x:14,duration:.38,stagger:.06,ease:"power3.out"},"-=.24");
      }

      if(document.querySelector(".ref-newsletter")){
        gsap.from(".ref-newsletter>*",{
          autoAlpha:0,
          y:14,
          duration:.5,
          stagger:.07,
          ease:"power3.out",
          scrollTrigger:{trigger:".ref-newsletter",start:"top 92%",once:true},
        });
      }

      if(document.querySelector(".ref-footer")){
        gsap.from(".ref-footer>div",{
          autoAlpha:0,
          y:16,
          duration:.5,
          stagger:.06,
          ease:"power3.out",
          scrollTrigger:{trigger:".ref-footer",start:"top 92%",once:true},
        });
      }

      const mm=gsap.matchMedia();
      mm.add("(min-width: 900px)",()=>{
        gsap.utils.toArray<HTMLElement>(".ref-product-card").forEach((card)=>{
          const img=card.querySelector(".ref-product-img img");
          if(!img) return;
          gsap.to(img,{
            yPercent:-3,
            ease:"none",
            scrollTrigger:{trigger:card,start:"top bottom",end:"bottom top",scrub:.7},
          });
        });
      });

      const progress=document.querySelector<HTMLElement>(".site-progress>span");
      if(progress){
        ScrollTrigger.create({
          start:0,
          end:"max",
          onUpdate:self=>gsap.set(progress,{scaleX:self.progress,transformOrigin:"left center"}),
        });
      }
    });

    ScrollTrigger.refresh();
    return()=>ctx.revert();
  },[]);

  return null;
}
