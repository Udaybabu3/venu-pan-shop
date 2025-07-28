import React, { useEffect, useState } from 'react';
import { getInventory } from '../api';

const Inventory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setItems(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div>
      <h2>📦 Current Inventory</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ margin: 'auto' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ingredient</th>
            <th>Unit</th>
            <th>Min Required</th>
            <th>Current Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const stock = Number(item.current_stock);
            const min = Number(item.min_required);
            const isLow = stock < min;

            return (
              <tr key={item.ingredient_id}>
                <td>{item.ingredient_id}</td>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>{min}</td>
                <td style={{ color: isLow ? 'red' : 'green', fontWeight: isLow ? 'bold' : 'normal' }}>
                  {isLow ? '⚠️ ' : ''}{stock}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
