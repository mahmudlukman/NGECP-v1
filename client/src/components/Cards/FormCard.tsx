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
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm shadow-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </section>
  );
};

export default FormCard;
