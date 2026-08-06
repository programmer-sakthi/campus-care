export interface StudentProfile {
  id: string;
  name: string;
  initials: string;
  institutionName: string;
  institutionCode: string;
}

// Swap for the authenticated user once real auth is wired up.
export const currentStudent: StudentProfile = {
  id: "student-self",
  name: "Aisha Kapoor",
  initials: "AK",
  institutionName: "Greenfield University",
  institutionCode: "GFU",
};