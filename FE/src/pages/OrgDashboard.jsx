import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateDeptPanel from "../components/CreateDeptPanel";
import ExpensesList from "../components/ExpensesList";
import SalesReceiptList from "../components/salesReceiptList";
import AccountsList from "../components/AccountsList";
import { useDeptStore } from "../store/deptStore";
import { useOrgStore } from "../store/orgStore";
import { useNavigate } from "react-router-dom";
import ItemsList from "../components/ItemsList";
import SideNavBar from "../components/SideNavBar";

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
    <div className="w-full h-screen bg-white flex flex-row flex-start items-start">
      <SideNavBar onTabSelect={(tab) => setActiveTab(tab)} />
      <div className="flex flex-col w-full">
        <div className="left-[9%] bg-white shadow-xl h-22 flex justify-end items-center px-4 w-full">
          <div className="flex flex-row p-2">
            <div className="rounded-full bg-gray-300 w-12 h-12"></div>
          </div>
        </div>
        <div className="w-full mx-auto items-start">
          {/* Header */}
          <div className="mb-8 w-full items-start">
            <h4 className="m-4 text-3xl font-bold text-gray-900 mb-2 text-start">
              Organization Name
            </h4>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === "Departments" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Departments
                  </h2>
                  <button
                    onClick={() => setDeptPanel(!deptPanel)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {deptPanel ? "Cancel" : "Create Department"}
                  </button>
                </div>

                {deptPanel && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <CreateDeptPanel orgId={orgId} panelStatus={setDeptPanel} />
                  </div>
                )}

                {deptList && deptList.length > 0 ? (
                  <div className="flex flex-col">
                    {deptList.map((element) => (
                      <div
                        key={element._id}
                        className="border  border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row gap-2">
                            <div className="bg-gray-300 h-10 w-10"></div>
                            <div className="flex flex-col justify-start items-start">
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
                                      handleEdit(
                                        editDeptDetails.id,
                                        editDeptDetails.name,
                                      );
                                      setEditMode(false);
                                    }
                                  }}
                                  className="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 items-start"
                                  autoFocus
                                />
                              ) : (
                                <h3 className="text-lg font-semibold text-gray-900">
                                  <a
                                    onClick={() =>
                                      navigate(`/deptDashboard/${element._id}`)
                                    }
                                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                  >
                                    {element.name}
                                  </a>
                                </h3>
                              )}
                              <p className="text-black">
                                Employee count: {element.employeeCount}
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="text-black">
                              Created by {element.createdByUser.name}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => {
                                  setEditMode(true);
                                  setEditDeptDetails({
                                    id: element._id,
                                    name: element.name,
                                  });
                                }}
                                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  handleDelete(element._id);
                                }}
                                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No departments found
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Create your first department to get started
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Expenses" && (
              <div className="p-6">
                <ExpensesList orgId={orgId} />
              </div>
            )}

            {activeTab === "Sales" && (
              <div className="p-6">
                <SalesReceiptList orgId={orgId} />
              </div>
            )}

            {activeTab === "Accounts" && (
              <div className="p-6">
                <AccountsList orgId={orgId} />
              </div>
            )}

            {activeTab === "Products" && (
              <div className="p-6">
                <ItemsList orgId={orgId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;
