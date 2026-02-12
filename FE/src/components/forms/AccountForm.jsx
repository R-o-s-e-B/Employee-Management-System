import React, { useState } from "react";
import FormInput from "./FormInput";
import { useAccountStore } from "../../store/accountStore";
import { useOrgStore } from "../../store/orgStore";

const AccountForm = ({ orgId, setShowForm }) => {
  const { createAccount, loading } = useAccountStore();
  const { orgId: orgIdFromStore } = useOrgStore();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
    });
    setErrors({});
  };

  const validateAccount = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Account name is required";
    }

    if (!orgId && !orgIdFromStore) {
      newErrors.org = "Organization not loaded";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccount()) return;

    const dataToSubmit = {
      orgId: orgId || orgIdFromStore,
      name: formData.name.trim(),
    };

    try {
      await createAccount(dataToSubmit);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.log("Error creating account: ", err);
    }
  };

  const fields = [
    {
      name: "name",
      placeholder: "Account Name",
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
          {loading ? "Creating..." : "Create Account"}
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

export default AccountForm;
