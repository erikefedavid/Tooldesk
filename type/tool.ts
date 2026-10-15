export type Category = 
  | "AI"
  | "Productivity"
  | "Design"
  | "Development"
  | "Writing"
  | "Audio"
  | "Video"
  | "Marketing"
  | "Web Utilities"
  | "Security"
  | "Education";


export interface Tool {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  feature: string[];
  tags: string[];
  description: string;
  websiteUrl: string;
  pricing: "Free" | "Freemium" | "Open Source" | "paid";
  requireSignUp: boolean;
  icon?: string;
  isFeatured?: boolean;
}