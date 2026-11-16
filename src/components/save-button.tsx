"use client";

import { useState } from "react";
import { HeartIcon } from "./icons";

// shortcut: local state only. Real saving needs login + saved_listings (build-guide step 13).
export function SaveButton({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setSaved((s) => !s)}
      aria-pressed={saved}
      aria-label={saved ? `Bỏ lưu ${title}` : `Lưu ${title}`}
      className={`grid h-11 w-11 place-items-center rounded-full transition-transform active:scale-90 ${saved ? "text-rose-500" : "text-transparent"}`}
    >
      <HeartIcon filled={saved} className="h-6 w-6 drop-shadow" />
    </button>
  );
}
