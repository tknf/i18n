import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "yaml";
import { I18n } from "@tknf/i18n";

const DEFAULT_DIR = path.resolve(process.cwd(), "locales");

export class NodeI18n extends I18n {
  constructor(translationDir: string = DEFAULT_DIR) {
    const translations: Record<string, any> = {};
    try {
      const translationsDir = fs.readdirSync(translationDir);
      for (const translation of translationsDir) {
        const filename = path.resolve(translationDir, translation);
        if (!fs.existsSync(filename)) {
          continue;
        }
        const basename = path.basename(filename);
        const ext = path.extname(filename);
        let localeName = basename.replace(ext, "");
        let isDefault = false;
        if (localeName.endsWith(".default")) {
          localeName = localeName.replace(".default", "");
          isDefault = true;
        }
        if (ext === ".yaml" || ext === ".yml") {
          const data = safeYamlParseFile(filename);
          if (isDefault) {
            translations["default"] = data;
          }
          translations[localeName] = data;
        } else if (ext === ".json") {
          const data = safeJsonParseFile(filename);
          if (isDefault) {
            translations["default"] = data;
          }
          translations[localeName] = data;
        }
      }
    } catch (err) {
      console.log(err);
    }
    super(translations);
  }

  translate(id: string, replacements?: { [key: string]: string | number | boolean }, lang?: string) {
    let targetLang = lang || "default";
    return super.translate(`${targetLang}.${id}`, replacements);
  }

  getlocaleTranslation(locale: string = "default") {
    const translation = this.translation[locale] || this.translation["default"] || {};
    if (typeof translation === "string") return {};
    return translation;
  }
}

function safeJsonParseFile(filename: string) {
  try {
    const file = fs.readFileSync(filename).toString("utf-8");
    return JSON.parse(file);
  } catch {
    return {};
  }
}

function safeYamlParseFile(filename: string) {
  try {
    const file = fs.readFileSync(filename).toString("utf-8");
    return yaml.parse(file) || {};
  } catch {
    return {};
  }
}
