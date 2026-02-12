import React, { useEffect, useState } from "react";
import { useSalesReceiptStore } from "../store/salesReceiptStore";
import SalesReceiptForm from "./forms/SalesReceiptForm";

const SalesReceiptList = ({ orgId }) => {
  const { getSalesReceiptsByOrg, salesReceipts, loading } =
    useSalesReceiptStore();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    const getAllSalesReceipts = async () => {
      try {
        await getSalesReceiptsByOrg({ orgId });
      } catch (err) {
        console.log(err);
      }
    };

    if (orgId) {
      getAllSalesReceipts();
    }
  }, [orgId]);

  const handleCreateReceipt = () => {
    setShowReceiptModal(true);
  };

  console.log("The sales receipts are: ", salesReceipts);

  return (
    <React.Fragment>
      <h1>Sales Receipts</h1>
      <button onClick={handleCreateReceipt}>Create Sales Receipt</button>
      {showReceiptModal && (
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
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h2>Create Sales Receipt</h2>
            <SalesReceiptForm orgId={orgId} setShowForm={setShowReceiptModal} />
          </div>
        </div>
      )}
      {loading && <p>Loading sales receipts...</p>}
      {salesReceipts && salesReceipts.length > 0 && (
        <div>
          <h2>Sales Receipts List</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {salesReceipts.map((receipt) => (
              <li
                key={receipt._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                <p>
                  <strong>Amount:</strong> ₹{receipt.amount}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {receipt.categoryId?.name || "N/A"}
                </p>
                <p>
                  <strong>Account:</strong>{" "}
                  {receipt.accountId?.name || "N/A"}
                </p>
                <p>
                  <strong>Payment Method:</strong> {receipt.paymentMethod}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(receipt.dateReceived).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {receipt.status}
                </p>
                {receipt.items && receipt.items.length > 0 && (
                  <div>
                    <strong>Items:</strong>
                    <ul>
                      {receipt.items.map((item, idx) => (
                        <li key={idx}>
                          {item.itemId?.name || "Item"} - Qty: {item.quantity}{" "}
                          {item.unit} @ ₹{item.rate} = ₹{item.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {receipt.contactId && (
                  <p>
                    <strong>Contact:</strong> {receipt.contactId?.name || "N/A"}
                  </p>
                )}
                {receipt.season && (
                  <p>
                    <strong>Season:</strong> {receipt.season}
                  </p>
                )}
                {receipt.notes && (
                  <p>
                    <strong>Notes:</strong> {receipt.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {salesReceipts && salesReceipts.length === 0 && !loading && (
        <p>No sales receipts found.</p>
      )}
    </React.Fragment>
  );
};

export default SalesReceiptList;
