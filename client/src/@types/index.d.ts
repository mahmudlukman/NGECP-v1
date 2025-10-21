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
  capacity: string;
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

export interface IInspection {
  _id: string;
  generator: {
    _id: string;
    generatorId: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
  owner?:
    | string
    | {
        _id?: string;
        email?: string;
        accountType?: "individual" | "company";
        name?: string;
        companyName?: string;
      };
  inspector?: {
    _id: string;
    name: string;
    email: string;
  };
  scheduledDate?: string;
  completedDate?: string;
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
  report?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInspectionReport {
  _id: string;
  inspection: {
    _id: string;
    scheduledDate: string;
    owner: {
      _id?: string;
      name?: string;
      email?: string;
      companyName?: string;
      accountType?: string;
    };
  };
  generator: {
    _id: string;
    generatorId: string;
    brand: string;
    model: string;
    serialNumber: string;
    location?: {
      address: string;
      state: string;
      lga: string;
    };
  };
  inspector: {
    _id: string;
    name: string;
    email: string;
  };
  reportDate?: Date;
  overallCompliance: boolean;
  complianceScore: number;
  emissionsTest: {
    passed: boolean;
    co2Level?: number;
    noxLevel?: number;
    particulateLevel?: number;
    notes?: string;
  };
  noiseLevel: {
    passed: boolean;
    decibelReading?: number;
    notes?: string;
  };
  fuelEfficiency: {
    passed: boolean;
    rating?: string;
    notes?: string;
  };
  maintenanceStatus: {
    passed: boolean;
    issues?: string[];
    notes?: string;
  };
  safetyCompliance: {
    passed: boolean;
    issues?: string[];
    notes?: string;
  };
  recommendations: string[];
  requiredActions?: string[];
  nextInspectionDate?: Date;
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[];
  isApproved: boolean;
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  approvalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
