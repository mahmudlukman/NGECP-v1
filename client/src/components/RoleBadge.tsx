import type { UserRole } from "../utils/data";

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  admin: "bg-[#0B1F1A] text-[#F3F1EA] border-[#0B1F1A]",
  editor: "bg-[#16785A]/10 text-[#16785A] border-[#16785A]/25",
  user: "bg-[#0B1F1A]/[0.04] text-[#0B1F1A]/70 border-[#0B1F1A]/10",
};

// Type guard or helper to check if a string is a valid UserRole
const isValidRole = (role: string): role is UserRole => {
  return role in ROLE_BADGE_STYLES;
};

const RoleBadge = ({ role }: { role?: string }) => {
  if (!role) return null;

  const normalizedRole = role.toLowerCase();
  const styles = isValidRole(normalizedRole)
    ? ROLE_BADGE_STYLES[normalizedRole]
    : ROLE_BADGE_STYLES.user;

  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[10px] font-semibold uppercase tracking-wide ${styles}`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;