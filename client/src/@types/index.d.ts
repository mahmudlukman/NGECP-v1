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

export interface IGenerator {
  _id: string;
  owner:
    | string
    | {
        _id: string;
        email: string;
        accountType: "individual" | "company";
        name?: string;
        companyName?: string;
      };
  generatorId: string;
  name: string;
  brand: string;
  capacity: number;
  yearOfManufacture?: number;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location: {
    address: string;
    state: string;
    lga: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  fuelType?: string;
  status: string;
  registrationDate: Date;
  lastInspectionDate?: Date;
  nextInspectionDue?: Date;
  complianceScore?: number;
}

interface IInspection {
  _id: string;
  generator: {
    _id: string;
    generatorId: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
  owner?: string | {
    _id?: string;
    email?: string;
    accountType?: "individual" | "company";
    name?: string;
    companyName?: string;
  };
  scheduledDate?: string;
  status: string;
  payment?: {
    _id: string;
    amount: number;
    status: string;
    transactionReference: string;
  };
  location?: {
    address?: string;
    state?: string;
    lga?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  updatedAt?: string;
}
