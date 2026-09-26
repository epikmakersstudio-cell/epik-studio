// Single source of truth for the studio's services. The navigation dropdown, footer,
// home page cards, pricing packages and contact form all read from this list.
export const services = [
  { id: "fashion", name: "Fashion", path: "/services/fashion" },
  { id: "wedding", name: "Wedding", path: "/services/wedding" },
  { id: "baby-shower-maternity", name: "Baby Shower & Maternity", path: "/services/baby-shower" },
  { id: "pre-birthday-birthday", name: "Pre-Birthday & Birthday", path: "/services/pre-birthday" },
  { id: "newborn", name: "Newborn", path: "/services/newborn" },
  { id: "family-portraits", name: "Family Portraits", path: "/services/family-portraits" },
] as const;

export type Service = (typeof services)[number];
export type ServiceId = Service["id"];
