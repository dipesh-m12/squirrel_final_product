export interface UserData {
  avatar?: string;
  city?: string;
  country?: string;
  createdAt?: string;
  email?: string;
  facebook?: string;
  firstName?: string;
  jobTitle?: string;
  joinedAt?: string;
  lastName?: string;
  linkedIn?: string;
  mobile?: string;
  orgContact?: string;
  orgEmail?: string;
  orgLocation?: string;
  orgLogo?: string;
  orgName?: string;
  orgType?: string;
  password?: string;
  pincode?: string;
  state?: string;
  twitter: string;
  updatedAt?: string;
  userId?: string;
  username?: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  coauthors: string;
  org: string;
  title: string;
  grantDate: Date | undefined | string;
  filingDate: Date | undefined | string;
  patentNumber: string;
  applicationNumber: string;
  abstract: string;
  sector: string;
  usedTech: string;
  transactionType: string;
}

export interface Patent {
  abstract: string;
  applicationNumber: string;
  city: string;
  coauthors: string;
  createdAt: string;
  email: string;
  filingDate: string | Date;
  firstName: string;
  grantDate: string | Date;
  lastName: string;
  listedAt: string | Date;
  mobile: string;
  org: string;
  patentId: string;
  patentImages: string[];
  patentNumber: string;
  patentType: string;
  pdf: string;
  sector: string;
  state: string;
  title: string;
  transactionType: "Available" | "Both" | "Sold";
  updatedAt: string;
  usedTech: string;
  userId: string;
  verified: boolean;
  __v: number;
  _id: string;
  userOwnPatent: boolean;
}
