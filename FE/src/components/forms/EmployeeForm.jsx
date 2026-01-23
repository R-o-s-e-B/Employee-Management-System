import React, { useState, useEffect, useRef } from "react";
import FormInput from "./FormInput";
import { useEmployeeStore } from "../../store/employeeStore";
import { useOrgStore } from "../../store/orgStore";
import { usePositionStore } from "../../store/positionStore";

const EmployeeForm = ({ deptId, setShowForm }) => {
  const { createEmployee } = useEmployeeStore();
  const { positions, getPositions, createPosition, deletePosition } =
    usePositionStore();
  const inputTypes = {
    text: "text",
    dropdown: "dropdown",
  };
  const { orgId } = useOrgStore();
  const positionRef = useRef();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    positionId: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      positionId: "",
      phone: "",
    });
    setErrors({});
  };

  useEffect(() => {
    const fetchPositions = async (orgId) => {
      console.log("Fetch positions called");
      try {
        await getPositions(orgId);
      } catch (err) {
        console.log("error fetching positions: ", err);
      }
    };
    if (orgId) fetchPositions(orgId);
  }, [orgId]);

  const fields = [
    { name: "firstName", placeholder: "First name", type: inputTypes.text },
    { name: "lastName", placeholder: "Last name", type: inputTypes.text },
    {
      name: "positionId",
      placeholder: "Position",
      type: "dropdown",
      options: positions.map((position) => ({
        label: position.name,
        value: position._id,
      })),
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
    e.preventDefault();
    if (!validateEmployee()) return;
    const dataToSubmit = {
      ...formData,
      orgId: orgId,
      deptId: deptId,
    };
    try {
      await createEmployee(dataToSubmit);
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const addPosition = async () => {
    const positionName = positionRef.current?.value?.trim();

    if (!positionName) {
      setErrors((prev) => ({
        ...prev,
        positionName: "Position name cannot be empty",
      }));
      return;
    }

    if (!orgId) {
      setErrors((prev) => ({
        ...prev,
        positionName: "Organization not loaded",
      }));
      return;
    }

    try {
      await createPosition({ name: positionName, orgId });
      positionRef.current.value = "";
    } catch (err) {
      console.log("Error creating position: ", err);
    }
  };

  const validateEmployee = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.positionId) {
      newErrors.positionId = "Position is required";
    }

    if (!orgId) {
      newErrors.org = "Organization not loaded";
    }

    if (!deptId) {
      newErrors.dept = "Department not loaded";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
              key={field.name}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              options={field.type == "dropdown" ? field.options : null}
            />
            {errors[field.name] && (
              <span style={{ color: "red" }}>{errors[field.name]}</span>
            )}
          </div>
        ))}
        <button type="submit">Add employee</button>
      </form>

      <input
        name={"newPosition"}
        type={inputTypes.text}
        placeholder={"Enter position"}
        ref={positionRef}
        onChange={(e) => (positionRef.current.value = e.target.value)}
      />
      <button onClick={addPosition}>Add new position</button>
    </div>
  );
};

export default EmployeeForm;
