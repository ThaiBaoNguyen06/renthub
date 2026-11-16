import Image from "next/image";
import Link from "next/link";
import { formatPriceVnd } from "@/lib/format";
import { PROPERTY_TYPES, WARDS, type MockListing } from "@/lib/mock-listings";
import { AreaIcon, BedIcon } from "./icons";
import { SaveButton } from "./save-button";

export function ListingCard({ listing, priority = false }: { listing: MockListing; priority?: boolean }) {
  const ward = WARDS.find((w) => w.slug === listing.wardSlug)?.name;
  const type = PROPERTY_TYPES.find((t) => t.value === listing.type)?.label;

  return (
    <article className="group relative">
      <Link href={`/nha-cho-thue/${listing.slug}`} className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={listing.image}
            alt={`${listing.title} tại ${ward}`}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 640px) 45vw, 72vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {listing.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              Mới đăng
            </span>
          )}
        </div>
        <div className="mt-3 space-y-0.5">
          <h3 className="truncate text-[15px] font-semibold text-ink">
            {type} tại {ward}
          </h3>
          <p className="truncate text-sm text-ink-muted">{listing.title}</p>
          <p className="flex items-center gap-3 text-sm text-ink-muted">
            <span className="flex items-center gap-1"><BedIcon /> {listing.bedrooms} PN</span>
            <span className="flex items-center gap-1"><AreaIcon /> {listing.areaSqm} m²</span>
          </p>
          <p className="pt-1 text-[15px] text-ink">
            <span className="font-semibold">{formatPriceVnd(listing.monthlyPrice)}</span> / tháng
          </p>
        </div>
      </Link>
      <div className="absolute right-1.5 top-1.5">
        <SaveButton title={listing.title} />
      </div>
    </article>
  );
}
