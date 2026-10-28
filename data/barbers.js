// Fictional demo barber profiles — edit freely.
const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const BARBERS = [
  {
    id: "marcus-reed",
    name: "Marcus Reed",
    specialty: "Skin fades & modern cuts",
    years: 12,
    image: img("photo-1532710093739-9470acff878f"),
    bio: "Marcus is known for crisp, seamless fades and sharp line-ups. (Fictional demo profile.)",
    socials: [{ label: "Instagram", href: "https://instagram.com" }],
  },
  {
    id: "daniel-cruz",
    name: "Daniel Cruz",
    specialty: "Classic cuts & hot towel shaves",
    years: 9,
    image: img("photo-1512690459411-b9245aed614b"),
    bio: "Daniel brings old-school technique and a calm, attentive approach. (Fictional demo profile.)",
    socials: [{ label: "Instagram", href: "https://instagram.com" }],
  },
  {
    id: "omar-hayes",
    name: "Omar Hayes",
    specialty: "Beard sculpting & grooming",
    years: 7,
    image: img("photo-1596362601603-b74f6ee5b3a4"),
    bio: "Omar specialises in beard design, shape and conditioning. (Fictional demo profile.)",
    socials: [{ label: "Facebook", href: "https://facebook.com" }],
  },
];

export const ANY_BARBER = { id: "any", name: "Any available barber" };

export function getBarberById(id) {
  return BARBERS.find((b) => b.id === id) || null;
}
