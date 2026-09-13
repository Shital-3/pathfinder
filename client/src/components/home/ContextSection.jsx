import useReveal from "../../hooks/useReveal";
import contextStudents from "../../assets/context-students.jpg";
import "./ContextSection.css";

const POINTS = [
  { title: "Structured, not scattered", body: "Every experience answers the same core questions — decision, why, outcome, what worked, what didn't." },
  { title: "Comparison, not conviction", body: "We show trade-offs across metrics, not verdicts. You still make the call." },
  { title: "Verified contributors", body: "Contributors link their academic background and current role. Anonymity is opt-in for sensitive topics." },
  { title: "No prediction, no hype", body: "We don't tell you what to do. We help you see what other students in similar shoes did — and how it went." },
];

export default function ContextSection() {
  const ref = useReveal();

  return (
    <section className="section context">
      <div className="container context__grid reveal" ref={ref}>
        <div className="context__text">
          <span className="eyebrow">Why Pathfinder</span>
          <h2 className="context__heading">Not advice. Context.</h2>

          <dl className="context__list">
            {POINTS.map((p) => (
              <div key={p.title} className="context__item">
                <dt>{p.title}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="img-zoom-wrap context__image">
          <img
            src={contextStudents}
            alt="Students collaborating over a laptop at a table"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}