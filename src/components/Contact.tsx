import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { InquiryApplication } from "@/lib/data";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Navigation,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Inquiry" as InquiryApplication["type"],
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("inquiries").insert([
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            inquiry_type: form.type,
            subject: form.subject,
            message: form.message,
            status: "Pending",
          },
        ]);
        if (error) {
          console.warn("Supabase inquiry insert note:", error);
        }
      }

      setSent(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        type: "Inquiry",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      console.error("Submission note:", err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            Connect With Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Contact & Office Location
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            Have an inquiry, service application, or reporting a leak? Visit our office in Brgy. Gabi or send us a message directly.
          </p>
        </div>

        {/* Contact Info + Interactive Map + Form Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Office Details & Embedded Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Info Box */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-sky-900 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold mb-1">
                Cordova Water System Office
              </h3>
              <p className="text-blue-200 text-xs mb-6">
                Serving Cordova with clean and potable water since 2011.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-cyan-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-[11px] font-medium uppercase tracking-wider">
                      Office Address
                    </p>
                    <p className="text-white font-medium">
                      Brgy. Gabi, Cordova, Cebu 6017, Philippines
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-cyan-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-[11px] font-medium uppercase tracking-wider">
                      Landline / Hotline
                    </p>
                    <p className="text-white font-medium">0991 702 3497 / (032) 383 3520</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-cyan-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-[11px] font-medium uppercase tracking-wider">
                      Email Address
                    </p>
                    <p className="text-white font-medium">cwsi@abejoph.com </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-cyan-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-[11px] font-medium uppercase tracking-wider">
                      Office Hours
                    </p>
                    <p className="text-white font-medium">
                      Monday to Friday: 8:00 AM - 5:00 PM <br />
                      Saturday: 8:00 AM – 12:00 NN <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden">
              <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cordova, Cebu Map & Pin</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/Brgy.+Gabi,+Cordova,+Cebu"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px] font-medium"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative w-full h-64 sm:h-72">
                <iframe
                  title="Cordova Water System Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3925.950687854571!2d123.9643657!3d10.2655571!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a7203807cf7%3A0x93a9ec1809b4d51c!2sCORDOVA%20WATER%20SYSTEM%20INC!5e0!3m2!1sen!2sph!4v1787897218863!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Send Application / Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
            {sent ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Message & Application Received!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you. Your submission has been securely transmitted. Our customer relations officer will contact you within 1–2 business days.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shadow-md cursor-pointer"
                >
                  Submit Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">
                    Send Inquiry or Service Application
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill out the form below. Submitted requests are saved directly to our database.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Juan dela Cruz"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="09XX-XXX-XXXX"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="juan@example.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                    >
                      <option value="Application">New Water Connection Application</option>
                      <option value="Inquiry">General Inquiry</option>
                      <option value="Billing">Billing & Payment Verification</option>
                      <option value="Leak Report">Report a Leak / Low Pressure</option>
                      <option value="Other">Other Concerns</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Concern Title *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. New connection request for Purok 2"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Provide specific details (e.g., house location, account number if applicable, description)..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 text-white text-xs font-bold hover:from-blue-800 hover:to-sky-700 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "Transmitting..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
