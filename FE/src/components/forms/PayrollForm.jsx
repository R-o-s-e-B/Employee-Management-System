import React, { useRef, useState } from "react";
import FormInput from "./FormInput";
import { useEmployeeStore } from "../../store/employeeStore";

const PayrollForm = ({ employeeId }) => {
  const { updateEmployeePayroll } = useEmployeeStore();
  const [errors, setErrors] = useState({
    baseSalary: "",
    method: "",
  });
  const inputTypes = {
    text: "text",
    dropdown: "dropdown",
    date: "date",
  };

  const [formData, setFormData] = useState({
    baseSalary: "",
    datePaid: null,
    bonuses: "",
    deductions: "",
    method: null,
  });

  const paymentMethods = ["bank_transfer", "cash", "check"];

  const resetForm = () => {
    setFormData({
      baseSalary: "",
      datePaid: null,
      bonuses: "",
      deductions: "",
      method: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fields = [
    { name: "baseSalary", placeholder: "Base salary", type: inputTypes.text },
    { name: "datePaid", placeholder: "Date paid", type: inputTypes.date },
    { name: "bonuses", placeholder: "Bonus Amount", type: inputTypes.text },
    { name: "deductions", placeholder: "Deductions", type: inputTypes.text },
    {
      name: "method",
      placeholder: "Method",
      type: inputTypes.dropdown,
      options: paymentMethods.map((method) => ({
        label: method,
        value: method,
      })),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput) return;
    try {
      console.log("Employee form details", formData);
      await updateEmployeePayroll({ ...formData, employeeId: employeeId });
      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  const validateInput = () => {
    const newErrors = {};
    if (!formData.baseSalary.trim()) {
      newErrors.baseSalary = "Base salary amount is required";
    }
    if (!formData.method) {
      newErrors.method = "Please select payment method";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <FormInput
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            type={field.type}
            onChange={handleChange}
            options={field.type == "dropdown" ? field.options : null}
          ></FormInput>
          {errors[field?.name] && (
            <span style={{ color: "red" }}>{errors[field?.name]}</span>
          )}
        </div>
      ))}
      <button type="submit">Add payroll</button>
    </form>
  );
};

export default PayrollForm;
