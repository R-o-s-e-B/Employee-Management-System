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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Home</h1>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Logged in as
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {user.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                </dd>
              </div>
              {orgName && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Active Organization
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {orgName}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Organization Section */}
        {isUserAdmin() && (
          <div className="mb-6">
            <button
              onClick={OpenCreateOrgPanel}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Organization
            </button>
            {OrgPanel && (
              <div className="mt-4 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <CreateOrgPanel panelStatus={setOrgPanel} />
              </div>
            )}
          </div>
        )}

        {/* Organizations Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Organizations
          </h2>
          {orgData && orgData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgData.map((element) => {
                return (
                  <div
                    key={element._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`/orgDashboard/${element._id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {element.name}
                          </h3>
                          {element.description && (
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {element.description}
                            </p>
                          )}
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(element._id);
                          }}
                          className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No organizations
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isUserAdmin()
                  ? "Get started by creating a new organization."
                  : "You don't have access to any organizations."}
              </p>
              {isUserAdmin() && (
                <div className="mt-6">
                  <button
                    onClick={OpenCreateOrgPanel}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Organization
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
