import { useState, useEffect } from "react";
import heroImg from "/hero.png";
import { Droplet, ShieldCheck, Clock, Award, ArrowRight, Calculator } from "lucide-react";

const stats = [
  { value: "100", label: "Households Served", icon: Droplet },
  { value: "24/7", label: "Reliable Supply", icon: Clock },
  { value: "2", label: "Years of Service", icon: ShieldCheck },
  { value: "99.8%", label: "PNSDW Water Quality", icon: Award },
];

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Cordova Water System Inc.";
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);

  // Typewriter animation effect
  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        setTypedText(fullText.substring(0, typedText.length + 1));
        if (typedText.length + 1 === fullText.length) {
          // Pause when full phrase is typed
          setTimeout(() => setIsDeleting(true), 3500);
          setTypingSpeed(100);
        }
      } else {
        setTypedText(fullText.substring(0, typedText.length - 1));
        if (typedText.length === 0) {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setTypingSpeed(120);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 60 : typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative flex flex-col pt-16">
      {/* Hero Container */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image with parallax overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Cordova Water System Utility"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
        </div>

        {/* High-contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/65 to-slate-900/75" />

        {/* Dynamic Water Wave SVG overlay */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            d="M0,80 C280,140 520,30 760,90 C1000,150 1240,40 1440,80 L1440,180 L0,180 Z"
            fill="white"
            fillOpacity="0.1"
          />
          <path
            d="M0,110 C360,50 720,150 1080,80 C1260,50 1380,100 1440,110 L1440,180 L0,180 Z"
            fill="white"
            fillOpacity="0.08"
          />
          <path
            d="M0,180 L1440,180 L1440,140 C1200,100 960,160 720,130 C480,100 240,150 0,135 Z"
            fill="#f8fafc"
          />
        </svg>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-16 sm:py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Brgy. Gabi, Cordova, Cebu
          </div>

          {/* Typing Title */}
          <h1
            className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 min-h-[3.2em] sm:min-h-[2.4em] flex flex-col items-center justify-center tracking-tight"
          >
            <span className="text-slate-100">Welcome to</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-200 inline-block">
              {typedText}
              <span className="animate-cursor h-8 sm:h-12 align-middle"></span>
            </span>
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
            Delivering safe, clean, and continuous potable water to households and enterprises across Cordova. Tested to DOH standards with sustainable, community-first service.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button
              onClick={() => scrollTo("rates")}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-xs sm:text-sm rounded-xl hover:from-sky-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-sky-200" />
              <span>Check Water Rates</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("services")}
              className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-200 cursor-pointer"
            >
              Our Services
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="w-full sm:w-auto px-6 py-3 bg-transparent text-slate-300 hover:text-white font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              Contact Office
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-y border-slate-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="text-center group p-2">
                <div className="inline-flex p-2 rounded-xl bg-sky-50 text-blue-700 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
                  {s.value}
                </p>
                <p className="text-slate-500 text-[11px] sm:text-xs font-medium uppercase tracking-wider mt-0.5">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}