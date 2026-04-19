function DataTypeConverter(row, schema) {

    const newRow = {}

    for (let key in schema) {

        let value = row[key]

        if (value === null || value === undefined || value === "") {
            newRow[key] = null
            continue
        }

        value = String(value).trim()
        const type = schema[key]

        // ✅ percentage (strict)
        if (type === "percentage") {
            if (/^\d+(\.\d+)?%$/.test(value)) {
                newRow[key] = Number(value.replace("%", ""))
            } else {
                newRow[key] = null
            }
        }

        // ✅ number (strict)
        else if (type === "number") {
            const isValidNumber = /^-?\d+(\.\d+)?$/.test(value)
            newRow[key] = isValidNumber ? Number(value) : null
        }

        // ✅ boolean (improved)
        else if (type === "boolean") {
            const val = value.toLowerCase()

            if (val === "true" || val === "1" || val === "yes") {
                newRow[key] = true
            }
            else if (val === "false" || val === "0" || val === "no") {
                newRow[key] = false
            }
            else {
                newRow[key] = null
            }
        }

        // date
        else if (type === "date") {
        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);

        if (isValidFormat) {
            newRow[key] = value.replace(/-/g, "/"); // ✅ convert to yyyy/mm/dd
        } else {
            newRow[key] = null;
        }
        }

        // ✅ email
        else if (type === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            newRow[key] = emailRegex.test(value) ? value : null
        }

        // ✅ string fallback
        else {
            newRow[key] = value
        }
    }

    return newRow
}

module.exports = DataTypeConverter;