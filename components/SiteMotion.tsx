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
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .from(".lhawta-offer-strip", { autoAlpha: 0, y: -10, duration: 0.35 })
        .from(".commerce-hero-copy .lhawta-eyebrow", { autoAlpha: 0, y: 12, duration: 0.4 }, "-=0.15")
        .from(".commerce-hero-copy h1", { autoAlpha: 0, y: 30, duration: 0.72 }, "-=0.18")
        .from(".commerce-hero-copy > p", { autoAlpha: 0, y: 16, duration: 0.48 }, "-=0.34")
        .from(".commerce-price-block", { autoAlpha: 0, y: 14, scale: 0.985, duration: 0.48 }, "-=0.24")
        .from(".commerce-hero-copy .lhawta-hero-actions > *", { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.06 }, "-=0.24")
        .from(".commerce-trust-row span", { autoAlpha: 0, y: 8, duration: 0.34, stagger: 0.05 }, "-=0.2")
        .fromTo(
          ".commerce-hero-media",
          { autoAlpha: 0, scale: 0.965, clipPath: "inset(4% 4% 4% 4% round 30px)" },
          { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 26px)", duration: 0.88, ease: "power4.out" },
          0.12
        );

      gsap.from(".commerce-categories a", {
        autoAlpha: 0,
        y: 14,
        duration: 0.48,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".commerce-categories",
          start: "top 93%",
          once: true,
        },
      });

      gsap.from(".deal-card", {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.065,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".deal-grid",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".retail-story", {
        autoAlpha: 0,
        y: 28,
        scale: 0.985,
        duration: 0.68,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".retail-story-grid",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".lhawta-compare-heading", {
        autoAlpha: 0,
        y: 28,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-compare-section",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".lhawta-compare-panel", {
        autoAlpha: 0,
        y: 24,
        scale: 0.985,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-compare-panel",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".lhawta-compare-row", {
        autoAlpha: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-compare-panel",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".lhawta-services-grid article", {
        autoAlpha: 0,
        y: 24,
        duration: 0.58,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-services-grid",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".lhawta-faq-list details", {
        autoAlpha: 0,
        y: 14,
        duration: 0.46,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-faq-list",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".lhawta-newsletter", {
        autoAlpha: 0,
        y: 28,
        scale: 0.985,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-newsletter",
          start: "top 90%",
          once: true,
        },
      });

      gsap.matchMedia().add("(min-width: 900px)", () => {
        gsap.to(".commerce-hero-media img", {
          yPercent: -5,
          scale: 1.035,
          ease: "none",
          scrollTrigger: {
            trigger: ".commerce-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        gsap.to(".commerce-hero-copy", {
          y: -28,
          autoAlpha: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: ".commerce-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        gsap.utils.toArray<HTMLElement>(".retail-story").forEach((el, index) => {
          const image = el.querySelector("img");
          if (!image) return;
          gsap.fromTo(
            image,
            { scale: 1.06, yPercent: index % 2 ? 2 : 0 },
            {
              scale: 1,
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        });
      });

      const progressBar = document.querySelector<HTMLElement>(".site-progress > span");
      const floatingBuy = document.querySelector<HTMLElement>(".pdp-floating-buy");

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          document.querySelector(".store-header")?.classList.toggle("scrolled", self.scroll() > 60);
          if (progressBar) {
            gsap.set(progressBar, { scaleX: self.progress, transformOrigin: "left center" });
          }
          floatingBuy?.classList.toggle("show", self.scroll() > 720);
        },
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return null;
}
