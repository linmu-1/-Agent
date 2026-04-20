"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { featuredWorks, guideCards, projectCards } from "@/data/home";
import { AnimatedHeroBrand } from "./AnimatedHeroBrand";
import { UploadLottieIndicator } from "./UploadLottieIndicator";
import styles from "./HomePage.module.css";

const PROJECT_DETAIL_URL =
  "https://xyq.jianying.com/novel/detail/script?thread_id=561a118a-fda3-4973-b2e6-71c5b6383ce0";

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
  slideshowImages,
  posterWidth,
  posterHeight,
  tone,
  priority = false,
}: (typeof projectCards)[number] & { priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasSlideshow = Boolean(slideshowImages?.length);

  useEffect(() => {
    if (!hovered || !slideshowImages?.length || slideshowImages.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slideshowImages.length);
    }, 850);

    return () => window.clearInterval(intervalId);
  }, [hovered, slideshowImages]);

  useEffect(() => {
    if (hasSlideshow) {
      return;
    }

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
  }, [hasSlideshow, hovered]);

  const displayedCover =
    hovered && slideshowImages?.length ? slideshowImages[currentSlide] ?? slideshowImages[0] : cover;
  const posterStyle =
    posterWidth && posterHeight
      ? {
          width: `${posterWidth}px`,
          height: `${posterHeight}px`,
        }
      : undefined;

  return (
    <Link
      className={styles.projectCardLink}
      href={PROJECT_DETAIL_URL}
      onMouseEnter={() => {
        setCurrentSlide(0);
        setHovered(true);
      }}
      onMouseLeave={() => {
        setCurrentSlide(0);
        setHovered(false);
      }}
    >
      <article
        className={hovered ? `${styles.projectCard} ${styles.projectCardHovered}` : styles.projectCard}
      >
        <div className={styles.projectCardVisual}>
          <div className={styles.projectGlow} style={{ background: tone }} />
          <div
            className={
              orientation === "portrait"
                ? styles.projectPosterPortrait
                : styles.projectPosterLandscape
            }
            style={posterStyle}
          >
            {previewVideo && !hasSlideshow ? (
              <video
                className={styles.projectVideo}
                loop
                muted
                playsInline
                poster={cover}
                preload="none"
                ref={videoRef}
                src={previewVideo}
              />
            ) : null}
            <Image
              alt={title}
              className={!hasSlideshow && previewVideo ? styles.projectImageWithVideo : undefined}
              fill
              priority={priority}
              sizes="253px"
              src={displayedCover}
            />
          </div>
          {!hasSlideshow ? (
            <div className={hovered ? `${styles.playButton} ${styles.playButtonHidden}` : styles.playButton}>
              <span className={styles.playTriangle} />
            </div>
          ) : null}
        </div>
        <div className={styles.projectMeta}>
          <strong>{title}</strong>
          <span>{createdAt}</span>
        </div>
      </article>
    </Link>
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
          preload="none"
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
  const pasteModalInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "ai">("upload");
  const [dragging, setDragging] = useState(false);
  const [hoveringDropzone, setHoveringDropzone] = useState(false);
  const [fileName, setFileName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteModalText, setPasteModalText] = useState("");
  const [uploadContentType, setUploadContentType] = useState<"file" | "text" | null>(null);
  const [animationResetKey, setAnimationResetKey] = useState(0);
  const [uploadStage, setUploadStage] = useState<"idle" | "preview" | "uploading" | "complete">(
    "idle",
  );

  const hasSelectedFile = fileName.length > 0;
  const displayFileName = fileName.replace(/\.[^/.]+$/, "");

  const helperText = useMemo(() => {
    if (uploadStage === "uploading") {
      return "上传中...";
    }

    if (uploadStage === "complete") {
      if (uploadContentType === "text") {
        return "已粘贴文本";
      }

      return displayFileName || fileName;
    }

    if (hasSelectedFile) {
      return fileName;
    }

    return "上传 & 拖拽 .docx文件";
  }, [displayFileName, fileName, hasSelectedFile, uploadContentType, uploadStage]);

  const visualStage =
    uploadStage === "uploading" || uploadStage === "complete"
      ? uploadStage
      : dragging || hoveringDropzone
        ? "preview"
        : "idle";

  const openPicker = () => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.click();
  };

  const handlePrimaryAction = () => {
    if (activeTab === "ai") {
      if (!aiPrompt.trim()) {
        aiInputRef.current?.focus();
        return;
      }

      aiInputRef.current?.focus();
      return;
    }

    if (uploadStage === "complete") {
      window.location.href = PROJECT_DETAIL_URL;
      return;
    }

    openPicker();
  };

  const isAiActionDisabled = activeTab === "ai" && !aiPrompt.trim();

  const openPasteTextModal = (text = "") => {
    setPasteModalText(text);
    setPasteModalOpen(true);
  };

  const closePasteTextModal = () => {
    setPasteModalOpen(false);
  };

  const handlePasteText = () => {
    openPasteTextModal("");
  };

  const onFileSelect = (file?: File) => {
    if (!file) {
      return;
    }

    setFileName(file.name);
    setUploadContentType("file");
    setDragging(false);
    setHoveringDropzone(false);
    setUploadStage("uploading");
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (pasteModalOpen && event.target === pasteModalInputRef.current) {
        return;
      }

      const files = event.clipboardData?.files;

      if (files?.length && activeTab === "upload") {
        event.preventDefault();
        onFileSelect(files[0]);
        return;
      }

      const text = event.clipboardData?.getData("text/plain");

      if (text?.trim()) {
        event.preventDefault();
        openPasteTextModal(text);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [activeTab, pasteModalOpen]);

  useEffect(() => {
    if (!pasteModalOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      pasteModalInputRef.current?.focus();
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePasteTextModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [pasteModalOpen]);

  const resetUpload = () => {
    setDragging(false);
    setHoveringDropzone(false);
    setFileName("");
    setUploadContentType(null);
    setUploadStage("idle");
    setAnimationResetKey((value) => value + 1);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handlePasteTextComplete = () => {
    if (!pasteModalText.trim()) {
      pasteModalInputRef.current?.focus();
      return;
    }

    setUploadContentType("text");
    setFileName("");
    setUploadStage("complete");
    setActiveTab("upload");
    setPasteModalOpen(false);
  };

  return (
    <section className={styles.uploadWrap}>
      <div className={styles.uploadShell}>
        <div className={styles.uploadTabsLayer}>
          <div className={styles.uploadTabRail}>
            <button
              className={activeTab === "upload" ? styles.uploadTabActive : styles.uploadTabInactive}
              onClick={() => setActiveTab("upload")}
              type="button"
            >
              <Image alt="" height={16} src="/home/upload-script.svg" width={16} />
              上传剧本
            </button>
            <button
              className={activeTab === "ai" ? styles.uploadTabActive : styles.uploadTabInactive}
              onClick={() => setActiveTab("ai")}
              type="button"
            >
              <Image alt="" height={16} src="/home/upload-ai.svg" width={16} />
              AI 生成剧本
            </button>
          </div>
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
            onPaste={(event) => {
              const file = event.clipboardData.files?.[0];

              if (file) {
                event.preventDefault();
                onFileSelect(file);
              }
            }}
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
              <div className={styles.uploadIndicatorWrap}>
                {uploadStage === "complete" && uploadContentType === "text" ? (
                  <div className={styles.uploadCompletedTextVisual}>
                    <Image
                      alt=""
                      className={styles.uploadCompletedTextImage}
                      height={48}
                      src="/home/upload-complete-text-icon.png"
                      width={37}
                    />
                  </div>
                ) : (
                  <UploadLottieIndicator
                    key={animationResetKey}
                    className={styles.uploadIndicator}
                    onComplete={() => {
                      setUploadContentType("file");
                      setUploadStage("complete");
                    }}
                    stage={visualStage}
                  />
                )}
                {uploadStage === "complete" && uploadContentType === "text" ? (
                  <button
                    aria-label="删除已上传文件"
                    className={styles.uploadResetHotspot}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      resetUpload();
                    }}
                    type="button"
                  >
                    <Image alt="" height={20} src="/home/upload-complete-close.svg" width={20} />
                  </button>
                ) : null}
              </div>
              <p className={uploadStage !== "idle" ? styles.dropzoneTextActive : undefined}>
                {uploadStage === "idle" ? (
                  <>
                    上传 & 拖拽{" "}
                    <span className={styles.dropzoneUploadLink}>.docx文件</span>
                  </>
                ) : (
                  helperText
                )}
              </p>
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
          <div className={styles.uploadFooterLeft}>
            <button className={styles.stylePresetButton} type="button">
              <span className={styles.stylePresetIcon} aria-hidden="true">
                <Image alt="" height={28} src="/home/style-preset-icon.png" width={28} />
              </span>
              <span className={styles.stylePresetLabel}>风格预设</span>
              <span className={styles.stylePresetChevron} aria-hidden="true">
                <Image alt="" height={9} src="/home/style-preset-left-icon.svg" width={9} />
              </span>
            </button>
            <button className={styles.ratioButton} type="button">
              <span className={styles.ratioIcon} aria-hidden="true">
                <Image alt="" height={28} src="/home/ratio-icon.png" width={28} />
              </span>
              <span className={styles.ratioLabel}>比例</span>
              <span className={styles.ratioChevron} aria-hidden="true">
                <Image alt="" height={9} src="/home/style-preset-left-icon.svg" width={9} />
              </span>
            </button>
          </div>
          <div className={styles.uploadActions}>
            {activeTab === "upload" && uploadStage !== "complete" ? (
              <button className={styles.pasteTextButton} onClick={handlePasteText} type="button">
                <span className={styles.pasteTextLabel}>粘贴文本</span>
                <span className={styles.pasteTextShortcut} aria-hidden="true">
                  <Image alt="" fill sizes="38px" src="/home/paste-text-shortcut.svg" />
                </span>
              </button>
            ) : null}
            <button
              className={isAiActionDisabled ? `${styles.uploadButton} ${styles.uploadButtonDisabled}` : styles.uploadButton}
              disabled={isAiActionDisabled}
              onClick={handlePrimaryAction}
              type="button"
            >
              {activeTab === "ai" || uploadStage === "complete" ? (
                "立即创作"
              ) : (
                <>
                  <span className={styles.uploadButtonPlus} aria-hidden="true" />
                  上传剧本
                </>
              )}
            </button>
          </div>
        </div>

        <input
          accept=".doc,.docx"
          aria-hidden="true"
          className={styles.fileInput}
          onChange={(event) => onFileSelect(event.target.files?.[0] ?? undefined)}
          ref={inputRef}
          tabIndex={-1}
          type="file"
        />
      </div>
      </div>

      <div className={styles.uploadFootnote}>
        <div className={styles.creditHint}>
          <span className={styles.infoBadge}>i</span>
          <p>
            <strong>100</strong> 字符消耗 <strong>2</strong> 积分，实际消耗与最终输出的剧本字符相关
          </p>
        </div>
      </div>

      {pasteModalOpen ? (
        <div className={styles.pasteModalOverlay} role="presentation">
          <div
            aria-labelledby="paste-text-modal-title"
            aria-modal="true"
            className={styles.pasteModal}
            role="dialog"
          >
            <div className={styles.pasteModalHeader}>
              <h3 className={styles.pasteModalTitle} id="paste-text-modal-title">
                粘贴文本
              </h3>
              <button
                aria-label="关闭粘贴文本弹窗"
                className={styles.pasteModalClose}
                onClick={closePasteTextModal}
                type="button"
              >
                ×
              </button>
            </div>
            <textarea
              className={styles.pasteModalTextarea}
              onChange={(event) => setPasteModalText(event.target.value)}
              placeholder="请在此处粘贴你的剧本……"
              ref={pasteModalInputRef}
              value={pasteModalText}
            />
            <div className={styles.pasteModalActions}>
              <button className={styles.pasteModalSecondaryButton} onClick={closePasteTextModal} type="button">
                取消
              </button>
              <button
                className={
                  pasteModalText.trim()
                    ? styles.pasteModalPrimaryButton
                    : `${styles.pasteModalPrimaryButton} ${styles.pasteModalPrimaryButtonDisabled}`
                }
                disabled={!pasteModalText.trim()}
                onClick={handlePasteTextComplete}
                type="button"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function HomePage() {
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const guideRef = useRef<HTMLDivElement | null>(null);
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;
    const revealSections = () => setShowDeferredSections(true);

    const idleWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
        cancelIdleCallback?: (handle: number) => void;
      };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(revealSections, { timeout: 400 });
    } else {
      timeoutId = globalThis.setTimeout(revealSections, 120);
    }

    return () => {
      if (idleId !== undefined && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }

      if (timeoutId !== undefined) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, []);

  const scrollRow = (ref: React.RefObject<HTMLDivElement | null>, direction: number) => {
    ref.current?.scrollBy({
      left: direction * 269,
      behavior: "smooth",
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <section className={styles.heroStage}>
          <div className={styles.heroMedia} aria-hidden="true">
            <video
              autoPlay
              className={styles.heroMediaVideo}
              loop
              muted
              playsInline
              poster="/home/featured-5.png"
              preload="auto"
              src="/home/hero-stage-video.mov"
            />
            <div className={styles.heroMediaFade}>
              <video
                autoPlay
                className={`${styles.heroMediaBlurVideo} ${styles.heroMediaBlurBandOne}`}
                loop
                muted
                playsInline
                poster="/home/featured-5.png"
                preload="auto"
                src="/home/hero-stage-video.mov"
              />
              <video
                autoPlay
                className={`${styles.heroMediaBlurVideo} ${styles.heroMediaBlurBandTwo}`}
                loop
                muted
                playsInline
                poster="/home/featured-5.png"
                preload="auto"
                src="/home/hero-stage-video.mov"
              />
              <video
                autoPlay
                className={`${styles.heroMediaBlurVideo} ${styles.heroMediaBlurBandThree}`}
                loop
                muted
                playsInline
                poster="/home/featured-5.png"
                preload="auto"
                src="/home/hero-stage-video.mov"
              />
              <video
                autoPlay
                className={`${styles.heroMediaBlurVideo} ${styles.heroMediaBlurBandFour}`}
                loop
                muted
                playsInline
                poster="/home/featured-5.png"
                preload="auto"
                src="/home/hero-stage-video.mov"
              />
              <div className={styles.heroMediaFadeTint} />
            </div>
          </div>

          <header className={styles.topNav}>
            <button
              aria-label="刷新页面"
              className={styles.topNavBrandButton}
              onClick={() => window.location.reload()}
              type="button"
            >
              <Image alt="短剧 Agent" height={28} src="/home/top-nav-logo-white.svg" width={82} />
            </button>

            <div className={styles.topNavRight}>
              <button className={styles.creditPill} type="button">
                <span className={styles.creditCount}>+ 200</span>
                <span className={styles.creditLabel}>积分</span>
              </button>
              <button aria-label="通知" className={styles.navIconButton} type="button">
                <Image alt="" className={styles.navIconImage} height={24} src="/home/nav-bell.svg" width={24} />
              </button>
              <button aria-label="帮助" className={styles.navIconButton} type="button">
                <Image alt="" className={styles.navIconImage} height={24} src="/home/nav-help.svg" width={24} />
              </button>
              <button aria-label="个人中心" className={styles.avatarButton} type="button">
                <Image alt="" className={styles.avatarImage} height={28} src="/home/nav-avatar.png" width={28} />
              </button>
            </div>
          </header>

          <div className={styles.heroStageContent}>
            <section className={styles.hero}>
              <AnimatedHeroBrand />
              <UploadPanel />
            </section>
          </div>
        </section>

        {showDeferredSections ? (
          <>
            <section className={styles.contentSection}>
              <SectionHeader title="我的项目" />
              <div className={styles.projectGrid}>
                {projectCards.map((item, index) => (
                  <ProjectCard
                    key={`${item.title}-${item.createdAt}-${item.cover}`}
                    priority={index < 2}
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
          </>
        ) : (
          <div className={styles.deferredSectionsPlaceholder} aria-hidden="true" />
        )}
      </div>
    </main>
  );
}
