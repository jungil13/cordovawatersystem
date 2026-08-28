import logoImg from "@/imports/image.png";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

const quickLinks = [
  { label: "Home", id: "home" },
  { label: "Water Rates & Tariff", id: "rates" },
  { label: "About Us", id: "about" },
  { label: "Our Services", id: "services" },
  { label: "Management Team", id: "team" },
  { label: "Photo Gallery", id: "gallery" },
  { label: "News & Advisories", id: "news" },
  { label: "FAQ", id: "faq" },
  { label: "Contact Us", id: "contact" },
];

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Cordova Water System Inc. Logo"
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="text-white font-extrabold text-sm sm:text-base tracking-tight">
                  Cordova Water System Inc.
                </p>
                <p className="text-cyan-400 text-xs font-medium">
                  Brgy. Gabi, Cordova, Cebu, Philippines
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A dedicated community water utility providing safe, clean, pressurized, and affordable drinking water to residential and commercial consumers across Cordova.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>LWUA Registered • Compliant with PNSDW Standards</span>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-3">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-4 text-sky-300">
              Navigation
            </p>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-4 text-sky-300">
              Office Information
            </p>
            <div className="flex items-start gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>Brgy. Gabi, Cordova, Cebu 6017</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>0991 702 3497 / (032) 383 3520 </span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>cwsi@abejoph.com </span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Mon–Fri: 8:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Cordova Water System Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dedicated to the families of Cordova, Cebu
          </p>
        </div>
      </div>
    </footer>
  );
}
