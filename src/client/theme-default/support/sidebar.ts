import type { DefaultTheme } from 'vitepress/theme'
import { ensureStartingSlash } from './utils'

/**
 * Get the `Sidebar` from sidebar option. This method will ensure to get correct
 * sidebar config from `MultiSideBarConfig` with various path combinations such
 * as matching `guide/` and `/guide/`. If no matching config was found, it will
 * return empty array.
 */
export function getSidebar(
  sidebar: DefaultTheme.Sidebar,
  path: string
): DefaultTheme.SidebarGroup[] {
  if (Array.isArray(sidebar)) {
    return sidebar
  }

  path = ensureStartingSlash(path)

  for (const dir in sidebar) {
    // make sure the multi sidebar key starts with slash too
    if (path.startsWith(ensureStartingSlash(dir))) {
      return sidebar[dir]
    }
  }

  return []
}

export function getFlatSideBarLinks(sidebar: DefaultTheme.SidebarGroup[]) {
  const links: { text: string; link: string }[] = []

  function recursivelyExtractLinks(items: DefaultTheme.SidebarItem[]) {
    for (const item of items) {
      if (item.link) {
        // @ts-expect-error ts thinks item.link may be undefined though its checked above
        links.push(item)
      }
      if ('items' in item) {
        recursivelyExtractLinks(item.items)
      }
    }
  }

  for (const group of sidebar) {
    recursivelyExtractLinks(group.items)
  }
  return links
}
