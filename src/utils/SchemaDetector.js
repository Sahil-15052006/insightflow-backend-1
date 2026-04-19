function SchemaDetector(data) {

    const dataSchema = {}

    if (!data || data.length === 0) {
        return dataSchema
    }

    const sampleSize = Math.min(50, data.length)
    const sampleData = data.slice(0, sampleSize)

    const columns = Object.keys(sampleData[0])

    for (let i = 0; i < columns.length; i++) {

        const columnName = columns[i]

        let stringCount = 0
        let numberCount = 0
        let booleanCount = 0
        let emailCount = 0
        let dateCount = 0
        let totalValid = 0
        let percentageCount = 0

        for (let j = 0; j < sampleData.length; j++) {

            let value = sampleData[j][columnName]

            if (value === null || value === undefined || value === "") {
                continue
            }

            totalValid++

            value = String(value).trim().toLowerCase()

            if (value === "true" || value === "false") {
                booleanCount++
            }

            else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                emailCount++
            }

            else if (!isNaN(value)) {
                numberCount++
            }

            else if (/^\d+(\.\d+)?%$/.test(value)) {
                percentageCount++
            }

            else if (!isNaN(Date.parse(value))) {
                dateCount++
            }

            else {
                stringCount++
            }
        }

        let detectedType = "string"

        // use threshold logic instead of max
        if (numberCount / totalValid > 0.3) {
            detectedType = "number"
        }

        else if (booleanCount / totalValid > 0.8) {
            detectedType = "boolean"
        }

        else if (emailCount / totalValid > 0.5) {
            detectedType = "email"
        }

        if (percentageCount / totalValid > 0.5) {
            detectedType = "percentage"
        }

        else if (dateCount / totalValid > 0.5) {
            detectedType = "date"
        }

        dataSchema[columnName] = detectedType
    }

    return dataSchema
}

module.exports = SchemaDetector;