import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "À Propos", path: "/about" },
  { label: "Services", path: "/services" },
];

/* ── Tooth logo SVG ── */
const ToothLogo = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
    <path
      d="M32 8C24 8 16 15 16 25C16 33 20 40 22 48C24 56 24 64 24 73C24 78 26 82 30 82C34 82 36 78 38 73C40 68 42 64 50 64C58 64 60 68 62 73C64 78 66 82 70 82C74 82 76 78 76 73C76 64 76 56 78 48C80 40 84 33 84 25C84 15 76 8 68 8C63 8 57 11 50 11C43 11 37 8 32 8Z"
      fill="white"
    />
    <path
      d="M36 20C40 26 44 28 50 28C56 28 60 26 64 20"
      stroke="rgba(20,184,166,0.8)"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Burger icon ── */
const BurgerIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/* ── Close (X) icon ── */
const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Arrow right icon ── */
const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Dashboard grid icon ── */
const DashboardIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

/* ── Logout icon ── */
const LogoutIcon = () => (
  <svg
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = React.useRef(0);

  /* ── scroll behaviour ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 80 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close menu on navigation ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ── lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/");
  };

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "dentiste"
        ? "/dentiste/dashboard"
        : "/patient/dashboard";

  return (
    <>
      {/* ════════════════════════════════════════
          NAVBAR BAR
      ════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-2 pointer-events-none
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* ── Pill container ── */}
        <div
          className={`pointer-events-auto flex items-center
            bg-white/95 backdrop-blur-xl rounded-full
            border border-slate-200/80 px-2 py-1.5
            transition-shadow duration-300
            ${
              scrolled
                ? "shadow-[0_8px_32px_rgba(15,23,42,0.14),0_2px_8px_rgba(15,23,42,0.06)]"
                : "shadow-[0_4px_24px_rgba(15,23,42,0.10)]"
            }`}
        >
          {/* ── Brand ── */}
          <Link
            to="/"
            className="flex items-center gap-2 px-2 py-0.5 shrink-0 no-underline"
          >
            <div
              className="w-9 h-9 rounded-full bg-[#0077b6] flex items-center justify-center
              shadow-[0_3px_10px_rgba(0,119,182,0.35)] shrink-0"
            >
              <ToothLogo />
            </div>
            <div className="leading-none">
              <div className="text-[1rem] font-black tracking-tight text-slate-900">
                DENT<span className="text-[#0077b6]">ORA</span>
              </div>
              <div className="text-[0.5rem] tracking-[0.14em] uppercase text-slate-400 font-semibold">
                DENTISTRY
              </div>
            </div>
          </Link>

          {/* ── Divider (desktop only) ── */}
          <div className="hidden md:block w-px h-6 bg-slate-200/90 mx-2 shrink-0" />

          {/* ── Nav links (desktop only) ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`inline-flex items-center px-5 py-2 rounded-full
                    text-[0.78rem] font-bold tracking-[0.07em] uppercase
                    no-underline whitespace-nowrap
                    transition-all duration-150
                    ${
                      active
                        ? "bg-slate-900/8 text-slate-900 shadow-[inset_0_1px_3px_rgba(15,23,42,0.10)]"
                        : "text-slate-500 hover:bg-slate-900/4 hover:text-slate-900"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ── Divider (desktop only) ── */}
          <div className="hidden md:block w-px h-6 bg-slate-200/90 mx-2 shrink-0" />

          {/* ── CTA (desktop only) ── */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {!user ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full
                  bg-[#0077b6] text-white text-[0.78rem] font-bold tracking-[0.05em]
                  no-underline whitespace-nowrap
                  shadow-[0_3px_12px_rgba(0,119,182,0.35)]
                  hover:bg-[#005f8e] hover:-translate-y-px
                  hover:shadow-[0_5px_18px_rgba(0,119,182,0.45)]
                  transition-all duration-150"
              >
                Connexion <ArrowIcon />
              </Link>
            ) : (
              <>
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full
                    bg-[#0077b6] text-white text-[0.78rem] font-bold tracking-[0.05em]
                    no-underline whitespace-nowrap
                    hover:bg-[#005f8e] transition-colors duration-150"
                >
                  <DashboardIcon /> Tableau de bord
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-full
                    bg-red-500/8 text-red-500 border border-red-500/20
                    text-[0.78rem] font-bold whitespace-nowrap
                    hover:bg-red-500/15 transition-colors duration-150 cursor-pointer"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>

          {/* ── Burger button (mobile only) ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="md:hidden ml-2 p-2 rounded-full
              bg-slate-900/5 hover:bg-slate-900/10
              text-slate-700 border-none cursor-pointer
              transition-colors duration-150 shrink-0"
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          MOBILE MENU OVERLAY (backdrop)
      ════════════════════════════════════════ */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
        />
      )}

      {/* ════════════════════════════════════════
          MOBILE DRAWER (slides down from top)
      ════════════════════════════════════════ */}
      <div
        className={`md:hidden fixed left-3 right-3 z-40
          bg-white/98 backdrop-blur-xl rounded-2xl
          border border-slate-200/80
          shadow-[0_16px_48px_rgba(15,23,42,0.16)]
          overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            menuOpen
              ? "top-[72px] opacity-100 pointer-events-auto"
              : "top-[60px] opacity-0 pointer-events-none"
          }`}
      >
        <div className="p-3 flex flex-col gap-1">
          {/* Nav links */}
          {NAV_LINKS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl
                  text-[0.92rem] font-bold tracking-[0.04em]
                  no-underline transition-colors duration-150
                  ${
                    active
                      ? "bg-slate-900/6 text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0077b6] mr-2.5 shrink-0" />
                )}
                {item.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="h-px bg-slate-100 my-1" />

          {/* CTA section */}
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2
                px-4 py-3.5 rounded-xl mt-1
                bg-[#0077b6] text-white
                text-[0.92rem] font-bold no-underline
                hover:bg-[#005f8e] transition-colors duration-150
                shadow-[0_4px_14px_rgba(0,119,182,0.30)]"
            >
              Se connecter <ArrowIcon />
            </Link>
          ) : (
            <>
              <Link
                to={dashboardPath}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                  text-[#0077b6] font-bold text-[0.92rem]
                  no-underline bg-blue-50 hover:bg-blue-100
                  transition-colors duration-150"
              >
                <DashboardIcon /> Tableau de bord
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl
                  text-red-500 font-bold text-[0.92rem]
                  bg-red-50 hover:bg-red-100
                  border-none cursor-pointer text-left
                  transition-colors duration-150"
              >
                <LogoutIcon /> Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
