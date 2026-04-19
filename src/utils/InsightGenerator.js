
function getNumericInsights(data, col) {
  const values = data.map(r => r[col]).filter(v => typeof v === "number");

  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  const insights = [];

  insights.push(`💰 Total ${col} is ${total}`);
  insights.push(`📊 Average ${col} is ${avg.toFixed(2)}`);
  insights.push(`🔼 Highest ${col} is ${max}`);
  insights.push(`🔽 Lowest ${col} is ${min}`);

  if (max > avg * 2) {
    insights.push(`⚠️ Some ${col} values are unusually high`);
  }

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

  const top = sorted[0];
  const least = sorted[sorted.length - 1];

  return [
    `🏆 Most frequent ${col} is ${top[0]}`,
    `📉 Least frequent ${col} is ${least[0]}`
  ];
}

function getTrendInsights(data, dateCol, valueCol) {
  const grouped = {};

  data.forEach(row => {
    const date = new Date(row[dateCol]).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + row[valueCol];
  });

  const values = Object.values(grouped);

  if (values.length < 2) return [];

  const first = values[0];
  const last = values[values.length - 1];

  if (last > first) {
    return [`📈 ${valueCol} is showing an increasing trend`];
  } else if (last < first) {
    return [`📉 ${valueCol} is decreasing over time`];
  } else {
    return [`➖ ${valueCol} is stable over time`];
  }
}

export function generateInsights(data, schema) {
  let insights = [];

  // Numeric
  schema.numeric.forEach(col => {
    insights.push(...getNumericInsights(data, col));
  });

  // Categorical
  schema.categorical.forEach(col => {
    insights.push(...getCategoricalInsights(data, col));
  });

  // Trend (use first numeric + first date)
  if (schema.date.length && schema.numeric.length) {
    insights.push(
      ...getTrendInsights(data, schema.date[0], schema.numeric[0])
    );
  }

  return insights;
}