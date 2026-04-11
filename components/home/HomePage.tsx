"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { featuredWorks, guideCards, projectCards } from "@/data/home";
import { AnimatedHeroBrand } from "./AnimatedHeroBrand";
import { UploadLottieIndicator } from "./UploadLottieIndicator";
import styles from "./HomePage.module.css";

function SectionHeader({
  title,
  actions,
  showFilter = true,
}: {
  title: string;
  actions?: React.ReactNode;
  showFilter?: boolean;
}) {
  return (
    <div className={styles.sectionHeader}>
      <h2>{title}</h2>
      <div className={styles.sectionActions}>
        {showFilter ? (
          <button className={styles.sectionFilter} type="button">
            全部
            <span aria-hidden="true">›</span>
          </button>
        ) : null}
        {actions}
      </div>
    </div>
  );
}

function ScrollButtons({
  onPrev,
  onNext,
  compact = false,
}: {
  onPrev: () => void;
  onNext: () => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? styles.scrollButtonsCompact : styles.scrollButtons}>
      <button aria-label="上一组" className={styles.iconCircle} onClick={onPrev} type="button">
        ‹
      </button>
      <button aria-label="下一组" className={styles.iconCircle} onClick={onNext} type="button">
        ›
      </button>
    </div>
  );
}

