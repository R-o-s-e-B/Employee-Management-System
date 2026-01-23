import React, { useState, useEffect, useRef } from "react";
import FormInput from "./FormInput";
import { useEmployeeStore } from "../../store/employeeStore";
import { useOrgStore } from "../../store/orgStore";
import { usePositionStore } from "../../store/positionStore";

const EmployeeForm = ({ deptId }) => {
  const { createEmployee } = useEmployeeStore();
  const { positions, getPositions, createPosition } = usePositionStore();
  const inputTypes = {
    text: "text",
    dropdown: "dropdown",
  };
  const { orgId } = useOrgStore();
  const positionRef = useRef();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    phone: "",
  });

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
      name: "position",
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

  const addPosition = async () => {
    try {
      await createPosition({ name: positionRef.current.value, orgId: orgId });
    } catch (err) {
      console.log("Error creating position: ", err);
    }
  };

  return (
    <div>
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
