// Mock data layer — swap for real API calls later.
// Kept in one place so Chat.tsx and Appointments.tsx agree on the same
// students / institutions.

export type InstitutionId = "inst-1" | "inst-2" | "inst-3";

export interface Institution {
  id: InstitutionId;
  name: string;
  shortName: string;
}

export const institutions: Institution[] = [
  { id: "inst-1", name: "Greenfield University", shortName: "Greenfield" },
  { id: "inst-2", name: "St. Xavier's College", shortName: "St. Xavier's" },
  { id: "inst-3", name: "Northbridge Institute of Technology", shortName: "Northbridge" },
];

export function institutionOf(id: InstitutionId): Institution {
  return institutions.find((i) => i.id === id)!;
}

export interface Student {
  id: string;
  name: string;
  institutionId: InstitutionId;
  initials: string;
}

export const students: Student[] = [
  { id: "s-1", name: "Aisha Kapoor", institutionId: "inst-1", initials: "AK" },
  { id: "s-2", name: "Rohan Mehta", institutionId: "inst-2", initials: "RM" },
  { id: "s-3", name: "Priya Nair", institutionId: "inst-1", initials: "PN" },
  { id: "s-4", name: "Kabir Singh", institutionId: "inst-3", initials: "KS" },
  { id: "s-5", name: "Meera Iyer", institutionId: "inst-2", initials: "MI" },
  { id: "s-6", name: "Arjun Rao", institutionId: "inst-3", initials: "AR" },
];

export function studentOf(id: string): Student {
  return students.find((s) => s.id === id)!;
}

export type AppointmentStatus = "pending" | "scheduled" | "completed";

export interface Appointment {
  id: string;
  studentId: string;
  reason: string;
  status: AppointmentStatus;
  requestedAt: string; // ISO
  scheduledAt?: string; // ISO, present once fixed
  sessionAt?: string; // ISO, when the completed session happened
  review?: string;
}

export const appointments: Appointment[] = [
  {
    id: "appt-1",
    studentId: "s-1",
    reason: "Struggling with exam anxiety and disrupted sleep over the past month.",
    status: "pending",
    requestedAt: "2026-08-01T09:12:00",
  },
  {
    id: "appt-2",
    studentId: "s-3",
    reason: "Ongoing conflict with a roommate that's causing significant daily stress.",
    status: "scheduled",
    requestedAt: "2026-07-29T14:40:00",
    scheduledAt: "2026-08-06T11:00:00",
  },
  {
    id: "appt-3",
    studentId: "s-4",
    reason: "Difficulty coping with family expectations and academic pressure this term.",
    status: "pending",
    requestedAt: "2026-08-02T18:05:00",
  },
  {
    id: "appt-4",
    studentId: "s-2",
    reason: "Feeling persistently low and unmotivated since the semester began.",
    status: "completed",
    requestedAt: "2026-07-18T10:00:00",
    scheduledAt: "2026-07-22T15:00:00",
    sessionAt: "2026-07-22T15:00:00",
    review: "",
  },
  {
    id: "appt-5",
    studentId: "s-5",
    reason: "Panic attacks before presentations and group work.",
    status: "completed",
    requestedAt: "2026-07-10T08:30:00",
    scheduledAt: "2026-07-15T13:00:00",
    sessionAt: "2026-07-15T13:00:00",
    review:
      "Meera was open about the physical symptoms of her panic attacks and could name the triggers clearly. We practiced a grounding technique she can use before presentations. Recommend a brief follow-up in 3 weeks to check in on progress; no urgent risk indicators observed.",
  },
  {
    id: "appt-6",
    studentId: "s-6",
    reason: "Follow-up check-in after a prior semester of counselling for academic burnout.",
    status: "completed",
    requestedAt: "2026-07-05T12:00:00",
    scheduledAt: "2026-07-09T16:30:00",
    sessionAt: "2026-07-09T16:30:00",
    review:
      "Arjun continues to manage his workload well and reports better sleep habits. He no longer feels he needs regular sessions. Agreed to close this case with an open door if things change.",
  },
];

export interface Message {
  id: string;
  sender: "student" | "counsellor";
  text: string;
  time: string; // ISO
}

export const conversations: Record<string, Message[]> = {
  "s-1": [
    { id: "m1", sender: "student", text: "Hi, I applied for counselling. Exams are really overwhelming me right now.", time: "2026-08-01T09:12:00" },
    { id: "m2", sender: "counsellor", text: "Hi Aisha, thanks for reaching out — that sounds like a lot to carry. Can you tell me a bit more about how it's been affecting your sleep?", time: "2026-08-01T09:40:00" },
    { id: "m3", sender: "student", text: "I've been waking up around 3am most nights thinking about exams. It's been going on for about 3 weeks.", time: "2026-08-01T09:52:00" },
    { id: "m4", sender: "counsellor", text: "That makes sense given the pressure you're under. Let's find a time to talk properly — are mornings or evenings easier for you this week?", time: "2026-08-01T10:05:00" },
    { id: "m5", sender: "student", text: "Evenings work best, after 5pm most days.", time: "2026-08-01T10:20:00" },
  ],
  "s-3": [
    { id: "m1", sender: "student", text: "Hi, things with my roommate have gotten pretty bad and it's affecting my focus.", time: "2026-07-29T14:40:00" },
    { id: "m2", sender: "counsellor", text: "Thanks for flagging this, Priya. I'd like to set aside proper time to go through it — does Thursday 11am work for you?", time: "2026-07-29T15:10:00" },
    { id: "m3", sender: "student", text: "Yes, Thursday 11am works well. Thank you.", time: "2026-07-29T15:15:00" },
    { id: "m4", sender: "counsellor", text: "Great, I've scheduled us for Thursday, 6 Aug at 11:00 AM. See you then.", time: "2026-07-29T15:16:00" },
  ],
  "s-4": [
    { id: "m1", sender: "student", text: "Hello, I've been finding it hard to meet my family's expectations alongside coursework.", time: "2026-08-02T18:05:00" },
    { id: "m2", sender: "counsellor", text: "Hi Kabir, that's a heavy balance to hold. I'd like to understand more before we fix a time — is this a recent change or something ongoing?", time: "2026-08-02T18:30:00" },
  ],
  "s-2": [
    { id: "m1", sender: "student", text: "I've just been feeling really low lately, not sure why.", time: "2026-07-18T10:00:00" },
    { id: "m2", sender: "counsellor", text: "Thanks for sharing that, Rohan. Let's talk it through — I've scheduled our session for 22 Jul at 3:00 PM.", time: "2026-07-18T10:30:00" },
    { id: "m3", sender: "student", text: "Thank you, I'll be there.", time: "2026-07-18T10:35:00" },
  ],
  "s-5": [
    { id: "m1", sender: "student", text: "I keep having panic attacks right before I have to present in class.", time: "2026-07-10T08:30:00" },
    { id: "m2", sender: "counsellor", text: "That sounds really tough, Meera. Let's meet on 15 Jul at 1:00 PM to go through some strategies.", time: "2026-07-10T09:00:00" },
  ],
  "s-6": [
    { id: "m1", sender: "student", text: "Hi, just checking in as we discussed last semester.", time: "2026-07-05T12:00:00" },
    { id: "m2", sender: "counsellor", text: "Good to hear from you, Arjun. Let's catch up on 9 Jul at 4:30 PM.", time: "2026-07-05T12:20:00" },
  ],
};