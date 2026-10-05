export type ProductFinish = {
  name: string;
  hex: string;
};

export type ProductSpec = {
  label: string;
  value: string;
  part: "display" | "chip" | "camera" | "battery" | "body";
};

export const iphone17ProMax = {
  id: "iphone-17-pro-max",
  brand: "Apple",
  name: "iPhone 17 Pro Max",
  eyebrow: "FLAGSHIP EXPERIENCE",
  tagline: "Don’t just read the specs. Explore where they live.",
  note: "Prototype catalog entry — commerce pricing and stock will be connected later.",
  finishes: [
    { name: "Cosmic Orange", hex: "#C86E45" },
    { name: "Deep Blue", hex: "#24344E" },
    { name: "Silver", hex: "#D8DDE4" },
  ] satisfies ProductFinish[],
  specs: [
    { label: "Display", value: '6.9" Super Retina XDR', part: "display" },
    { label: "Performance", value: "A19 Pro", part: "chip" },
    { label: "Camera system", value: "48 MP Pro camera system", part: "camera" },
    { label: "Zoom", value: "Up to 8× optical-quality zoom", part: "camera" },
    { label: "Charging", value: "USB-C", part: "battery" },
  ] satisfies ProductSpec[],
};

export const comparisonProducts = [
  {
    name: "iPhone 17 Pro Max",
    subtitle: "Flagship",
    highlights: ["6.9″ display", "A19 Pro", "48 MP Pro cameras", "Premium build"],
  },
  {
    name: "Galaxy Ultra",
    subtitle: "Comparison slot",
    highlights: ["Large AMOLED", "Flagship processor", "Advanced cameras", "S Pen class"],
  },
  {
    name: "HONOR Magic Pro",
    subtitle: "Comparison slot",
    highlights: ["Premium OLED", "Flagship processor", "Telephoto camera", "Fast charging"],
  },
];
