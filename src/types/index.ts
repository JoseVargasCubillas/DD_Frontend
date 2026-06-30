export type Role = "admin" | "user" | "instructor";
export type Plan = "free" | "basic" | "pro" | "enterprise";
export type CourseStatus = "draft" | "published" | "archived";
export type CourseType = "evergreen" | "cohort";
export type OrderStatus = "pending" | "completed" | "failed" | "refunded";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing";
export type EventStatus = "upcoming" | "ongoing" | "finished" | "canceled";
export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone: string;
  bio: string;
  plan: Plan;
  enrolledCourses: string[];
  tagIds?: string[];
  tags?: Tag[];
  notes?: string;
  contactStatus?: "lead" | "customer" | "churned";
  marketingStatus?: "never_subscribed" | "subscribed" | "unsubscribed";
  signInCount?: number;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Tag {
  id?: string;
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  contactsCount?: number;
  createdAt?: string;
}

export interface Module {
  id?: string;
  _id: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  lessonIds: string[];
  isPublished: boolean;
  lessons?: Lesson[];
  createdAt?: string;
}

export interface Package {
  id?: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  courseIds: string[];
  durationDays: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
}

export interface Promotion {
  id?: string;
  _id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  scope: "all" | "course" | "package";
  targetId: string;
  expiresAt: string | null;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Course {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo: string;
  price: number;
  salePrice?: number;
  currency: string;
  category: string;
  tags: string[];
  level: CourseLevel;
  status: CourseStatus;
  instructor: User | string;
  totalDuration: number;
  totalLessons: number;
  lessons?: Lesson[];
  enrolledCount: number;
  rating: number;
  isFeatured: boolean;
  requirements: string[];
  whatYouLearn: string[];
  createdAt: string;
  courseType?: CourseType;
  primaryColor?: string;
  accentColor?: string;
}

export interface OfferContentItem {
  courseId: string;
  access: "full" | "modules";
  moduleIds: string[];
}

export interface Offer {
  id?: string;
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: "standard" | "trial";
  status: "draft" | "published" | "archived";
  price: number;
  currency: string;
  content: OfferContentItem[];
  assignedUserIds: string[];
  startsAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface Lesson {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  course: string;
  order: number;
  description: string;
  videoUrl: string;
  duration: number;
  content: string;
  resources: { name: string; url: string }[];
  isPreview: boolean;
  isFree: boolean;
  thumbnail?: string;
  mediaType?: "none" | "video" | "audio";
  isPublished?: boolean;
  commentsVisibility?: "visible" | "hidden" | "locked";
}

export interface Event {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  type: "seminar" | "workshop" | "webinar" | "conference";
  modality: "in-person" | "online" | "hybrid";
  location: string;
  onlineUrl: string;
  startDate: string;
  endDate: string;
  price: number;
  salePrice?: number;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  instructor: User | string;
  isFeatured: boolean;
  agenda: { time: string; topic: string; speaker: string }[];
}

export interface BlogPost {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  author: User | string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  readTime: number;
  viewsCount: number;
  isFeatured: boolean;
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
  createdAt: string;
}

export interface Subscription {
  id?: string;
  _id?: string;
  user: string;
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface OrderItem {
  type: string;
  refId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  _id?: string;
  user?: User | string;
  userId?: string;
  customer?: User | string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  contactId?: string;
  subscriptionId?: string;
  paymentIntentId?: string;
  paymentProvider?: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: OrderStatus;
  paidAt?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; pages: number };
}

export interface AuthResult {
  user: Pick<User, "id" | "name" | "email" | "role">;
  accessToken: string;
  refreshToken: string;
}
