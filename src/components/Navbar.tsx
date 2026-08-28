import { useState, useEffect } from "react";
import logoImg from "/image.png";
import { Menu, X, Droplets, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "Water Rates", id: "rates", highlight: true },
  { label: "About Us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Our Team", id: "team" },
  { label: "Gallery", id: "gallery" },
  { label: "News", id: "news" },
  { label: "FAQ", id: "faq" },
  { label: "Contact Us", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => document.getElementById(l.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(navLinks[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-100"
          : "bg-white/90 backdrop-blur-sm py-2.5 sm:py-3 border-b border-slate-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer text-left"
        >
          <div className="relative">
            <img
              src={logoImg}
              alt="Cordova Water System Inc. Logo"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-blue-900 leading-tight tracking-tight group-hover:text-blue-700 transition-colors">
              Cordova Water System Inc.
            </p>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              Brgy. Gabi, Cordova, Cebu
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "text-white bg-blue-700 shadow-sm"
                    : link.highlight
                    ? "text-blue-700 bg-sky-50 hover:bg-sky-100 border border-sky-200"
                    : "text-slate-600 hover:text-blue-700 hover:bg-slate-50"
                }`}
              >
                {link.highlight && <Droplets className="w-3.5 h-3.5 text-sky-500" />}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle (Admin button removed from public UI) */}
        <div className="flex xl:hidden items-center">
          <button
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xl animate-fadeIn">
          <nav className="flex flex-col p-4 gap-1 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                  active === link.id
                    ? "text-white bg-blue-700"
                    : link.highlight
                    ? "text-blue-800 bg-sky-50 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.highlight && <Droplets className="w-3.5 h-3.5 text-sky-600" />}
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
