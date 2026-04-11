export type ProjectCard = {
  title: string;
  createdAt: string;
  orientation: "portrait" | "landscape";
  cover: string;
  previewVideo?: string;
  tone: string;
};

export type FeaturedWork = {
  title: string;
  views: string;
  cover: string;
  highlight?: string;
  previewVideo?: string;
};

export type GuideCard = {
  author: string;
  description: string;
  cover: string;
  cta: string;
  ctaIcon?: string;
  accentTone: string;
  overlayCards?: string[];
};
