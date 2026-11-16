// Inline SVG icons (Lucide-style, 24px grid, stroke). Decorative by default: callers add labels.
type IconProps = { className?: string };

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const SearchIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const HeartIcon = ({ className = "h-6 w-6", filled = false }: IconProps & { filled?: boolean }) => (
  <svg {...base} className={className} fill={filled ? "currentColor" : "rgba(0,0,0,0.35)"} stroke="white" strokeWidth={2}>
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
  </svg>
);
export const ChevronLeftIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}><path d="m15 18-6-6 6-6" /></svg>
);
export const ChevronRightIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}><path d="m9 18 6-6-6-6" /></svg>
);
export const ArrowRightIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
export const MenuIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const UserIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const BedIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" /></svg>
);
export const AreaIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <svg {...base} className={className}><path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" /></svg>
);
export const ShieldCheckIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
);

// Category icons
export const GridIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
);
export const BuildingIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" /></svg>
);
export const HomeIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M3 10.5 12 3l9 7.5V21H3z" /><path d="M9 21v-6h6v6" /></svg>
);
export const StoreIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M3 9 5 3h14l2 6" /><path d="M3 9h18v12H3z" /><path d="M9 21v-6h6v6" /></svg>
);
export const TreeIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M12 22v-6" /><path d="M7 16h10l-3-4h2l-4-6-4 6h2z" /><path d="M3 22h18" /></svg>
);
export const SofaIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M2 14a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z" /></svg>
);
export const DoorIcon = ({ className = "h-6 w-6" }: IconProps) => (
  <svg {...base} className={className}><path d="M4 22h16M6 22V3h12v19" /><path d="M14 12h.01" /></svg>
);
