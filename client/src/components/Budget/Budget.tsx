import { useEffect, useState, useContext } from "react";
import { fetchBudget } from "../../utils/budget-utils";
import { AppContext } from "../../context/AppContext";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);
  const [newBudget, setNewBudget] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadExpenses();
    }, []);
  
    // Function to load expenses and handle errors
    const loadExpenses = async () => {
    try {
      const fetchedBudget = await fetchBudget();
      setBudget(fetchedBudget);
    } catch (err: any) {
      console.log(err.message);
    }
    };


  const saveBudget = () => {
    if (newBudget !== null) {
      setBudget(newBudget);
      setIsEditing(false);
    }
  };

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      {isEditing ? (
        <>
          <input
            type="number"
            value={newBudget ?? budget}
            onChange={(e) => setNewBudget(parseFloat(e.target.value))}
          />
          <button onClick={saveBudget} className="btn btn-success btn-sm mx-2">
            Save
          </button>
        </>
      ) : (
        <>
          <div data-testid="budget">Budget: ${budget}</div>
          <button onClick={() => { setIsEditing(true); setNewBudget(budget); }} className="btn btn-primary btn-sm mx-2">
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default Budget;
