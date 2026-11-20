import { PRICE_RANGES, PROPERTY_TYPES, WARDS } from "@/lib/mock-listings";
import { SearchIcon } from "./icons";

// Plain GET form: works without JavaScript and produces a shareable URL.
// The results page (/thue-nha-quan-7) is built in build-guide step 11.
export function SearchBar() {
  return (
    <form
      action="/thue-nha-quan-7"
      method="get"
      role="search"
      className="mx-auto flex w-full max-w-3xl flex-col gap-1 rounded-3xl border border-line bg-white p-2 shadow-pill sm:flex-row sm:items-center sm:gap-0 sm:rounded-full"
    >
      <Field label="Khu vực" name="phuong" placeholder="Tất cả phường">
        {WARDS.map((w) => (
          <option key={w.slug} value={w.slug}>{w.name}</option>
        ))}
      </Field>
      <Divider />
      <Field label="Loại nhà" name="loai" placeholder="Mọi loại nhà">
        {PROPERTY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </Field>
      <Divider />
      <Field label="Giá thuê / tháng" name="gia" placeholder="Mọi mức giá">
        {PRICE_RANGES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </Field>
      <button
        type="submit"
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:ml-2 sm:w-12 sm:px-0 md:w-auto md:px-5"
      >
        <SearchIcon />
        <span className="sm:sr-only md:not-sr-only">Tìm kiếm</span>
      </button>
    </form>
  );
}

function Field({ label, name, placeholder, children }: { label: string; name: string; placeholder: string; children: React.ReactNode }) {
  const id = `search-${name}`;
  return (
    <div className="flex-1 rounded-full px-5 py-2 transition-colors focus-within:bg-slate-100 hover:bg-slate-50">
      <label htmlFor={id} className="block text-xs font-semibold text-ink">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        className="w-full cursor-pointer appearance-none bg-transparent text-sm text-ink-muted outline-none"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 hidden h-8 w-px bg-line sm:block" />;
}
