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

  console.log("The expenses are: ", expenses);

  return (
    <React.Fragment>
      <h1>Expenses</h1>
      <button onClick={handleCreateExpense}>Create expense</button>
      {showExpenseModal && (
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
            <h2>Create Expense</h2>
            <ExpenseForm orgId={orgId} setShowForm={setShowExpenseModal} />
          </div>
        </div>
      )}
      {loading && <p>Loading expenses...</p>}
      {expenses && expenses.length > 0 && (
        <div>
          <h2>Expenses List</h2>
          <ul>
            {expenses.map((expense) => (
              <li key={expense._id}>
                <p className="text-black">Amount: {expense.amount}</p>
                <p className="text-black">
                  Category: {expense.category?.name || "N/A"}
                </p>
                <p className="text-black">
                  Date: {new Date(expense.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};

export default ExpensesList;
