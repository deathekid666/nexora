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
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".source-eyebrow", { autoAlpha: 0, y: 14, duration: 0.5 })
        .from(".source-hero h1", { autoAlpha: 0, y: 28, duration: 0.85 }, "-=0.28")
        .from(".source-hero-copy > p", { autoAlpha: 0, y: 18, duration: 0.58 }, "-=0.46")
        .from(".source-hero-actions > *", { autoAlpha: 0, y: 12, duration: 0.46, stagger: 0.07 }, "-=0.32")
        .from(".source-hero-meta span", { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.05 }, "-=0.24");

      gsap.fromTo(
        ".source-hero-media",
        { clipPath: "inset(7% 7% 7% 7% round 34px)", scale: 0.97, autoAlpha: 0 },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          scale: 1,
          autoAlpha: 1,
          duration: 1.15,
          ease: "power4.out",
          delay: 0.12,
        }
      );

      gsap.fromTo(
        ".source-hero-media img",
        { scale: 1.08 },
        { scale: 1, duration: 1.45, ease: "power3.out", delay: 0.16 }
      );

      gsap.from(".source-hero-media-copy > *", {
        autoAlpha: 0,
        y: 10,
        duration: 0.46,
        stagger: 0.06,
        delay: 0.82,
        ease: "power3.out",
      });

      gsap.from(".source-categories a", {
        autoAlpha: 0,
        y: 14,
        duration: 0.56,
        stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".source-categories",
          start: "top 92%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".source-heading h2,.source-compare-head h2").forEach((el) => {
        gsap.fromTo(
          el,
          {
            autoAlpha: 0,
            y: 34,
            clipPath: "inset(0 0 100% 0)",
          },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.matches(".source-heading,.source-compare-head")) return;

        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-scale]").forEach((el) => {
        if (el.matches(".source-hero-media")) return;

        gsap.fromTo(
          el,
          { autoAlpha: 0, scale: 0.975, y: 18 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      const latestCards = gsap.utils.toArray<HTMLElement>(".source-latest-card");
      if (latestCards.length) {
        gsap.from(latestCards, {
          autoAlpha: 0,
          y: 34,
          scale: 0.985,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".source-latest-rail",
            start: "top 88%",
            once: true,
          },
        });
      }

      const compareRows = gsap.utils.toArray<HTMLElement>(".source-compare-row");
      if (compareRows.length) {
        gsap.from(compareRows, {
          autoAlpha: 0,
          y: 24,
          duration: 0.62,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".source-compare-table",
            start: "top 87%",
            once: true,
          },
        });
      }

      const editorialCards = gsap.utils.toArray<HTMLElement>(
        ".source-editorial-feature,.source-editorial-small"
      );
      if (editorialCards.length) {
        gsap.from(editorialCards, {
          autoAlpha: 0,
          y: 30,
          scale: 0.985,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".source-editorial",
            start: "top 88%",
            once: true,
          },
        });
      }

      const serviceCards = gsap.utils.toArray<HTMLElement>(".source-services article");
      if (serviceCards.length) {
        gsap.from(serviceCards, {
          autoAlpha: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".source-services",
            start: "top 90%",
            once: true,
          },
        });
      }

      gsap.matchMedia().add("(min-width: 761px)", () => {
        gsap.to(".source-hero-copy", {
          y: -72,
          autoAlpha: 0.22,
          ease: "none",
          scrollTrigger: {
            trigger: ".source-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        gsap.to(".source-hero-media", {
          y: -26,
          scale: 0.955,
          borderRadius: 42,
          ease: "none",
          scrollTrigger: {
            trigger: ".source-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        gsap.to(".source-hero-media img", {
          scale: 1.07,
          ease: "none",
          scrollTrigger: {
            trigger: ".source-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        gsap.fromTo(
          ".source-compare",
          { scale: 0.965, borderRadius: 34, y: 34 },
          {
            scale: 1,
            borderRadius: 0,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".source-compare",
              start: "top 92%",
              end: "top 24%",
              scrub: 1,
            },
          }
        );

        gsap.utils.toArray<HTMLElement>(
          ".source-latest-card,.source-editorial-feature,.source-editorial-gaming"
        ).forEach((el) => {
          const image = el.querySelector("img");
          if (!image) return;

          gsap.fromTo(
            image,
            { scale: 1.045, yPercent: 2 },
            {
              scale: 1,
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.15,
              },
            }
          );
        });

        gsap.to(".source-editorial-feature", {
          y: -22,
          ease: "none",
          scrollTrigger: {
            trigger: ".source-editorial",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to(".source-editorial-stack", {
          y: 18,
          ease: "none",
          scrollTrigger: {
            trigger: ".source-editorial",
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
            gsap.set(progressBar, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });
          }

          floatingBuy?.classList.toggle("show", self.scroll() > 720);
        },
      });

      const arrowLinks = gsap.utils.toArray<HTMLElement>(".source-home a");
      arrowLinks.forEach((el) => {
        const arrow = el.querySelector("svg");
        if (!arrow) return;

        const enter = () => gsap.to(arrow, { x: 3, duration: 0.18, ease: "power2.out" });
        const leave = () => gsap.to(arrow, { x: 0, duration: 0.22, ease: "power2.out" });

        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);

        return () => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        };
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return null;
}
