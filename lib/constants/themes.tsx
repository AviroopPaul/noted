import React from "react";
import { Sun, Moon, Palette } from "lucide-react";

export const THEMES = {
  light: [
    { id: "light", icon: <Sun size={16} />, label: "Light" },
    { id: "cupcake", icon: <Palette size={16} />, label: "Cupcake" },
    { id: "emerald", icon: <Palette size={16} />, label: "Emerald" },
    { id: "corporate", icon: <Palette size={16} />, label: "Corporate" },
    { id: "garden", icon: <Palette size={16} />, label: "Garden" },
    { id: "lofi", icon: <Palette size={16} />, label: "Lo-Fi" },
    { id: "retro", icon: <Palette size={16} />, label: "Retro" },
    { id: "cyberpunk", icon: <Palette size={16} />, label: "Cyberpunk" },
    { id: "valentine", icon: <Palette size={16} />, label: "Valentine" },
    { id: "pastel", icon: <Palette size={16} />, label: "Pastel" },
    { id: "fantasy", icon: <Palette size={16} />, label: "Fantasy" },
    { id: "wireframe", icon: <Palette size={16} />, label: "Wireframe" },
    { id: "cmyk", icon: <Palette size={16} />, label: "CMYK" },
    { id: "autumn", icon: <Palette size={16} />, label: "Autumn" },
    { id: "acid", icon: <Palette size={16} />, label: "Acid" },
    { id: "lemonade", icon: <Palette size={16} />, label: "Lemonade" },
    { id: "winter", icon: <Palette size={16} />, label: "Winter" },
  ] as const,
  dark: [
    { id: "dark", icon: <Moon size={16} />, label: "Dark" },
    { id: "synthwave", icon: <Palette size={16} />, label: "Synthwave" },
    { id: "halloween", icon: <Palette size={16} />, label: "Halloween" },
    { id: "forest", icon: <Palette size={16} />, label: "Forest" },
    { id: "aqua", icon: <Palette size={16} />, label: "Aqua" },
    { id: "black", icon: <Palette size={16} />, label: "Black" },
    { id: "luxury", icon: <Palette size={16} />, label: "Luxury" },
    { id: "dracula", icon: <Palette size={16} />, label: "Dracula" },
    { id: "business", icon: <Palette size={16} />, label: "Business" },
    { id: "night", icon: <Palette size={16} />, label: "Night" },
    { id: "coffee", icon: <Palette size={16} />, label: "Coffee" },
  ] as const,
} as const;

export type Theme = (
  | (typeof THEMES.light)[number]
  | (typeof THEMES.dark)[number]
)["id"];
