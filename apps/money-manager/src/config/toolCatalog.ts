import { AppFeature } from '@dailyapps/config';

export const money_managerToolCatalog: AppFeature[] = [
  {
    "id": "expense_logger",
    "title": "Expense & Income Logger",
    "description": "Quickly record daily transactions with categories",
    "icon": "💸",
    "route": "ExpenseLogger",
    "category": "Transactions",
    "isFeatured": true,
    "keywords": [
      "expense",
      "income",
      "money",
      "transaction"
    ]
  },
  {
    "id": "budget_planner",
    "title": "Category Budgets",
    "description": "Set monthly spending limits and monitor budget health",
    "icon": "📊",
    "route": "BudgetPlanner",
    "category": "Budgets",
    "keywords": [
      "budget",
      "limit",
      "savings",
      "category"
    ]
  },
  {
    "id": "insights",
    "title": "Spending Insights",
    "description": "Visual breakdown of monthly expense distribution",
    "icon": "📈",
    "route": "SpendingInsights",
    "category": "Analytics",
    "keywords": [
      "chart",
      "analytics",
      "reports",
      "insights"
    ]
  },
  {
    "id": "export_csv",
    "title": "Export CSV & Reports",
    "description": "Export transactions to spreadsheet-ready CSV files",
    "icon": "📑",
    "route": "ExportCsv",
    "category": "Export",
    "keywords": [
      "csv",
      "excel",
      "export",
      "backup"
    ]
  }
];
