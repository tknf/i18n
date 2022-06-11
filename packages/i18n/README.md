# @tknf/i18n
Internationalization utilities.

## Get Started
### Install
```bash
yarn add @tknf/i18n
# or
npm install --save @tknf/i18n
```

### Usage
```js
// index.js
import { I18n } from "@tknf/i18n";

const translations = {
  Form: {
    Errors: {
      String: "Invalid format",
      Email: "Invalid email format: {email}"
    }
  }
};
const i18n = new I18n(translations);

// Default format
console.log(i18n.translate("Form.Errors.String"));
// Invalid format

// With replacements
console.log(i18n.translate("Form.Errors.Email"), { email: "test@example.com"} );
// Invalid email format: test@example.com
```