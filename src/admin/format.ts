import { services } from "@/data/services";

export const serviceName = (id: string | null | undefined) =>
  services.find((s) => s.id === id)?.name ?? "No service chosen";

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
