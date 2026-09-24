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
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">
        {label}
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        />
        <button
          type="button"
          onClick={submit}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors"
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
              className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-sm pl-3 pr-2 py-1.5 rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${item}`}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">{emptyText}</p>
      )}
    </div>
  );
};

export default TagListField;
