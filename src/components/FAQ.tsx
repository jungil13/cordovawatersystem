import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How to Apply for a New Service Connection?",
    a: "As our main requirement, applicants should attend an Orientation/Seminar at Cordova Water System Inc. Office scheduled every Thursday & Friday at 2:00 o'clock in the afternoon. All the requirements and policies will be discussed in the orientation/seminar.",
  },
  {
    q: "Meter Reading, Due Date, Disconnection Schedule?",
    a: "Meter Reading – Every 1st to 5th day of the month.\n\nDue Date – Every 25th day of the month. Note that an additional 2% of your current bill will be added to your bill as the penalty. Always be prompt to pay your water bills to avoid penalty and service line disconnection.\n\nDisconnection Schedule – If you haven't settled your account 5 days after your due date, please expect our disconnection team to inform you that your service line will be temporarily disconnected until you settle your account.",
  },
  {
    q: "How to Request for Reconnection?",
    a: "Temporary Close – For temporary close without balance, please go to our billing staff and request for Reconnection. You will be given a Reconnection Form to fill up and sign. After this, our reconnection team will proceed to reconnect your water meter.\n\nDisconnected Account – For accounts that have been disconnected due to unpaid balance, please settle your account first at the teller. After paying your arrears plus the reconnection fee, you can request for Reconnection. You will be given a Reconnection Form to fill up and sign. After this, our reconnection team will proceed to reconnect your water meter.\n\nNote: Please be sure to close all your faucets before requesting for reconnection. Our personnel will not be liable for any water loss due to this circumstance.",
  },
  {
    q: "Why Do I Have No Water?",
    a: "If there is an emergency mainline leak repair, we will be forced to shut off some valves or, at maximum, our pumping stations to prevent excessive water loss. Notice of this event will be posted through our Facebook Page (https://www.facebook.com/profile.php?id=61562900730330).\n\nOther circumstances of having no water may be due to unsettled water balances. Please be prompt to pay your water bills to avoid disconnection of your service lines.",
  },
  {
    q: "What Are the Water Consumption and Fees?",
    a: "Our approved tariff schedule:\n\n• 0 – 5 cu. m: ₱220 (Minimum charge)\n• 6 – 10 cu. m: ₱48 per cubic meter\n• 11 – 20 cu. m: ₱54 per cubic meter\n• 21 – 30 cu. m: ₱65 per cubic meter\n• 31+ cu. m: ₱92 per cubic meter\n\nFor full details, visit the Water Rates section of this website.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="faq" className="py-20 bg-white reveal-init">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Common Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Find quick answers to questions about new connections, billing schedule, reconnections, and water rates.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen ? "border-blue-300 bg-sky-50/30 shadow-md" : "border-slate-200/90 bg-white"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span
                    className={`font-bold text-xs sm:text-sm transition-colors ${
                      isOpen ? "text-blue-800" : "text-slate-900"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a.split("\n\n").map((paragraph, pi) => {
                      // Render bullet lines
                      const lines = paragraph.split("\n");
                      return (
                        <div key={pi} className={pi > 0 ? "mt-3" : ""}>
                          {lines.map((line, li) =>
                            line.startsWith("•") ? (
                              <p key={li} className="flex items-start gap-1.5 mt-1">
                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                <span>{line.substring(1).trim()}</span>
                              </p>
                            ) : line.startsWith("Note:") ? (
                              <p key={li} className="mt-2 text-amber-700 font-semibold bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                                {line}
                              </p>
                            ) : line.includes("facebook.com") ? (
                              <p key={li} className="mt-1">
                                {line.split("(https://")[0]}
                                {line.includes("(https://") && (
                                  <a
                                    href={"https://" + line.split("(https://")[1].replace(")", "")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-semibold"
                                  >
                                    Facebook Page
                                  </a>
                                )}
                              </p>
                            ) : (
                              <p key={li} className={li > 0 ? "mt-1" : ""}>{line}</p>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-2xl p-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 text-center">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
            Still have questions about your account?
          </h3>
          <p className="text-xs text-slate-600 mb-4">
            Our customer relations desk in Brgy. Gabi is ready to assist you.
          </p>
          <button
            onClick={() => scrollTo("contact")}
            className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-md cursor-pointer"
          >
            Contact Customer Support
          </button>
        </div>
      </div>
    </section>
  );
}
