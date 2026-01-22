import React, { useState } from "react";
import FormInput from "./FormInput";
import { useEmployeeStore } from "../../store/employeeStore";
import { useOrgStore } from "../../store/orgStore";

const EmployeeForm = ({ deptId }) => {
  const { createEmployee } = useEmployeeStore();
  const inputTypes = {
    text: "text",
    dropdown: "dropdown",
  };
  const { orgId } = useOrgStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    phone: "",
  });

  const fields = [
    { name: "firstName", placeholder: "First name", type: inputTypes.text },
    { name: "lastName", placeholder: "Last name", type: inputTypes.text },
    {
      name: "position",
      placeholder: "Position",
      type: "dropdown",
      options: [
        { label: "Developer", value: "dev" },
        { label: "Designer", value: "design" },
        { label: "Manager", value: "manager" },
      ],
    },
    { name: "phone", placeholder: "Phone", type: inputTypes.text },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const dataToSubmit = {
      ...formData,
      orgId: orgId,
      deptId: deptId,
    };
    try {
      await createEmployee(dataToSubmit);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      {fields.map((field) => (
        <FormInput
          name={field.name}
          key={field.name}
          type={field.type}
          placeholder={field.placeholder}
          onChange={handleChange}
          options={field.type == "dropdown" ? field.options : null}
        />
      ))}
      <button type="submit">Add employee</button>
    </form>
  );
};

export default EmployeeForm;
