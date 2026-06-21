import { KANBAN_COLS, KANBAN_CARDS } from "@/components/landing/landingData.js";


export function KanbanMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-2xl overflow-hidden bg-white" data-cursor-hover>
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="flex-1 ml-3">
          <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 inline-block">
            app.jobtrackly.io/kanban
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-50 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {KANBAN_COLS.map((col) => (
            <div key={col.label} className="w-36 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-[11px] font-semibold text-gray-700">{col.label}</span>
                </div>
                <span className="text-[10px] text-gray-400">{col.count}</span>
              </div>
              <div className="space-y-2">
                {(KANBAN_CARDS[col.label] || []).map((card) => (
                  <div key={card.role} className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100">
                    <div className="text-[11px] font-semibold text-gray-800">{card.role}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{card.company}</div>
                  </div>
                ))}
                {!KANBAN_CARDS[col.label] && <div className="h-8 rounded-lg border-2 border-dashed border-gray-200" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardMockup() {
  const stats = [
    { label: "Applied",      value: "18",  c: "text-blue-600"   },
    { label: "Interviews",   value: "5",   c: "text-teal-600"   },
    { label: "Offers",       value: "2",   c: "text-green-600"  },
    { label: "Response rate",value: "38%", c: "text-purple-600" },
  ];
  const recent = [
    { role: "Frontend Engineer", company: "Stripe",  status: "Interview", dot: "bg-teal-500"  },
    { role: "Data Analyst",      company: "Airbnb",  status: "Applied",   dot: "bg-blue-500"  },
    { role: "PM, Growth",        company: "Notion",  status: "Offer",     dot: "bg-green-500" },
  ];
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-4 w-full max-w-xs" data-cursor-hover>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className={`text-base font-extrabold ${s.c}`}>{s.value}</div>
            <div className="text-[8px] text-gray-400 leading-tight mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] font-bold text-gray-700 mb-2">Recent applications</div>
      <div className="space-y-1.5 mb-3">
        {recent.map((r) => (
          <div key={r.role} className="flex items-center gap-2 text-[10px]">
            <span className={`w-1.5 h-1.5 rounded-full ${r.dot} flex-shrink-0`} />
            <span className="text-gray-700 font-medium truncate">{r.role}</span>
            <span className="text-gray-400 truncate">{r.company}</span>
            <span className="ml-auto text-gray-400 flex-shrink-0">{r.status}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
        <span className="text-gray-600">2 follow-ups due this week</span>
      </div>
    </div>
  );
}

export function CalendarMockup() {
  const days  = ["Mo","Tu","We","Th","Fr","Sa","Su"];
  const cells = Array.from({ length: 35 }, (_, i) => { const d = i - 2; return d > 0 && d <= 30 ? d : null; });
  const dotColor = { 8:"bg-teal-400", 15:"bg-amber-400", 22:"bg-green-400" };
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-4 w-full max-w-xs" data-cursor-hover>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-900">June 2025</span>
        <span className="text-xs text-gray-400">Google synced ✓</span>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map((d) => <div key={d} className="text-center text-[10px] text-gray-400 font-medium">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <div key={i} className={`aspect-square flex items-center justify-center rounded-md text-[11px] font-medium relative ${d === 14 ? "bg-blue-500 text-white" : "text-gray-700"}`}>
            {d || ""}
            {d && dotColor[d] && <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${dotColor[d]}`} />}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {[{ color:"bg-teal-400", label:"Interview — Google SWE", day:"Jun 8" }, { color:"bg-amber-400", label:"Follow-up — Stripe", day:"Jun 15" }].map((e) => (
          <div key={e.label} className="flex items-center gap-2 text-[10px]">
            <span className={`w-1.5 h-1.5 rounded-full ${e.color} flex-shrink-0`} />
            <span className="text-gray-600 truncate">{e.label}</span>
            <span className="ml-auto text-gray-400 flex-shrink-0">{e.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsMockup() {
  const bars = [40,65,50,80,55,90,70];
  const days = ["M","T","W","T","F","S","S"];
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-4 w-full max-w-xs" data-cursor-hover>
      <div className="text-xs font-bold text-gray-700 mb-3">Applications this week</div>
      <div className="flex items-end gap-1.5 h-20 mb-2">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-blue-100 flex flex-col justify-start" style={{ height:`${h}%` }}>
            <div className="rounded-t-sm bg-blue-500 w-full" style={{ height:"30%" }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mb-3">
        {days.map((d, i) => <div key={i} className="flex-1 text-center text-[9px] text-gray-400">{d}</div>)}
      </div>
      <div className="pt-3 border-t border-gray-100 flex gap-3">
        {[{ label:"Applied", val:"12", c:"text-blue-600" }, { label:"Interviews", val:"4", c:"text-teal-600" }, { label:"Response rate", val:"33%", c:"text-green-600" }].map((s) => (
          <div key={s.label} className="flex-1 text-center">
            <div className={`text-sm font-extrabold ${s.c}`}>{s.val}</div>
            <div className="text-[9px] text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}