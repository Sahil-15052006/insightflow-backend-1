function DataCleaner(data, schema) {

    const columnStats = {};

    // -------- STEP 1: calculate stats --------
    for (let key in schema) {

        const type = schema[key];
        let values = [];

        for (let i = 0; i < data.length; i++) {

            let value = data[i][key];

            if (value === null || value === undefined || value === "") continue;

            // ✅ number (strict)
            if (type === "number") {
                if (typeof value === "number") {
                    values.push(value);
                }
            }

            // ✅ percentage (already decimal)
            else if (type === "percentage") {
                if (typeof value === "number") {
                    values.push(value);
                }
            }

            // ✅ boolean normalize
            else if (type === "boolean") {
                if (value === true || value === false) {
                    values.push(value);
                }
            }

            // ✅ email
            else if (type === "email") {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    values.push(value);
                }
            }

            // ✅ date
            else if (type === "date") {
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    values.push(value);
                }
            }

            else {
                values.push(value);
            }
        }

        if (values.length === 0) {
            columnStats[key] = null;
            continue;
        }

        // -------- numeric median --------
        if (type === "number" || type === "percentage") {

            values.sort((a, b) => a - b);

            let mid = Math.floor(values.length / 2);

            columnStats[key] =
                values.length % 2 === 0
                    ? (values[mid - 1] + values[mid]) / 2
                    : values[mid];
        }

        // -------- mode --------
        else {

            let freq = {};
            let max = 0;
            let mode = null;

            for (let val of values) {

                freq[val] = (freq[val] || 0) + 1;

                if (freq[val] > max) {
                    max = freq[val];
                    mode = val;
                }
            }

            columnStats[key] = mode;
        }
    }

    // -------- STEP 2: clean row --------
    let cleanedData = [];

    for (let i = 0; i < data.length; i++) {

        let newRow = {};

        for (let key in schema) {

            let value = data[i][key];
            let type = schema[key];

            // ✅ number
            if (type === "number") {

                if (typeof value !== "number") {
                    newRow[key] = columnStats[key];
                } else {
                    newRow[key] = value;
                }
            }

            // ✅ percentage (already decimal)
            else if (type === "percentage") {

                if (typeof value !== "number") {
                    newRow[key] = columnStats[key];
                } else {
                    newRow[key] = value;
                }
            }

            // ✅ boolean
            else if (type === "boolean") {

                if (value === true || value === false) {
                    newRow[key] = value;
                } else {
                    newRow[key] = columnStats[key];
                }
            }

            // ✅ email
            else if (type === "email") {

                if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newRow[key] = value;
                } else {
                    newRow[key] = null;
                }
            }

            // ✅ date
            else if (type === "date") {

                if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    newRow[key] = value;
                } else {
                    newRow[key] = columnStats[key];
                }
            }

            // ✅ string
            else {

                if (value === null || value === "") {
                    newRow[key] = columnStats[key];
                } else {
                    newRow[key] = value;
                }
            }
        }

        cleanedData.push(newRow);
    }

    return cleanedData;
}

module.exports = DataCleaner;