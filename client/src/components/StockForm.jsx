import React, { useState } from 'react';
import { addStock } from '../api';

const StockForm = () => {
  const [formData, setFormData] = useState({ ingredient_id: '', added_amount: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = parseInt(formData.ingredient_id);
      const amount = parseInt(formData.added_amount);

      if (isNaN(id) || isNaN(amount) || id <= 0 || amount <= 0) {
        alert("❌ Please enter valid positive numbers.");
        return;
      }

      await addStock({ ingredient_id: id, added_amount: amount });
      alert('✅ Stock added!');
      setFormData({ ingredient_id: '', added_amount: '' });
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add stock.');
    }
  };

  return (
    <div>
      <h2>📥 Add Incoming Stock</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="ingredient_id"
          placeholder="Ingredient ID"
          value={formData.ingredient_id}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="added_amount"
          placeholder="Added Amount"
          value={formData.added_amount}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StockForm;
