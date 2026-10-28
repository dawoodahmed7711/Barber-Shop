// Fictional demo prices — edit freely.
export const SERVICE_CATEGORIES = ["All", "Haircuts", "Beard", "Packages"];

const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const SERVICES = [
  {
    id: "classic-haircut",
    name: "Classic Haircut",
    category: "Haircuts",
    price: 20,
    duration: 30,
    icon: "scissors",
    image: img("photo-1503951914875-452162b0f3f1"),
    description: "A timeless scissor-and-clipper cut tailored to your head shape and style.",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    category: "Haircuts",
    price: 25,
    duration: 40,
    icon: "zap",
    image: img("photo-1621605815971-fbc98d665033"),
    description: "A seamless skin fade blended with precision and finished with a clean line-up.",
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    category: "Beard",
    price: 15,
    duration: 20,
    icon: "sparkles",
    image: img("photo-1599351431202-1e0f0137899a"),
    description: "Shape, trim and define your beard with sharp edges and a tidy finish.",
  },
  {
    id: "haircut-beard-combo",
    name: "Haircut and Beard Combo",
    category: "Packages",
    price: 35,
    duration: 50,
    icon: "users",
    image: img("photo-1622286342621-4bd786c2447c"),
    description: "Our classic haircut paired with a full beard trim in a single visit.",
  },
  {
    id: "wash-styling",
    name: "Hair Wash and Styling",
    category: "Haircuts",
    price: 12,
    duration: 20,
    icon: "droplets",
    image: img("photo-1605497788044-5a32c7078486"),
    description: "A refreshing wash followed by professional styling products and finish.",
  },
  {
    id: "premium-grooming",
    name: "Premium Grooming Package",
    category: "Packages",
    price: 45,
    duration: 60,
    icon: "crown",
    image: img("photo-1585747860715-2ba37e788b70"),
    description: "Haircut, beard sculpting, wash and styling — the full grooming experience.",
  },
];

export const FEATURED_SERVICE_IDS = [
  "classic-haircut",
  "skin-fade",
  "haircut-beard-combo",
  "premium-grooming",
];

export function getServiceById(id) {
  return SERVICES.find((s) => s.id === id) || null;
}
