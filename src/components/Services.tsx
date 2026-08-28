import { useState } from "react";
import {
  Pipette,
  Receipt,
  Wrench,
  FlaskConical,
  Gauge,
  Headset,
  ArrowRight,
  ZoomIn,
  X,
} from "lucide-react";

const services = [
  {
    icon: Pipette,
    title: "New Water Service Connection",
    desc: "Seamless application, surveying, meter setup, and branch pipeline connection for residential and commercial premises.",
    tag: "Installation",
  },
  {
    icon: Receipt,
    title: "Transparent Billing & Collection",
    desc: "Monthly computerized billing statements with multi-channel payment options.",
    tag: "Billing",
  },
  {
    icon: Wrench,
    title: "Emergency Repairs & Leaks",
    desc: "Rapid response technical teams available for mainline pipe bursts, meter replacements, and valve maintenance.",
    tag: "Maintenance",
  },
  {
    icon: FlaskConical,
    title: "Water Quality & Laboratory Testing",
    desc: "Routine bacteriological, physical, and chemical lab testing strictly complying with DOH Philippine National Standards.",
    tag: "Safety",
  },
  {
    icon: Gauge,
    title: "Accurate Meter Reading & Audits",
    desc: "Regular monthly meter monitoring with computerized error-checking to spot abnormally high usage or concealed indoor leaks.",
    tag: "Metering",
  },
  {
    icon: Headset,
    title: "Customer Support & Applications",
    desc: "Responsive consumer helpdesk for billing queries, transfer of ownership, service reconnections, and community concerns.",
    tag: "Support",
  },
];

export default function Services() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="py-20 bg-slate-50 reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            Utility Operations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Comprehensive Water Services
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            From new pipe connections and routine laboratory water testing to emergency leak resolution.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-2 group-hover:text-blue-700 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-600">CWSI Standard Service</span>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    Inquire <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Responsibility Infographic Banner ─── */}
        <div className="mt-14">
          <div className="text-center mb-5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
              Know Your Responsibility
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              Understanding which parts of the water line are managed by CWSI and which fall under the consumer.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-1">
              Applying for a New Water Connection?
            </h3>
            <p className="text-xs sm:text-sm text-blue-200">
              Submit your inquiry online or drop by our Gabi office for site survey scheduling.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("rates")}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
            >
              View Rates
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-6 py-2.5 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-blue-50 transition-colors shadow-lg cursor-pointer flex-shrink-0"
            >
              Apply Online
            </button>
          </div>
        </div>
      </div>

      {/* ─── Full-Screen Lightbox ─── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-10 shadow-lg"
            aria-label="Close fullscreen view"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large Infographic */}
          <div
            className="max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/responsibility-infographic.png"
              alt="CWSI vs Consumer Pipe Responsibility Infographic — Full Size"
              className="w-full h-auto object-contain block bg-white"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>

          <p className="absolute bottom-5 left-0 right-0 text-center text-slate-400 text-xs">
            Click anywhere outside to close
          </p>
        </div>
      )}
    </section>
  );
}
