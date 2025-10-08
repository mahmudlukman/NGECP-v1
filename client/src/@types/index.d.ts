export interface RootState {
  auth: {
    user: User | null;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  cartItems: Record<string>;
  role: string;
  isActive?: boolean;
}

export interface ServerError {
  status?: number;
  data?: {
    message?: string;
  };
  message?: string;
}