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
        .from(".lhawta-eyebrow", { autoAlpha: 0, y: 12, duration: 0.45 })
        .from(".lhawta-hero h1", { autoAlpha: 0, y: 34, duration: 0.78 }, "-=0.18")
        .from(".lhawta-hero-copy > p", { autoAlpha: 0, y: 18, duration: 0.5 }, "-=0.34")
        .from(".lhawta-hero-actions > *", { autoAlpha: 0, y: 12, duration: 0.42, stagger: 0.07 }, "-=0.24")
        .from(".lhawta-hero-proof span", { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.055 }, "-=0.22")
        .fromTo(
          ".lhawta-hero-product",
          { autoAlpha: 0, scale: 0.96, clipPath: "inset(5% 5% 5% 5% round 34px)" },
          { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 0.95, ease: "power4.out" },
          0.14
        )
        .from(".lhawta-hero-product-top > *,.lhawta-hero-product-bottom > *", { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.05 }, "-=0.3");

      gsap.from(".lhawta-category-dock a", {
        autoAlpha: 0,
        y: 18,
        duration: 0.52,
        stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-category-dock",
          start: "top 94%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".lhawta-section-heading,.lhawta-compare-heading").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      gsap.from(".lhawta-merch-main,.lhawta-mini-story", {
        autoAlpha: 0,
        y: 28,
        scale: 0.985,
        duration: 0.78,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-merch-section",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".lhawta-services-grid article", {
        autoAlpha: 0,
        y: 28,
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-services-grid",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".lhawta-faq-list details", {
        autoAlpha: 0,
        y: 16,
        duration: 0.52,
        stagger: 0.055,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-faq-list",
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".lhawta-help-card", {
        autoAlpha: 0,
        y: 22,
        scale: 0.985,
        duration: 0.62,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-help-card",
          start: "top 92%",
          once: true,
        },
      });

      gsap.from(".lhawta-newsletter", {
        autoAlpha: 0,
        y: 32,
        scale: 0.975,
        duration: 0.82,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-newsletter",
          start: "top 90%",
          once: true,
        },
      });

      gsap.from(".lhawta-footer-brand,.lhawta-footer-links > div,.lhawta-footer-statement", {
        autoAlpha: 0,
        y: 24,
        duration: 0.62,
        stagger: 0.075,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lhawta-footer",
          start: "top 84%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, scale: 0.975, y: 18 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".lhawta-hero",
            start: "top 66px",
            end: "+=1050",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        heroTl
          .to(".lhawta-hero-copy", {
            autoAlpha: 0,
            x: -70,
            y: -20,
            duration: 0.35,
            ease: "none",
          }, 0)
          .to(".lhawta-category-dock", {
            autoAlpha: 0,
            y: 45,
            duration: 0.26,
            ease: "none",
          }, 0.05)
          .to(".lhawta-hero-product", {
            xPercent: -37,
            scale: 1.42,
            borderRadius: 10,
            duration: 1,
            ease: "none",
          }, 0)
          .to(".lhawta-hero-product > img", {
            scale: 1.07,
            duration: 1,
            ease: "none",
          }, 0)
          .to(".lhawta-hero-product-top,.lhawta-hero-product-bottom", {
            autoAlpha: 0,
            duration: 0.25,
            ease: "none",
          }, 0.12)
          .to(".lhawta-blue-line", {
            width: "100%",
            duration: 0.45,
            ease: "none",
          }, 0.2);

        const latestSection = document.querySelector<HTMLElement>(".lhawta-latest-section");
        const latestTrack = document.querySelector<HTMLElement>(".lhawta-horizontal-track");

        if (latestSection && latestTrack) {
          const getDistance = () => Math.max(0, latestTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.09);

          gsap.to(latestTrack, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: latestSection,
              start: "top top",
              end: () => "+=" + Math.max(1100, getDistance() * 1.08),
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }

        gsap.fromTo(
          ".lhawta-merch-main > img",
          { scale: 1.09 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".lhawta-merch-main",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          }
        );

        const compareTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".lhawta-compare-section",
            start: "top top",
            end: "+=900",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        compareTl
          .fromTo(".lhawta-compare-heading", { autoAlpha: 0, y: 65 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "none" }, 0)
          .fromTo(".lhawta-compare-panel", { autoAlpha: 0, scale: 0.94, y: 42 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.26, ease: "none" }, 0.18)
          .fromTo(".lhawta-compare-row", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.12, ease: "none" }, 0.36);

        gsap.to(".lhawta-mini-blue", {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: ".lhawta-merch-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to(".lhawta-mini-black", {
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: ".lhawta-merch-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
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
