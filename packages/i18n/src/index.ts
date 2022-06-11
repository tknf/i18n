import { get, merge } from "./utils";

const REPLACE_REGEX = /{([^}]*)}/g;

export class I18n {
  translation: TranslationDictionary = {};
  lang?: string;

  constructor(
    translation?: TranslationDictionary | TranslationDictionary[],
    lang?: string,
    defaultData: Record<string, any> = {}
  ) {
    this.translation = Array.isArray(translation)
      ? merge(defaultData, ...translation.slice().reverse())
      : merge(defaultData, translation) || defaultData;
    this.lang = lang;
  }

  translate(id: string, replacements?: { [key: string]: string | number | boolean }): string {
    if (id.length <= 0) {
      return "";
    }

    let text: string;
    try {
      text = get(this.translation, id, "");
    } catch (err) {
      console.error(err);
      text = "";
    }

    if (!text || typeof text !== "string") {
      return "";
    }

    if (replacements) {
      return text.replace(REPLACE_REGEX, (match: string) => {
        // eslint-disable-next-line no-param-reassign
        match = match.replace(/\s+/g, "");
        const replacement: string = match.substring(1, match.length - 1);

        if (replacements[replacement] === undefined) {
          const replacementData = JSON.stringify(replacements);

          console.error(
            `Error in translation for key '${id}'. No replacement found for key '${replacement}'. The following replacements were passed: '${replacementData}'`
          );
        }

        return replacements[replacement] as string;
      });
    }

    return text;
  }

  translationKeyExists(path: string): boolean {
    return Boolean(get(this.translation, path));
  }
}

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}
