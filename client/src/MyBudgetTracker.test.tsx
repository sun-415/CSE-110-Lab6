import { render, screen, fireEvent } from "@testing-library/react";
import { AppProvider } from "./context/AppContext";
import { MyBudgetTracker } from "./views/MyBudgetTracker";
import Budget from "./components/Budget/Budget";
import AddExpenseForm from "./components/Expense/AddExpenseForm";
import ExpenseItem from "./components/Expense/ExpenseItem";
import ExpenseList from "./components/Expense/ExpenseList";
import ExpenseTotal from "./components/Expense/ExpenseTotal";
import Remaining from "./components/Remaining";

//Create an expense, verify added to list, ensure total spent and remaining updates
test("Create an Expense", () => {
  render(<AppProvider><MyBudgetTracker /></AppProvider>);

  //Get elements for the input
  const nameInput = screen.getByPlaceholderText("Expense Name");
  const costInput = screen.getByPlaceholderText("Expense Cost");
  const saveButton = screen.getByText("Save");

  //Make sure they are displayed on the page
  expect(nameInput).toBeInTheDocument();
  expect(costInput).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();

  //Create the expense
  fireEvent.change(nameInput, { target: { value: "Movie" } });
  fireEvent.change(costInput, { target: { value: "20" } });
  fireEvent.click(saveButton);

  //Ensure new expense is added to the expense list
  const expenseName = screen.getByText("Movie");
  expect(expenseName).toBeInTheDocument();
  const expenseDeleteButton = screen.getByTestId("expense1");
  expect(expenseDeleteButton).toBeInTheDocument();

  //Ensure spent and remaining updates
  const spent = screen.getByTestId("spent");
  expect(spent).toHaveTextContent("20");
  const remaining = screen.getByTestId("remaining");
  expect(remaining).toHaveTextContent("980");
});



//Confirm deleted expense is removed, ensure total spent and remaining updates
test("Delete an Expense", () => {
  render(<AppProvider><MyBudgetTracker /></AppProvider>);

  //Create couple of expenses
  const nameInput = screen.getByPlaceholderText("Expense Name");
  const costInput = screen.getByPlaceholderText("Expense Cost");
  const saveButton = screen.getByText("Save");
  fireEvent.change(nameInput, { target: { value: "Movie" } });
  fireEvent.change(costInput, { target: { value: "20" } });
  fireEvent.click(saveButton);
  fireEvent.change(nameInput, { target: { value: "Entertainment" } });
  fireEvent.change(costInput, { target: { value: "50" } });
  fireEvent.click(saveButton);
  fireEvent.change(nameInput, { target: { value: "Shopping" } });
  fireEvent.change(costInput, { target: { value: "250" } });
  fireEvent.click(saveButton);

  //Ensure the expenses are displayed, and spent/remaining updates
  expect(screen.getByText("Movie")).toBeInTheDocument();
  expect(screen.getByText("Entertainment")).toBeInTheDocument();
  expect(screen.getByText("Shopping")).toBeInTheDocument();
  const spent = screen.getByTestId("spent");
  expect(spent).toHaveTextContent("320");
  const remaining = screen.getByTestId("remaining");
  expect(remaining).toHaveTextContent("680");
  
  //Delete the entertainment expense
  const deleteButton = screen.getByTestId("expense2");
  fireEvent.click(deleteButton);

  //Confirm the entertainment expense is removed
  const deletedExpense = screen.queryByText("Entertainment");
  expect(deletedExpense).not.toBeInTheDocument();

  //Ensure total spent and remaining updates
  const updatedSpent = screen.getByTestId("spent");
  expect(updatedSpent).toHaveTextContent("270");
  const updatedRemaining = screen.getByTestId("remaining");
  expect(updatedRemaining).toHaveTextContent("730");
});

