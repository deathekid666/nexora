"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".source-eyebrow", { opacity: 0, y: 16, duration: 0.55 })
        .from(".source-hero h1", { opacity: 0, y: 34, duration: 0.9 }, "-=0.3")
        .from(".source-hero-copy > p", { opacity: 0, y: 20, duration: 0.65 }, "-=0.5")
        .from(".source-hero-actions > *", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, "-=0.35")
        .from(".source-hero-meta span", { opacity: 0, y: 12, duration: 0.45, stagger: 0.06 }, "-=0.25");

      gsap.fromTo(
        ".source-hero-media",
        { clipPath: "inset(0 0 100% 0 round 28px)", y: 22 },
        { clipPath: "inset(0 0 0% 0 round 28px)", y: 0, duration: 1.15, ease: "power4.out", delay: 0.15 }
      );

      gsap.fromTo(
        ".source-hero-media img",
        { scale: 1.08 },
        { scale: 1, duration: 1.65, ease: "power3.out", delay: 0.2 }
      );

      gsap.from(".source-hero-media-copy > *", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        stagger: 0.07,
        delay: 0.85,
        ease: "power3.out",
      });

      gsap.from(".source-categories a", {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.055,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".source-categories",
          start: "top 92%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, scale: 0.965, y: 24 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      const latestCards = gsap.utils.toArray<HTMLElement>(".source-latest-card");
      if (latestCards.length) {
        gsap.from(latestCards, {
          opacity: 0,
          x: 44,
          duration: 0.82,
          stagger: 0.11,
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
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".source-compare-table",
            start: "top 88%",
            once: true,
          },
        });
      }

      const editorialCards = gsap.utils.toArray<HTMLElement>(
        ".source-editorial-feature,.source-editorial-small"
      );
      if (editorialCards.length) {
        gsap.from(editorialCards, {
          opacity: 0,
          y: 30,
          duration: 0.82,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".source-editorial",
            start: "top 86%",
            once: true,
          },
        });
      }

      const serviceCards = gsap.utils.toArray<HTMLElement>(".source-services article");
      if (serviceCards.length) {
        gsap.from(serviceCards, {
          opacity: 0,
          y: 20,
          duration: 0.58,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".source-services",
            start: "top 90%",
            once: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".source-heading h2,.source-compare-head h2").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.45, y: 24, letterSpacing: "-0.075em" },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "-0.055em",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 91%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".source-latest-card,.source-editorial-feature,.source-editorial-gaming").forEach((el) => {
        const image = el.querySelector("img");
        if (!image) return;

        gsap.to(image, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.15,
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

      const hoverTargets = gsap.utils.toArray<HTMLElement>(
        ".source-latest-card,.source-editorial-feature,.source-editorial-small,.source-hero-media"
      );

      hoverTargets.forEach((el) => {
        const move = (event: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(el, {
            rotationY: px * 1.6,
            rotationX: py * -1.2,
            transformPerspective: 1200,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        const leave = () => {
          gsap.to(el, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);

        cleanups.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
      });

      const links = gsap.utils.toArray<HTMLElement>(".source-home a");
      links.forEach((el) => {
        const arrow = el.querySelector("svg");
        if (!arrow) return;

        const enter = () => gsap.to(arrow, { x: 3, duration: 0.2, ease: "power2.out" });
        const leave = () => gsap.to(arrow, { x: 0, duration: 0.25, ease: "power2.out" });

        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);

        cleanups.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        });
      });
    });

    ScrollTrigger.refresh();

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}
