import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateDeptPanel from "../components/CreateDeptPanel";
import ExpensesList from "../components/ExpensesList";
import SalesReceiptList from "../components/salesReceiptList";
import AccountsList from "../components/AccountsList";
import { useDeptStore } from "../store/deptStore";
import { useOrgStore } from "../store/orgStore";
import { useNavigate } from "react-router-dom";

const OrgDashboard = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { setActiveOrg } = useOrgStore();
  const [activeTab, setActiveTab] = useState("department");
  const [deptPanel, setDeptPanel] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDeptDetails, setEditDeptDetails] = useState({
    id: null,
    name: null,
  });
  const { deptList, getAllDepts, deleteDept, editDept } = useDeptStore();

  useEffect(() => {
    if (orgId) {
      setActiveOrg(orgId);
    }
  }, [orgId, setActiveOrg]);

  useEffect(() => {
    async function getDepts() {
      try {
        await getAllDepts({ orgId: orgId });
      } catch (err) {
        throw err;
      }
    }
    getDepts();
  }, [orgId]);

  const handleDelete = async (id) => {
    try {
      await deleteDept({ deptId: id });
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = async (id, name) => {
    try {
      await editDept({ deptId: id, name: name });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <p> {`This is an org dashboard of id: ${orgId}`} </p>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          borderBottom: "2px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("department")}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: activeTab === "department" ? "#007bff" : "#f0f0f0",
            color: activeTab === "department" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "5px 5px 0 0",
          }}
        >
          Department
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: activeTab === "expenses" ? "#007bff" : "#f0f0f0",
            color: activeTab === "expenses" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "5px 5px 0 0",
          }}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab("salesReceipt")}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor:
              activeTab === "salesReceipt" ? "#007bff" : "#f0f0f0",
            color: activeTab === "salesReceipt" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "5px 5px 0 0",
          }}
        >
          Sales Receipt
        </button>
        <button
          onClick={() => setActiveTab("accounts")}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: activeTab === "accounts" ? "#007bff" : "#f0f0f0",
            color: activeTab === "accounts" ? "white" : "black",
            cursor: "pointer",
            borderRadius: "5px 5px 0 0",
          }}
        >
          Accounts
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "department" && (
        <div>
          <button onClick={() => setDeptPanel(!deptPanel)}>
            Create a dept
          </button>
          {deptPanel ? (
            <CreateDeptPanel orgId={orgId} panelStatus={setDeptPanel} />
          ) : null}

          {deptList ? (
            deptList.map((element) => {
              return (
                <p key={element._id}>
                  {editMode && editDeptDetails.id == element._id ? (
                    <input
                      type="text"
                      value={editDeptDetails.name}
                      onChange={(e) => {
                        setEditDeptDetails((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          handleEdit(editDeptDetails.id, editDeptDetails.name);
                          setEditMode(false);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <a onClick={() => navigate(`/deptDashboard/${element._id}`)}>
                      {element.name}
                    </a>
                  )}

                  <button
                    onClick={(e) => {
                      handleDelete(element._id);
                    }}
                  >
                    Delete department
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditDeptDetails({
                        id: element._id,
                        name: element.name,
                      });
                    }}
                  >
                    Edit dept name
                  </button>
                </p>
              );
            })
          ) : (
            <p>No depts found</p>
          )}
        </div>
      )}

      {activeTab === "expenses" && <ExpensesList orgId={orgId} />}

      {activeTab === "salesReceipt" && <SalesReceiptList orgId={orgId} />}

      {activeTab === "accounts" && <AccountsList orgId={orgId} />}
    </React.Fragment>
  );
};

export default OrgDashboard;
