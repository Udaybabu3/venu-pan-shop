import React, { useState } from 'react';
import axios from 'axios';

const StockForm = () => {
  const [formData, setFormData] = useState({
    ingredient_id: '',
    added_amount: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/stock', formData);
    alert('✅ Stock added!');
    setFormData({ ingredient_id: '', added_amount: '' });
  };

  return (
    <div>
      <h2>📥 Add Incoming Stock</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="ingredient_id" placeholder="Ingredient ID" value={formData.ingredient_id} onChange={handleChange} required />
        <input type="number" name="added_amount" placeholder="Added Amount" value={formData.added_amount} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StockForm;
