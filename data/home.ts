import type { FeaturedWork, GuideCard, ProjectCard } from "@/types/home";

export const projectCards: ProjectCard[] = [
  {
    title: "热血总裁",
    createdAt: "2026-03-01 12:31",
    orientation: "portrait",
    cover: "/home/project-covers/project-5.png",
    previewVideo: "/home/project-videos/project-5.mp4",
    tone: "linear-gradient(180deg, rgba(198,218,242,0.12) 0%, rgba(98,130,169,0.34) 100%)",
  },
  {
    title: "科技行者",
    createdAt: "2026-03-01 12:31",
    orientation: "landscape",
    cover: "/home/project-covers/project-2.png",
    previewVideo: "/home/project-videos/project-2.mp4",
    tone: "linear-gradient(180deg, rgba(234,223,178,0.06) 0%, rgba(123,116,77,0.2) 100%)",
  },
  {
    title: "赛博未来",
    createdAt: "2026-03-01 12:31",
    orientation: "portrait",
    cover: "/home/project-covers/project-3.png",
    previewVideo: "/home/project-videos/project-3.mp4",
    tone: "linear-gradient(180deg, rgba(255,177,117,0.08) 0%, rgba(18,16,22,0.36) 100%)",
  },
  {
    title: "我在美利坚当总统",
    createdAt: "2026-03-01 12:31",
    orientation: "portrait",
    cover: "/home/project-covers/project-4.png",
    previewVideo: "/home/project-videos/project-4.mp4",
    tone: "linear-gradient(180deg, rgba(192,202,183,0.08) 0%, rgba(120,120,102,0.2) 100%)",
  },
  {
    title: "科技行者",
    createdAt: "2026-03-01 12:31",
    orientation: "landscape",
    cover: "/home/project-covers/project-1.png",
    previewVideo: "/home/project-videos/project-1.mp4",
    tone: "linear-gradient(180deg, rgba(232,189,200,0.1) 0%, rgba(183,132,144,0.28) 100%)",
  },
];

export const featuredWorks: FeaturedWork[] = [
  {
    title: "梦幻旧爱无敌宇宙",
    views: "141.2w",
    cover: "/home/featured-covers/featured-1.png",
    highlight: "TOP 1",
    previewVideo: "/home/featured-videos/featured-1.mp4",
  },
  {
    title: "猫和老鼠和我",
    views: "141.2w",
    cover: "/home/featured-covers/featured-2.png",
    previewVideo: "/home/featured-videos/featured-2.mp4",
  },
  {
    title: "九品芝麻官",
    views: "141.2w",
    cover: "/home/featured-covers/featured-3.png",
    previewVideo: "/home/featured-videos/featured-3.mp4",
  },
  {
    title: "梦幻旧爱无敌宇宙",
    views: "141.2w",
    cover: "/home/featured-covers/featured-4-console-loop.png",
    previewVideo: "/home/featured-videos/featured-4.mp4",
  },
  {
    title: "梦幻旧爱无敌宇宙",
    views: "141.2w",
    cover: "/home/featured-covers/featured-5.png",
    previewVideo: "/home/featured-videos/featured-5.mp4",
  },
];

export const guideCards: GuideCard[] = [
  {
    author: "@打捞书",
    description: "梦幻旧爱无敌宇宙",
    cover: "/home/guide-1.png",
    cta: "去看看",
    accentTone: "linear-gradient(180deg, rgba(220,227,229,0) 0%, #dce3e5 68%)",
    overlayCards: ["/home/guide-stack-1.png", "/home/guide-stack-2.png"],
  },
  {
    author: "@linmu",
    description: "猫和老鼠和我",
    cover: "/home/guide-2.png",
    cta: "试一试",
    ctaIcon: "/home/guide-try.svg",
    accentTone: "linear-gradient(180deg, rgba(205,224,207,0) 0%, #cde0cf 68%)",
  },
  {
    author: "@LiLiya",
    description: "无敌的大摩托车",
    cover: "/home/guide-3.png",
    cta: "去看看",
    accentTone: "linear-gradient(180deg, rgba(235,235,243,0) 0%, #ebebf3 68%)",
  },
  {
    author: "@小智",
    description: "猫和老鼠和我",
    cover: "/home/guide-4.png",
    cta: "去看看",
    accentTone: "linear-gradient(180deg, rgba(212,231,229,0) 0%, #d4e7e5 68%)",
  },
  {
    author: "@LiLiya",
    description: "猫和老鼠和我",
    cover: "/home/guide-5.png",
    cta: "去看看",
    accentTone: "linear-gradient(180deg, rgba(220,227,229,0) 0%, #dce3e5 68%)",
  },
];
