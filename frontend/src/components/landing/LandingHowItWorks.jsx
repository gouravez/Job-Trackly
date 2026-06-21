import { Reveal } from "@/effects/GlobalEffects.jsx";

const HOW_IT_WORKS = [
  { step: "01", title: "Sign up in seconds",           desc: "Create an account with email (OTP-verified) or one-click Google sign-in — no credit card, no setup." },
  { step: "02", title: "Add an application",          desc: "Log a role in seconds: company, position, status, date applied. Or save it first and apply later." },
  { step: "03", title: "Move it through the pipeline",desc: "Drag cards across your Kanban as things progress. Assessment, interview, offer — it all stays organized." },
  { step: "04", title: "Never miss a beat",           desc: "Calendar keeps your interview dates in view. Reminders ping you before follow-ups are due. Analytics show what's working." },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gray-50 border-y border-gray-100 py-24 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <Reveal variant="up" className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-500 mb-3 tracking-widest uppercase">
            How it works
          </p>
          <h2 className="text-4xl font-extrabold text-gray-900">
            Up and running in minutes
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal
              key={step.step}
              variant="up"
              delay={i * 100}
              className="space-y-3"
            >
              <div className="text-4xl font-black text-gray-100 leading-none">
                {step.step}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}