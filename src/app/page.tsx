import Image from "next/image";
import Link from "next/link";
import { ShieldCheckIcon } from "@/components/icons";
import { ListingCard } from "@/components/listing-card";
import { ListingRow, RowItem } from "@/components/listing-row";
import { Logo, SiteHeader } from "@/components/site-header";
import { MOCK_LISTINGS, PROPERTY_TYPES, TYPE_COVERS, WARDS } from "@/lib/mock-listings";

export default function HomePage({ searchParams }: { searchParams: { loai?: string } }) {
  const activeType = PROPERTY_TYPES.some((t) => t.value === searchParams.loai) ? searchParams.loai : undefined;
  const listings = activeType ? MOCK_LISTINGS.filter((l) => l.type === activeType) : MOCK_LISTINGS;
  const rows = WARDS.map((ward) => ({ ward, items: listings.filter((l) => l.wardSlug === ward.slug) })).filter((r) => r.items.length > 0);

  return (
    <>
      <SiteHeader activeType={activeType} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-10">
        {rows.length === 0 && (
          <p className="py-16 text-center text-ink-muted">Hiện chưa có tin đăng thuộc loại này. Vui lòng quay lại sau.</p>
        )}

        {rows.map(({ ward, items }, rowIndex) => (
          <ListingRow key={ward.slug} title={`Cho thuê tại ${ward.name}`} href={`/thue-nha-quan-7/${ward.slug}`}>
            {items.map((listing, i) => (
              <RowItem key={listing.slug}>
                {/* Above-the-fold images load first (LCP). */}
                <ListingCard listing={listing} priority={rowIndex === 0 && i < 4} />
              </RowItem>
            ))}
          </ListingRow>
        ))}

        <section className="py-6" aria-labelledby="by-type">
          <h2 id="by-type" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            Tìm theo loại nhà
          </h2>
          <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:px-0">
            {PROPERTY_TYPES.map((t) => (
              <li key={t.value} className="w-[40%] shrink-0 sm:w-[28%] lg:w-auto">
                <Link href={`/?loai=${t.value}`} className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
                    <Image src={TYPE_COVERS[t.value]} alt="" fill sizes="(min-width: 1024px) 16vw, 40vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <p className="mt-2 font-medium">{t.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 flex flex-col items-start gap-6 rounded-3xl bg-brand-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white">
              <ShieldCheckIcon />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Có nhà cho thuê ở Quận 7?</h2>
              <p className="mt-1 max-w-xl text-ink-muted">
                Gửi thông tin nhà cho RentHub. Môi giới sẽ xác minh, hoàn thiện tin đăng và kết nối bạn với người thuê phù hợp.
              </p>
            </div>
          </div>
          <Link
            href="/dang-ky?vai-tro=host"
            className="shrink-0 rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Đăng tin cho thuê
          </Link>
        </section>
      </main>

      <footer className="border-t border-line bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-10">
          <div className="space-y-2">
            <Logo />
            <p className="max-w-sm text-sm text-ink-muted">Nền tảng cho thuê nhà khu Quận 7, TP. Hồ Chí Minh.</p>
          </div>
          <nav aria-label="Khu vực" className="text-sm">
            <p className="mb-2 font-semibold">Khu vực</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-ink-muted">
              {WARDS.map((w) => (
                <li key={w.slug}>
                  <Link href={`/thue-nha-quan-7/${w.slug}`} className="hover:text-ink hover:underline">
                    Phường {w.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="border-t border-line py-4 text-center text-xs text-ink-muted">© {new Date().getFullYear()} RentHub</p>
      </footer>
    </>
  );
}
