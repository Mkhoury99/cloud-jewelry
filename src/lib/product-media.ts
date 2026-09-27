import butterfly from "@/assets/product-butterfly.jpg";
import customPiece from "@/assets/line-art-story.jpg";
import morningMist from "@/assets/product-thread.jpg";
import pearlTrio from "@/assets/product-trio.jpg";
import roseCharm from "@/assets/hero-bracelet.jpg";

export type ProductPhoto = {
  src: string;
  width: number;
  height: number;
};

export type ProductMedia = ProductPhoto | "beads" | "pearl";

export const productMedia: Record<string, ProductMedia> = {
  "rose-charm-bracelet": { src: roseCharm, width: 800, height: 1008 },
  "morning-mist-bracelet": { src: morningMist, width: 736, height: 912 },
  "pearl-trio": { src: pearlTrio, width: 736, height: 912 },
  "butterfly-necklace": { src: butterfly, width: 736, height: 912 },
  "thread-anklet": "beads",
  "pearl-anklet": "pearl",
  "custom-piece": { src: customPiece, width: 816, height: 816 },
};
