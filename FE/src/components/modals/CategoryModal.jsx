import React, { useState } from "react";
import { useCategoryStore } from "../../store/categoryStore";
import { useOrgStore } from "../../store/orgStore";

const CategoryModal = ({ isOpen, onClose, categoryType, orgId }) => {
  const { createCategory, loading } = useCategoryStore();
  const { orgId: orgIdFromStore } = useOrgStore();
  const [categories, setCategories] = useState([{ name: "" }]);
  const [errors, setErrors] = useState({});

  const currentOrgId = orgId || orgIdFromStore;

  const handleAddCategory = () => {
    setCategories([...categories, { name: "" }]);
  };

  const handleRemoveCategory = (index) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const handleCategoryChange = (index, value) => {
    const updated = [...categories];
    updated[index].name = value;
    setCategories(updated);
    // Clear error for this field
    if (errors[`category-${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`category-${index}`];
      setErrors(newErrors);
    }
  };

  const validateCategories = () => {
    const newErrors = {};
    const validCategories = categories.filter((cat) => cat.name.trim());

    if (validCategories.length === 0) {
      newErrors.general = "At least one category name is required";
      setErrors(newErrors);
      return false;
    }

    // Check for duplicate names
    const names = validCategories.map((cat) => cat.name.trim().toLowerCase());
    const duplicates = names.filter(
      (name, index) => names.indexOf(name) !== index,
    );
    if (duplicates.length > 0) {
      newErrors.general = "Duplicate category names are not allowed";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCategories()) return;

    const validCategories = categories
      .filter((cat) => cat.name.trim())
      .map((cat) => ({ name: cat.name.trim() }));

    try {
      await createCategory({
        organizationId: currentOrgId,
        type: categoryType,
        categories: validCategories,
      });
      // Reset form
      setCategories([{ name: "" }]);
      setErrors({});
      onClose();
    } catch (err) {
      console.log("Error creating categories: ", err);
      setErrors({
        general: err.response?.data?.message || "Failed to create categories",
      });
    }
  };

  const handleClose = () => {
    setCategories([{ name: "" }]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Add {categoryType === "expense" ? "Expense" : "Income"} Categories
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      handleCategoryChange(index, e.target.value)
                    }
                    placeholder={`Category ${index + 1} name`}
                    className="flex-1 px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddCategory}
              className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Another Category
              </div>
            </button>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Creating..." : "Create Categories"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
