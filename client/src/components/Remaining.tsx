import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Remaining = () => {
  const { expenses, budget } = useContext(AppContext);

  const totalExpenses = expenses.reduce((total, item) => {
    return (total = total + item.cost);
  }, 0);

  const remainingBudget = budget - totalExpenses;
  const alertType = remainingBudget < 0 ? "alert-danger" : "alert-success";

  // Exercise: Create an alert when Remaining is less than 0.

  //Use useEffect to only show alert when remainingBudget changes
  useEffect(() => {
    if (remainingBudget < 0) {
      alert("You have exceeded your budget!");
    }
  }, [remainingBudget]);

  return (
    <div className={`alert ${alertType}`}>
      <span data-testid="remaining">Remaining: ${remainingBudget}</span>
    </div>
  );
};

export default Remaining;
