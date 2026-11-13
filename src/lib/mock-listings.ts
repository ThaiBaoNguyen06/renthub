// shortcut: MOCK data for the homepage design. Replace with real queries on published listings (build-guide step 11).

export type Ward = { name: string; slug: string };

export const WARDS: Ward[] = [
  { name: "Tân Thuận", slug: "tan-thuan" },
  { name: "Phú Thuận", slug: "phu-thuan" },
  { name: "Tân Mỹ", slug: "tan-my" },
  { name: "Tân Hưng", slug: "tan-hung" },
];

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Căn hộ" },
  { value: "house", label: "Nhà riêng" },
  { value: "townhouse", label: "Nhà phố" },
  { value: "villa", label: "Biệt thự" },
  { value: "studio", label: "Studio" },
  { value: "room", label: "Phòng" },
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];

export const PRICE_RANGES = [
  { value: "0-5", label: "Dưới 5 triệu" },
  { value: "5-10", label: "5 – 10 triệu" },
  { value: "10-20", label: "10 – 20 triệu" },
  { value: "20-50", label: "20 – 50 triệu" },
  { value: "50-", label: "Trên 50 triệu" },
];

export type MockListing = {
  slug: string;
  type: PropertyType;
  wardSlug: string;
  title: string;
  monthlyPrice: number; // VND
  areaSqm: number;
  bedrooms: number;
  image: string;
  isNew?: boolean;
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=720&q=70&auto=format&fit=crop`;

export const MOCK_LISTINGS: MockListing[] = [
  { slug: "can-ho-2pn-view-song-tan-hung-a1b2c3", type: "apartment", wardSlug: "tan-hung", title: "Căn hộ 2PN view sông", monthlyPrice: 15_000_000, areaSqm: 75, bedrooms: 2, image: img("1560448204-e02f11c3d0e2"), isNew: true },
  { slug: "studio-full-noi-that-tan-hung-d4e5f6", type: "studio", wardSlug: "tan-hung", title: "Studio full nội thất", monthlyPrice: 7_500_000, areaSqm: 35, bedrooms: 1, image: img("1502672260266-1c1ef2d93688") },
  { slug: "can-ho-3pn-gan-crescent-mall-g7h8i9", type: "apartment", wardSlug: "tan-hung", title: "Căn hộ 3PN gần Crescent Mall", monthlyPrice: 28_000_000, areaSqm: 120, bedrooms: 3, image: img("1522708323590-d24dbb6b0267") },
  { slug: "can-ho-1pn-ban-cong-tan-hung-j1k2l3", type: "apartment", wardSlug: "tan-hung", title: "Căn hộ 1PN có ban công", monthlyPrice: 11_000_000, areaSqm: 52, bedrooms: 1, image: img("1493809842364-78817add7ffb"), isNew: true },
  { slug: "phong-rieng-gan-dai-hoc-tan-hung-m4n5o6", type: "room", wardSlug: "tan-hung", title: "Phòng riêng gần đại học", monthlyPrice: 4_200_000, areaSqm: 22, bedrooms: 1, image: img("1505691938895-1758d7feb511") },
  { slug: "nha-pho-4-tang-tan-my-p7q8r9", type: "townhouse", wardSlug: "tan-my", title: "Nhà phố 4 tầng mặt tiền", monthlyPrice: 45_000_000, areaSqm: 240, bedrooms: 4, image: img("1568605114967-8130f3a36994") },
  { slug: "biet-thu-san-vuon-tan-my-s1t2u3", type: "villa", wardSlug: "tan-my", title: "Biệt thự sân vườn hồ bơi", monthlyPrice: 120_000_000, areaSqm: 400, bedrooms: 5, image: img("1613490493576-7fde63acd811") },
  { slug: "can-ho-2pn-gan-cong-vien-tan-my-v4w5x6", type: "apartment", wardSlug: "tan-my", title: "Căn hộ 2PN gần công viên", monthlyPrice: 18_000_000, areaSqm: 82, bedrooms: 2, image: img("1554995207-c18c203602cb"), isNew: true },
  { slug: "nha-rieng-hem-xe-hoi-tan-my-y7z8a9", type: "house", wardSlug: "tan-my", title: "Nhà riêng hẻm xe hơi", monthlyPrice: 22_000_000, areaSqm: 110, bedrooms: 3, image: img("1570129477492-45c003edd2be") },
  { slug: "studio-toi-gian-tan-my-b1c2d3", type: "studio", wardSlug: "tan-my", title: "Studio tối giản, nhiều ánh sáng", monthlyPrice: 8_000_000, areaSqm: 38, bedrooms: 1, image: img("1586023492125-27b2c045efd7") },
  { slug: "biet-thu-hien-dai-phu-thuan-e4f5g6", type: "villa", wardSlug: "phu-thuan", title: "Biệt thự hiện đại 3 tầng", monthlyPrice: 85_000_000, areaSqm: 320, bedrooms: 4, image: img("1600596542815-ffad4c1539a9") },
  { slug: "nha-pho-moi-xay-phu-thuan-h7i8j9", type: "townhouse", wardSlug: "phu-thuan", title: "Nhà phố mới xây", monthlyPrice: 32_000_000, areaSqm: 180, bedrooms: 4, image: img("1600585154340-be6161a56a0c"), isNew: true },
  { slug: "can-ho-bep-rong-phu-thuan-k1l2m3", type: "apartment", wardSlug: "phu-thuan", title: "Căn hộ bếp rộng, 2PN", monthlyPrice: 14_000_000, areaSqm: 70, bedrooms: 2, image: img("1484154218962-a197022b5858") },
  { slug: "nha-rieng-san-thuong-phu-thuan-n4o5p6", type: "house", wardSlug: "phu-thuan", title: "Nhà riêng có sân thượng", monthlyPrice: 19_500_000, areaSqm: 95, bedrooms: 3, image: img("1580587771525-78b9dba3b914") },
  { slug: "can-ho-cao-cap-phu-thuan-q7r8s9", type: "apartment", wardSlug: "phu-thuan", title: "Căn hộ cao cấp tầng cao", monthlyPrice: 35_000_000, areaSqm: 130, bedrooms: 3, image: img("1600607687939-ce8a6c25118c") },
  { slug: "nha-rieng-gan-cang-tan-thuan-t1u2v3", type: "house", wardSlug: "tan-thuan", title: "Nhà riêng gần khu chế xuất", monthlyPrice: 12_000_000, areaSqm: 80, bedrooms: 2, image: img("1512917774080-9991f1c4c750") },
  { slug: "can-ho-tien-nghi-tan-thuan-w4x5y6", type: "apartment", wardSlug: "tan-thuan", title: "Căn hộ tiện nghi, có bảo vệ", monthlyPrice: 9_500_000, areaSqm: 60, bedrooms: 2, image: img("1600210492486-724fe5c67fb0"), isNew: true },
  { slug: "nha-pho-kinh-doanh-tan-thuan-z7a8b9", type: "townhouse", wardSlug: "tan-thuan", title: "Nhà phố tiện kinh doanh", monthlyPrice: 26_000_000, areaSqm: 150, bedrooms: 3, image: img("1494526585095-c41746248156") },
  { slug: "phong-co-gac-tan-thuan-c1d2e3", type: "room", wardSlug: "tan-thuan", title: "Phòng có gác, giờ giấc tự do", monthlyPrice: 3_500_000, areaSqm: 25, bedrooms: 1, image: img("1617104678098-de229db51175") },
  { slug: "studio-gan-cau-tan-thuan-f4g5h6", type: "studio", wardSlug: "tan-thuan", title: "Studio gần cầu Tân Thuận", monthlyPrice: 6_800_000, areaSqm: 32, bedrooms: 1, image: img("1501183638710-841dd1904471") },
];

/** Cover image per property type, for the "browse by type" row. */
export const TYPE_COVERS: Record<PropertyType, string> = {
  apartment: img("1522708323590-d24dbb6b0267"),
  house: img("1570129477492-45c003edd2be"),
  townhouse: img("1568605114967-8130f3a36994"),
  villa: img("1613490493576-7fde63acd811"),
  studio: img("1502672260266-1c1ef2d93688"),
  room: img("1505691938895-1758d7feb511"),
};
