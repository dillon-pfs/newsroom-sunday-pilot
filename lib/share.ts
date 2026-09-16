import type { Metadata } from "next";

const image = "/brand/wordmark-bar.png";

export function shareMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `Poor Form Sports · ${title}`,
      description,
      siteName: "Poor Form Sports",
      type: "website",
      images: [{ url: image, alt: "Poor Form Sports · DEMO / SATIRE" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Poor Form Sports · ${title}`,
      description,
      images: [image],
    },
  };
}
