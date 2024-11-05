import exp from "constants";
import { Expense } from "../types";
import { Request, Response } from "express";

export function createExpenseServer(req: Request, res: Response, expenses: Expense[]) {
    const { id, cost, description } = req.body;

    if (!description || !id || !cost) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    const newExpense: Expense = {
        id: id,
        description,
        cost,
    };

    expenses.push(newExpense);
    res.status(201).send(newExpense); 
}

export function deleteExpense(req: Request, res: Response, expenses: Expense[]) {
    // TO DO: Implement deleteExpense function
    const {id} = req.params;

    // Find the index of the expense with the given ID
    const index = expenses.findIndex(expense => expense.id === id);

    if (index === -1) {
        // If expense not found, return a 404 status
        return res.status(404).send({ error: "Expense not found" });
    }

    // Remove the expense from the array
    expenses.splice(index, 1);

    //Respond with a success message
    res.status(200).send({message: "Expense deleted successfully"});

}

export function getExpenses(req: Request, res: Response, expenses: Expense[]) {
    res.status(200).send({ "data": expenses });
}