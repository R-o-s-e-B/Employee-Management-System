import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { useExpenseStore } from "../../store/expenseStore";
import { useCategoryStore } from "../../store/categoryStore";
import { useAccountStore } from "../../store/accountStore";
import { useOrgStore } from "../../store/orgStore";
import CategoryModal from "../modals/CategoryModal";

const ExpenseForm = ({ orgId, setShowForm }) => {
  const { createExpense, loading } = useExpenseStore();
  const { categories, getCategories } = useCategoryStore();
  const { accounts, getAccounts } = useAccountStore();
  const { orgId: orgIdFromStore } = useOrgStore();

  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    contactId: "",
    zone: "",
    paymentMethod: "",
    notes: "",
    billUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentOrgId = orgId || orgIdFromStore;
      if (currentOrgId) {
        try {
          await Promise.all([
            getCategories({ orgId: currentOrgId }),
            getAccounts({ orgId: currentOrgId }),
          ]);
        } catch (err) {
          console.log("error fetching data: ", err);
        }
      }
    };
    fetchData();
  }, [orgId, orgIdFromStore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if "Add new category" option was selected
    if (name === "category" && value === "__add_new__") {
      setShowCategoryModal(true);
      // Reset the dropdown to empty
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      accountId: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      contactId: "",
      zone: "",
      paymentMethod: "",
      notes: "",
      billUrl: "",
    });
    setErrors({});
  };

  const validateExpense = () => {
    const newErrors = {};

    if (!formData.accountId) {
      newErrors.accountId = "Account is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!orgId && !orgIdFromStore) {
      newErrors.org = "Organization not loaded";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateExpense()) return;

    const dataToSubmit = {
      orgId: orgId || orgIdFromStore,
      accountId: formData.accountId,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date ? new Date(formData.date) : new Date(),
      contactId: formData.contactId.trim() || null,
      zone: formData.zone.trim() || null,
      paymentMethod: formData.paymentMethod || null,
      notes: formData.notes.trim() || null,
      billUrl: formData.billUrl.trim() || null,
    };

    try {
      await createExpense(dataToSubmit);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.log("Error creating expense: ", err);
    }
  };

  const expenseCategories = categories.filter(
    (cat) => cat.type === "expense",
  );

  // Refresh categories after modal closes
  const handleCategoryModalClose = async () => {
    setShowCategoryModal(false);
    const currentOrgId = orgId || orgIdFromStore;
    if (currentOrgId) {
      try {
        await getCategories({ orgId: currentOrgId });
      } catch (err) {
        console.log("error refreshing categories: ", err);
      }
    }
  };

  const paymentMethods = [
    { label: "Select payment method", value: "" },
    { label: "Cash", value: "cash" },
    { label: "Bank", value: "bank" },
    { label: "UPI", value: "upi" },
    { label: "Cheque", value: "cheque" },
  ];

  const fields = [
    {
      name: "accountId",
      placeholder: "Account",
      type: "dropdown",
      options: [
        { label: "Select account", value: "" },
        ...accounts.map((account) => ({
          label: account.name,
          value: account._id,
        })),
      ],
    },
    {
      name: "amount",
      placeholder: "Amount",
      type: "number",
    },
    {
      name: "category",
      placeholder: "Category",
      type: "dropdown",
      options: [
        { label: "Select category", value: "" },
        ...expenseCategories.map((cat) => ({
          label: cat.name,
          value: cat._id,
        })),
        { label: "+ Add new category", value: "__add_new__" },
      ],
    },
    {
      name: "date",
      placeholder: "Date",
      type: "date",
    },
    {
      name: "contactId",
      placeholder: "Contact ID (optional)",
      type: "text",
    },
    {
      name: "zone",
      placeholder: "Zone (optional)",
      type: "text",
    },
    {
      name: "paymentMethod",
      placeholder: "Payment Method",
      type: "dropdown",
      options: paymentMethods,
    },
    {
      name: "notes",
      placeholder: "Notes (optional)",
      type: "text",
    },
    {
      name: "billUrl",
      placeholder: "Bill URL (optional)",
      type: "text",
    },
  ];

  return (
    <div>
      {/* Show button if no categories exist */}
      {expenseCategories.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-3">
            No expense categories found. Create categories to get started.
          </p>
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add Categories
          </button>
        </div>
      )}

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={handleCategoryModalClose}
        categoryType="expense"
        orgId={orgId || orgIdFromStore}
      />

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {fields.map((field) => (
          <div key={field.name}>
            <FormInput
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              type={field.type}
              onChange={handleChange}
              options={field.type === "dropdown" ? field.options : null}
            />
            {errors[field.name] && (
              <span style={{ color: "red" }}>{errors[field.name]}</span>
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {loading ? "Creating..." : "Create Expense"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
