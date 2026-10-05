"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-animate > *", {
        opacity: 0,
        y: 34,
        duration: 1,
        stagger: 0.09,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, scale: 0.94, y: 20 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      const track = document.querySelector(".brand-marquee-track");
      if (track) {
        gsap.to(track, {
          xPercent: -50,
          duration: 28,
          repeat: -1,
          ease: "none",
        });
      }

      ScrollTrigger.create({
        start: 60,
        onUpdate: (self) => {
          document.querySelector(".store-header")?.classList.toggle("scrolled", self.scroll() > 60);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
