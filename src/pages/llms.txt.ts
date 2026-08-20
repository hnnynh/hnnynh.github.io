import { getBlogPosts } from "../utils.ts";
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  SITE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../config.ts";

export async function GET() {
  const posts = await getBlogPosts();
  const postLinks = posts.map((post) => {
    const url = new URL(`/posts/${post.id}/`, SITE).toString();
    const description = post.data.description.replace(/\s+/g, " ").trim();

    return `- [${post.data.title}](${url}): ${description}`;
  });

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} is ${AUTHOR_NAME}'s technical blog about Site Reliability Engineering, Kubernetes, Istio, and Cloud-Native engineering.`,
    "",
    "## Topics",
    "",
    "- Site Reliability Engineering",
    "- Kubernetes",
    "- Istio and service mesh",
    "- Cloud-Native infrastructure",
    "- Platform and DevOps engineering",
    "",
    "## Posts",
    "",
    ...postLinks,
    "",
    "## Site Links",
    "",
    `- [About ${AUTHOR_NAME}](${AUTHOR_URL})`,
    `- [RSS Feed](${SITE}/rss.xml)`,
    `- [XML Sitemap](${SITE}/sitemap-index.xml)`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
