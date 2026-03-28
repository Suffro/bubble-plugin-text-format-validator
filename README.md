## How it works

1. Drag the **Validator** element onto your page and hide it.
2. In your workflow: `Element Actions → Text format validator → Validate`.
3. Fill in `text to validate` and `format`.
4. The optional advanced fields `Extra option 1`, `Extra option 2` and `Compare value`, depend on the chosen format, **check the guide below**.
5. Catch validation actions with the following events: `Format validation complete`, `Format validation passed`, `Format validation failed`.
6. Read the result from the element states: `is valid`, `error message`, `validated text`, `validated format`. 

---

## Formats advanced options reference

### Web / Network

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isEmail` | JSON: `{"allow_display_name":true}` | — | — |
| `isURL` | JSON: `{"protocols":["https"],"require_protocol":true}` | — | — |
| `isIP` | `4` or `6` (empty = both) | — | — |
| `isMACAddress` | JSON: `{"no_separators":true}` | — | — |

### Numbers

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isInt` | min: `0` | max: `100` | — |
| `isFloat` | min: `0.0` | max: `99.9` | — |
| `isNumeric` | JSON: `{"no_symbols":true}` | — | — |
| `isCurrency` | JSON: `{"symbol":"€","require_symbol":true}` | — | — |

### Text

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isEmpty` | JSON: `{"ignore_whitespace":true}` | — | — |
| `isLength` | min: `3` | max: `50` | — |
| `isAlpha` | locale: `it-IT` | — | — |
| `isAlphanumeric` | locale: `it-IT` | — | — |

> **isEmpty**: inverted logic — `is_valid = true` means the field **has** a value (is not empty).

### Finance

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isCreditCard` | — | — | — |
| `isIBAN` | — | — | — |
| `isBIC` | — | — | — |

### Dates

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isDate` | JSON: `{"format":"DD/MM/YYYY","strictMode":true}` | — | — |
| `isISO8601` | JSON: `{"strict":true}` | — | — |
| `isBefore` | — | — | limit date: `2025-12-31` |
| `isAfter` | — | — | limit date: `2020-01-01` |

> **isBefore/isAfter**: if Compare value is empty, compares against today's date.

### Security

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isUUID` | version: `3`, `4`, `5` or `all` | — | — |
| `isJWT` | — | — | — |
| `isStrongPassword` | JSON: `{"minLength":10,"minSymbols":2}` | — | — |

> **isStrongPassword** defaults: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol.

### Formats

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isJSON` | — | — | — |
| `isBase64` | JSON: `{"urlSafe":true}` | — | — |
| `isMimeType` | — | — | — |
| `isHexColor` | — | — | — |

### Geo / Locale

| Type | Extra option 1 | Extra option 2 | Compare value |
|------|-------------|----------------|---------------|
| `isPostalCode` | country: `IT`, `US`, `any` | — | — |
| `isMobilePhone` | locale: `it-IT`, `any` | JSON: `{"strictMode":true}` | — |
| `isPassportNumber` | country: `IT` | — | — |
| `isVAT` | country: `IT` **(required)** | — | — |

---

## IMPORTANT NOTES

- JSON fields must use **double quotes**: `{"key":"value"}` ✅ — `{'key':'value'}` ❌
- Leave Extra option 1 empty when not needed
- `validated text` for isEmail returns the normalized email (lowercase, dots removed for Gmail)
- Each call overwrites previous states — for multiple fields use multiple validator elements or validate sequentially
