function DataValidator(data, schema) {

    let errors = [];
    let warnings = [];

    // 1. check empty data
    if (!data || data.length === 0) {
        errors.push("Data is empty");
    }

    // 2. check required fields (you can change this list)
    const requiredFields = Object.keys(schema);

    for (let i = 0; i < data.length; i++) {

        let row = data[i];

        // check missing fields
        for (let j = 0; j < requiredFields.length; j++) {

            let key = requiredFields[j];

            if (!(key in row)) {
                errors.push("Missing field: " + key + " in row " + i);
            }
        }
    }

    // 3. column null check
    for (let key in schema) {

        let nullCount = 0;

        for (let i = 0; i < data.length; i++) {
            let value = data[i][key];

            if (value === null || value === undefined) {
                nullCount++;
            }
        }

        let ratio = nullCount / data.length;

        if (ratio > 0.5) {
            warnings.push("Column " + key + " has too many null values");
        }
    }

    // 4. row null check
    for (let i = 0; i < data.length; i++) {

        let row = data[i];
        let nullCount = 0;

        for (let key in schema) {
            let value = row[key];

            if (value === null || value === undefined) {
                nullCount++;
            }
        }

        let ratio = nullCount / Object.keys(schema).length;

        if (ratio > 0.5) {
            warnings.push("Row " + i + " has too many null values");
        }
    }

    // 5. duplicate check
    let seen = new Set();

    for (let i = 0; i < data.length; i++) {

        let rowString = JSON.stringify(data[i]);

        if (seen.has(rowString)) {
            warnings.push("Duplicate row found at index " + i);
        } else {
            seen.add(rowString);
        }
    }

    // final result
    return {
        valid: errors.length === 0,
        errors: errors,
        warnings: warnings
    };
}

module.exports = DataValidator;