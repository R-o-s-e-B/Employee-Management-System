import React, { useState } from "react";
import { useItemStore } from "../../store/itemStore";

const ItemAddModal = ({ orgId, onClose, onSuccess }) => {
  const [items, setItems] = useState([{ name: "", unit: "kg" }]);
  const { createItems } = useItemStore();

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { name: "", unit: "kg" }]);
  };

  const removeRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filtered = items.filter((i) => i.name.trim());
    const data = { orgId, items: filtered };
    console.log("The dat ai", data);
    try {
      await createItems(data);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl w-[500px]">
        <h2 className="text-xl font-semibold mb-4">Add Items</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="border p-2 rounded w-full text-black border-black"
              />

              <select
                value={item.unit}
                onChange={(e) => handleChange(index, "unit", e.target.value)}
                className="border p-2 rounded text-black border-black"
              >
                <option value="kg">kg</option>
                <option value="litre">litre</option>
                <option value="bag">bag</option>
              </select>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="text-blue-500 text-sm"
          >
            + Add another
          </button>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Save Items
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemAddModal;
