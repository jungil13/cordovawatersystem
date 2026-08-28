import { useState, useEffect } from "react";
import { fetchTeam, TeamMember, initialTeam } from "@/lib/data";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam.slice(0, 3));

  useEffect(() => {
    fetchTeam().then((data) => {
      if (data && data.length > 0) {
        setTeamMembers(data.slice(0, 3));
      }
    });
  }, []);

  return (
    <section id="team" className="py-20 sm:py-28 bg-white reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-[0.25em] mb-2">
            TEAM
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f1e36] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet Our Team
          </h2>
        </div>

        {/* 3 Team Members Centered Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 justify-center items-end">
          {teamMembers.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center text-center group"
            >
              {/* Photo */}
              <div className="w-48 h-64 sm:w-full sm:h-72 overflow-hidden flex items-start justify-center mb-4 rounded-md">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover object-top filter drop-shadow-sm group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Name Centered */}
              <h3 className="font-extrabold text-[#111827] text-base sm:text-lg tracking-tight mb-2">
                {member.name}
              </h3>

              {/* Badge Centered */}
              <div className="inline-block">
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#f3f4f6] text-[#6b7280] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-slate-200/60">
                  {member.badge || member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}