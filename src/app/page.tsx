import { asc } from "drizzle-orm";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db/client";
import { wards } from "@/db/schema";
import { ShieldCheckIcon } from "@/components/icons";
import { ListingCard } from "@/components/listing-card";
import { ListingRow, RowItem } from "@/components/listing-row";
import { Logo, SiteHeader } from "@/components/site-header";
import { MOCK_LISTINGS, PROPERTY_TYPES, TYPE_COVERS, WARDS } from "@/lib/mock-listings";

// Wards rarely change, so the query result is cached for days.
async function getWards() {
  "use cache";
  cacheLife("days");
  return db.select().from(wards).orderBy(asc(wards.sortOrder));
}

// Next 16: searchParams is a Promise, and reading it is request-time work,
// so every component that awaits it sits inside <Suspense> (see HomePage).
type SearchParams = PageProps<"/">["searchParams"];

async function getActiveType(searchParams: SearchParams) {
  const { loai } = await searchParams;
  return PROPERTY_TYPES.some((t) => t.value === loai) ? (loai as string) : undefined;
}

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <>
      <Suspense fallback={<SiteHeader />}>
        <Header searchParams={searchParams} />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-10">
        <Suspense fallback={<ListingsSkeleton />}>
          <ListingRows searchParams={searchParams} />
        </Suspense>

        <section className="py-6" aria-labelledby="by-type">
          <h2 id="by-type" className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            Tìm theo loại nhà
          </h2>
          <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:px-0">
            {PROPERTY_TYPES.map((t) => (
              <li key={t.value} className="w-[40%] shrink-0 sm:w-[28%] lg:w-auto">
                <Link href={`/?loai=${t.value}`} className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
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
            className="shrink-0 rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Đăng tin cho thuê
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}

async function Header({ searchParams }: { searchParams: SearchParams }) {
  return <SiteHeader activeType={await getActiveType(searchParams)} />;
}

async function ListingRows({ searchParams }: { searchParams: SearchParams }) {
  const activeType = await getActiveType(searchParams);
  // shortcut: mock listings until real published listings exist (build-guide step 11).
  const listings = activeType ? MOCK_LISTINGS.filter((l) => l.type === activeType) : MOCK_LISTINGS;
  const rows = WARDS.map((ward) => ({ ward, items: listings.filter((l) => l.wardSlug === ward.slug) })).filter(
    (r) => r.items.length > 0,
  );

  if (rows.length === 0) {
    return <p className="py-16 text-center text-ink-muted">Hiện chưa có tin đăng thuộc loại này. Vui lòng quay lại sau.</p>;
  }

  return rows.map(({ ward, items }, rowIndex) => (
    <ListingRow key={ward.slug} title={`Cho thuê tại ${ward.name}`} href={`/thue-nha-quan-7/${ward.slug}`}>
      {items.map((listing, i) => (
        <RowItem key={listing.slug}>
          {/* Above-the-fold images load first (LCP). */}
          <ListingCard listing={listing} priority={rowIndex === 0 && i < 4} />
        </RowItem>
      ))}
    </ListingRow>
  ));
}

function ListingsSkeleton() {
  return (
    <div className="py-6" aria-hidden>
      <div className="mb-4 h-8 w-64 animate-pulse rounded-lg bg-slate-100" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="aspect-square w-[72%] shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:w-[45%] md:w-[31%] lg:w-[23%] xl:w-[18.5%]" />
        ))}
      </div>
    </div>
  );
}

// Cached: ward links come from the database; the year is computed inside the cache scope.
async function Footer() {
  "use cache";
  cacheLife("days");
  const wardList = await getWards();

  return (
    <footer className="border-t border-line bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between lg:px-10">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-ink-muted">Nền tảng cho thuê nhà khu Quận 7, TP. Hồ Chí Minh.</p>
        </div>
        <nav aria-label="Khu vực" className="text-sm">
          <p className="mb-2 font-semibold">Khu vực</p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-ink-muted">
            {wardList.map((w) => (
              <li key={w.id}>
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
  );
}
