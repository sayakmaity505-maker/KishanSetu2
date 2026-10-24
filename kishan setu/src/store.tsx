import React, { createContext, useContext, useReducer } from "react";

export type KycStatus = "verified" | "pending" | "failed";
export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "rescheduled"
  | "completed"
  | "cancelled"
  | "no_show";
export type PaymentStatus = "processing" | "credited" | "failed";
export type GrievanceStatus =
  | "registered"
  | "under_review"
  | "resolved"
  | "rejected";

export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  state: string;
  district: string;
  block: string;
  village: string;
  farmerId: string;
  aadhaarMasked: string;
  kycStatus: KycStatus;
  bankAccountMasked: string;
  ifscMasked: string;
  consentGiven: boolean;
  landAcres: number;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  district: string;
  state: string;
  address: string;
  dailyCapacityQ: number;
  bookedQ: number;
  crops: string[];
  distanceKm: number;
  agentName: string;
}

export interface CropPrice {
  crop: string;
  mspPerQ: number;
  season: string;
}

export interface Booking {
  id: string;
  farmerId: string;
  farmerName: string;
  centreId: string;
  centreName: string;
  crop: string;
  quantity: number;
  date: string;
  slot: string;
  status: BookingStatus;
  queuePosition?: number;
  queueCurrent?: number;
  estimatedWaitMins?: number;
  rejectionReason?: string;
  rescheduleDate?: string;
  rescheduleSlot?: string;
  rescheduleReason?: string;
  kycVerified: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  farmerId: string;
  farmerName: string;
  centreId: string;
  centreName: string;
  crop: string;
  scheduledQty: number;
  actualQty: number;
  qualityGrade: string;
  pricePerQ: number;
  grossAmount: number;
  qualityDeduction: number;
  otherDeduction: number;
  netAmount: number;
  agentId: string;
  utrNumber: string;
  pfmsRef: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Grievance {
  id: string;
  farmerId: string;
  farmerName: string;
  bookingId?: string;
  category: string;
  description: string;
  status: GrievanceStatus;
  assignedTo?: string;
  resolutionNote?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  farmerId: string;
  message: string;
  hindi: string;
  type: "booking" | "acceptance" | "rejection" | "queue" | "payment" | "bill";
  read: boolean;
  createdAt: string;
}

export interface CentreAgent {
  id: string;
  name: string;
  centreId: string;
  centreName: string;
  authorized: boolean;
}

export interface AppState {
  farmers: Farmer[];
  centres: ProcurementCentre[];
  cropPrices: CropPrice[];
  bookings: Booking[];
  transactions: Transaction[];
  grievances: Grievance[];
  notifications: Notification[];
  centreAgents: CentreAgent[];
  currentFarmerId: string | null;
  currentCentreAgentId: string | null;
}

type Action =
  | { type: "CREATE_BOOKING"; booking: Booking }
  | { type: "UPDATE_BOOKING_STATUS"; bookingId: string; status: BookingStatus; extra?: Partial<Booking> }
  | { type: "CREATE_TRANSACTION"; transaction: Transaction }
  | { type: "CREATE_GRIEVANCE"; grievance: Grievance }
  | { type: "ADD_NOTIFICATION"; notification: Notification }
  | { type: "SET_CURRENT_FARMER"; farmerId: string | null }
  | { type: "SET_CURRENT_AGENT"; agentId: string | null }
  | { type: "MARK_NOTIFICATIONS_READ"; farmerId: string };

const DEMO_FARMERS: Farmer[] = [
  {
    id: "F001",
    name: "Ramesh Kumar",
    mobile: "9876543210",
    state: "West Bengal",
    district: "Burdwan",
    block: "Memari",
    village: "Salap",
    farmerId: "WB-BDW-2024-001234",
    aadhaarMasked: "XXXX XXXX 4582",
    kycStatus: "verified",
    bankAccountMasked: "XXXXXXXX4821",
    ifscMasked: "SBIN0XXXXX",
    consentGiven: true,
    landAcres: 4.5,
  },
  {
    id: "F002",
    name: "Priya Devi",
    mobile: "9765432109",
    state: "West Bengal",
    district: "Hooghly",
    block: "Singur",
    village: "Gopalnagar",
    farmerId: "WB-HGL-2024-002341",
    aadhaarMasked: "XXXX XXXX 7823",
    kycStatus: "verified",
    bankAccountMasked: "XXXXXXXX3012",
    ifscMasked: "UCBA0XXXXX",
    consentGiven: true,
    landAcres: 2.8,
  },
  {
    id: "F003",
    name: "Suresh Patel",
    mobile: "9654321098",
    state: "West Bengal",
    district: "Burdwan",
    block: "Kalna",
    village: "Debipur",
    farmerId: "WB-BDW-2024-003127",
    aadhaarMasked: "XXXX XXXX 1196",
    kycStatus: "pending",
    bankAccountMasked: "XXXXXXXX8834",
    ifscMasked: "PUNB0XXXXX",
    consentGiven: true,
    landAcres: 3.2,
  },
  {
    id: "F004",
    name: "Mohan Singh",
    mobile: "9543210987",
    state: "West Bengal",
    district: "Burdwan",
    block: "Bhatar",
    village: "Kendua",
    farmerId: "WB-BDW-2024-004556",
    aadhaarMasked: "XXXX XXXX 3374",
    kycStatus: "verified",
    bankAccountMasked: "XXXXXXXX5521",
    ifscMasked: "BKID0XXXXX",
    consentGiven: true,
    landAcres: 6.0,
  },
  {
    id: "F005",
    name: "Geeta Bai",
    mobile: "9432109876",
    state: "West Bengal",
    district: "Medinipur",
    block: "Ghatal",
    village: "Raghunathpur",
    farmerId: "WB-MDP-2024-005781",
    aadhaarMasked: "XXXX XXXX 9021",
    kycStatus: "verified",
    bankAccountMasked: "XXXXXXXX7743",
    ifscMasked: "CNRB0XXXXX",
    consentGiven: true,
    landAcres: 1.8,
  },
  {
    id: "F006",
    name: "Arjun Yadav",
    mobile: "9321098765",
    state: "West Bengal",
    district: "Burdwan",
    block: "Ausgram",
    village: "Patharchur",
    farmerId: "WB-BDW-2024-006892",
    aadhaarMasked: "XXXX XXXX 5567",
    kycStatus: "verified",
    bankAccountMasked: "XXXXXXXX2298",
    ifscMasked: "MAHB0XXXXX",
    consentGiven: true,
    landAcres: 8.2,
  },
];

const DEMO_CENTRES: ProcurementCentre[] = [
  {
    id: "CTR-024",
    name: "Burdwan Government Wheat Procurement Centre",
    district: "Burdwan",
    state: "West Bengal",
    address: "Near Grain Market, Burdwan, WB 713101",
    dailyCapacityQ: 1200,
    bookedQ: 850,
    crops: ["Wheat", "Gram"],
    distanceKm: 4.2,
    agentName: "Rajesh Kumar",
  },
  {
    id: "CTR-031",
    name: "Hooghly Rice Procurement Centre",
    district: "Hooghly",
    state: "West Bengal",
    address: "Arambagh Road, Singur, WB 712409",
    dailyCapacityQ: 1500,
    bookedQ: 620,
    crops: ["Rice (Common)", "Paddy"],
    distanceKm: 7.8,
    agentName: "Anita Sharma",
  },
  {
    id: "CTR-018",
    name: "Medinipur Paddy Procurement Centre",
    district: "Medinipur",
    state: "West Bengal",
    address: "Ghatal NH-116, Medinipur, WB 721212",
    dailyCapacityQ: 800,
    bookedQ: 420,
    crops: ["Paddy", "Maize"],
    distanceKm: 12.5,
    agentName: "Vijay Mondal",
  },
  {
    id: "CTR-041",
    name: "Bardhaman Gram Procurement Centre",
    district: "Burdwan",
    state: "West Bengal",
    address: "Katwa Road, Burdwan, WB 713102",
    dailyCapacityQ: 600,
    bookedQ: 180,
    crops: ["Gram", "Wheat"],
    distanceKm: 6.1,
    agentName: "Ravi Biswas",
  },
  {
    id: "CTR-055",
    name: "Nadia Maize Procurement Centre",
    district: "Nadia",
    state: "West Bengal",
    address: "Krishnagar Bypass, Nadia, WB 741101",
    dailyCapacityQ: 1000,
    bookedQ: 350,
    crops: ["Maize", "Rice (Common)"],
    distanceKm: 18.3,
    agentName: "Sunita Das",
  },
];

const DEMO_CROP_PRICES: CropPrice[] = [
  { crop: "Wheat", mspPerQ: 2585, season: "Rabi 2025-26" },
  { crop: "Rice (Common)", mspPerQ: 2300, season: "Kharif 2025-26" },
  { crop: "Paddy", mspPerQ: 2183, season: "Kharif 2025-26" },
  { crop: "Maize", mspPerQ: 2090, season: "Kharif 2025-26" },
  { crop: "Gram", mspPerQ: 5440, season: "Rabi 2025-26" },
];

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "KS-2026-001284",
    farmerId: "F001",
    farmerName: "Ramesh Kumar",
    centreId: "CTR-024",
    centreName: "Burdwan Government Wheat Procurement Centre",
    crop: "Wheat",
    quantity: 50,
    date: "12 September 2026",
    slot: "10:00 – 11:00",
    status: "pending",
    kycVerified: true,
    createdAt: "2026-09-08T09:15:00Z",
  },
  {
    id: "KS-2026-001283",
    farmerId: "F002",
    farmerName: "Priya Devi",
    centreId: "CTR-031",
    centreName: "Hooghly Rice Procurement Centre",
    crop: "Rice (Common)",
    quantity: 30,
    date: "11 September 2026",
    slot: "09:00 – 10:00",
    status: "accepted",
    queuePosition: 5,
    queueCurrent: 3,
    estimatedWaitMins: 30,
    kycVerified: true,
    createdAt: "2026-09-07T11:22:00Z",
  },
  {
    id: "KS-2026-001280",
    farmerId: "F004",
    farmerName: "Mohan Singh",
    centreId: "CTR-024",
    centreName: "Burdwan Government Wheat Procurement Centre",
    crop: "Wheat",
    quantity: 75,
    date: "10 September 2026",
    slot: "11:00 – 12:00",
    status: "completed",
    kycVerified: true,
    createdAt: "2026-09-06T08:45:00Z",
  },
  {
    id: "KS-2026-001271",
    farmerId: "F005",
    farmerName: "Geeta Bai",
    centreId: "CTR-018",
    centreName: "Medinipur Paddy Procurement Centre",
    crop: "Paddy",
    quantity: 40,
    date: "09 September 2026",
    slot: "14:00 – 15:00",
    status: "rejected",
    rejectionReason: "Centre capacity exceeded for the requested date",
    kycVerified: true,
    createdAt: "2026-09-05T10:30:00Z",
  },
  {
    id: "KS-2026-001265",
    farmerId: "F003",
    farmerName: "Suresh Patel",
    centreId: "CTR-024",
    centreName: "Burdwan Government Wheat Procurement Centre",
    crop: "Wheat",
    quantity: 25,
    date: "15 September 2026",
    slot: "09:00 – 10:00",
    status: "pending",
    kycVerified: false,
    createdAt: "2026-09-08T07:10:00Z",
  },
  {
    id: "KS-2026-001258",
    farmerId: "F006",
    farmerName: "Arjun Yadav",
    centreId: "CTR-024",
    centreName: "Burdwan Government Wheat Procurement Centre",
    crop: "Wheat",
    quantity: 60,
    date: "13 September 2026",
    slot: "13:00 – 14:00",
    status: "rescheduled",
    rescheduleDate: "14 September 2026",
    rescheduleSlot: "10:00 – 11:00",
    rescheduleReason: "Centre maintenance on 13 Sept afternoon",
    kycVerified: true,
    createdAt: "2026-09-07T06:20:00Z",
  },
];

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2026-04821",
    bookingId: "KS-2026-001280",
    farmerId: "F004",
    farmerName: "Mohan Singh",
    centreId: "CTR-024",
    centreName: "Burdwan Government Wheat Procurement Centre",
    crop: "Wheat",
    scheduledQty: 75,
    actualQty: 73.5,
    qualityGrade: "A",
    pricePerQ: 2585,
    grossAmount: 190000.75,
    qualityDeduction: 3500,
    otherDeduction: 0,
    netAmount: 186500.75,
    agentId: "AGT-024-01",
    utrNumber: "UTR2026090894521",
    pfmsRef: "PFMS/WB/2026/0098012",
    paymentStatus: "credited",
    createdAt: "2026-09-10T15:30:00Z",
  },
  {
    id: "TXN-2026-04798",
    bookingId: "KS-2026-001220",
    farmerId: "F002",
    farmerName: "Priya Devi",
    centreId: "CTR-031",
    centreName: "Hooghly Rice Procurement Centre",
    crop: "Rice (Common)",
    scheduledQty: 45,
    actualQty: 44.0,
    qualityGrade: "B",
    pricePerQ: 2300,
    grossAmount: 101200,
    qualityDeduction: 2200,
    otherDeduction: 0,
    netAmount: 99000,
    agentId: "AGT-031-01",
    utrNumber: "UTR2026090312847",
    pfmsRef: "PFMS/WB/2026/0097431",
    paymentStatus: "processing",
    createdAt: "2026-09-08T11:00:00Z",
  },
];