function ProjectCard({
  title,
  createdAt,
  orientation,
  cover,
  previewVideo,
  tone,
  priority = false,
}: (typeof projectCards)[number] & { priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (hovered) {
      video.currentTime = 0;
      void video.play().catch(() => {
        // Keep the image fallback visible if autoplay is blocked.
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [hovered]);

  return (
    <article
      className={hovered ? `${styles.projectCard} ${styles.projectCardHovered}` : styles.projectCard}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.projectCardVisual}>
        <div className={styles.projectGlow} style={{ background: tone }} />
        <div
          className={
            orientation === "portrait"
              ? styles.projectPosterPortrait
              : styles.projectPosterLandscape
          }
        >
          {previewVideo ? (
            <video
              className={styles.projectVideo}
              loop
              muted
              playsInline
              poster={cover}
              preload="metadata"
              ref={videoRef}
              src={previewVideo}
            />
          ) : null}
          <Image
            alt={title}
            className={previewVideo ? styles.projectImageWithVideo : undefined}
            fill
            priority={priority}
            sizes="253px"
            src={cover}
          />
        </div>
        <div className={hovered ? `${styles.playButton} ${styles.playButtonHidden}` : styles.playButton}>
          <span className={styles.playTriangle} />
        </div>
      </div>
      <div className={styles.projectMeta}>
        <strong>{title}</strong>
        <span>{createdAt}</span>
      </div>
    </article>
  );
}

function FeaturedCard({ item }: { item: (typeof featuredWorks)[number] }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (hovered) {
      video.currentTime = 0;
      void video.play().catch(() => {
        // Keep the still cover visible if autoplay is blocked.
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [hovered]);

  return (
    <div className={styles.featuredCardWrap}>
      <article
        className={styles.featuredCard}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {item.previewVideo ? (
          <video
            className={styles.featuredVideo}
            loop
            muted
            playsInline
            poster={item.cover}
            preload="metadata"
            ref={videoRef}
            src={item.previewVideo}
          />
        ) : null}
        <Image
          alt={item.title}
          className={item.previewVideo ? styles.featuredImageWithVideo : styles.featuredImage}
          fill
          sizes="253px"
          src={item.cover}
        />
        {item.highlight ? (
          <Image
            alt={item.highlight}
            className={styles.topBadge}
            height={24}
            src="/home/featured-top-badge.svg"
            width={63}
          />
        ) : null}
        <div className={styles.viewsPill}>
          <span className={styles.playMini} />
          {item.views}
        </div>
      </article>
      <div className={styles.featuredTitle}>{item.title}</div>
    </div>
  );
}

function GuideCard({ item }: { item: (typeof guideCards)[number] }) {
  return (
    <article className={styles.guideCard}>
      <Image alt={item.author} className={styles.guideImage} fill sizes="253px" src={item.cover} />
      <div className={styles.guideFade} style={{ background: item.accentTone }} />
      {item.overlayCards ? (
        <div className={styles.guideStack}>
          {item.overlayCards.map((src, index) => (
            <div
              className={styles.guideStackCard}
              key={src}
              style={{
                transform: `translateX(${index * 28}px) rotate(${index === 0 ? -17 : 12}deg)`,
              }}
            >
              <Image alt="" fill sizes="38px" src={src} />
            </div>
          ))}
        </div>
      ) : null}
      <div className={styles.guideText}>
        <strong>{item.author}</strong>
        <span>{item.description}</span>
      </div>
      <button className={styles.guideButton} type="button">
        {item.ctaIcon ? (
          <Image alt="" height={14} src={item.ctaIcon} width={14} />
        ) : null}
        {item.cta}
      </button>
    </article>
  );
}

function UploadPanel() {
  const aiInputRef = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "ai">("upload");
  const [dragging, setDragging] = useState(false);
  const [hoveringDropzone, setHoveringDropzone] = useState(false);
  const [fileName, setFileName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [animationResetKey, setAnimationResetKey] = useState(0);
  const [uploadStage, setUploadStage] = useState<"idle" | "preview" | "uploading" | "complete">(
    "idle",
  );

  const hasSelectedFile = fileName.length > 0;

  const helperText = useMemo(() => {
    if (uploadStage === "uploading") {
      return "上传中...";
    }

    if (uploadStage === "complete") {
      return "真人权谋";
    }

    if (hasSelectedFile) {
      return fileName;
    }

    return "支持 .docx 格式，可拖拽或点击此处上传";
  }, [fileName, hasSelectedFile, uploadStage]);

  const visualStage =
    uploadStage === "uploading" || uploadStage === "complete"
      ? uploadStage
      : dragging || hoveringDropzone
        ? "preview"
        : "idle";

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handlePrimaryAction = () => {
    if (activeTab === "ai") {
      aiInputRef.current?.focus();
      return;
    }

    openPicker();
  };

  const onFileSelect = (file?: File) => {
    if (!file) {
      return;
    }

    setFileName(file.name);
    setDragging(false);
    setHoveringDropzone(false);
    setUploadStage("uploading");
  };

  const resetUpload = () => {
    setDragging(false);
    setHoveringDropzone(false);
    setFileName("");
    setUploadStage("idle");
    setAnimationResetKey((value) => value + 1);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className={styles.uploadWrap}>
      <div className={styles.uploadTabsLayer}>
        <button
          className={activeTab === "upload" ? styles.uploadTabPrimaryActive : styles.uploadTabPrimary}
          onClick={() => setActiveTab("upload")}
          type="button"
        >
          <Image alt="" height={16} src="/home/upload-script.svg" width={16} />
          上传剧本
        </button>
        <button
          className={activeTab === "ai" ? styles.uploadTabSecondaryActive : styles.uploadTabSecondary}
          onClick={() => setActiveTab("ai")}
          type="button"
        >
          <Image alt="" height={18} src="/home/upload-ai.svg" width={18} />
          AI 生成剧本
        </button>
      </div>

      <div className={styles.uploadCard}>
        {activeTab === "upload" ? (
          <div
            aria-label="上传剧本"
            className={dragging ? `${styles.dropzone} ${styles.dropzoneDragging}` : styles.dropzone}
            onClick={openPicker}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              onFileSelect(event.dataTransfer.files?.[0]);
            }}
            onMouseEnter={() => setHoveringDropzone(true)}
            onMouseLeave={() => setHoveringDropzone(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPicker();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.dropzoneArt}>
              <UploadLottieIndicator
                key={animationResetKey}
                className={styles.uploadIndicator}
                onComplete={() => setUploadStage("complete")}
                stage={visualStage}
              />
              {uploadStage === "complete" ? (
                <button
                  aria-label="删除已上传文件"
                  className={styles.uploadResetHotspot}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    resetUpload();
                  }}
                  type="button"
                />
              ) : null}
              <p className={uploadStage !== "idle" ? styles.dropzoneTextActive : undefined}>{helperText}</p>
            </div>
          </div>
        ) : (
          <div className={styles.aiPanel}>
            <label className={styles.aiInputWrap}>
              <span className={styles.srOnly}>AI 生成剧本输入框</span>
              <textarea
                className={styles.aiTextarea}
                onChange={(event) => setAiPrompt(event.target.value)}
                placeholder="可以尝试输入这些要素：故事设定、主角特征、剧情脉络、最终结局等等"
                ref={aiInputRef}
                value={aiPrompt}
              />
            </label>
          </div>
        )}

        <div className={styles.uploadFooter}>
          <div className={styles.creditHint}>
            <span className={styles.infoBadge}>i</span>
            <p>
              <strong>100</strong> 字符消耗 <strong>2</strong> 积分，实际消耗与最终输出的剧本字符相关
            </p>
          </div>
          <button className={styles.uploadButton} onClick={handlePrimaryAction} type="button">
            {activeTab === "ai" ? "立即创作" : uploadStage === "complete" ? "立即创作" : "上传剧本"}
          </button>
        </div>

        <input
          accept=".doc,.docx"
          hidden
          onChange={(event) => onFileSelect(event.target.files?.[0] ?? undefined)}
          ref={inputRef}
          type="file"
        />
      </div>
    </section>
  );
}

export function HomePage() {
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const guideRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (ref: React.RefObject<HTMLDivElement | null>, direction: number) => {
    ref.current?.scrollBy({
      left: direction * 269,
      behavior: "smooth",
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <header className={styles.topNav}>
          <Image alt="短剧 Agent" height={28} src="/home/top-nav-brand.svg" width={82} />

          <div className={styles.topNavRight}>
            <button className={styles.creditPill} type="button">
              <span className={styles.creditCount}>+ 200</span>
              <span className={styles.creditLabel}>积分</span>
            </button>
            <button aria-label="通知" className={styles.navIconButton} type="button">
              <Image alt="" height={24} src="/home/nav-bell.svg" width={24} />
            </button>
            <button aria-label="帮助" className={styles.navIconButton} type="button">
              <Image alt="" height={24} src="/home/nav-help.svg" width={24} />
            </button>
            <button aria-label="个人中心" className={styles.avatarButton} type="button">
              <Image alt="" className={styles.avatarImage} height={28} src="/home/nav-avatar.png" width={28} />
            </button>
          </div>
        </header>

        <section className={styles.hero}>
          <AnimatedHeroBrand />
          <p className={styles.heroSubtitle}>
            全面应用{" "}
            <span className={styles.seedanceWrap}>
              <span className="serif">Seedance 2.0</span>
              <Image
                alt=""
                aria-hidden="true"
                className={styles.seedanceRing}
                height={24}
                src="/home/seedance-ring.svg"
                width={112}
              />
            </span>{" "}
            模型，一键直出整部剧！
          </p>
          <UploadPanel />
        </section>

        <section className={styles.contentSection}>
          <SectionHeader title="我的项目" />
          <div className={styles.projectGrid}>
            {projectCards.map((item) => (
              <ProjectCard
                key={`${item.title}-${item.createdAt}-${item.cover}`}
                priority={item.cover === "/home/project-1.svg"}
                {...item}
              />
            ))}
          </div>
        </section>

        <section className={styles.contentSection}>
          <SectionHeader
            actions={
              <ScrollButtons
                compact
                onNext={() => scrollRow(featuredRef, 1)}
                onPrev={() => scrollRow(featuredRef, -1)}
              />
            }
            showFilter={false}
            title="爆款作品"
          />
          <div className={styles.scrollViewport} ref={featuredRef}>
            <div className={styles.featuredRow}>
              {featuredWorks.map((item) => (
                <FeaturedCard item={item} key={`${item.title}-${item.cover}`} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.contentSection}>
          <SectionHeader
            actions={
              <ScrollButtons
                onNext={() => scrollRow(guideRef, 1)}
                onPrev={() => scrollRow(guideRef, -1)}
              />
            }
            showFilter={false}
            title="教学引导"
          />
          <div className={styles.scrollViewport} ref={guideRef}>
            <div className={styles.guideRow}>
              {guideCards.map((item) => (
                <GuideCard item={item} key={`${item.author}-${item.cover}`} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
