import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateDeptPanel from "../components/CreateDeptPanel";
import ExpensesList from "../components/ExpensesList";
import SalesReceiptList from "../components/salesReceiptList";
import AccountsList from "../components/AccountsList";
import { useDeptStore } from "../store/deptStore";
import { useOrgStore } from "../store/orgStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import ItemsList from "../components/ItemsList";
import SideNavBar from "../components/SideNavBar";
import { getEmployeesByOrgApi } from "../api/employeeApi";
import { getExpensesByOrgApi } from "../api/expenseApi";
import { getSalesReceiptsByOrgApi } from "../api/salesReceiptApi";

const OrgDashboard = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { user } = useAuthStore();
  const { setActiveOrg, orgName: storeOrgName, orgData } = useOrgStore();
  const orgName = storeOrgName ?? orgData?.find((o) => o._id === orgId)?.name ?? "Organization";
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({
    totalEmployees: null,
    totalExpenses: null,
    totalSales: null,
    loading: false,
  });
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

  useEffect(() => {
    if (!orgId || activeTab !== "Dashboard") return;
    let cancelled = false;
    setStats((s) => ({ ...s, loading: true }));
    const toArray = (res) => {
      if (!res) return [];
      if (Array.isArray(res)) return res;
      const data = res?.data ?? res;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.result)) return data.result;
      return [];
    };
    (async () => {
      const next = { loading: false };
      try {
        const [employeesRes, expensesRes, salesRes] = await Promise.all([
          getEmployeesByOrgApi(orgId),
          getExpensesByOrgApi({ orgId }),
          getSalesReceiptsByOrgApi({ orgId }),
        ]);
        if (cancelled) return;
        const employees = toArray(employeesRes);
        const expenses = toArray(expensesRes);
        const sales = toArray(salesRes);
        next.totalEmployees = employees.length;
        next.totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        next.totalSales = sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
      } catch (err) {
        if (!cancelled) {
          next.totalEmployees = 0;
          next.totalExpenses = 0;
          next.totalSales = 0;
        }
      }
      if (!cancelled) setStats((s) => ({ ...s, ...next }));
    })();
    return () => { cancelled = true; };
  }, [orgId, activeTab]);

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
    <div className="w-full min-h-screen bg-slate-50 flex flex-row">
      <SideNavBar activeTab={activeTab} onTabSelect={(tab) => setActiveTab(tab)} />
      <div className="flex flex-col flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-slate-900">{orgName}</h1>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 cursor-default"
                title={user?.name ?? "User"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === "Dashboard" && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Overview</h2>
                {stats.loading ? (
                  <p className="text-slate-500 text-sm">Loading stats...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total employees</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalEmployees ?? "—"}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total expenses</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalExpenses != null ? `₹${Number(stats.totalExpenses).toLocaleString()}` : "—"}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total sales</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalSales != null ? `₹${Number(stats.totalSales).toLocaleString()}` : "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Departments" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Departments</h2>
                  <button
                    onClick={() => setDeptPanel(!deptPanel)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    {deptPanel ? "Cancel" : "Create Department"}
                  </button>
                </div>

                {deptPanel && (
                  <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <CreateDeptPanel orgId={orgId} panelStatus={setDeptPanel} />
                  </div>
                )}

                {deptList && deptList.length > 0 ? (
                  <div className="space-y-3">
                    {deptList.map((element) => (
                      <div
                        key={element._id}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex flex-row gap-3 items-center">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
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
                                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
                                  autoFocus
                                />
                              ) : (
                                <h3 className="text-base font-semibold text-slate-900">
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/deptDashboard/${element._id}`)}
                                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer text-left"
                                  >
                                    {element.name}
                                  </button>
                                </h3>
                              )}
                              <p className="text-sm text-slate-500 mt-0.5">Employee count: {element.employeeCount}</p>
                              {element.createdByUser?.name && (
                                <p className="text-xs text-slate-400 mt-1">Created by {element.createdByUser.name}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditMode(true);
                                setEditDeptDetails({ id: element._id, name: element.name });
                              }}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(element._id)}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-600 font-medium">No departments yet</p>
                    <p className="text-slate-400 text-sm mt-1">Create your first department to get started</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Expenses" && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Expenses</h2>
                <ExpensesList orgId={orgId} />
              </div>
            )}

            {activeTab === "Sales" && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Sales</h2>
                <SalesReceiptList orgId={orgId} />
              </div>
            )}

            {activeTab === "Accounts" && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Accounts</h2>
                <AccountsList orgId={orgId} />
              </div>
            )}

            {activeTab === "Products" && (
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Products</h2>
                <ItemsList orgId={orgId} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrgDashboard;
