// Gallery items. Categories: Haircuts, Beard, Studio.
const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

export const GALLERY_CATEGORIES = ["All", "Haircuts", "Beard", "Studio"];

export const GALLERY = [
  { id: "g1", category: "Haircuts", title: "Modern skin fade", alt: "Barber finishing a modern skin fade haircut", src: img("photo-1621605815971-fbc98d665033") },
  { id: "g2", category: "Haircuts", title: "Classic side part", alt: "Classic gentleman's haircut with a side part", src: img("photo-1503951914875-452162b0f3f1") },
  { id: "g3", category: "Beard", title: "Sculpted beard", alt: "Neatly trimmed and sculpted beard", src: img("photo-1599351431202-1e0f0137899a") },
  { id: "g4", category: "Studio", title: "Barber chairs", alt: "Row of barber chairs inside a bright barber shop", src: img("photo-1585747860715-2ba37e788b70") },
  { id: "g5", category: "Haircuts", title: "Textured styling", alt: "Textured hair styling with a matte product", src: img("photo-1605497788044-5a32c7078486") },
  { id: "g6", category: "Beard", title: "Beard and cut combo", alt: "Fresh haircut paired with a groomed beard", src: img("photo-1622286342621-4bd786c2447c") },
  { id: "g7", category: "Studio", title: "Shop interior", alt: "Interior of a modern barber shop studio", src: img("photo-1532710093739-9470acff878f") },
  { id: "g8", category: "Haircuts", title: "Precision line-up", alt: "Barber creating a precise hairline line-up", src: img("photo-1512690459411-b9245aed614b") },
];

export const GALLERY_PREVIEW_IDS = ["g1", "g3", "g4", "g5"];
