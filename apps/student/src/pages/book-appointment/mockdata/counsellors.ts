import type { Counsellor } from "../types";

export const counsellors: Counsellor[] = [
  {
    id: "c-1",
    name: "Dr. Neha Sharma",
    initials: "NS",
    specialties: ["Anxiety & stress", "Exam pressure"],
    bio: "Works with students on exam-related anxiety, sleep disruption, and building sustainable study routines.",
    yearsExperience: 8,
    availability: "available",
  },
  {
    id: "c-2",
    name: "Dr. Vikram Rao",
    initials: "VR",
    specialties: ["Depression & mood", "Relationships"],
    bio: "Focuses on low mood, motivation, and navigating relationship or family conflict during college years.",
    yearsExperience: 12,
    availability: "limited",
  },
  {
    id: "c-3",
    name: "Dr. Sana Fernandes",
    initials: "SF",
    specialties: ["Trauma-informed care", "Family conflict"],
    bio: "Trauma-informed counsellor experienced in supporting students through family conflict and major life transitions.",
    yearsExperience: 5,
    availability: "available",
  },
  {
    id: "c-4",
    name: "Dr. Arjun Mehta",
    initials: "AM",
    specialties: ["Burnout", "Academic pressure"],
    bio: "Helps students recognize and recover from academic burnout, with a practical, goal-oriented approach.",
    yearsExperience: 6,
    availability: "available",
  },
];