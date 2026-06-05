import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RoleRoute from "./components/Auth/RoleRoute";
import RendezVousPage from "./pages/RendezVousPage";
import ServicesPage from "./pages/ServicesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DossiersPage from "./pages/DossiersPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import PatientLayout from "./layouts/PatientLayout";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientServices from "./pages/patient/PatientServices";
import PatientDisponibilites from "./pages/patient/PatientDisponibilites";
import PatientRendezVous from "./pages/patient/PatientRendezVous";
import PatientDossierMedical from "./pages/patient/PatientDossierMedical";
import PatientHistoriqueSoins from "./pages/patient/PatientHistoriqueSoins";
import DentisteLayout from "./layouts/DentisteLayout";
import DentisteDashboard from "./pages/dentiste/DentisteDashboard";
import DentisteProfile from "./pages/dentiste/DentisteProfile";
import DentisteRendezVous from "./pages/dentiste/DentisteRendezVous";
import DentisteDossiersMedicaux from "./pages/dentiste/DentisteDossiersMedicaux";
import DentisteFichesSoins from "./pages/dentiste/DentisteFichesSoins";
import DentisteDisponibilites from "./pages/dentiste/DentisteDisponibilites";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDentistes from "./pages/admin/AdminDentistes";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminServices from "./pages/admin/AdminServices";
import AdminDisponibilites from "./pages/admin/AdminDisponibilites";
import AdminRendezVous from "./pages/admin/AdminRendezVous";
import AdminDossiersMedicaux from "./pages/admin/AdminDossiersMedicaux";
import AdminFichesSoins from "./pages/admin/AdminFichesSoins";
import ForgotPassword from "./components/Auth/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Hero from "./components/Home/Hero";
import About from "./components/Home/About";
import Features from "./components/Home/Features";
import Chatbot from "./components/Chatbot/Chatbot";
import ToastHost from "./components/Feedback/ToastHost";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastHost />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<AboutPage />} />

          <Route element={<PrivateRoute />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <DashboardPage />
                </Layout>
              }
            />
            <Route
              path="/rendez-vous"
              element={
                <Layout>
                  <RendezVousPage />
                </Layout>
              }
            />
            <Route
              path="/services"
              element={
                <Layout>
                  <ServicesPage />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
          </Route>

          <Route
            element={<PrivateRoute allowedRoles={["admin", "dentiste"]} />}
          >
            <Route
              path="/dossiers"
              element={
                <Layout>
                  <DossiersPage />
                </Layout>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/dentistes" element={<AdminDentistes />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route
                  path="/admin/disponibilites"
                  element={<AdminDisponibilites />}
                />
                <Route
                  path="/admin/rendez-vous"
                  element={<AdminRendezVous />}
                />
                <Route
                  path="/admin/dossiers-medicaux"
                  element={<AdminDossiersMedicaux />}
                />
                <Route
                  path="/admin/fiches-soins"
                  element={<AdminFichesSoins />}
                />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["patient"]} />}>
              <Route element={<PatientLayout />}>
                <Route
                  path="/patient/dashboard"
                  element={<PatientDashboard />}
                />
                <Route path="/patient/profile" element={<PatientProfile />} />
                <Route path="/patient/services" element={<PatientServices />} />
                <Route
                  path="/patient/disponibilites"
                  element={<PatientDisponibilites />}
                />
                <Route
                  path="/patient/rendez-vous"
                  element={<PatientRendezVous />}
                />
                <Route
                  path="/patient/dossier-medical"
                  element={<PatientDossierMedical />}
                />
                <Route
                  path="/patient/historique-soins"
                  element={<PatientHistoriqueSoins />}
                />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["dentiste"]} />}>
              <Route element={<DentisteLayout />}>
                <Route
                  path="/dentiste/dashboard"
                  element={<DentisteDashboard />}
                />
                <Route path="/dentiste/profile" element={<DentisteProfile />} />
                <Route
                  path="/dentiste/rendez-vous"
                  element={<DentisteRendezVous />}
                />
                <Route
                  path="/dentiste/dossiers-medicaux"
                  element={<DentisteDossiersMedicaux />}
                />
                <Route
                  path="/dentiste/fiches-soins"
                  element={<DentisteFichesSoins />}
                />
                <Route
                  path="/dentiste/disponibilites"
                  element={<DentisteDisponibilites />}
                />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
