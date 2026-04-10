export default function DataCleaner(data, schema) {

    const columnStats = {};

    for (let key in schema) {

        const type = schema[key];
        let values = [];

        // collect values
        for (let i = 0; i < data.length; i++) {
            let value = data[i][key];

            if (value !== null && value !== undefined) {
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

        else {

            let freq = {};
            let max = 0;
            let mode = null;

            for (let i = 0; i < values.length; i++) {
                let val = values[i];

                if (freq[val] === undefined) {
                    freq[val] = 1;
                } else {
                    freq[val] = freq[val] + 1;
                }

                if (freq[val] > max) {
                    max = freq[val];
                    mode = val;
                }
            }

            columnStats[key] = mode;
        }
    }

    let cleanedData = [];

    for (let i = 0; i < data.length; i++) {

        let row = data[i];
        let newRow = {};

        for (let key in schema) {

            let value = row[key];

            if (value === null || value === undefined) {
                newRow[key] = columnStats[key];
            } else {
                newRow[key] = value;
            }
        }

        cleanedData.push(newRow);
    }

    return cleanedData;
}