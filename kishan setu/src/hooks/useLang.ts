import { useAuth } from "../auth";
import { t } from "../i18n";
import type { Lang } from "../auth";

export function useLang(): { lang: Lang; T: (key: string) => string } {
  const { lang } = useAuth();
  return { lang, T: (key: string) => t(key, lang) };
}
