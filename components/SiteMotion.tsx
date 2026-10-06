"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion(){
  useLayoutEffect(()=>{
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced) return;

    const cleanups:Array<()=>void>=[];
    const ctx=gsap.context(()=>{
      const intro=gsap.timeline({defaults:{ease:"power3.out"}});

      intro
        .from(".sketch-topbar",{autoAlpha:0,y:-8,duration:.26})
        .from(".sketch-main-header",{autoAlpha:0,y:-12,duration:.34},"-=.12")
        .from(".sketch-nav",{autoAlpha:0,y:-10,duration:.3},"-=.18")
        .from(".sketch-all,.sketch-nav-categories a,.sketch-nav-special a",{autoAlpha:0,y:-8,duration:.32,stagger:.028},"-=.2")
        .from(".premium-hero-copy > *",{autoAlpha:0,y:24,duration:.54,stagger:.065},"-=.03")
        .from(".hero-product-main",{autoAlpha:0,x:28,y:18,scale:.96,duration:.7},"-=.36")
        .from(".hero-product-small",{autoAlpha:0,x:26,y:16,scale:.965,duration:.58,stagger:.08},"-=.42")
        .from(".premium-trust-strip",{autoAlpha:0,y:14,duration:.42},"-=.16");

      gsap.fromTo(".sketch-hero",{
        clipPath:"inset(2.5% 2.5% 2.5% 2.5% round 26px)",
        scale:.992
      },{
        clipPath:"inset(0% 0% 0% 0% round 20px)",
        scale:1,
        duration:.86,
        ease:"power4.out"
      });

      const revealGroups=[
        {selector:".sketch-trust-strip>div",trigger:".sketch-trust-strip",y:18,stagger:.06},
        {selector:".sketch-category-strip a",trigger:".sketch-category-strip",y:16,stagger:.04},
        {selector:".sketch-product-card",trigger:".sketch-product-grid",y:28,stagger:.055},
        {selector:".sketch-services-grid article",trigger:".sketch-services-grid",y:24,stagger:.055},
        {selector:".sketch-faq-list details",trigger:".sketch-faq-list",y:16,stagger:.05},
        {selector:".category-product-card",trigger:".category-grid",y:26,stagger:.055},
      ];

      revealGroups.forEach(({selector,trigger,y,stagger})=>{
        if(!document.querySelector(trigger)) return;
        gsap.from(selector,{
          autoAlpha:0,
          y,
          scale:.985,
          duration:.62,
          stagger,
          ease:"power3.out",
          scrollTrigger:{trigger,start:"top 90%",once:true}
        });
      });

      gsap.utils.toArray<HTMLElement>(".sketch-section-head").forEach((el)=>{
        gsap.from(el.children,{
          autoAlpha:0,
          y:22,
          duration:.58,
          stagger:.07,
          ease:"power3.out",
          scrollTrigger:{trigger:el,start:"top 91%",once:true}
        });
      });

      gsap.utils.toArray<HTMLElement>(".sketch-promo-card").forEach((el,index)=>{
        gsap.fromTo(el,{
          autoAlpha:0,
          y:30,
          scale:.975,
          clipPath:"inset(0 0 10% 0 round 20px)"
        },{
          autoAlpha:1,
          y:0,
          scale:1,
          clipPath:"inset(0 0 0% 0 round 17px)",
          duration:.72,
          delay:index*.06,
          ease:"power3.out",
          scrollTrigger:{trigger:el,start:"top 91%",once:true}
        });
      });

      if(document.querySelector(".sketch-compare")){
        const compareTl=gsap.timeline({
          scrollTrigger:{trigger:".sketch-compare",start:"top 82%",once:true}
        });
        compareTl
          .from(".sketch-compare-copy",{autoAlpha:0,x:-30,duration:.62,ease:"power3.out"})
          .from(".sketch-compare-table",{autoAlpha:0,y:26,scale:.975,duration:.62,ease:"power3.out"},"-=.34")
          .from(".sketch-compare-row",{autoAlpha:0,y:14,duration:.4,stagger:.06,ease:"power3.out"},"-=.22");
      }

      if(document.querySelector(".category-hero")){
        const categoryTl=gsap.timeline({defaults:{ease:"power3.out"}});
        categoryTl
          .from(".category-back",{autoAlpha:0,x:-14,duration:.34})
          .from(".category-hero>div>span,.category-hero h1,.category-hero p",{autoAlpha:0,y:22,duration:.5,stagger:.07},"-=.12")
          .from(".category-hero aside",{autoAlpha:0,x:24,scale:.98,duration:.56},"-=.3")
          .from(".category-toolbar>*",{autoAlpha:0,y:10,duration:.4,stagger:.06},"-=.18")
          .from(".category-sidebar",{autoAlpha:0,x:-18,duration:.5},"-=.18");
      }

      const mm=gsap.matchMedia();

      mm.add("(min-width: 901px)",()=>{
        if(document.querySelector(".premium-hero")){
          gsap.to(".premium-hero-copy",{
            y:-18,
            autoAlpha:.78,
            ease:"none",
            scrollTrigger:{trigger:".premium-hero",start:"top top",end:"bottom top",scrub:1.1}
          });

          gsap.to(".hero-product-main",{
            y:-18,
            scale:1.015,
            ease:"none",
            scrollTrigger:{trigger:".premium-hero",start:"top top",end:"bottom top",scrub:1.05}
          });

          gsap.to(".hero-xiaomi",{
            y:14,
            ease:"none",
            scrollTrigger:{trigger:".premium-hero",start:"top top",end:"bottom top",scrub:1.12}
          });

          gsap.to(".hero-ps5",{
            y:-12,
            ease:"none",
            scrollTrigger:{trigger:".premium-hero",start:"top top",end:"bottom top",scrub:1.16}
          });

          const hero=document.querySelector<HTMLElement>(".premium-hero");
          const showcase=document.querySelector<HTMLElement>(".premium-showcase");
          if(hero&&showcase){
            const moveX=gsap.quickTo(showcase,"x",{duration:.6,ease:"power3.out"});
            const moveY=gsap.quickTo(showcase,"y",{duration:.6,ease:"power3.out"});

            const move=(event:MouseEvent)=>{
              const rect=hero.getBoundingClientRect();
              const px=(event.clientX-rect.left)/rect.width-.5;
              const py=(event.clientY-rect.top)/rect.height-.5;
              moveX(px*6);
              moveY(py*4);
            };
            const leave=()=>{
              moveX(0);
              moveY(0);
            };

            hero.addEventListener("mousemove",move);
            hero.addEventListener("mouseleave",leave);
            cleanups.push(()=>{
              hero.removeEventListener("mousemove",move);
              hero.removeEventListener("mouseleave",leave);
            });
          }
        }

        gsap.utils.toArray<HTMLElement>(".sketch-promo-card").forEach((el)=>{
          const img=el.querySelector("img");
          if(!img) return;
          gsap.fromTo(img,{scale:1.08,yPercent:2},{
            scale:1,
            yPercent:-4,
            ease:"none",
            scrollTrigger:{trigger:el,start:"top bottom",end:"bottom top",scrub:1}
          });
        });

        gsap.utils.toArray<HTMLElement>(".sketch-product-card,.category-product-card").forEach((el,index)=>{
          gsap.to(el,{
            y:index%2===0?-5:-2,
            ease:"none",
            scrollTrigger:{trigger:el,start:"top bottom",end:"bottom top",scrub:.65}
          });
        });
      });

      const nav=document.querySelector<HTMLElement>(".sketch-nav");
      const progress=document.querySelector<HTMLElement>(".site-progress>span");

      ScrollTrigger.create({
        start:0,
        end:"max",
        onUpdate:self=>{
          nav?.classList.toggle("nav-scrolled",self.scroll()>90);
          if(progress){
            gsap.set(progress,{scaleX:self.progress,transformOrigin:"left center"});
          }
        }
      });
    });

    ScrollTrigger.refresh();

    return()=>{
      cleanups.forEach(fn=>fn());
      ctx.revert();
    };
  },[]);

  return null;
}
