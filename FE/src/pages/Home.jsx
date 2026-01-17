import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import CreateOrgPanel from "../components/CreateOrgPanel";
import { useOrgStore } from "../store/orgStore";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { orgName, getAllOrgs, orgData, deleteOrg } = useOrgStore();
  const [OrgPanel, setOrgPanel] = useState(false);

  useEffect(() => {
    async function allOrgs() {
      try {
        await getAllOrgs({ userId: user.userId });
      } catch (err) {
        console.log(err);
      }
    }
    allOrgs();
  }, [user]);

  const isUserAdmin = () => {
    if (user.role === "admin") {
      return true;
    }
    return false;
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrg({ orgId: id });
    } catch (err) {
      console.log(err);
    }
  };
  const OpenCreateOrgPanel = () => {
    setOrgPanel(!OrgPanel);
  };

  return (
    <React.Fragment>
      <h5>Home</h5>
      <p>{`User logged in: ${user.name}`}</p>
      <p>{`User role is: ${user.role}`}</p>
      <p>{`Organization name: ${orgName}`}</p>
      {isUserAdmin && (
        <>
          <button onClick={OpenCreateOrgPanel}>Create Organization</button>
          <div className={`${OrgPanel ? "visible" : "hidden"}`}>
            <CreateOrgPanel panelStatus={setOrgPanel} />
          </div>
        </>
      )}

      <h5>Orgs</h5>
      <div className="flex flex-col">
        {orgData ? (
          orgData.map((element) => {
            return (
              <p
                onClick={() => navigate(`/orgDashboard/${element._id}`)}
                key={element._id}
              >
                {element.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(element._id);
                  }}
                >
                  Delete org
                </button>
              </p>
            );
          })
        ) : (
          <p>No orgs found</p>
        )}
      </div>
    </React.Fragment>
  );
};

export default Home;
