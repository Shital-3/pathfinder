import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import DilemmaDirectory from "./pages/DilemmaDirectory";
import DilemmaDetail from "./pages/DilemmaDetail";
import ExperiencesPage from "./pages/ExperiencesPage";
import ExperienceDetail from "./pages/ExperienceDetail";
import ShareExperience from "./pages/ShareExperience";
import ContributorsPage from "./pages/ContributorsPage";
import ContributorDetail from "./pages/ContributorDetail";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/auth/AdminRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { authApi } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    function handleAuthExpired() {
      setUser(null);
    }

    window.addEventListener("pathfinder:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("pathfinder:auth-expired", handleAuthExpired);
  }, []);

  useEffect(() => {
    authApi.me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  async function handleLogout() {
    try { await authApi.logout(); } finally { setUser(null); }
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<DilemmaDirectory />} />
          <Route path="/dilemmas" element={<DilemmaDirectory />} />
          <Route path="/dilemmas/:slug" element={<DilemmaDetail />} />
          <Route path="/all-dilemmas" element={<DilemmaDirectory />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="/experiences/:id" element={<ExperienceDetail />} />
          <Route
            path="/share"
            element={
              <ProtectedRoute user={user} loading={authLoading}>
                <ShareExperience />
              </ProtectedRoute>
            }
          />
          <Route path="/contributors" element={<ContributorsPage />} />
          <Route path="/contributors/:id" element={<ContributorDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute user={user} loading={authLoading}>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/signin" element={<SignInPage onAuthSuccess={setUser} />} />
          <Route path="/register" element={<RegisterPage onAuthSuccess={setUser} />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}