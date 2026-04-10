export default function SchemaDetector(data) {

    const dataSchema = {}

    if (!data || data.length === 0) {
        return dataSchema
    }

    const sampleSize = Math.min(20, data.length)
    const sampleData = data.slice(0, sampleSize)

    const columns = Object.keys(sampleData[0])

    for (let i = 0; i < columns.length; i++) {

        const columnName = columns[i]

        let stringCount = 0
        let numberCount = 0
        let booleanCount = 0
        let emailCount = 0
        let dateCount = 0

        for (let j = 0; j < sampleData.length; j++) {

            let value = sampleData[j][columnName]

            if (value === null || value === undefined || value === "") {
                continue
            }

            value = String(value).trim().toLowerCase()

            // BOOLEAN (check early)
            if (value === "true" || value === "false") {
                booleanCount++
            }

            // EMAIL (basic pattern)
            else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                emailCount++
            }

            // NUMBER (strict check)
            else if (!isNaN(value) && value !== "") {
                numberCount++
            }

            // DATE (valid parse)
            else if (!isNaN(Date.parse(value))) {
                dateCount++
            }

            else {
                stringCount++
            }
        }

        // Determine type based on max count
        let detectedType = "string"
        let maxCount = stringCount

        if (numberCount > maxCount) {
            detectedType = "number"
            maxCount = numberCount
        }

        if (emailCount > maxCount) {
            detectedType = "email"
            maxCount = emailCount
        }

        if (booleanCount > maxCount) {
            detectedType = "boolean"
            maxCount = booleanCount
        }

        if (dateCount > maxCount) {
            detectedType = "date"
            maxCount = dateCount
        }

        dataSchema[columnName] = detectedType
    }

    return dataSchema
}