import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_ORIGIN = "https://ktekglobal.com";
const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/M9ZAsUUupdRzDtPT0QwPXKmkyYZ2/social-images/social-1761242744395-Knight_Tek_HERO_Banner_World_blue_text.png";

interface SeoProps {
  title: string;
  description: string;
  /** Path-only canonical (e.g. "/products/thermal-stop"). Defaults to current location. */
  canonical?: string;
  /** OG image absolute URL. Falls back to the site's default share image. */
  image?: string;
  /** OG type (e.g. "website", "product", "article"). */
  type?: string;
  /** Set true on /admin, /auth, 404 etc. */
  noindex?: boolean;
  /** One or more JSON-LD objects. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const MANAGED_ATTR = "data-seo-managed";

const ensureMetaByName = (name: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    el.setAttribute(MANAGED_ATTR, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const ensureMetaByProperty = (property: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    el.setAttribute(MANAGED_ATTR, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const ensureLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MANAGED_ATTR, "");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const removeMetaByName = (name: string) => {
  document.head.querySelector(`meta[name="${name}"]`)?.remove();
};

const Seo = ({ title, description, canonical, image, type = "website", noindex, jsonLd }: SeoProps) => {
  const location = useLocation();
  const path = canonical ?? location.pathname;
  const canonicalUrl = `${SITE_ORIGIN}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  useEffect(() => {
    document.title = title;

    ensureMetaByName("description", description);
    ensureLink("canonical", canonicalUrl);

    ensureMetaByProperty("og:title", title);
    ensureMetaByProperty("og:description", description);
    ensureMetaByProperty("og:url", canonicalUrl);
    ensureMetaByProperty("og:type", type);
    ensureMetaByProperty("og:image", ogImage);

    ensureMetaByName("twitter:title", title);
    ensureMetaByName("twitter:description", description);
    ensureMetaByName("twitter:image", ogImage);

    if (noindex) {
      ensureMetaByName("robots", "noindex, nofollow");
    } else {
      removeMetaByName("robots");
    }

    const ldNodes: HTMLScriptElement[] = [];
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((block) => {
        const node = document.createElement("script");
        node.type = "application/ld+json";
        node.setAttribute(MANAGED_ATTR, "");
        node.textContent = JSON.stringify(block);
        document.head.appendChild(node);
        ldNodes.push(node);
      });
    }

    return () => {
      ldNodes.forEach((n) => n.remove());
    };
  }, [title, description, canonicalUrl, type, ogImage, noindex, jsonLd]);

  return null;
};

export default Seo;
