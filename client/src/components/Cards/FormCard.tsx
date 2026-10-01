import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface FormCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

const FormCard = ({
  icon: Icon,
  title,
  description,
  action,
  children,
}: FormCardProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#0B1F1A]/10 bg-white font-[Figtree,ui-sans-serif,system-ui,sans-serif] shadow-[0_20px_40px_-30px_rgba(11,31,26,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0B1F1A]/10 bg-[#F7F6F1] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#16785A]/20 bg-[#16785A]/[0.08] text-[#16785A]">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="font-[Newsreader,Georgia,serif] text-base font-normal text-[#0B1F1A]">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#0B1F1A]/50">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
};

export default FormCard;
