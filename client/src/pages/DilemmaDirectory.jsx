import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DirectoryHero from "../components/dilemmas/DirectoryHero";
import SearchSortBar from "../components/dilemmas/SearchSortBar";
import CategoryTabs from "../components/dilemmas/CategoryTabs";
import DilemmaCard from "../components/dilemmas/DilemmaCard";
import EmptyState from "../components/shared/EmptyState";
import { apiRequest } from "../services/api";
import "./DilemmaDirectory.css";

export default function DilemmaDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("Recommended");
  const [category, setCategory] = useState("All");
  const [dilemmas, setDilemmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const sortMap = { Recommended: "recommended", "Most experiences": "most_experiences", "Most recent": "recent" };
    const params = new URLSearchParams({ limit: "50", sort: sortMap[sort] || "recommended" });
    if (query.trim()) params.set("search", query.trim());
    if (category !== "All") params.set("category", category);

    setLoading(true);
    apiRequest(`/dilemmas?${params.toString()}`)
      .then((data) => { if (!cancelled) setDilemmas(data.items || []); })
      .catch((err) => { if (!cancelled) setError(err.message || "Unable to load dilemmas."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query, sort, category]);

  function handleQueryChange(nextQuery) {
    setQuery(nextQuery);
    const params = new URLSearchParams(searchParams);
    if (nextQuery.trim()) params.set("search", nextQuery.trim());
    else params.delete("search");
    setSearchParams(params, { replace: true });
  }

  return (
    <>
      <DirectoryHero />
      <div className="container">
        <SearchSortBar query={query} onQueryChange={handleQueryChange} sort={sort} onSortChange={setSort} />
        <CategoryTabs active={category} onChange={setCategory} />
      </div>
      <div className="container dir-layout">
        {loading ? <p>Loading dilemmas...</p> : error ? (
          <EmptyState title="Could not load dilemmas." body={error} />
        ) : dilemmas.length === 0 ? (
          <EmptyState title="Nothing matched that search." body="Try another decision, topic, or technology." actionLabel="Clear search" onAction={() => { setQuery(""); setCategory("All"); setSearchParams({}, { replace: true }); }} />
        ) : (
          <div className="dir-layout__grid">{dilemmas.map((d) => <DilemmaCard key={d.slug} dilemma={d} />)}</div>
        )}
      </div>
    </>
  );
}
