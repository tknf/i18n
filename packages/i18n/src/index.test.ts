import { I18n } from "../dist";

const EnTranslation = {
  Form: {
    Errors: {
      String: "Invalid format",
      Email: "Invalid email ({email})"
    }
  }
};

const JaTranslation = {
  Form: {
    Errors: {
      String: "不正な形式です"
    }
  }
};

describe("I18n test", () => {
  test("translate default string", () => {
    const i18n = new I18n(EnTranslation);
    const message = i18n.translate("Form.Errors.String");
    expect(message).toMatch("Invalid format");
  });

  test("translate with replacements", () => {
    const i18n = new I18n(EnTranslation);
    const message = i18n.translate("Form.Errors.Email", { email: "test@example.com" });
    expect(message).toMatch("Invalid email (test@example.com)");
  });

  test("override translations", () => {
    const i18n = new I18n([JaTranslation, EnTranslation]);
    const message = i18n.translate("Form.Errors.String");
    expect(message).toMatch("不正な形式です");
  });
});
