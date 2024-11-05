import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MyBudgetTracker", () => {
  render(<App />);
  const titleElement = screen.getByText("My Budget Planner");
  expect(titleElement).toBeInTheDocument();
});
