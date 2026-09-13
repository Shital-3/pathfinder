import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import DilemmaCard from "../dilemmas/DilemmaCard";
import { DILEMMAS } from "../../data/dilemmas";
import "./FeaturedDilemmas.css";

export default function FeaturedDilemmas() {
  const scrollRef = useRef(null);
  const featured = DILEMMAS.slice(0, 3);
  const loopItems = [...featured, ...featured]; // duplicated for seamless loop

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId;
    let isPaused = false;
    const speed = 0.5; // px per frame — tweak to taste

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;
        // once we've scrolled past the first copy, snap back to 0
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);

    const pause = () => { isPaused = true; };
    const resume = () => { isPaused = false; };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <section className="featured">
      <div className="container">
        <div className="featured__header">
          <div className="featured__title-area">
            <span className="eyebrow">Featured dilemmas</span>
            <h2 className="featured__heading">Decisions worth thinking through.</h2>
            <p className="featured__subheading">
              See how others navigated the choices you are facing.
            </p>
          </div>
          <Link to="/dilemmas" className="featured__viewall desktop-only">
            View all <span className="arrow">-&gt;</span>
          </Link>
        </div>

        <div className="featured__scroll-container" ref={scrollRef}>
          {loopItems.map((dilemma, i) => (
            <div className="featured__scroll-item" key={`${dilemma.slug}-${i}`}>
              <DilemmaCard dilemma={dilemma} />
            </div>
          ))}
        </div>

        <Link to="/dilemmas" className="featured__viewall mobile-only">
          View all <span className="arrow">-&gt;</span>
        </Link>
      </div>
    </section>
  );
}