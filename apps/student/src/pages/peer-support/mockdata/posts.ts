import type { Post } from "../types/peerSupport";
import { mockUsers } from "./users";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const mockPosts: Post[] = [
  {
    id: "p1",
    author: mockUsers[0],
    topicId: "t1",
    title: "Feeling overwhelmed with college work",
    content:
      "I've been struggling to keep up with assignments this week. Sometimes it feels like everything is piling up at once and I don't know where to start. Anyone else dealing with this right now?",
    createdAt: hoursAgo(2),
    upvotes: 24,
    downvotes: 1,
    commentCount: 3,
  },
  {
    id: "p2",
    author: mockUsers[2],
    topicId: "t2",
    title: "Anyone else get anxious before every exam?",
    content:
      "Even when I've studied enough, I still get this wave of panic right before exams start. My hands shake and I blank out on things I definitely know. Would love to hear how others deal with this.",
    createdAt: hoursAgo(5),
    upvotes: 31,
    downvotes: 0,
    commentCount: 2,
  },
  {
    id: "p3",
    author: mockUsers[4],
    topicId: "t3",
    title: "First semester is harder than I expected",
    content:
      "I thought I'd adjust quickly to college life, but between managing my own schedule and being away from home, it's been a lot. Slowly figuring out a routine that works.",
    createdAt: hoursAgo(8),
    upvotes: 18,
    downvotes: 0,
    commentCount: 1,
  },
  {
    id: "p4",
    author: mockUsers[1],
    topicId: "t4",
    title: "My parents expect straight A's and I'm exhausted",
    content:
      "I know they mean well, but the pressure to keep a perfect GPA is wearing me down. I feel like I can't tell them how tired I actually am.",
    createdAt: hoursAgo(10),
    upvotes: 42,
    downvotes: 2,
    commentCount: 2,
  },
  {
    id: "p5",
    author: mockUsers[5],
    topicId: "t5",
    title: "Long distance relationship during college is tough",
    content:
      "My partner and I are three time zones apart and it's harder than either of us expected. Some days I wonder if we're just growing apart slowly.",
    createdAt: daysAgo(1),
    upvotes: 15,
    downvotes: 1,
    commentCount: 0,
  },
  {
    id: "p6",
    author: mockUsers[3],
    topicId: "t6",
    title: "Eating lunch alone again and it's starting to get to me",
    content:
      "I moved to a new campus this year and haven't really made close friends yet. Most days I eat alone and scroll my phone just to feel less awkward sitting by myself.",
    createdAt: daysAgo(1),
    upvotes: 37,
    downvotes: 0,
    commentCount: 3,
  },
  {
    id: "p7",
    author: mockUsers[7],
    topicId: "t7",
    title: "Comparing myself to classmates constantly",
    content:
      "Everyone around me seems to have their life figured out — internships, relationships, plans. I know it's probably not that simple for them either, but it's hard not to feel behind.",
    createdAt: daysAgo(2),
    upvotes: 22,
    downvotes: 1,
    commentCount: 1,
  },
  {
    id: "p8",
    author: mockUsers[6],
    topicId: "t8",
    title: "Can't get my sleep schedule back on track",
    content:
      "I've been going to bed around 3am for weeks now and I know it's affecting everything else. Any tips that actually worked for resetting your sleep schedule during the semester?",
    createdAt: daysAgo(2),
    upvotes: 19,
    downvotes: 0,
    commentCount: 2,
  },
  {
    id: "p9",
    author: mockUsers[0],
    topicId: "t9",
    title: "Homesick but don't want to worry my family",
    content:
      "I miss home a lot more than I expected to. I don't want to tell my parents because I don't want them to worry, so I've just been keeping it to myself.",
    createdAt: daysAgo(3),
    upvotes: 27,
    downvotes: 0,
    commentCount: 0,
  },
  {
    id: "p10",
    author: mockUsers[2],
    topicId: "t10",
    title: "Small things that have helped me lately",
    content:
      "Wanted to share a few small things that have made a difference for me recently: short walks between classes, writing things down before bed, and actually eating breakfast. Curious what's worked for others.",
    createdAt: daysAgo(3),
    upvotes: 33,
    downvotes: 0,
    commentCount: 2,
  },
  {
    id: "p11",
    author: mockUsers[4],
    topicId: "t1",
    title: "Group projects are stressing me out more than exams",
    content:
      "I don't mind working hard on my own, but coordinating with a group that doesn't reply or split work evenly is draining. Not sure how to bring it up without sounding difficult.",
    createdAt: daysAgo(4),
    upvotes: 20,
    downvotes: 1,
    commentCount: 2,
  },
  {
    id: "p12",
    author: mockUsers[1],
    topicId: "t3",
    title: "How do you actually make friends after freshman year?",
    content:
      "It feels like everyone already found their friend groups in the first few weeks. I'm a bit further along now and still figuring out where I fit in socially.",
    createdAt: daysAgo(5),
    upvotes: 29,
    downvotes: 0,
    commentCount: 1,
  },
];