import type { AccentColor, BaseColor } from "./colors";

export const SITE = "https://hnnynh.github.io";
export const BASE = "";

export const SITE_TITLE = "hnnynh";
export const SITE_DESCRIPTION =
  "Practical notes on SRE, Kubernetes, Istio, and Cloud-Native engineering";
export const AUTHOR_NAME = "Yoonho Hann";
export const AUTHOR_URL = `${SITE}/about/`;
export const NAME = "(c) hnnynh - LICENSE";
export const LICENSE = "All right reserved";
export const BASE_COLOR: BaseColor = "neutral";
export const ACCENT_COLOR: AccentColor = "cyan";

export const SOCIAL_LINKS: {
  FACEBOOK_URL?: string;
  TWITTER_URL?: string;
  GITHUB_URL?: string;
  INSTAGRAM_URL?: string;
  LINKEDIN_URL?: string;
  YOUTUBE_URL?: string;
  SUBSTACK_URL?: string;
  EMAIL?: string;
  SHOW_RSS?: boolean;
} = {
  GITHUB_URL: "https://github.com/hnnynh",
  LINKEDIN_URL: "https://www.linkedin.com/in/yoonho-hann/",
  EMAIL: "hnnynh125@gmail.com",
};

export const MANUAL_DARK_MODE = true;
export const SEARCH_ENABLED = true;
export const SHOW_IMAGES = true;
export const SITE_NAME = "hnnynh";

export const GISCUS = {
  enabled: true,
  repo: "hnnynh/hnnynh.github.io",
  repoId: "R_kgDOR6ZRPA",
  category: "Announcements",
  categoryId: "DIC_kwDOR6ZRPM4DAfdr",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "en",
} as const;
