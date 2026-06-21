import { Reveal } from "@/effects/GlobalEffects.jsx";

const STUDENT_CARDS = [
  { emoji: "🎓", title: "Campus recruiting ready", desc: "Track early deadlines, rolling admissions, and multiple recruiting cycles at once." },
  { emoji: "🤝", title: "Referral network",        desc: "Track alumni, professors, and recruiters. Link them to applications to remember who helped." },
  { emoji: "📄", title: "Resume versions",         desc: "Tailor your resume per role and keep every version organized in one place." },
];

export default function LandingStudents() {
  return (
    <section
      id="students"
      className="bg-gray-50 border-y border-gray-100 py-20 px-6"
    >
      <div className="max-w-4xl mx-auto text-center">
        <Reveal variant="up" className="mb-12">
          <p className="text-sm font-semibold text-brand-500 mb-3 tracking-widest uppercase">
            For students
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Free forever, while you're in school
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Campus recruiting is intense. Job Trackly gives every student the
            same tools professionals pay for — completely free, no credit card
            needed.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          {STUDENT_CARDS.map((card, i) => (
            <Reveal
              key={card.title}
              variant="scale"
              delay={i * 90}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-2"
            >
              <div data-cursor-hover>
                <div className="text-2xl">{card.emoji}</div>
                <h3 className="font-bold text-gray-900">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}