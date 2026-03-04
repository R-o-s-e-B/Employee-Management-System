import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import CreateOrgPanel from "../components/CreateOrgPanel";
import { useOrgStore } from "../store/orgStore";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getAllOrgs, orgData, deleteOrg } = useOrgStore();
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

  const isUserAdmin = () => user?.role === "admin";

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteOrg({ orgId: id });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Welcome back, {user?.name ?? "User"}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                    {user?.role ?? "—"}
                  </span>
                </p>
              </div>
            </div>
            {isUserAdmin() && (
              <button
                onClick={() => setOrgPanel(!OrgPanel)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {OrgPanel ? "Cancel" : "Create Organization"}
              </button>
            )}
          </div>
        </header>

        {OrgPanel && isUserAdmin() && (
          <div className="mb-6 p-5 bg-white rounded-xl border border-slate-200">
            <CreateOrgPanel panelStatus={setOrgPanel} />
          </div>
        )}

        {/* Organizations */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Organizations</h2>
          {orgData && orgData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orgData.map((element) => (
                <div
                  key={element._id}
                  onClick={() => navigate(`/orgDashboard/${element._id}`)}
                  className="bg-white rounded-xl border border-slate-200 hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                          <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {element.name}
                          </h3>
                          {element.description && (
                            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{element.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isUserAdmin() && (
                          <button
                            onClick={(e) => handleDelete(e, element._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-slate-900">No organizations</h3>
              <p className="mt-2 text-sm text-slate-500">
                {isUserAdmin()
                  ? "Create your first organization to manage teams and expenses."
                  : "You don't have access to any organizations yet."}
              </p>
              {isUserAdmin() && (
                <button
                  onClick={() => setOrgPanel(true)}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Organization
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
