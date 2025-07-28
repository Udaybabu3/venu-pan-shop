import React, { useState } from 'react';
import { logUsage } from '../api';

const UseForm = () => {
  const [formData, setFormData] = useState({
    ingredient_id: '',
    used_amount: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = parseInt(formData.ingredient_id);
    const amount = parseInt(formData.used_amount);

    if (isNaN(id) || isNaN(amount) || id <= 0 || amount <= 0) {
      alert('❌ Please enter valid positive numbers.');
      return;
    }

    try {
      await logUsage({ ingredient_id: id, used_amount: amount });
      alert('✅ Usage logged!');
      setFormData({ ingredient_id: '', used_amount: '' });
    } catch (error) {
      console.error(error);
      alert('❌ Failed to log usage. Please try again.');
    }
  };

  return (
    <div>
      <h2>📝 Log Used Ingredient</h2>
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
          name="used_amount"
          placeholder="Used Amount"
          value={formData.used_amount}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UseForm;
