import React, { useRef } from "react";
import { useOrgStore } from "../store/orgStore";
import { useAuthStore } from "../store/authStore";

const CreateOrgPanel = ({ panelStatus }) => {
  const { createOrg } = useOrgStore();
  const { user } = useAuthStore();

  const orgNameRef = useRef();

  const HandleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      await createOrg({
        name: orgNameRef.current.value,
        owner: user.userId,
      });
    } catch (err) {
      console.log(err);
    }
    panelStatus(false);
  };

  return (
    <div className="content-center">
      <form onSubmit={HandleCreateOrg}>
        <input ref={orgNameRef} placeholder="Enter org name"></input>
        <button type="submit">Create Org</button>
      </form>
    </div>
  );
};

export default CreateOrgPanel;
