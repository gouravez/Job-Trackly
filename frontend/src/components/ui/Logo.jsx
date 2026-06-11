import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ size = "md", className }) {
  const sizes = {
    sm: { icon: 16, box: "w-8 h-8 rounded-lg", text: "text-sm" },
    md: { icon: 20, box: "w-9 h-9 rounded-xl", text: "text-base" },
    lg: { icon: 24, box: "w-11 h-11 rounded-xl", text: "text-lg" },
  };
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn("flex items-center justify-center bg-dark-accent", s.box)}
      >
        <Briefcase size={s.icon} color="white" strokeWidth={2} />
      </div>
      <span className={cn("font-bold text-gray-900 tracking-tight", s.text)}>
        Job Trackly
      </span>
    </div>
  );
}
