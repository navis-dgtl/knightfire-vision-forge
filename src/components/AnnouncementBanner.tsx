import { Link } from "react-router-dom";
import { useActiveBanner } from "@/lib/banners";

const isExternal = (url: string) => /^https?:\/\//i.test(url);

/**
 * Site-wide announcement strip rendered above the main Navigation.
 * Hidden entirely (returns null) when no active banner exists, so the
 * page layout stays identical to today on the vast majority of visits.
 */
const AnnouncementBanner = () => {
  const { data: banner } = useActiveBanner();
  if (!banner) return null;

  const bg = banner.background_color || "hsl(var(--accent))";
  const fg = banner.text_color || "hsl(var(--accent-foreground))";

  const linkContent = banner.link_label || "Learn more";
  const inner = (
    <div className="container mx-auto px-4 py-2 text-sm flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
      <span>{banner.message}</span>
      {banner.link_url && (
        <span className="underline font-medium">{linkContent} →</span>
      )}
    </div>
  );

  if (banner.link_url) {
    if (isExternal(banner.link_url)) {
      return (
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: bg, color: fg }}
          className="block hover:opacity-90 transition-opacity"
        >
          {inner}
        </a>
      );
    }
    return (
      <Link
        to={banner.link_url}
        style={{ backgroundColor: bg, color: fg }}
        className="block hover:opacity-90 transition-opacity"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div style={{ backgroundColor: bg, color: fg }}>
      {inner}
    </div>
  );
};

export default AnnouncementBanner;
