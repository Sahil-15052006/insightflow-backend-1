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

        if (type === "percentage") {
            const num = Number(value.replace("%", ""))
            newRow[key] = isNaN(num) ? null : num / 100
        }

        else if (type === "number") {
            const isValidNumber = /^-?\d+(\.\d+)?$/.test(value)
            newRow[key] = isValidNumber ? Number(value) : null
        }

        else if (type === "boolean") {
            const val = value.toLowerCase()
            if (val === "true") newRow[key] = true
            else if (val === "false") newRow[key] = false
            else newRow[key] = null
        }

        else if (type === "date") {
            const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(value)
            if (!isValidFormat) {
                newRow[key] = null
            } else {
                const date = new Date(value)
                newRow[key] = isNaN(date.getTime()) ? null : date
            }
        }

        else if (type === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            newRow[key] = emailRegex.test(value) ? value : null
        }

        else {
            newRow[key] = value
        }
    }

    return newRow
}