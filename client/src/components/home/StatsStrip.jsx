import { Sun, Users, ShieldCheck, Layers } from "lucide-react";
import "./StatsStrip.css";

// TODO: replace with a live GET /api/stats (or derive from /api/dilemmas + /api/experiences) once backend is up
const STATS = [
  { value: "8", label: "Experiences Shared", icon: Sun },
  { value: "6", label: "Student Contributors", icon: Users },
  { value: "6", label: "Live Dilemmas", icon: ShieldCheck },
  { value: "1.2k+", label: "Students Reached", icon: Layers },
];

export default function StatsStrip() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stats__item">
              <div className="stats__icon-wrapper">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <div className="stats__text">
                <span className="stats__value">{s.value}</span>
                <span className="stats__label">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}