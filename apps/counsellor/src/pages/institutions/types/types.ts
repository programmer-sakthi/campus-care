export interface Institution {
  id: string;
  name: string;
  /** Short official code, e.g. "SKCT" for Sri Krishna College of Technology */
  code: string;
}

export interface Invitation {
  id: string;
  institution: Institution;
  /** ISO timestamp of when the admin sent the invitation */
  sentAt: string;
  /** Optional note the institution admin attached to the invite */
  note?: string;
}

export interface Membership {
  institution: Institution;
  /** ISO timestamp of when the counsellor joined */
  joinedAt: string;
  /** How many applications from this institution are currently active */
  activeApplications: number;
}