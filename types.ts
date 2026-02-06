
export enum UserRole {
  MERCHANT = 'MERCHANT',
  ACCOUNTANT = 'ACCOUNTANT'
}

export interface FinancialData {
  income: number;
  expenses: number;
  wages: number;
  debtsToUs: number;
  debtsByUs: number;
  inventory: number;
  liquidity: number;
  goldPrice: number;
  lastUpdated: string;
}

export interface User {
  username: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export interface VoiceParsingResult {
  field?: keyof FinancialData;
  value?: number;
  message?: string;
}
