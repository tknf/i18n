import { NodeI18n } from "../dist";

describe("Node i18n test", () => {
  const i18n = new NodeI18n();

  test("translate default string", () => {
    const message = i18n.translate("Form.Errors.String");
    expect(message).toMatch("Invalid format");
  });

  test("translate with lang", () => {
    const message = i18n.translate("Form.Errors.String", {}, "ja");
    expect(message).toMatch("不正な形式です");
  });

  test("translate with replacements", () => {
    const message = i18n.translate("Form.Errors.Email", { email: "test@example.com" });
    expect(message).toMatch("Invalid email (test@example.com)");
  });
});
