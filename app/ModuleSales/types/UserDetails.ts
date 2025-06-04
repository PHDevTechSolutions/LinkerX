// types/UserDetails.ts
export interface UserDetails {
  UserId: string;
  ReferenceID: string;
  Manager: string;
  TSM: string;
  TargetQuota: string; // make this a string for consistency
  Firstname: string;
  Lastname: string;
  Email: string;
  Role: string;
  Department: string;
  Company: string;
}
