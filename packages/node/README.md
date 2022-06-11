# @tknf/node-i18n
Internationalization utilities for Node.js.

## Get Started
### Install
```bash
yarn add @tknf/node-i18n
# or
npm install --save @tknf/node-i18n
```

### Usage
```yaml
# locales/en.default.yaml
Form:
  Errors:
    String: "Invalid format"
    Email: "Invalid email format: {email}"
```
```js
// index.js
import { NodeI18n } from "@tknf/node-i18n";
import path from "path"

const translations = path.resolve(__dirname, "locales");
const i18n = new NodeI18n(translations);

// Default format
console.log(i18n.translate("Form.Errors.String"));
// Invalid format

// With replacements
console.log(i18n.translate("Form.Errors.Email"), { email: "test@example.com"} );
// Invalid email format: test@example.com
```