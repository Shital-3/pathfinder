import contextStudents from "../../assets/context-students.jpg";
import "./DirectoryHero.css";

export default function DirectoryHero() {
  return (
    <section className="dir-hero">
      <div className="container dir-hero__grid">
        <div>
          <span className="eyebrow">Dilemma Explorer</span>
          <h1 className="dir-hero__heading">What are you trying to figure out?</h1>
          <p className="dir-hero__subtext">
            Search a decision you're facing. Filter by year, branch, and goal.
            Every dilemma is backed by real student experiences.
          </p>
        </div>

        <div className="img-zoom-wrap dir-hero__image">
          <img
            src={contextStudents}
            alt="Students reviewing notes together"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}