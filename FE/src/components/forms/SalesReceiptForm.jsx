import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import { useSalesReceiptStore } from "../../store/salesReceiptStore";
import { useCategoryStore } from "../../store/categoryStore";
import { useItemStore } from "../../store/itemStore";
import { useAccountStore } from "../../store/accountStore";
import { useOrgStore } from "../../store/orgStore";
import CategoryModal from "../modals/CategoryModal";

const SalesReceiptForm = ({ orgId, setShowForm }) => {
  const { createSalesReceipt, loading } = useSalesReceiptStore();
  const { categories, getCategories } = useCategoryStore();
  const { items, getItems } = useItemStore();
  const { accounts, getAccounts } = useAccountStore();
  const { orgId: orgIdFromStore } = useOrgStore();

  const [formData, setFormData] = useState({
    accountId: "",
    categoryId: "",
    amount: "",
    dateReceived: new Date().toISOString().split("T")[0],
    contactId: "",
    paymentMethod: "",
    season: "",
    batchId: "",
    notes: "",
    receiptUrl: "",
    status: "finalized",
  });

  const [itemsList, setItemsList] = useState([
    { itemId: "", quantity: "", rate: "", unit: "kg" },
  ]);

  const [errors, setErrors] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const currentOrgId = orgId || orgIdFromStore;
      if (currentOrgId) {
        try {
          await Promise.all([
            getCategories({ orgId: currentOrgId }),
            getItems({ orgId: currentOrgId }),
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
    if (name === "categoryId" && value === "__add_new__") {
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

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...itemsList];
    updatedItems[index][field] = value;
    setItemsList(updatedItems);
  };

  const addItemRow = () => {
    setItemsList([
      ...itemsList,
      { itemId: "", quantity: "", rate: "", unit: "kg" },
    ]);
  };

  const removeItemRow = (index) => {
    if (itemsList.length > 1) {
      setItemsList(itemsList.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setFormData({
      accountId: "",
      categoryId: "",
      amount: "",
      dateReceived: new Date().toISOString().split("T")[0],
      contactId: "",
      paymentMethod: "",
      season: "",
      batchId: "",
      notes: "",
      receiptUrl: "",
      status: "finalized",
    });
    setItemsList([{ itemId: "", quantity: "", rate: "", unit: "kg" }]);
    setErrors({});
  };

  const validateSalesReceipt = () => {
    const newErrors = {};

    if (!formData.accountId) {
      newErrors.accountId = "Account is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    if (!orgId && !orgIdFromStore) {
      newErrors.org = "Organization not loaded";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSalesReceipt()) return;

    // Process items array - filter out empty items and calculate amounts
    const processedItems = itemsList
      .filter(
        (item) =>
          item.itemId && item.quantity && item.rate && parseFloat(item.quantity) > 0,
      )
      .map((item) => ({
        itemId: item.itemId,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        unit: item.unit || "kg",
        amount: parseFloat(item.quantity) * parseFloat(item.rate),
      }));

    const dataToSubmit = {
      organizationId: orgId || orgIdFromStore,
      accountId: formData.accountId,
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      dateReceived: formData.dateReceived
        ? new Date(formData.dateReceived)
        : new Date(),
      contactId: formData.contactId.trim() || null,
      paymentMethod: formData.paymentMethod,
      items: processedItems.length > 0 ? processedItems : [],
      season: formData.season.trim() || null,
      batchId: formData.batchId.trim() || null,
      notes: formData.notes.trim() || null,
      receiptUrl: formData.receiptUrl.trim() || null,
      status: formData.status || "finalized",
    };

    try {
      await createSalesReceipt(dataToSubmit);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.log("Error creating sales receipt: ", err);
    }
  };

  const incomeCategories = categories.filter((cat) => cat.type === "income");

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

  const statusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Finalized", value: "finalized" },
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
      name: "categoryId",
      placeholder: "Category",
      type: "dropdown",
      options: [
        { label: "Select category", value: "" },
        ...incomeCategories.map((cat) => ({
          label: cat.name,
          value: cat._id,
        })),
        { label: "+ Add new category", value: "__add_new__" },
      ],
    },
    {
      name: "amount",
      placeholder: "Amount",
      type: "number",
    },
    {
      name: "dateReceived",
      placeholder: "Date Received",
      type: "date",
    },
    {
      name: "contactId",
      placeholder: "Contact ID (optional)",
      type: "text",
    },
    {
      name: "paymentMethod",
      placeholder: "Payment Method",
      type: "dropdown",
      options: paymentMethods,
    },
    {
      name: "season",
      placeholder: "Season (optional)",
      type: "text",
    },
    {
      name: "batchId",
      placeholder: "Batch ID (optional)",
      type: "text",
    },
    {
      name: "status",
      placeholder: "Status",
      type: "dropdown",
      options: statusOptions,
    },
    {
      name: "notes",
      placeholder: "Notes (optional)",
      type: "text",
    },
    {
      name: "receiptUrl",
      placeholder: "Receipt URL (optional)",
      type: "text",
    },
  ];

  return (
    <div>
      {/* Show button if no categories exist */}
      {incomeCategories.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-3">
            No income categories found. Create categories to get started.
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
        categoryType="income"
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

        <div>
          <h3>Items (optional)</h3>
          {itemsList.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <select
                name={`itemId-${index}`}
                value={item.itemId}
                onChange={(e) =>
                  handleItemChange(index, "itemId", e.target.value)
                }
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value="">Select Item</option>
                {items.map((it) => (
                  <option key={it._id} value={it._id}>
                    {it.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                style={{
                  width: "100px",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "#fff",
                }}
                step="0.01"
              />
              <input
                type="text"
                placeholder="Unit"
                value={item.unit}
                onChange={(e) =>
                  handleItemChange(index, "unit", e.target.value)
                }
                style={{
                  width: "80px",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "#fff",
                }}
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(index, "rate", e.target.value)
                }
                style={{
                  width: "100px",
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  color: "#333",
                  backgroundColor: "#fff",
                }}
                step="0.01"
              />
              {itemsList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItemRow}
            style={{
              marginTop: 10,
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Add Item
          </button>
        </div>

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
          {loading ? "Creating..." : "Create Sales Receipt"}
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

export default SalesReceiptForm;
