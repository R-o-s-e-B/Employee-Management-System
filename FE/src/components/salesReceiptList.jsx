import React, { useEffect, useState } from "react";
import { useSalesReceiptStore } from "../store/salesReceiptStore";
import SalesReceiptForm from "./forms/SalesReceiptForm";

const contactDisplay = (contactId) => {
  if (!contactId) return "—";
  if (typeof contactId === "object") {
    const name = [contactId.firstName, contactId.lastName]
      .filter(Boolean)
      .join(" ");
    return name || "—";
  }
  return "—";
};

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Sales Receipts
        </h2>
        <button
          type="button"
          onClick={handleCreateReceipt}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Create Sales Receipt
        </button>
      </div>

      {showReceiptModal && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Create Sales Receipt
              </h3>
              <SalesReceiptForm
                orgId={orgId}
                setShowForm={setShowReceiptModal}
              />
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-gray-500 text-sm py-4">
          Loading sales receipts...
        </p>
      )}

      {!loading && salesReceipts && salesReceipts.length > 0 && (
        <div className="space-y-4">
          {salesReceipts.map((receipt) => (
            <div
              key={receipt._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-row flex-wrap justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-green-600">
                    ₹
                  </span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{receipt.amount?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {receipt.categoryId?.name ?? "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Account: {receipt.accountId?.name ?? "—"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {receipt.paymentMethod}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        receipt.status === "finalized"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {receipt.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-right text-sm text-gray-600">
                <p>
                  Date:{" "}
                  {receipt.dateReceived
                    ? new Date(receipt.dateReceived).toLocaleDateString()
                    : "—"}
                </p>
                {receipt.contactId && (
                  <p>Contact: {contactDisplay(receipt.contactId)}</p>
                )}
                {receipt.season && (
                  <p className="text-gray-500">Season: {receipt.season}</p>
                )}
                {receipt.notes && (
                  <p className="text-gray-500 mt-1 truncate max-w-[200px]">
                    {receipt.notes}
                  </p>
                )}
              </div>
              {receipt.items && receipt.items.length > 0 && (
                <div className="w-full mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Line items
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {receipt.items.map((item, idx) => (
                      <li key={idx}>
                        {item.itemId?.name ?? "Item"} — {item.quantity}{" "}
                        {item.unit ?? "kg"} @ ₹{item.rate} = ₹
                        {item.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && (!salesReceipts || salesReceipts.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No sales receipts found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first sales receipt to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalesReceiptList;
