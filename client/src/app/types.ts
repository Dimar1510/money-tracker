export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
};

enum Type {
  income = "income",
  expense = "expense",
}

export type Transaction = {
  id: string;
  name: string;
  type: Type;
  date: string;
  amount: number;
  categoryId?: string;
  category: {
    name: string;
  };
};

export type Category = {
  total: number;
  category: string;
  categoryId: string;
};

export type ByMonth = {
  month: string;
  total: number;
  categories: { name: string; total: number };
};

export type ByYear = {
  _id: string;
  months: ByMonth[];
};
