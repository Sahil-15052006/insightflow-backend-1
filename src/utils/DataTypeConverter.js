export default function DataTypeConverter(row, schema) {

    const newRow = {}

    for (let key in schema) {

        let value = row[key]

        if (value === null || value === undefined || value === "") {
            newRow[key] = null
            continue
        }

        value = String(value).trim()

        const type = schema[key]

        if (type === "number") {
            const num = Number(value)
            newRow[key] = isNaN(num) ? null : num
        }

        else if (type === "boolean") {
            const val = value.toLowerCase()
            if (val === "true") newRow[key] = true
            else if (val === "false") newRow[key] = false
            else newRow[key] = null
        }

        else if (type === "date") {
            const date = new Date(value)
            newRow[key] = isNaN(date.getTime()) ? null : date
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