const DEMO_CENTRE_AGENTS: CentreAgent[] = [
  {
    id: "AGT-024-01",
    name: "Rajesh Kumar",
    centreId: "CTR-024",
    centreName: "Burdwan Government Wheat Procurement Centre",
    authorized: true,
  },
  {
    id: "AGT-031-01",
    name: "Anita Sharma",
    centreId: "CTR-031",
    centreName: "Hooghly Rice Procurement Centre",
    authorized: true,
  },
];

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "N001",
    farmerId: "F001",
    message: "Your procurement request KS-2026-001284 has been submitted.",
    hindi: "आपका खरीद अनुरोध KS-2026-001284 सबमिट हो गया है।",
    type: "booking",
    read: false,
    createdAt: "2026-09-08T09:15:00Z",
  },
  {
    id: "N002",
    farmerId: "F002",
    message: "Your procurement request has been accepted. You are #5 in the queue.",
    hindi: "आपका खरीद अनुरोध स्वीकार हो गया। आप कतार में #5 हैं।",
    type: "acceptance",
    read: true,
    createdAt: "2026-09-07T12:00:00Z",
  },
];

const DEMO_GRIEVANCES: Grievance[] = [
  {
    id: "GRV-2026-00341",
    farmerId: "F005",
    farmerName: "Geeta Bai",
    bookingId: "KS-2026-001271",
    category: "Booking",
    description: "My booking was rejected without proper reason. Centre had capacity.",
    status: "under_review",
    assignedTo: "AGT-018-01",
    createdAt: "2026-09-05T11:00:00Z",
  },
  {
    id: "GRV-2026-00328",
    farmerId: "F003",
    farmerName: "Suresh Patel",
    category: "Payment",
    description: "Payment not received after 7 days of transaction completion.",
    status: "registered",
    createdAt: "2026-09-04T09:30:00Z",
  },
];

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "CREATE_BOOKING":
      return { ...state, bookings: [...state.bookings, action.booking] };
    case "UPDATE_BOOKING_STATUS":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.bookingId
            ? { ...b, status: action.status, ...action.extra }
            : b
        ),
      };
    case "CREATE_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
        bookings: state.bookings.map((b) =>
          b.id === action.transaction.bookingId
            ? { ...b, status: "completed" }
            : b
        ),
      };
    case "CREATE_GRIEVANCE":
      return { ...state, grievances: [...state.grievances, action.grievance] };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case "SET_CURRENT_FARMER":
      return { ...state, currentFarmerId: action.farmerId };
    case "SET_CURRENT_AGENT":
      return { ...state, currentCentreAgentId: action.agentId };
    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.farmerId === action.farmerId ? { ...n, read: true } : n
        ),
      };
    default:
      return state;
  }
}

const initialState: AppState = {
  farmers: DEMO_FARMERS,
  centres: DEMO_CENTRES,
  cropPrices: DEMO_CROP_PRICES,
  bookings: DEMO_BOOKINGS,
  transactions: DEMO_TRANSACTIONS,
  grievances: DEMO_GRIEVANCES,
  notifications: DEMO_NOTIFICATIONS,
  centreAgents: DEMO_CENTRE_AGENTS,
  currentFarmerId: null,
  currentCentreAgentId: null,
};

const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
