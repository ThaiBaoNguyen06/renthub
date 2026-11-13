"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

/** A titled horizontal carousel. Children are the cards. */
export function ListingRow({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          <Link href={href} className="group inline-flex items-center gap-2 rounded-lg hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
            {title}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 transition-colors group-hover:bg-slate-200">
              <ArrowRightIcon />
            </span>
          </Link>
        </h2>
        <div className="hidden gap-2 sm:flex">
          <NavButton label={`Xem tin trước – ${title}`} disabled={!canPrev} onClick={() => scrollBy(-1)}>
            <ChevronLeftIcon />
          </NavButton>
          <NavButton label={`Xem tin tiếp – ${title}`} disabled={!canNext} onClick={() => scrollBy(1)}>
            <ChevronRightIcon />
          </NavButton>
        </div>
      </div>
      <div
        ref={scroller}
        onScroll={update}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {children}
      </div>
    </section>
  );
}

export function RowItem({ children }: { children: React.ReactNode }) {
  return <div className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23%] xl:w-[18.5%]">{children}</div>;
}

function NavButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:shadow-pill disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-none"
    >
      {children}
    </button>
  );
}
