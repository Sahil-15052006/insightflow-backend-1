function getNumericInsights(data, col) {
  const values = data.map(r => r[col]).filter(v => typeof v === "number");

  if (!values.length) return [];

  const max = Math.max(...values);
  const min = Math.min(...values);

  const insights = [];

  insights.push(`🔼 Highest ${col} is ${max}`);
  insights.push(`🔽 Lowest ${col} is ${min}`);

  return insights;
}

function getCategoricalInsights(data, col) {
  const freq = {};

  data.forEach(row => {
    const val = row[col];
    if (!val) return;
    freq[val] = (freq[val] || 0) + 1;
  });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

  if (!sorted.length) return [];

  return [
    `🏆 Most common ${col} is ${sorted[0][0]}`,
    `📉 Least common ${col} is ${sorted[sorted.length - 1][0]}`
  ];
}

function getDayInsights(data, dateCol) {
  const freq = {};

  data.forEach(row => {
    const rawDate = row[dateCol];
    if (!rawDate) return;

    const date = new Date(rawDate);
    if (isNaN(date)) return;

    const day = date.toLocaleDateString("en-US", { weekday: "long" });

    freq[day] = (freq[day] || 0) + 1;
  });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

  if (!sorted.length) return [];

  return [
    `📅 Most active day is ${sorted[0][0]}`,
    `📉 Least active day is ${sorted[sorted.length - 1][0]}`
  ];
}

function generateInsights(data, schema) {
  let insights = [];

  // 🚫 Ignore useless columns
  const ignoreColumns = ["OrderID", "ID", "UserID"];

  // ✅ Numeric
  schema.numeric.forEach(col => {
    if (ignoreColumns.includes(col)) return;
    insights.push(...getNumericInsights(data, col));
  });

  // ✅ Categorical
  schema.categorical.forEach(col => {
    if (ignoreColumns.includes(col)) return;
    insights.push(...getCategoricalInsights(data, col));
  });

  // ✅ Day insights (optional but powerful)
  if (schema.date.length) {
    insights.push(...getDayInsights(data, schema.date[0]));
  }


  return insights;
}

module.exports = generateInsights;