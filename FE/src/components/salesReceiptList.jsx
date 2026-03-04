import React, { useEffect, useState } from "react";
import { useSalesReceiptStore } from "../store/salesReceiptStore";
import { useAccountStore } from "../store/accountStore";
import { useCategoryStore } from "../store/categoryStore";
import SalesReceiptForm from "./forms/SalesReceiptForm";

const contactDisplay = (contact) => {
  if (!contact) return "—";
  if (typeof contact === "object") {
    const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
    return name || "—";
  }
  return "—";
};

const SalesReceiptDetailView = ({ receipt, onBack }) => {
  const hasItems = receipt.items && receipt.items.length > 0;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to sales receipts
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl font-semibold text-emerald-600">₹</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold text-slate-900">₹{Number(receipt.amount).toLocaleString()}</h3>
            <p className="text-sm text-slate-500 mt-0.5">Sales receipt</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  receipt.status === "finalized" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {receipt.status ?? "—"}
              </span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Category</dt>
            <dd className="mt-1 text-sm text-slate-900">{receipt.categoryId?.name ?? receipt.categoryId ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Account</dt>
            <dd className="mt-1 text-sm text-slate-900">{receipt.accountId?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date received</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {receipt.dateReceived ? new Date(receipt.dateReceived).toLocaleDateString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment method</dt>
            <dd className="mt-1 text-sm text-slate-900 capitalize">{receipt.paymentMethod ?? "—"}</dd>
          </div>
          {receipt.contactId && (
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</dt>
              <dd className="mt-1 text-sm text-slate-900">{contactDisplay(receipt.contactId)}</dd>
            </div>
          )}
          {receipt.season && (
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Season</dt>
              <dd className="mt-1 text-sm text-slate-900">{receipt.season}</dd>
            </div>
          )}
          {receipt.batchId && (
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Batch ID</dt>
              <dd className="mt-1 text-sm text-slate-900">{receipt.batchId}</dd>
            </div>
          )}
          {receipt.createdAt && (
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created at</dt>
              <dd className="mt-1 text-sm text-slate-500">{new Date(receipt.createdAt).toLocaleString()}</dd>
            </div>
          )}
        </dl>

        {receipt.notes && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</dt>
            <dd className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{receipt.notes}</dd>
          </div>
        )}

        {receipt.receiptUrl && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Receipt / attachment</dt>
            <dd className="mt-1">
              <a
                href={receipt.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Open link
              </a>
            </dd>
          </div>
        )}

        {hasItems && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Line items</h4>
            <ul className="space-y-2">
              {receipt.items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm text-slate-700">
                  <span>{item.itemId?.name ?? "Item"}</span>
                  <span>
                    {item.quantity} {item.unit ?? "kg"} @ ₹{item.rate != null ? Number(item.rate).toLocaleString() : "—"} = ₹
                    {item.amount != null ? Number(item.amount).toLocaleString() : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const SalesReceiptList = ({ orgId }) => {
  const { getSalesReceiptsByOrg, salesReceipts, loading } = useSalesReceiptStore();
  const { getAccounts, accounts } = useAccountStore();
  const { getCategories, categories } = useCategoryStore();
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [filters, setFilters] = useState({
    accountId: "",
    categoryId: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (orgId) {
      getAccounts({ orgId }).catch(console.error);
      getCategories({ orgId }).catch(console.error);
    }
  }, [orgId, getAccounts, getCategories]);

  useEffect(() => {
    if (!orgId) return;
    const queryParams = {};
    if (filters.accountId) queryParams.accountId = filters.accountId;
    if (filters.categoryId) queryParams.categoryId = filters.categoryId;
    if (filters.fromDate) queryParams.fromDate = filters.fromDate;
    if (filters.toDate) queryParams.toDate = filters.toDate;
    getSalesReceiptsByOrg({ orgId, queryParams }).catch(console.error);
  }, [orgId, filters.accountId, filters.categoryId, filters.fromDate, filters.toDate]);

  const incomeCategories = (categories ?? []).filter((c) => c.type === "income");
  const hasActiveFilters = filters.accountId || filters.categoryId || filters.fromDate || filters.toDate;

  const handleClearFilters = () => {
    setFilters({ accountId: "", categoryId: "", fromDate: "", toDate: "" });
  };

  const handleCreateReceipt = () => {
    setShowReceiptModal(true);
  };

  if (selectedReceipt) {
    return (
      <div>
        <SalesReceiptDetailView receipt={selectedReceipt} onBack={() => setSelectedReceipt(null)} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Sales Receipts</h2>
        <button
          type="button"
          onClick={handleCreateReceipt}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Create Sales Receipt
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-3">Filters</p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[140px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Account</label>
            <select
              value={filters.accountId}
              onChange={(e) => setFilters((f) => ({ ...f, accountId: e.target.value }))}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All accounts</option>
              {(accounts ?? []).map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All categories</option>
              {incomeCategories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">From date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
              className="block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">To date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
              className="block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {showReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Create Sales Receipt</h3>
              <SalesReceiptForm orgId={orgId} setShowForm={setShowReceiptModal} />
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-slate-500 text-sm py-4">Loading sales receipts...</p>}

      {!loading && salesReceipts && salesReceipts.length > 0 && (
        <div className="space-y-4">
          {salesReceipts.map((receipt) => (
            <div
              key={receipt._id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedReceipt(receipt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedReceipt(receipt);
                }
              }}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-row flex-wrap justify-between gap-4 hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-emerald-600">₹</span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <p className="text-lg font-semibold text-slate-900">₹{receipt.amount?.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Category: {receipt.categoryId?.name ?? "—"}</p>
                  <p className="text-sm text-slate-600">Account: {receipt.accountId?.name ?? "—"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 capitalize">{receipt.paymentMethod}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        receipt.status === "finalized" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {receipt.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col text-right text-sm text-slate-600">
                <p>
                  {receipt.dateReceived ? new Date(receipt.dateReceived).toLocaleDateString() : "—"}
                </p>
                {receipt.contactId && <p>Contact: {contactDisplay(receipt.contactId)}</p>}
                {receipt.season && <p className="text-slate-500">Season: {receipt.season}</p>}
                {receipt.notes && <p className="text-slate-500 mt-1 truncate max-w-[200px]">{receipt.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (!salesReceipts || salesReceipts.length === 0) && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-slate-600">No sales receipts found.</p>
          <p className="text-sm text-slate-400 mt-1">Create your first sales receipt to get started.</p>
        </div>
      )}
    </div>
  );
};

export default SalesReceiptList;
