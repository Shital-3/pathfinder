import { Link } from "react-router-dom";
import heroStudent from "/src/assets/hero.png";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        {/* Left Column */}
        <div className="hero__content">
          <div className="hero__badge hero__animate-fade">
            <span className="hero__badge-dot" />
            Decision Intelligence for Students
          </div>

          <h1 className="hero__headline">
            <span className="hero__word hero__word--1">Understand</span>{" "}
            <span className="hero__word hero__word--2">your</span>{" "}
            <span className="hero__word hero__word--3">options</span>{" "}
            <span className="hero__word hero__word--4">
              <em className="hero__em">before</em>
            </span>{" "}
            <span className="hero__word hero__word--5">you</span>{" "}
            <span className="hero__word hero__word--6">decide.</span>
          </h1>

          <div className="hero__ctas hero__animate-fade-delayed">
            <Link to="/dilemmas" className="btn btn--primary">
              Explore Dilemmas
            </Link>
            <Link to="/share" className="btn btn--outline">
              Share Your Experience
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="hero__visual">
          <div className="hero__card hero__animate-scale">
            <div className="hero__image">
              <img
                src={heroStudent}
                alt="Student weighing a decision between DSA and Projects"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}