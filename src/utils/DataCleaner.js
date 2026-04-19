function DataCleaner(data, schema) {

    const columnStats = {};

    for (let key in schema) {

        const type = schema[key];
        let values = [];

        for (let i = 0; i < data.length; i++) {

            let value = data[i][key];

            if (value === null || value === undefined || value === "") {
                continue;
            }

            if (type === "number") {
                if (!isNaN(value)) {
                    values.push(Number(value));
                }
            }

            else if (type === "boolean") {
                if (value === true || value === false || value === "true" || value === "false") {
                    values.push(value);
                }
            }

            else if (type === "email") {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    values.push(value);
                }
            }

            else if (type === "percentage") {
                if (/^\d+(\.\d+)?%$/.test(value)) {
                    values.push(Number(value.replace("%", "")));
                }
            }

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

        if (type === "number") {

            values.sort(function(a, b) {
                return a - b;
            });

            let mid = Math.floor(values.length / 2);

            if (values.length % 2 === 0) {
                columnStats[key] = (values[mid - 1] + values[mid]) / 2;
            } else {
                columnStats[key] = values[mid];
            }
        }

        else if (type === "string" || type === "boolean") {

            let freq = {};
            let max = 0;
            let mode = null;

            for (let i = 0; i < values.length; i++) {

                let val = values[i];

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

            if (type === "number") {

                if (value === null || value === "" || isNaN(value)) {
                    newRow[key] = columnStats[key];
                } else {
                    newRow[key] = Number(value);
                }
            }

            else if (type === "boolean") {

                if (value === true || value === false) {
                    newRow[key] = value;
                } else if (value === "true") {
                    newRow[key] = true;
                } else if (value === "false") {
                    newRow[key] = false;
                } else {
                    newRow[key] = columnStats[key];
                }
            }

            else if (type === "email") {

                if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newRow[key] = value;
                } else {
                    newRow[key] = null;
                }
            }

            else if (type === "percentage") {

                if (value && /^\d+(\.\d+)?%$/.test(value)) {
                    newRow[key] = Number(value.replace("%", "")) / 100;
                } else {
                    newRow[key] = columnStats[key] !== null ? columnStats[key] / 100 : null;
                }
            }

            else if (type === "date") {

                if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    newRow[key] = value;
                } else {
                    newRow[key] = columnStats[key];
                }
            }

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