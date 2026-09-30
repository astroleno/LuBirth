/** All public resources stay inside the deployment's base path. */
export function assetUrl(path: string) {
  const relativePath = path.replace(/^\/+/, '');
  const mediaBase = import.meta.env.VITE_LUBIRTH_MEDIA_BASE;
  const base = mediaBase && /^(?:bgm|sfx)\//.test(relativePath)
    ? mediaBase
    : import.meta.env.BASE_URL;
  return `${base}${relativePath}`;
}
