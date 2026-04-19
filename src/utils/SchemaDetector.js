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
        let percentageCount = 0
        let totalValid = 0

        for (let j = 0; j < sampleData.length; j++) {

            let value = sampleData[j][columnName]

            if (value === null || value === undefined || value === "") {
                continue
            }

            totalValid++

            value = String(value).trim().toLowerCase()

            // ✅ boolean
            if (value === "true" || value === "false") {
                booleanCount++
            }

            // ✅ email
            else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                emailCount++
            }

            // ✅ percentage (check BEFORE number)
            else if (/^\d+(\.\d+)?%$/.test(value)) {
                percentageCount++
            }

            // ✅ strict number
            else if (/^-?\d+(\.\d+)?$/.test(value)) {
                numberCount++
            }

            // ✅ strict date only
            else {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    dateCount++;
            } else {
                    stringCount++;
            }
}
        }

        let detectedType = "string"

        // ✅ avoid divide by zero
        if (totalValid === 0) {
            dataSchema[columnName] = "string"
            continue
        }

        // ✅ proper priority
        if (percentageCount / totalValid > 0.5) {
            detectedType = "percentage"
        }
        else if (numberCount / totalValid > 0.3) {
            detectedType = "number"
        }
        else if (booleanCount / totalValid > 0.8) {
            detectedType = "boolean"
        }
        else if (emailCount / totalValid > 0.5) {
            detectedType = "email"
        }
        else if (dateCount / totalValid > 0.5) {
            detectedType = "date"
        }

        dataSchema[columnName] = detectedType
    }

    return dataSchema
}

module.exports = SchemaDetector;