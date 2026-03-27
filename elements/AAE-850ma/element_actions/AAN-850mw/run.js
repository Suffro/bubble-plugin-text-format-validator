function(instance, properties, context) {

    // ─────────────────────────────────────────────
    // 1. GUARD: verifica che validator.js sia caricato
    // ─────────────────────────────────────────────
    if (typeof validator === "undefined") {
        instance.publishState("is_valid", false);
        instance.publishState("error_message", "validator.js non caricato. Verifica lo Shared Header.");
        instance.publishState("validated_value", "");
        instance.publishState("validation_type", "");
        instance.triggerEvent("validation_complete");
        instance.triggerEvent("validation_failed");
        return;
    }

    // ─────────────────────────────────────────────
    // 2. LETTURA INPUT
    // ─────────────────────────────────────────────
    var rawValue     = properties.value;
    var type         = properties.validation_type;
    var opt1         = properties.option_1 || "";
    var opt2         = properties.option_2 || "";
    var compareValue = properties.compare_value || "";

    // Converti a stringa: validator.js lavora solo con stringhe.
    // Se il valore è null/undefined, trattalo come stringa vuota.
    var str = (rawValue == null) ? "" : String(rawValue);

    // ─────────────────────────────────────────────
    // 3. MAPPA VALIDAZIONI
    // ─────────────────────────────────────────────
    var result  = false;
    var errMsg  = "";
    var cleaned = str; // valore validato/sanitizzato

    try {

        switch (type) {

            // ═══════ RETE / IDENTIFICATIVI ═══════

            case "isEmail":
                // opt1: opzioni JSON (es: '{"allow_display_name":true}')
                var emailOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isEmail(str, emailOpts);
                if (result) cleaned = validator.normalizeEmail(str) || str;
                errMsg = result ? "" : "Indirizzo email non valido";
                break;

            case "isURL":
                // opt1: opzioni JSON (es: '{"protocols":["https"],"require_protocol":true}')
                var urlOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isURL(str, urlOpts);
                errMsg = result ? "" : "URL non valido";
                break;

            case "isIP":
                // opt1: versione IP → "4" o "6" (default: entrambe)
                var ipVersion = opt1 || "";
                result = validator.isIP(str, ipVersion || undefined);
                errMsg = result ? "" : "Indirizzo IP non valido";
                break;

            case "isMACAddress":
                // opt1: opzioni JSON (es: '{"no_separators":true}')
                var macOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isMACAddress(str, macOpts);
                errMsg = result ? "" : "Indirizzo MAC non valido";
                break;

            // ═══════ NUMERI ═══════

            case "isInt":
                // opt1: min (es: "0"), opt2: max (es: "100")
                var intOpts = {};
                if (opt1 !== "") intOpts.min = parseInt(opt1, 10);
                if (opt2 !== "") intOpts.max = parseInt(opt2, 10);
                result = validator.isInt(str, intOpts);
                errMsg = result ? "" : "Non è un numero intero valido";
                break;

            case "isFloat":
                // opt1: min, opt2: max
                var floatOpts = {};
                if (opt1 !== "") floatOpts.min = parseFloat(opt1);
                if (opt2 !== "") floatOpts.max = parseFloat(opt2);
                result = validator.isFloat(str, floatOpts);
                errMsg = result ? "" : "Non è un numero decimale valido";
                break;

            case "isNumeric":
                // opt1: opzioni JSON (es: '{"no_symbols":true}')
                var numOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isNumeric(str, numOpts);
                errMsg = result ? "" : "Non è un valore numerico";
                break;

            case "isCurrency":
                // opt1: opzioni JSON (es: '{"symbol":"€","require_symbol":true}')
                var currOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isCurrency(str, currOpts);
                errMsg = result ? "" : "Formato valuta non valido";
                break;

            // ═══════ TESTO ═══════

            case "isNotEmpty":
                // opt1: opzioni JSON (es: '{"ignore_whitespace":true}')
                var emptyOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isEmpty(str, emptyOpts);
                // Nota: qui "result = true" significa CHE È vuoto.
                // Invertiamo la semantica: is_valid = true se NON è vuoto.
                result = !result;
                errMsg = result ? "" : "Il campo è vuoto";
                break;

            case "isLength":
                // opt1: min (es: "3"), opt2: max (es: "50")
                var lenOpts = {};
                if (opt1 !== "") lenOpts.min = parseInt(opt1, 10);
                if (opt2 !== "") lenOpts.max = parseInt(opt2, 10);
                result = validator.isLength(str, lenOpts);
                errMsg = result ? "" : "Lunghezza non valida (min: " + (lenOpts.min || 0) + ", max: " + (lenOpts.max || "∞") + ")";
                break;

            case "isAlpha":
                // opt1: locale (es: "it-IT", "en-US"). Default: "en-US"
                var alphaLocale = opt1 || "en-US";
                result = validator.isAlpha(str, alphaLocale);
                errMsg = result ? "" : "Deve contenere solo lettere";
                break;

            case "isAlphanumeric":
                // opt1: locale (es: "it-IT"). Default: "en-US"
                var alnumLocale = opt1 || "en-US";
                result = validator.isAlphanumeric(str, alnumLocale);
                errMsg = result ? "" : "Deve contenere solo lettere e numeri";
                break;

            // ═══════ CARTE / FINANZA ═══════

            case "isCreditCard":
                result = validator.isCreditCard(str);
                errMsg = result ? "" : "Numero carta di credito non valido";
                break;

            case "isIBAN":
                result = validator.isIBAN(str);
                errMsg = result ? "" : "Codice IBAN non valido";
                break;

            case "isBIC":
                result = validator.isBIC(str);
                errMsg = result ? "" : "Codice BIC/SWIFT non valido";
                break;

            // ═══════ DATE ═══════

            case "isDate":
                // opt1: opzioni JSON (es: '{"format":"DD/MM/YYYY","delimiters":["/"],"strictMode":true}')
                var dateOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isDate(str, dateOpts);
                errMsg = result ? "" : "Data non valida";
                break;

            case "isISO8601":
                // opt1: opzioni JSON (es: '{"strict":true}')
                var isoOpts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isISO8601(str, isoOpts);
                errMsg = result ? "" : "Data ISO 8601 non valida";
                break;

            case "isBefore":
                // compare_value: la data limite (es: "2025-12-31")
                result = validator.isBefore(str, compareValue || undefined);
                errMsg = result ? "" : "La data deve essere precedente a " + (compareValue || "oggi");
                break;

            case "isAfter":
                // compare_value: la data limite (es: "2020-01-01")
                result = validator.isAfter(str, compareValue || undefined);
                errMsg = result ? "" : "La data deve essere successiva a " + (compareValue || "oggi");
                break;

            // ═══════ IDENTITÀ / SICUREZZA ═══════

            case "isUUID":
                // opt1: versione UUID → "3", "4", "5", "all" (default: "all")
                var uuidVer = opt1 || "all";
                result = validator.isUUID(str, uuidVer === "all" ? undefined : uuidVer);
                errMsg = result ? "" : "UUID non valido";
                break;

            case "isJWT":
                result = validator.isJWT(str);
                errMsg = result ? "" : "Token JWT non valido";
                break;

            case "isStrongPassword":
                // opt1: opzioni JSON
                // Default: {minLength:8, minLowercase:1, minUppercase:1,
                //           minNumbers:1, minSymbols:1}
                var pwdDefaults = {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    returnScore: false
                };
                var pwdOpts = opt1 ? Object.assign({}, pwdDefaults, JSON.parse(opt1)) : pwdDefaults;
                result = validator.isStrongPassword(str, pwdOpts);
                errMsg = result ? "" : "Password non sufficientemente forte (min " + pwdOpts.minLength + " caratteri, maiuscole, minuscole, numeri, simboli)";
                break;

            // ═══════ FORMATI ═══════

            case "isJSON":
                result = validator.isJSON(str);
                errMsg = result ? "" : "JSON non valido";
                break;

            case "isBase64":
                // opt1: opzioni JSON (es: '{"urlSafe":true}')
                var b64Opts = opt1 ? JSON.parse(opt1) : {};
                result = validator.isBase64(str, b64Opts);
                errMsg = result ? "" : "Stringa Base64 non valida";
                break;

            case "isMimeType":
                result = validator.isMimeType(str);
                errMsg = result ? "" : "MIME type non valido";
                break;

            case "isHexColor":
                result = validator.isHexColor(str);
                errMsg = result ? "" : "Colore esadecimale non valido";
                break;

            // ═══════ GEO / LOCALE ═══════

            case "isPostalCode":
                // opt1: locale (es: "IT", "US", "DE", "any"). Default: "any"
                var postalLocale = opt1 || "any";
                result = validator.isPostalCode(str, postalLocale);
                errMsg = result ? "" : "Codice postale non valido";
                break;

            case "isMobilePhone":
                // opt1: locale (es: "it-IT", "en-US", "any"). Default: "any"
                // opt2: opzioni JSON (es: '{"strictMode":true}')
                var phoneLocale = opt1 || "any";
                var phoneOpts = opt2 ? JSON.parse(opt2) : {};
                result = validator.isMobilePhone(str, phoneLocale, phoneOpts);
                errMsg = result ? "" : "Numero di telefono non valido";
                break;

            case "isPassportNumber":
                // opt1: country code (es: "IT", "US", "DE")
                var passportCC = opt1 || "";
                result = validator.isPassportNumber(str, passportCC || undefined);
                errMsg = result ? "" : "Numero di passaporto non valido";
                break;

            case "isVAT":
                // opt1: country code (es: "IT", "DE", "GB")
                var vatCC = opt1 || "";
                result = validator.isVAT(str, vatCC);
                errMsg = result ? "" : "Partita IVA non valida";
                break;

            // ═══════ FALLBACK ═══════

            default:
                result = false;
                errMsg = "Tipo di validazione sconosciuto: " + type;
                break;

        } // end switch

    } catch (e) {
        // Errore nel parsing delle opzioni JSON o in validator.js
        result = false;
        errMsg = "Errore di validazione: " + e.message;
        cleaned = str;
    }

    // ─────────────────────────────────────────────
    // 4. PUBBLICA STATI
    // ─────────────────────────────────────────────
    instance.publishState("is_valid", result);
    instance.publishState("error_message", errMsg);
    instance.publishState("validated_value", result ? cleaned : str);
    instance.publishState("validation_type", type);

    // ─────────────────────────────────────────────
    // 5. TRIGGER EVENTI
    // ─────────────────────────────────────────────
    // Triggera sempre "validation_complete" per workflow generici.
    instance.triggerEvent("validation_complete");

    // Triggera l'evento specifico in base all'esito.
    if (result) {
        instance.triggerEvent("validation_passed");
    } else {
        instance.triggerEvent("validation_failed");
    }

}