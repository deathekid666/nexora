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
      gsap.from(".hero-animate > *", {
        opacity: 0,
        y: 34,
        duration: 1,
        stagger: 0.09,
        ease: "power3.out",
      });

      gsap.fromTo(
        ".luxe-hero-media",
        { scale: 1.08 },
        { scale: 1.02, duration: 1.8, ease: "power3.out" }
      );

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
          { autoAlpha: 0, scale: 0.95, y: 22 },
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

      const track = document.querySelector<HTMLElement>(".brand-marquee-track");
      if (track) {
        const marquee = gsap.to(track, {
          xPercent: -50,
          duration: 28,
          repeat: -1,
          ease: "none",
        });

        const enter = () => marquee.timeScale(0.35);
        const leave = () => marquee.timeScale(1);
        track.parentElement?.addEventListener("mouseenter", enter);
        track.parentElement?.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          track.parentElement?.removeEventListener("mouseenter", enter);
          track.parentElement?.removeEventListener("mouseleave", leave);
        });
      }

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

      const spotlightTargets = gsap.utils.toArray<HTMLElement>(
        ".luxe-product-card,.luxe-category-card,.luxe-campaign,.luxe-guide-card,.luxe-compare-board,.highlight-card"
      );

      spotlightTargets.forEach((el) => {
        const move = (event: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          el.style.setProperty("--my", `${event.clientY - rect.top}px`);
        };
        el.addEventListener("mousemove", move);
        cleanups.push(() => el.removeEventListener("mousemove", move));
      });

      const tiltTargets = gsap.utils.toArray<HTMLElement>(".luxe-campaign,.luxe-guide-card");
      tiltTargets.forEach((el) => {
        const xTo = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power3.out" });

        const move = (event: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          xTo(px * 3.5);
          yTo(py * -3.5);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
      });

      gsap.utils.toArray<HTMLElement>(".luxe-section-head h2,.product-editorial-head h2,.specs-heading h2").forEach((el) => {
        gsap.fromTo(
          el,
          { letterSpacing: "-0.075em", opacity: 0.7 },
          {
            letterSpacing: "-0.055em",
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }
        );
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}
