import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { useExpenseStore } from "../../store/expenseStore";
import { useCategoryStore } from "../../store/categoryStore";
import { useAccountStore } from "../../store/accountStore";
import { useOrgStore } from "../../store/orgStore";

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
