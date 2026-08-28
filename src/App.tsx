import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import WaterRates from "./components/WaterRates";
import About from "./components/About";
import Services from "./components/Services";
import Team from "./components/Team";
import Gallery from "./components/Gallery";
import News from "./components/News";
import NewsDetail from "./components/NewsDetail";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPage from "./components/Admin/AdminPage";
import type { NewsItem } from "./lib/data";

export default function App() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentRoute, setCurrentRoute] = useState<"home" | "admin">("home");

  // URL /admin route listener
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path === "/admin" || path.endsWith("/admin") || hash === "#admin") {
        setCurrentRoute("admin");
      } else {
        setCurrentRoute("home");
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Scroll Reveal Animations
  useEffect(() => {
    if (currentRoute === "admin") return;

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    });

    const revealElements = document.querySelectorAll(".reveal-init");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [selectedNews, currentRoute]);

  const handleNewsSelect = (news: NewsItem) => {
    setSelectedNews(news);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsBack = () => {
    setSelectedNews(null);
    setTimeout(() => {
      document.getElementById("news")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleExitAdmin = () => {
    setCurrentRoute("home");
    if (window.location.pathname.endsWith("/admin") || window.location.hash === "#admin") {
      window.history.pushState(null, "", "/");
    }
  };

  // 1. DEDICATED FULL-PAGE ADMIN DASHBOARD
  if (currentRoute === "admin") {
    return <AdminPage onExit={handleExitAdmin} />;
  }

  // 2. NEWS ARTICLE DETAIL VIEW
  if (selectedNews) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
        <Navbar />
        <NewsDetail news={selectedNews} onBack={handleNewsBack} />
        <Footer />
      </div>
    );
  }

  // 3. PUBLIC WEBSITE HOMEPAGE
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-sky-200 selection:text-blue-900">
      <Navbar />
      <main className="flex-grow">
        <Home />
        <WaterRates />
        <About />
        <Services />
        <Team />
        <Gallery />
        <News onSelect={handleNewsSelect} />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
