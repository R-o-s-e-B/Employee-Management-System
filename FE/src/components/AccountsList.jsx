import React, { useEffect, useState } from "react";
import { useAccountStore } from "../store/accountStore";
import AccountForm from "./forms/AccountForm";
import { getExpensesByOrgApi } from "../api/expenseApi";
import { getSalesReceiptsByOrgApi } from "../api/salesReceiptApi";

const toArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  const data = res?.data ?? res;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const AccountDetailView = ({ account, orgId, onBack }) => {
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [expRes, salesRes] = await Promise.all([
          getExpensesByOrgApi({ orgId, accountId: account._id }),
          getSalesReceiptsByOrgApi({ orgId, queryParams: { accountId: account._id } }),
        ]);
        if (cancelled) return;
        setExpenses(toArray(expRes));
        setSales(toArray(salesRes));
      } catch (err) {
        if (!cancelled) {
          setExpenses([]);
          setSales([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orgId, account._id]);

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalSales = sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

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
        Back to accounts
      </button>

      {/* Account info card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl font-semibold text-indigo-600">
              {account.name?.charAt(0)?.toUpperCase() ?? "A"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900">{account.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">Account</p>
            {account.createdBy?.name && (
              <p className="text-sm text-slate-500 mt-1">Created by {account.createdBy.name}</p>
            )}
            <p className="text-xs text-slate-400 mt-0.5">
              Created at:{" "}
              {account.createdAt
                ? new Date(account.createdAt).toLocaleDateString()
                : account._id
                  ? new Date(parseInt(account._id.toString().slice(0, 8), 16) * 1000).toLocaleDateString()
                  : "—"}
            </p>
          </div>
        </div>
        {!loading && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total expenses</p>
              <p className="text-lg font-semibold text-slate-900 mt-0.5">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total sales</p>
              <p className="text-lg font-semibold text-slate-900 mt-0.5">₹{totalSales.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm py-4">Loading expenses and sales...</p>
      ) : (
        <>
          {/* Expenses for this account */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <h4 className="px-5 py-3 text-base font-semibold text-slate-800 border-b border-slate-200">Expenses</h4>
            <div className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <p className="px-5 py-6 text-sm text-slate-500">No expenses for this account.</p>
              ) : (
                expenses.map((expense) => (
                  <div key={expense._id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">₹{Number(expense.amount).toLocaleString()}</p>
                      <p className="text-sm text-slate-500">
                        {expense.category?.name ?? expense.category ?? "—"}
                        {expense.paymentMethod && ` · ${expense.paymentMethod}`}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {expense.date ? new Date(expense.date).toLocaleDateString() : "—"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sales for this account */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <h4 className="px-5 py-3 text-base font-semibold text-slate-800 border-b border-slate-200">Sales</h4>
            <div className="divide-y divide-slate-100">
              {sales.length === 0 ? (
                <p className="px-5 py-6 text-sm text-slate-500">No sales for this account.</p>
              ) : (
                sales.map((receipt) => (
                  <div key={receipt._id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">₹{Number(receipt.amount).toLocaleString()}</p>
                      <p className="text-sm text-slate-500">
                        {receipt.categoryId?.name ?? receipt.categoryId ?? "—"}
                        {receipt.paymentMethod && ` · ${receipt.paymentMethod}`}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500">
                      {receipt.dateReceived ? new Date(receipt.dateReceived).toLocaleDateString() : "—"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AccountsList = ({ orgId }) => {
  const { getAccounts, accounts, loading } = useAccountStore();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

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

  if (selectedAccount) {
    return (
      <div>
        <AccountDetailView
          account={selectedAccount}
          orgId={orgId}
          onBack={() => setSelectedAccount(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Accounts</h2>
        <button
          type="button"
          onClick={handleCreateAccount}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Create Account
        </button>
      </div>

      {showAccountModal && (
        <div className="fixed inset-0 bg-slate-900/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Create Account</h3>
              <AccountForm orgId={orgId} setShowForm={setShowAccountModal} />
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-slate-500 text-sm py-4">Loading accounts...</p>
      )}

      {!loading && accounts && accounts.length > 0 && (
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account._id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedAccount(account)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedAccount(account);
                }
              }}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-row flex-wrap justify-between gap-4 hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-indigo-600">
                    {account.name?.charAt(0)?.toUpperCase() ?? "A"}
                  </span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <p className="text-lg font-semibold text-slate-900">{account.name}</p>
                  <p className="text-sm text-slate-500">Account</p>
                </div>
              </div>
              <div className="flex flex-col text-right text-sm text-slate-600">
                {account.createdBy?.name && <p>Created by: {account.createdBy.name}</p>}
                <p>
                  Created at:{" "}
                  {account.createdAt
                    ? new Date(account.createdAt).toLocaleDateString()
                    : account._id
                      ? new Date(parseInt(account._id.toString().slice(0, 8), 16) * 1000).toLocaleDateString()
                      : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (!accounts || accounts.length === 0) && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-slate-600">No accounts found.</p>
          <p className="text-sm text-slate-400 mt-1">Create your first account to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AccountsList;
