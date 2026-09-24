import type { LucideIcon } from "lucide-react";
import FormCard from "./FormCard";
import TagListField from "../Inputs/TagListField";

interface TagListCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  label: string;
  placeholder: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  emptyText?: string;
}

const TagListCard = ({
  icon,
  title,
  description,
  label,
  placeholder,
  items = [],
  onAdd,
  onRemove,
  emptyText,
}: TagListCardProps) => {
  return (
    <FormCard icon={icon} title={title} description={description}>
      <TagListField
        label={label}
        placeholder={placeholder}
        items={items}
        onAdd={onAdd}
        onRemove={onRemove}
        emptyText={emptyText}
      />
    </FormCard>
  );
};

export default TagListCard;
