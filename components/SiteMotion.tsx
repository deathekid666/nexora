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
        .from(".sketch-topbar",{autoAlpha:0,y:-8,duration:.28})
        .from(".sketch-main-header",{autoAlpha:0,y:-12,duration:.38},"-=.12")
        .from(".sketch-nav",{autoAlpha:0,y:-8,duration:.35},"-=.18")
        .from(".sketch-hero-copy > *",{autoAlpha:0,y:22,duration:.52,stagger:.07},"-=.05")
        .from(".sketch-device-card",{autoAlpha:0,y:30,scale:.92,rotation:0,duration:.62,stagger:.075},"-=.36")
        .from(".sketch-hero-loc",{autoAlpha:0,x:18,duration:.4},"-=.2");

      gsap.from(".sketch-trust-strip>div",{
        autoAlpha:0,y:14,duration:.46,stagger:.06,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-trust-strip",start:"top 94%",once:true}
      });

      gsap.from(".sketch-category-strip a",{
        autoAlpha:0,y:12,duration:.42,stagger:.035,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-category-strip",start:"top 94%",once:true}
      });

      gsap.from(".sketch-section-head>*",{
        autoAlpha:0,y:20,duration:.55,stagger:.06,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-products-section",start:"top 90%",once:true}
      });

      gsap.from(".sketch-product-card",{
        autoAlpha:0,y:26,duration:.58,stagger:.055,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-product-grid",start:"top 90%",once:true}
      });

      gsap.from(".sketch-promo-card",{
        autoAlpha:0,y:26,scale:.985,duration:.65,stagger:.08,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-promos",start:"top 90%",once:true}
      });

      gsap.from(".sketch-compare-copy",{
        autoAlpha:0,x:-26,duration:.68,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-compare",start:"top 82%",once:true}
      });

      gsap.from(".sketch-compare-row",{
        autoAlpha:0,y:16,duration:.46,stagger:.07,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-compare-table",start:"top 88%",once:true}
      });

      gsap.from(".sketch-services-grid article",{
        autoAlpha:0,y:22,duration:.55,stagger:.055,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-services-grid",start:"top 90%",once:true}
      });

      gsap.from(".sketch-faq-list details",{
        autoAlpha:0,y:14,duration:.45,stagger:.05,ease:"power3.out",
        scrollTrigger:{trigger:".sketch-faq-list",start:"top 90%",once:true}
      });

      const mm=gsap.matchMedia();

      mm.add("(min-width: 901px)",()=>{
        gsap.to(".sketch-hero-bg",{
          yPercent:-5,scale:1.08,ease:"none",
          scrollTrigger:{trigger:".sketch-hero",start:"top bottom",end:"bottom top",scrub:1}
        });

        gsap.to(".device-samsung",{y:-12,ease:"none",scrollTrigger:{trigger:".sketch-hero",start:"top top",end:"bottom top",scrub:1.1}});
        gsap.to(".device-xiaomi",{y:18,ease:"none",scrollTrigger:{trigger:".sketch-hero",start:"top top",end:"bottom top",scrub:1.15}});
        gsap.to(".device-tablet",{x:16,y:-8,ease:"none",scrollTrigger:{trigger:".sketch-hero",start:"top top",end:"bottom top",scrub:1.05}});
        gsap.to(".device-ps5",{y:-18,ease:"none",scrollTrigger:{trigger:".sketch-hero",start:"top top",end:"bottom top",scrub:1.2}});

        gsap.utils.toArray<HTMLElement>(".sketch-promo-card").forEach((el)=>{
          const img=el.querySelector("img");
          if(!img) return;
          gsap.fromTo(img,{scale:1.06},{scale:1,ease:"none",scrollTrigger:{trigger:el,start:"top bottom",end:"bottom top",scrub:1}});
        });
      });

      gsap.utils.toArray<HTMLElement>(".sketch-product-card").forEach((card)=>{
        const img=card.querySelector(".sketch-product-media img");
        if(!img) return;
        const enter=()=>gsap.to(img,{scale:1.045,duration:.28,ease:"power2.out"});
        const leave=()=>gsap.to(img,{scale:1,duration:.34,ease:"power2.out"});
        card.addEventListener("mouseenter",enter);
        card.addEventListener("mouseleave",leave);
      });

      const progress=document.querySelector<HTMLElement>(".site-progress>span");
      ScrollTrigger.create({
        start:0,end:"max",
        onUpdate:self=>{
          if(progress) gsap.set(progress,{scaleX:self.progress,transformOrigin:"left center"});
        }
      });
    });

    ScrollTrigger.refresh();
    return()=>ctx.revert();
  },[]);

  return null;
}
