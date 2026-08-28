import { ShieldCheck, HeartHandshake, Zap, Leaf, Award, CheckCircle } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Safety & Quality First",
    desc: "We adhere strictly to PNSDW and DOH microbiological and chemical standards to safeguard the health of all families in Cordova.",
  },
  {
    icon: HeartHandshake,
    title: "Community Driven",
    desc: "Operated with community welfare at heart, ensuring equitable access and transparent public service across our franchise area.",
  },

  {
    icon: Leaf,
    title: "Resource Sustainability",
    desc: "Committed to aquifer conservation, sustainable pumping, and watershed protection programs for future generations.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-white reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Image with Decorative Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1774789599304-cca1e1ffbb95?w=800&h=600&fit=crop&auto=format"
                alt="Cordova Water System Treatment Facility"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>

            {/* Floating Registration Badge */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white rounded-2xl shadow-xl p-4 sm:p-5 border border-sky-100 flex items-center gap-3 sm:gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">LWUA Registered Utility</p>
                <p className="text-slate-500 text-[11px]">Compliant with PNSDW 2017</p>
              </div>
            </div>
          </div>

          {/* Right: Content & Core Pillars */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              About Our Utility
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
              Serving Cordova with Clean, Safe & Reliable Water
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              Cordova Water System Inc. (CWSI) is a community-based water utility headquartered in Brgy. Gabi, Cordova, Cebu. Founded over 15 years ago to address the vital potable water requirements of our barangays, CWSI has grown into a trusted utility recognized by regional regulatory bodies.
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Our facilities continuously undergo modern filtration and distribution upgrades to ensure every household and local commercial establishment enjoys reliable, pressurized water delivered right to the tap.
            </p>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-sky-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-blue-700 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-bold text-slate-900 text-xs mb-1">{v.title}</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
