export interface RootState {
  auth: {
    user: User | null;
  };
}

export interface User {
  _id: string;
  email: string;
  role: string;
  accountType: "individual" | "company";
  name?: string;
  companyName?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface ServerError {
  status?: number;
  data?: {
    message?: string;
  };
  message?: string;
}

// Define the registration data type
export interface RegistrationData {
  email: string;
  password: string;
  accountType: "individual" | "company";
  phoneNumber: string;
  name?: string;
  companyName?: string;
  companyRegNumber?: string;
  companyAddress?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
}
