import React, { useEffect, useState } from 'react';
import { getUsedToday, getStockToday, getReorderAlerts } from '../api';
import jsPDF from 'jspdf';

const Reports = () => {
  const [used, setUsed] = useState([]);
  const [stocked, setStocked] = useState([]);
  const [reorder, setReorder] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [usedData, stockData, reorderData] = await Promise.all([
          getUsedToday(),
          getStockToday(),
          getReorderAlerts()
        ]);

        setUsed(usedData);
        setStocked(stockData);
        setReorder(reorderData);
      } catch (err) {
        console.error("Failed to load report data:", err);
      }
    };

    fetchReports();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toISOString().split('T')[0];

    doc.setFontSize(18);
    doc.text("Venu Pan Shop - Daily Inventory Report", 10, 15);

    doc.setFontSize(12);
    let y = 25;

    // Used Today
    doc.text("Used Today:", 10, y);
    y += 7;
    if (used.length === 0) {
      doc.text("None", 15, y);
      y += 7;
    } else {
      used.forEach(u => {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(`${u.ingredient}: ${u.total_used}`, 15, y);
        y += 7;
      });
    }

    // Stock Received Today
    y += 5;
    doc.text("Stock Received Today:", 10, y);
    y += 7;
    if (stocked.length === 0) {
      doc.text("None", 15, y);
      y += 7;
    } else {
      stocked.forEach(s => {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(`${s.ingredient}: ${s.total_added}`, 15, y);
        y += 7;
      });
    }

    // Reorder Alerts
    y += 5;
    doc.text("Reorder Alerts:", 10, y);
    y += 7;
    if (reorder.length === 0) {
      doc.text("All good", 15, y);
    } else {
      reorder.forEach(r => {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(`${r.ingredient} - Stock: ${r.current_stock} (Min: ${r.min_required})`, 15, y);
        y += 7;
      });
    }

    doc.save(`report-${today}.pdf`);
  };

  return (
    <div>
      <h2>📅 Daily Report</h2>
      <button onClick={downloadPDF} style={{ marginBottom: '20px', padding: '8px 16px', fontWeight: 'bold' }}>
        📥 Download PDF
      </button>

      <h3>🧾 Used Today</h3>
      <ul>
        {used.length === 0 ? <li>None</li> :
          used.map(u => (
            <li key={u.ingredient}>{u.ingredient}: {u.total_used}</li>
          ))}
      </ul>

      <h3>📥 Stock Received Today</h3>
      <ul>
        {stocked.length === 0 ? <li>None</li> :
          stocked.map(s => (
            <li key={s.ingredient}>{s.ingredient}: {s.total_added}</li>
          ))}
      </ul>

      <h3>🚨 Reorder Alerts</h3>
      <ul>
        {reorder.length === 0 ? <li>All good ✅</li> :
          reorder.map(r => (
            <li key={r.ingredient}>
              {r.ingredient} - Stock: {r.current_stock} (Min: {r.min_required})
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Reports;
