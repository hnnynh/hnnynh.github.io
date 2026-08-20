import type { APIRoute, GetStaticPaths } from "astro";
import sharp from "sharp";
import {
  ACCENT_COLOR,
  BASE_COLOR,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../../config.ts";
import { getBlogPosts } from "src/utils";
import colors from "tailwindcss/colors";

type Page = {
  title: string;
  description: string;
  customOGImage?: string;
};

const posts = await getBlogPosts();

const pages: Record<string, Page> = {
  main: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  ...Object.fromEntries(
    posts.map((post) => [
      post.id,
      {
        title: post.data.customOGImage ? "" : post.data.title,
        description: post.data.customOGImage
          ? ""
          : `${post.data.shortDescription ?? post.data.description}\n\n${SITE_TITLE}`,
        customOGImage: post.data.customOGImage,
      },
    ]),
  ),
};

export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(pages).map(([route, page]) => ({
    params: { route: `${route}.png` },
    props: page,
  }));

export const GET: APIRoute = async ({ props }) => {
  const page = props as Page;
  const image = page.customOGImage
    ? await renderCustomImage(page.customOGImage)
    : await renderDefaultImage(page);

  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
};

async function renderCustomImage(assetPath: string) {
  const normalizedPath = assetPath.replace("../..", "/src").replace(/^\//, "");

  return sharp(normalizedPath)
    .resize(1200, 630, { fit: "cover" })
    .png()
    .toBuffer();
}

async function renderDefaultImage(page: Page) {
  const accent = toRgb(colors[ACCENT_COLOR][600]);
  const base = colors[BASE_COLOR];
  const titleLines = wrapText(page.title, 27, 3);
  const descriptionLines = wrapText(page.description, 58, 4);
  const title = renderLines(titleLines, 96, 190, 84, "title");
  const descriptionY = 190 + titleLines.length * 84 + 44;
  const description = renderLines(
    descriptionLines,
    96,
    descriptionY,
    40,
    "description",
  );

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${toRgb(base[950])}" />
          <stop offset="0.65" stop-color="${toRgb(base[950])}" />
          <stop offset="1" stop-color="${toRgb(colors[ACCENT_COLOR][950])}" />
        </linearGradient>
        <style>
          .title { fill: ${toRgb(colors[ACCENT_COLOR][500])}; font: 600 72px Inter, Arial, sans-serif; }
          .description { fill: ${toRgb(base[100])}; font: 400 32px Inter, Arial, sans-serif; }
        </style>
      </defs>
      <rect width="1200" height="630" fill="url(#background)" />
      <rect width="1200" height="8" fill="${accent}" />
      ${title}
      ${description}
    </svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

function wrapText(text: string, maxLength: number, maxLines: number) {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) continue;

    const words = paragraph.trim().split(/\s+/);
    let line = "";

    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length <= maxLength) {
        line = next;
      } else {
        if (line) lines.push(line);
        line = word;
      }

      if (lines.length === maxLines) break;
    }

    if (line && lines.length < maxLines) lines.push(line);
    if (lines.length === maxLines) break;
  }

  return lines;
}

function renderLines(
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
  className: string,
) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" class="${className}">${escapeXml(line)}</text>`,
    )
    .join("");
}

function escapeXml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character] ?? character,
  );
}

function toRgb(color: string) {
  const match = color.match(
    /^oklch\(([\d.]+)%\s+([\d.]+)\s+(none|[-\d.]+)(?:\s*\/\s*[\d.]+%?)?\)$/,
  );
  if (!match) return color;

  const lightness = Number(match[1]) / 100;
  const chroma = Number(match[2]);
  const hue = match[3] === "none" ? 0 : (Number(match[3]) * Math.PI) / 180;
  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);
  const l = Math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3);

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  return `rgb(${linear
    .map((value) => {
      const srgb =
        value <= 0.0031308
          ? 12.92 * value
          : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
      return Math.round(Math.min(1, Math.max(0, srgb)) * 255);
    })
    .join(" ")})`;
}
