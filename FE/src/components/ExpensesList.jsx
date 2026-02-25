import React, { useEffect, useState } from "react";
import { useExpenseStore } from "../store/expenseStore";
import ExpenseForm from "./forms/ExpenseForm";

const ExpensesList = ({ orgId }) => {
  const { getExpensesByOrg, expenses, loading } = useExpenseStore();
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    const getAllExpenses = async () => {
      try {
        await getExpensesByOrg({ orgId });
      } catch (err) {
        console.log(err);
      }
    };

    if (orgId) {
      getAllExpenses();
    }
  }, [orgId]);

  const handleCreateExpense = () => {
    setShowExpenseModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
        <button
          type="button"
          onClick={handleCreateExpense}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Create expense
        </button>
      </div>

      {showExpenseModal && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Create Expense
              </h3>
              <ExpenseForm orgId={orgId} setShowForm={setShowExpenseModal} />
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-gray-500 text-sm py-4">Loading expenses...</p>
      )}

      {!loading && expenses && expenses.length > 0 && (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-row flex-wrap justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-gray-500">
                    ₹
                  </span>
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{expense.amount?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {expense.category?.name ?? "—"}
                  </p>
                  {expense.paymentMethod && (
                    <p className="text-xs text-gray-500 capitalize mt-1">
                      {expense.paymentMethod}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col text-right text-sm text-gray-600">
                <p>Account: {expense.accountId?.name ?? "—"}</p>
                <p>
                  Date:{" "}
                  {expense.date
                    ? new Date(expense.date).toLocaleDateString()
                    : "—"}
                </p>
                {expense.notes && (
                  <p className="text-gray-500 mt-1 truncate max-w-[200px]">
                    {expense.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (!expenses || expenses.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No expenses found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first expense to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesList;
