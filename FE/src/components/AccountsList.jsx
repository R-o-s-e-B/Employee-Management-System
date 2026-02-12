import React, { useEffect, useState } from "react";
import { useAccountStore } from "../store/accountStore";
import AccountForm from "./forms/AccountForm";

const AccountsList = ({ orgId }) => {
  const { getAccounts, accounts, loading } = useAccountStore();
  const [showAccountModal, setShowAccountModal] = useState(false);

  useEffect(() => {
    const getAllAccounts = async () => {
      try {
        await getAccounts({ orgId });
      } catch (err) {
        console.log(err);
      }
    };

    if (orgId) {
      getAllAccounts();
    }
  }, [orgId]);

  const handleCreateAccount = () => {
    setShowAccountModal(true);
  };

  console.log("The accounts are: ", accounts);

  return (
    <React.Fragment>
      <h1>Accounts</h1>
      <button onClick={handleCreateAccount}>Create Account</button>
      {showAccountModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h2>Create Account</h2>
            <AccountForm orgId={orgId} setShowForm={setShowAccountModal} />
          </div>
        </div>
      )}
      {loading && <p>Loading accounts...</p>}
      {accounts && accounts.length > 0 && (
        <div>
          <h2>Accounts List</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {accounts.map((account) => (
              <li
                key={account._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <p>
                  <strong>Name:</strong> {account.name}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(account.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {accounts && accounts.length === 0 && !loading && (
        <p>No accounts found.</p>
      )}
    </React.Fragment>
  );
};

export default AccountsList;
