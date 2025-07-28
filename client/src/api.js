// ✅ Dynamically use env variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchJSON = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ API call failed: ${url}`, err);
    throw err;
  }
};

export const getInventory = () => fetchJSON(`${BASE_URL}/inventory`);
export const logUsage = (data) =>
  fetchJSON(`${BASE_URL}/use`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
export const addStock = (data) =>
  fetchJSON(`${BASE_URL}/stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const getUsedToday = () => fetchJSON(`${BASE_URL}/report/used-today`);
export const getStockToday = () => fetchJSON(`${BASE_URL}/report/stock-today`);
export const getReorderAlerts = () => fetchJSON(`${BASE_URL}/report/reorder`);
