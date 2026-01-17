import React, { useRef } from "react";
import { useDeptStore } from "../store/deptStore";

const CreateDeptPanel = ({ orgId }, panelStatus) => {
  const { createDept } = useDeptStore();
  const deptNameRef = useRef();

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      console.log("trying dept creation: ", deptNameRef.current.value);
      await createDept({
        orgId: orgId,
        name: deptNameRef.current.value,
      });
    } catch (err) {
      throw err;
    }
    panelStatus(false);
  };

  return (
    <div className="class-center">
      <form>
        <input ref={deptNameRef} placeholder="Enter Department name" />
        <button type="button" onClick={handleCreateDept}>
          Create department
        </button>
      </form>
    </div>
  );
};

export default CreateDeptPanel;
