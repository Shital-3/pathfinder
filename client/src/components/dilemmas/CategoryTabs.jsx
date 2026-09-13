import { CATEGORIES, PLANNED_CATEGORIES } from "../../data/dilemmas";
import "./CategoryTabs.css";

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="cat-tabs">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          type="button"
          className={`cat-tab ${active === c ? "is-active" : ""}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}

      {PLANNED_CATEGORIES.map((c) => (
        <button
          key={c}
          type="button"
          className="cat-tab cat-tab--planned"
          disabled
          title="Coming soon"
        >
          {c} <span className="cat-tab__badge">Soon</span>
        </button>
      ))}
    </div>
  );
}