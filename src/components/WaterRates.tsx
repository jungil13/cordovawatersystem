import { useState } from "react";
import { getStoredRates, RateBracket } from "@/lib/data";
import { CheckCircle2, Droplets } from "lucide-react";

export default function WaterRates() {
  const [rates] = useState<RateBracket[]>(getStoredRates());

  return (
    <section id="rates" className="py-20 bg-gradient-to-b from-slate-50 to-sky-50/50 reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            Official Tariff Rates
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Water Consumption & Tariff Fees
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Transparent and standardized water tariff schedule approved for residential and commercial connections in Brgy. Gabi, Cordova, Cebu.
          </p>
        </div>

        {/* Centered Rates Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* White Header Block */}
            <div className="bg-white border-b border-slate-200 p-6 text-center relative">
              <div className="absolute top-3 right-4 opacity-10">
                <Droplets className="w-16 h-16 text-sky-500" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">
                WATER CONSUMPTION AND FEES
              </p>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                Residential / Commercial – Bag-ong presyo kada kubiko
              </h3>
            </div>

            {/* Table — white background */}
            <div className="p-4 sm:p-6 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-[11px] sm:text-xs tracking-wider">
                      <th className="py-3 px-3 sm:px-4">KONSUMO (KUBIKO)</th>
                      <th className="py-3 px-3 sm:px-4 text-center">RESIDENTIAL / COMMERCIAL</th>
                      <th className="py-3 px-3 sm:px-4 text-right">REMARKS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rates.map((rate, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-sky-50/60 transition-colors duration-150"
                      >
                        <td className="py-3.5 px-3 sm:px-4 font-semibold text-slate-800">
                          {rate.range}
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-center font-extrabold text-blue-700 text-sm sm:text-base">
                          ₱{rate.rate}
                        </td>
                        <td className="py-3.5 px-3 sm:px-4 text-right text-slate-500 text-xs sm:text-sm font-medium">
                          {rate.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-600">Note:</span> Rates shown are for display purposes and should be validated against the latest official CWSI tariff and advisories.
              </div>
            </div>

            {/* Highlights Bar */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Base minimum ₱220 covers first 5 cu. m</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Billing cycle generated 1st–5th of every month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
