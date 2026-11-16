import Link from "next/link";
import { BuildingIcon, DoorIcon, GridIcon, HomeIcon, MenuIcon, SofaIcon, StoreIcon, TreeIcon, UserIcon } from "./icons";
import { SearchBar } from "./search-bar";

const CATEGORIES = [
  { value: undefined, label: "Tất cả", Icon: GridIcon },
  { value: "apartment", label: "Căn hộ", Icon: BuildingIcon },
  { value: "house", label: "Nhà riêng", Icon: HomeIcon },
  { value: "townhouse", label: "Nhà phố", Icon: StoreIcon },
  { value: "villa", label: "Biệt thự", Icon: TreeIcon },
  { value: "studio", label: "Studio", Icon: SofaIcon },
  { value: "room", label: "Phòng", Icon: DoorIcon },
];

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
      aria-label="RentHub – Trang chủ"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
        <HomeIcon className="h-5 w-5" />
      </span>
      <span className="text-xl font-bold tracking-tight text-brand">RentHub</span>
    </Link>
  );
}

export function SiteHeader({ activeType }: { activeType?: string }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pt-4 sm:px-6 lg:px-10">
          <Logo />
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/dang-ky?vai-tro=host"
              className="hidden rounded-full px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-100 md:block"
            >
              Đăng tin cho thuê
            </Link>
            <Link
              href="/dang-nhap"
              aria-label="Đăng nhập"
              className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-ink transition-colors hover:bg-slate-200"
            >
              <UserIcon />
            </Link>
            <button
              type="button"
              aria-label="Mở menu"
              className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-ink transition-colors hover:bg-slate-200"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <nav aria-label="Loại nhà" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <ul className="no-scrollbar -mb-px mt-2 flex gap-6 overflow-x-auto sm:justify-center sm:gap-8">
            {CATEGORIES.map(({ value, label, Icon }) => {
              const active = activeType === value;
              return (
                <li key={label} className="shrink-0">
                  <Link
                    href={value ? `/?loai=${value}` : "/"}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 flex-col items-center gap-1 border-b-2 pb-2 pt-1 text-xs font-medium transition-colors sm:text-sm ${
                      active ? "border-ink text-ink" : "border-transparent text-ink-muted hover:border-line hover:text-ink"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Not sticky: on phones the full form would cover half the screen while scrolling. */}
      <div className="border-b border-line bg-slate-50 px-4 py-5 sm:px-6">
        <SearchBar />
      </div>
    </>
  );
}
