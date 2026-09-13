/**
 * left / right: { label, percent }
 * Percentages should sum to 100. All values are contributor-aggregated,
 * never implied to be statistically representative.
 */
export default function DistributionBar({ left, right }) {
  return (
    <div className="dist-bar">
      <div className="dist-bar__labels">
        <span>{left.label}</span>
        <span>{right.label}</span>
      </div>
      <div className="dist-bar__track">
        <div className="dist-bar__fill" style={{ width: `${left.percent}%` }} />
      </div>
      <div className="dist-bar__values">
        <span>{left.percent}%</span>
        <span>{right.percent}%</span>
      </div>
    </div>
  );
}