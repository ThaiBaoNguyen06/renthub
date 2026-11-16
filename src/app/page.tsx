import {asc} from "drizzle-orm";
import {cacheLife} from "next/cache";
import {db} from "@/db/client";
import {wards} from "@/db/schema";

async function getWards() {
  "use cache";
  cacheLife("days");
  return db.select().from(wards).orderBy(asc(wards.sortOrder));
}

export default async function Home() {
  const list = await getWards();
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">RentHub</h1>
      <p className="mt-2 text-gray-600">Tìm nhà cho thuê tại Quận 7, TP.HCM</p>
      <h2 className="mt-8 text-xl font-semibold">Các phường</h2>
      <ul className="mt-2 list-disc pl-5">
        {list.map((w) =>(
        <li key={w.id}>{w.name}</li>
        ))}
      </ul>
    </main>
  );
}
