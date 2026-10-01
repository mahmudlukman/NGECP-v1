import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

interface TagListFieldProps {
  label: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  emptyText?: string;
}

const TagListField = ({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
  emptyText = "None added yet",
}: TagListFieldProps) => {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="font-[Figtree,ui-sans-serif,system-ui,sans-serif]">
      <label className="mb-2 block text-sm font-medium text-[#0B1F1A]/70">
        {label}
      </label>
      <div className="mb-3 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-[#0B1F1A]/15 px-3 py-2 text-sm text-[#0B1F1A] placeholder:text-[#0B1F1A]/35 focus:border-[#16785A] focus:outline-none focus:ring-2 focus:ring-[#16785A]/20"
        />
        <button
          type="button"
          onClick={submit}
          className="flex items-center gap-1.5 rounded-lg bg-[#0B1F1A] px-4 py-2 text-sm font-medium text-[#F3F1EA] transition-colors hover:bg-[#12332b]"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#16785A]/[0.08] py-1.5 pl-3 pr-2 text-sm text-[#0B1F1A]/80"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${item}`}
                className="text-[#0B1F1A]/35 transition-colors hover:text-rose-600"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs italic text-[#0B1F1A]/40">{emptyText}</p>
      )}
    </div>
  );
};

export default TagListField;