//Validate budget = remaining + spent even after various operations
describe("Budget Balance Verification", () => {
  test("Add three expenses", () => {
    render(<AppProvider><MyBudgetTracker /></AppProvider>);

    //Create couple of expenses
    const nameInput = screen.getByPlaceholderText("Expense Name");
    const costInput = screen.getByPlaceholderText("Expense Cost");
    const saveButton = screen.getByText("Save");
    fireEvent.change(nameInput, { target: { value: "Movie" } });
    fireEvent.change(costInput, { target: { value: "19" } });
    fireEvent.click(saveButton);
    fireEvent.change(nameInput, { target: { value: "Entertainment" } });
    fireEvent.change(costInput, { target: { value: "51" } });
    fireEvent.click(saveButton);
    fireEvent.change(nameInput, { target: { value: "Shopping" } });
    fireEvent.change(costInput, { target: { value: "281" } });
    fireEvent.click(saveButton);
    fireEvent.change(nameInput, { target: { value: "Gifts" } });
    fireEvent.change(costInput, { target: { value: "133" } });
    fireEvent.click(saveButton);

    //Get the elements
    const budget = screen.getByTestId("budget");
    const remaining = screen.getByTestId("remaining");
    const spent = screen.getByTestId("spent");

    //Extract the numbers
    const budgetVal = parseInt((budget.textContent?.replace(/\D/g, '') || "0"));
    const remainingVal = parseInt(remaining.textContent?.replace(/\D/g, "") || "0");
    const spentVal = parseInt(spent.textContent?.replace(/\D/g, "") || "0");

    expect(budgetVal).toBe(remainingVal + spentVal);
    expect(remainingVal).toBe(516);
    expect(spentVal).toBe(484);
  });


  test("Add and Delete expenses", () => {
    render(<AppProvider><MyBudgetTracker /></AppProvider>);
        //Create couple of expenses
        const nameInput = screen.getByPlaceholderText("Expense Name");
        const costInput = screen.getByPlaceholderText("Expense Cost");
        const saveButton = screen.getByText("Save");
        fireEvent.change(nameInput, { target: { value: "Movie" } });
        fireEvent.change(costInput, { target: { value: "19" } });
        fireEvent.click(saveButton);
        fireEvent.change(nameInput, { target: { value: "Entertainment" } });
        fireEvent.change(costInput, { target: { value: "51" } });
        fireEvent.click(saveButton);
        fireEvent.change(nameInput, { target: { value: "Shopping" } });
        fireEvent.change(costInput, { target: { value: "281" } });
        fireEvent.click(saveButton);

        //Delete expense
        const delete1 = screen.getByTestId("expense1");
        fireEvent.click(delete1);

        //Add more expenses
        fireEvent.change(nameInput, { target: { value: "Food" } });
        fireEvent.change(costInput, { target: { value: "34" } });
        fireEvent.click(saveButton);
        fireEvent.change(nameInput, { target: { value: "Subscription" } });
        fireEvent.change(costInput, { target: { value: "20" } });
        fireEvent.click(saveButton);

        //Delete expense
        const delete2 = screen.getByTestId("expense4"); 
        fireEvent.click(delete2);

        //Add more expense
        fireEvent.change(nameInput, { target: { value: "Clothes" } });
        fireEvent.change(costInput, { target: { value: "186" } });
        fireEvent.click(saveButton);
        fireEvent.change(nameInput, { target: { value: "Random Fees" } });
        fireEvent.change(costInput, { target: { value: "30" } });
        fireEvent.click(saveButton);
        fireEvent.change(nameInput, { target: { value: "More fees" } });
        fireEvent.change(costInput, { target: { value: "122" } });
        fireEvent.click(saveButton);

        //Delete expense
        const delete3 = screen.getByTestId("expense5"); 
        fireEvent.click(delete3);


        //Get the elements
        const budget = screen.getByTestId("budget");
        const remaining = screen.getByTestId("remaining");
        const spent = screen.getByTestId("spent");

        //Extract the numbers
        const budgetVal = parseInt((budget.textContent?.replace(/\D/g, '') || "0"));
        const remainingVal = parseInt(remaining.textContent?.replace(/\D/g, "") || "0");
        const spentVal = parseInt(spent.textContent?.replace(/\D/g, "") || "0");

        expect(budgetVal).toBe(remainingVal + spentVal);
        expect(remainingVal).toBe(326);
        expect(spentVal).toBe(674);
  });
});



//Other cases
test("Zero Expenses", () => {
    render(<AppProvider><MyBudgetTracker /></AppProvider>);

    //Get the elements
    const budget = screen.getByTestId("budget");
    const remaining = screen.getByTestId("remaining");
    const spent = screen.getByTestId("spent");

    //Extract the numbers
    const budgetVal = parseInt((budget.textContent?.replace(/\D/g, '') || "0"));
    const remainingVal = parseInt(remaining.textContent?.replace(/\D/g, "") || "0");
    const spentVal = parseInt(spent.textContent?.replace(/\D/g, "") || "0");

    expect(budgetVal).toBe(remainingVal + spentVal);
    expect(remainingVal).toBe(1000);
    expect(spentVal).toBe(0);
  });


test("Negative remaining", () => {
  render(<AppProvider><MyBudgetTracker /></AppProvider>);
  const nameInput = screen.getByPlaceholderText("Expense Name");
  const costInput = screen.getByPlaceholderText("Expense Cost");
  const saveButton = screen.getByText("Save");
  fireEvent.change(nameInput, { target: { value: "Rent" } });
  fireEvent.change(costInput, { target: { value: "1500" } });
  fireEvent.click(saveButton);

  const remaining = screen.getByTestId("remaining");
  const spent = screen.getByTestId("spent");

  expect(remaining).toHaveTextContent("-500");
  expect(spent).toHaveTextContent("1500");

});
