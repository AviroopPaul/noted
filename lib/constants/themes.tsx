import React from "react";
import {
  Sun,
  Moon,
  Cake,
  Leaf,
  Building2,
  Flower2,
  Radio,
  Watch,
  Zap,
  Heart,
  Paintbrush,
  Castle,
  Square,
  Printer,
  Snowflake,
  Music,
  Ghost,
  TreePine,
  Droplets,
  CircleDot,
  Crown,
  Skull,
  Briefcase,
  Cloud,
  Coffee,
} from "lucide-react";
import { FaTree, FaFlask, FaLemon } from "react-icons/fa";

export interface ThemeOption {
  id: string;
  icon: React.ReactNode;
  label: string;
}

export interface ThemeGroups {
  light: ThemeOption[];
  dark: ThemeOption[];
}

export const THEMES: ThemeGroups = {
  light: [
    { id: "light", icon: <Sun size={16} />, label: "Light" },
    { id: "cupcake", icon: <Cake size={16} />, label: "Cupcake" },
    { id: "emerald", icon: <Leaf size={16} />, label: "Emerald" },
    { id: "corporate", icon: <Building2 size={16} />, label: "Corporate" },
    { id: "garden", icon: <Flower2 size={16} />, label: "Garden" },
    { id: "lofi", icon: <Radio size={16} />, label: "Lo-Fi" },
    { id: "retro", icon: <Watch size={16} />, label: "Retro" },
    { id: "cyberpunk", icon: <Zap size={16} />, label: "Cyberpunk" },
    { id: "valentine", icon: <Heart size={16} />, label: "Valentine" },
    { id: "pastel", icon: <Paintbrush size={16} />, label: "Pastel" },
    { id: "fantasy", icon: <Castle size={16} />, label: "Fantasy" },
    { id: "wireframe", icon: <Square size={16} />, label: "Wireframe" },
    { id: "cmyk", icon: <Printer size={16} />, label: "CMYK" },
    { id: "autumn", icon: <FaTree size={16} />, label: "Autumn" },
    { id: "acid", icon: <FaFlask size={16} />, label: "Acid" },
    { id: "lemonade", icon: <FaLemon size={16} />, label: "Lemonade" },
    { id: "winter", icon: <Snowflake size={16} />, label: "Winter" },
  ] as const,
  dark: [
    { id: "dark", icon: <Moon size={16} />, label: "Dark" },
    { id: "synthwave", icon: <Music size={16} />, label: "Synthwave" },
    { id: "halloween", icon: <Ghost size={16} />, label: "Halloween" },
    { id: "forest", icon: <TreePine size={16} />, label: "Forest" },
    { id: "aqua", icon: <Droplets size={16} />, label: "Aqua" },
    { id: "black", icon: <CircleDot size={16} />, label: "Black" },
    { id: "luxury", icon: <Crown size={16} />, label: "Luxury" },
    { id: "dracula", icon: <Skull size={16} />, label: "Dracula" },
    { id: "business", icon: <Briefcase size={16} />, label: "Business" },
    { id: "night", icon: <Cloud size={16} />, label: "Night" },
    { id: "coffee", icon: <Coffee size={16} />, label: "Coffee" },
  ] as const,
} as const;

export type Theme = (
  | (typeof THEMES.light)[number]
  | (typeof THEMES.dark)[number]
)["id"];
