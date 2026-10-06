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
        .from(".source-eyebrow", { autoAlpha: 0, y: 12, duration: 0.45 })
        .from(".source-hero h1", { autoAlpha: 0, y: 28, duration: 0.75 }, "-=0.22")
        .from(".source-hero-copy > p", { autoAlpha: 0, y: 16, duration: 0.5 }, "-=0.38")
        .from(".source-hero-actions > *", { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.06 }, "-=0.26")
        .from(".source-hero-meta span", { autoAlpha: 0, y: 8, duration: 0.35, stagger: 0.045 }, "-=0.2");

      gsap.fromTo(
        ".source-hero-media",
        { autoAlpha: 0, scale: 0.96 },
        { autoAlpha: 1, scale: 1, duration: 0.95, ease: "power4.out", delay: 0.1 }
      );

      gsap.fromTo(
        ".source-hero-media img",
        { scale: 1.08 },
        { scale: 1, duration: 1.35, ease: "power3.out", delay: 0.12 }
      );

      gsap.from(".source-categories a", {
        autoAlpha: 0,
        y: 14,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".source-categories",
          start: "top 92%",
          once: true,
        },
      });

      gsap.from(".source-hero-float", {
        autoAlpha: 0,
        x: 18,
        duration: 0.55,
        stagger: 0.08,
        delay: 0.78,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".source-heading h2").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".source-latest-card").forEach((el, index) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            delay: index * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".source-latest-rail",
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.from(".source-editorial-feature,.source-editorial-small", {
        autoAlpha: 0,
        y: 26,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".source-editorial",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".source-services article", {
        autoAlpha: 0,
        y: 18,
        duration: 0.52,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".source-services",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".retail-services-grid article", {
        autoAlpha: 0,
        y: 30,
        duration: 0.68,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".retail-services-grid",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".retail-faq-list details", {
        autoAlpha: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.055,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".retail-faq-list",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".retail-faq-support-card", {
        autoAlpha: 0,
        y: 20,
        scale: 0.98,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".retail-faq-support-card",
          start: "top 92%",
          once: true,
        },
      });

      gsap.from(".closing-footer-top > *", {
        autoAlpha: 0,
        y: 24,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".closing-footer",
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(".closing-footer-statement", {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".closing-footer-statement",
          start: "top 90%",
          once: true,
        },
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".source-hero",
            start: "top 68px",
            end: "+=1100",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        heroTimeline
          .to(
            ".source-hero-copy",
            {
              autoAlpha: 0,
              y: -90,
              duration: 0.42,
              ease: "none",
            },
            0
          )
          .to(
            ".source-hero-media",
            {
              xPercent: -13,
              scale: 1.18,
              borderRadius: 10,
              duration: 1,
              ease: "none",
            },
            0
          )
          .to(
            ".source-hero-media img",
            {
              scale: 1.07,
              duration: 1,
              ease: "none",
            },
            0
          )
          .to(
            ".source-hero-media-copy",
            {
              autoAlpha: 0,
              y: -16,
              duration: 0.35,
              ease: "none",
            },
            0.08
          );

        const compareTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".source-compare",
            start: "top top",
            end: "+=900",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        compareTimeline
          .fromTo(
            ".source-compare-head",
            { autoAlpha: 0, y: 70 },
            { autoAlpha: 1, y: 0, duration: 0.28, ease: "none" },
            0
          )
          .fromTo(
            ".source-compare-labels",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.12, ease: "none" },
            0.2
          )
          .fromTo(
            ".source-compare-row",
            { autoAlpha: 0, y: 38 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.2,
              ease: "none",
            },
            0.26
          );

        gsap.fromTo(
          ".source-editorial-feature img",
          { scale: 1.09 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".source-editorial-feature",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          ".source-editorial-stack",
          { y: 36 },
          {
            y: -18,
            ease: "none",
            scrollTrigger: {
              trigger: ".source-editorial",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      const progressBar = document.querySelector<HTMLElement>(".site-progress > span");
      const floatingBuy = document.querySelector<HTMLElement>(".pdp-floating-buy");

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          document.querySelector(".store-header")?.classList.toggle("scrolled", self.scroll() > 60);

          if (progressBar) {
            gsap.set(progressBar, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });
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
