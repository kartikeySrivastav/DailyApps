export interface CalculationRecord {
  id: string;
  toolId: string;
  toolName: string;
  category: string;
  title: string;
  subtitle?: string;
  result: string;
  secondaryResult?: string;
  badge?: string;
  timestamp: number;
  inputs: Record<string, any>;
}

export interface SaveCalculationParams {
  toolId: string;
  toolName: string;
  category: string;
  title: string;
  subtitle?: string;
  result: string;
  secondaryResult?: string;
  badge?: string;
  inputs: Record<string, any>;
}
