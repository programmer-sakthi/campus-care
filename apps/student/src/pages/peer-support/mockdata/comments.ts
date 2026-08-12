import type { Comment } from "../types/peerSupport";
import { mockUsers } from "./users";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const mockComments: Comment[] = [
  // Post p1
  {
    id: "c1",
    postId: "p1",
    author: mockUsers[1],
    content: "That sounds really difficult. You're definitely not alone in feeling overwhelmed during a busy stretch like this.",
    createdAt: hoursAgo(1.5),
    upvotes: 12,
    downvotes: 0,
  },
  {
    id: "c2",
    postId: "p1",
    author: mockUsers[2],
    content: "I've been going through something similar this week. Breaking tasks into smaller pieces has helped me a little.",
    createdAt: hoursAgo(1),
    upvotes: 5,
    downvotes: 0,
  },
  {
    id: "c3",
    postId: "p1",
    author: mockUsers[5],
    content: "Sending support. Try picking just one thing to finish today instead of thinking about everything at once.",
    createdAt: hoursAgo(0.5),
    upvotes: 8,
    downvotes: 0,
  },

  // Post p2
  {
    id: "c4",
    postId: "p2",
    author: mockUsers[6],
    content: "Exam anxiety is more common than it feels in the moment. Slow breathing right before you go in can help more than it sounds like it would.",
    createdAt: hoursAgo(4),
    upvotes: 14,
    downvotes: 0,
  },
  {
    id: "c5",
    postId: "p2",
    author: mockUsers[4],
    content: "I get this too. Writing a quick brain dump of formulas before the exam starts helps me stop blanking.",
    createdAt: hoursAgo(3),
    upvotes: 6,
    downvotes: 0,
  },

  // Post p3
  {
    id: "c6",
    postId: "p3",
    author: mockUsers[0],
    content: "First semester was the hardest for me too. It gets easier once you find a rhythm, promise.",
    createdAt: hoursAgo(6),
    upvotes: 9,
    downvotes: 0,
  },

  // Post p4
  {
    id: "c7",
    postId: "p4",
    author: mockUsers[3],
    content: "It's okay to want a break from that pressure. Your worth isn't actually tied to a GPA, even if it feels that way right now.",
    createdAt: hoursAgo(9),
    upvotes: 20,
    downvotes: 0,
  },
  {
    id: "c8",
    postId: "p4",
    author: mockUsers[7],
    content: "I relate to this a lot. Have you been able to talk to them about how tired you feel, even a little?",
    createdAt: hoursAgo(7),
    upvotes: 4,
    downvotes: 0,
  },

  // Post p6
  {
    id: "c9",
    postId: "p6",
    author: mockUsers[1],
    content: "That sounds lonely and honestly really common in the first year. Would you be open to trying a club or study group?",
    createdAt: daysAgo(0.9),
    upvotes: 15,
    downvotes: 0,
  },
  {
    id: "c10",
    postId: "p6",
    author: mockUsers[4],
    content: "I did the same thing last semester. It got better once I started saying yes to small invites even when I didn't feel like it.",
    createdAt: daysAgo(0.8),
    upvotes: 10,
    downvotes: 0,
  },
  {
    id: "c11",
    postId: "p6",
    author: mockUsers[6],
    content: "You're not alone in this, even though it feels that way right now. Glad you shared it here.",
    createdAt: daysAgo(0.7),
    upvotes: 18,
    downvotes: 0,
  },

  // Post p7
  {
    id: "c12",
    postId: "p7",
    author: mockUsers[2],
    content: "Everyone's timeline looks different, even when it doesn't seem like it from the outside.",
    createdAt: daysAgo(1.8),
    upvotes: 7,
    downvotes: 0,
  },

  // Post p8
  {
    id: "c13",
    postId: "p8",
    author: mockUsers[0],
    content: "Keeping a consistent wake-up time, even on weekends, helped me more than trying to force an early bedtime.",
    createdAt: daysAgo(1.9),
    upvotes: 6,
    downvotes: 0,
  },
  {
    id: "c14",
    postId: "p8",
    author: mockUsers[3],
    content: "Cutting screens out an hour before bed made a bigger difference for me than I expected.",
    createdAt: daysAgo(1.7),
    upvotes: 5,
    downvotes: 0,
  },

  // Post p10
  {
    id: "c15",
    postId: "p10",
    author: mockUsers[5],
    content: "Love this list. Writing things down before bed has genuinely helped me stop overthinking at night.",
    createdAt: daysAgo(2.8),
    upvotes: 9,
    downvotes: 0,
  },
  {
    id: "c16",
    postId: "p10",
    author: mockUsers[7],
    content: "Short walks between classes sound simple but I'm going to try that this week.",
    createdAt: daysAgo(2.6),
    upvotes: 4,
    downvotes: 0,
  },

  // Post p11
  {
    id: "c17",
    postId: "p11",
    author: mockUsers[1],
    content: "Bringing it up early and calmly usually goes better than waiting until you're frustrated. It's a fair thing to raise.",
    createdAt: daysAgo(3.8),
    upvotes: 11,
    downvotes: 0,
  },
  {
    id: "c18",
    postId: "p11",
    author: mockUsers[6],
    content: "Group project stress is real and valid. You're not being difficult by wanting things split fairly.",
    createdAt: daysAgo(3.6),
    upvotes: 13,
    downvotes: 0,
  },

  // Post p12
  {
    id: "c19",
    postId: "p12",
    author: mockUsers[3],
    content: "It takes longer for some people, and that's completely normal. Clubs and smaller study groups helped me find people more than big events did.",
    createdAt: daysAgo(4.8),
    upvotes: 10,
    downvotes: 0,
  },
];