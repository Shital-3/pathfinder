import React from "react";
import { Link } from "react-router-dom";
import "./AboutPage.css";

const ABOUT_HERO_IMAGE = 
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

const WHY_POINTS = [
  {
    num: "01",
    title: "Real experiences",
    desc: "Systematic decision paths based on authentic student choices. Focus on real tradeoffs like DSA vs projects.",
  },
  {
    num: "02",
    title: "Useful context",
    desc: "Detailed backstory and environment behind each choice so you can compare against your own situation.",
  },
  {
    num: "03",
    title: "Student perspectives",
    desc: "First-hand accounts from peers across engineering, tech, and non-tech tracks navigating similar paths.",
  },
  {
    num: "04",
    title: "No one-size-fits-all",
    desc: "Nuanced insights instead of blanket rules. What worked for one student may not suit another.",
  },
];

const FLOW_STEPS = ["Question", "Dilemmas", "Experiences", "Perspectives", "Decision"];

const STATS = [
  { value: "1.2k+", label: "Experiences" },
  { value: "500+", label: "Contributors" },
  { value: "100+", label: "Topics" },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container about-hero__grid">
          <div className="about-hero__content">
            <span className="eyebrow">OUR MISSION</span>
            <h1 className="about-hero__title">
              Navigating career crossroads with clarity.
            </h1>
            <p className="about-hero__desc">
              Pathfinder bridges the gap between raw ambition and real-world experience, 
              helping students make informed choices through shared community insights.
            </p>
          </div>

          <div className="about-hero__image-wrapper">
            <img
              src={ABOUT_HERO_IMAGE}
              className="about-hero__image"
              alt="Students collaborating around a study table"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Why Pathfinder Exists Section */}
      <section className="about-why">
        <div className="container">
          <span className="eyebrow">Mission</span>
          <h2 className="about-why__title">Why Pathfinder exists</h2>

          <div className="about-why__grid">
            {WHY_POINTS.map((item) => (
              <div key={item.num} className="why-card">
                <span className="why-card__num">{item.num}</span>
                <h3 className="why-card__title">{item.title}</h3>
                <p className="why-card__desc">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Decision Flow Strip */}
          <div className="flow-strip">
            {FLOW_STEPS.map((step, idx) => (
              <React.Fragment key={step}>
                <span className="flow-strip__step">{step}</span>
                {idx < FLOW_STEPS.length - 1 && (
                  <span className="flow-strip__arrow">&rarr;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>


      {/* Image Gallery Grid Section */}
      <section className="about-gallery">
        <div className="container about-gallery__grid">
          <div className="gallery-item gallery-item--large">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800" alt="Students on campus" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=500" alt="Student studying" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500" alt="Group discussion" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=500" alt="Student on laptop" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500" alt="Library workspace" />
          </div>
          <div className="gallery-item">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=500" alt="Campus conversation" />
          </div>
        </div>
      </section>

    </div>
  );
}