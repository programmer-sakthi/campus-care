import type { AnonymousUser, UserRole } from "../types/peerSupport";

const ADJECTIVES = [
  "Calm",
  "Quiet",
  "Kind",
  "Brave",
  "Gentle",
  "Thoughtful",
  "Peaceful",
  "Hopeful",
  "Steady",
  "Warm",
];

const ANIMALS = [
  "Otter",
  "Fox",
  "Panda",
  "Owl",
  "Bear",
  "Cat",
  "Koala",
  "Deer",
  "Rabbit",
  "Sparrow",
];

const ROLES: UserRole[] = ["Student", "Peer"];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateUsername(): string {
  return `${pickRandom(ADJECTIVES)}${pickRandom(ANIMALS)}`;
}

export function generateAnonymousUser(id = "current-user", role?: UserRole): AnonymousUser {
  return {
    id,
    username: generateUsername(),
    role: role ?? pickRandom(ROLES),
  };
}