// Navigation Policy Guard
//
// 1. CMS-heavy routes (e.g. /cosmetic/products/*) use document navigation 
//    to ensure the server-rendered HTML is fresh and bypasses any stale
//    React RSC payload/hydration state that can cause pages to hang or render blank.
// 2. Fallback routes (/system-update) must also use document navigation to guarantee 
//    successful routing out of broken or unfinished states.
export function isCmsHeavyRoute(href: string) {
  return (
    href === "/" ||
    href === "/cosmetic" ||
    href.startsWith("/cosmetic/products/")
  );
}

export function shouldUseDocumentNavigation(href: string) {
  return (
    isCmsHeavyRoute(href) ||
    href.startsWith("/system-update")
  );
}
