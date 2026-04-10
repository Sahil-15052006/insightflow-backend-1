export function cleanJSONData(data, config = {}) {
  const {
    forceStringFields = [],
    forceNumberFields = [],
    requiredFields = [],
    removeEmptyRows = true,
    capitalizeStrings = true
  } = config;

  if (!Array.isArray(data)) {
    throw new Error("Input must be an array of objects");
  }

  const cleaned = data.map(row => {
    const cleanedRow = {};

    for (let key in row) {
      let value = normalizeValue(row[key]);

      if (isEmpty(value)) {
        cleanedRow[key] = null;
        continue;
      }

      // Email handling
      if (key === "email") {
        const email = value.toLowerCase();
        cleanedRow[key] = isValidEmail(email) ? email : null;
        continue;
      }

      // Date handling
      if (key === "join_date") {
        cleanedRow[key] = normalizeDate(value);
        continue;
      }

      // Force string
      if (forceStringFields.includes(key)) {
        cleanedRow[key] = cleanString(value, capitalizeStrings);
        continue;
      }

      // Force number
      if (forceNumberFields.includes(key)) {
        cleanedRow[key] = cleanNumber(value);
        continue;
      }

      if (isBoolean(value)) {
        cleanedRow[key] = toBoolean(value);
        continue;
      }

      if (isNumeric(value)) {
        cleanedRow[key] = cleanNumber(value);
        continue;
      }

      cleanedRow[key] = cleanString(value, capitalizeStrings);
    }

    return cleanedRow;
  });

  return cleaned.filter(row => {
    if (removeEmptyRows) {
      const allNull = Object.values(row).every(v => v === null);
      if (allNull) return false;
    }

    if (requiredFields.length > 0) {
      const missing = requiredFields.some(field => row[field] === null);
      if (missing) return false;
    }

    return true;
  });
}

// ---------- Helpers ----------

function normalizeValue(value) {
  return typeof value === "string" ? value.trim() : value;
}

function isEmpty(value) {
  return (
    value === "" ||
    value === null ||
    value === undefined ||
    (typeof value === "string" &&
      ["n/a", "null", "undefined"].includes(value.toLowerCase()))
  );
}

function isBoolean(value) {
  return (
    typeof value === "string" &&
    ["true", "false"].includes(value.toLowerCase())
  );
}

function toBoolean(value) {
  return value.toLowerCase() === "true";
}

function isNumeric(value) {
  if (typeof value === "number") return true;

  if (typeof value === "string") {
    const cleaned = value.replace(/[,₹%]/g, "");
    return cleaned !== "" && !isNaN(cleaned);
  }

  return false;
}

function cleanNumber(value) {
  if (typeof value === "number") return value;

  if (typeof value !== "string") return null;

  const cleaned = value.replace(/[,₹%]/g, "");

  if (cleaned.trim() === "") return null;

  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

function cleanString(value, capitalize = true) {
  if (typeof value !== "string") return value;

  let cleaned = value.replace(/\s+/g, " ").trim();

  if (capitalize) {
    cleaned = cleaned
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  } else {
    cleaned = cleaned.toLowerCase();
  }

  return cleaned;
}

// ---------- Email Validation ----------

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- Date Normalization ----------

function normalizeDate(value) {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  // Handle YYYY-MM-DD directly (SAFE)
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  // Handle DD-MM-YYYY / DD/MM/YYYY / DD.MM.YYYY
  const parts = cleaned.split(/[-/.]/);

  if (parts.length === 3) {
    let [d, m, y] = parts;

    if (y.length === 4) {
      return `${y}-${pad(m)}-${pad(d)}`;
    }
  }

  // Handle YYYY/MM/DD or YYYY.MM.DD
  if (/^\d{4}[-/.]\d{2}[-/.]\d{2}$/.test(cleaned)) {
    const [y, m, d] = cleaned.split(/[-/.]/);
    return `${y}-${pad(m)}-${pad(d)}`;
  }

  return null;
}

function pad(val) {
  return val.toString().padStart(2, "0");
}