export type Role = 'admin' | 'user' | 'instructor';
export type Plan = 'free' | 'basic' | 'pro' | 'enterprise';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export type EventStatus = 'upcoming' | 'ongoing' | 'finished' | 'canceled';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone: string;
  bio: string;
  plan: Plan;
  enrolledCourses: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Course {
  _id: string;
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
  enrolledCount: number;
  rating: number;
  isFeatured: boolean;
  requirements: string[];
  whatYouLearn: string[];
  createdAt: string;
}

export interface Lesson {
  _id: string;
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
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  type: 'seminar' | 'workshop' | 'webinar' | 'conference';
  modality: 'in-person' | 'online' | 'hybrid';
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
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  author: User | string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  readTime: number;
  viewsCount: number;
  isFeatured: boolean;
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
  createdAt: string;
}

export interface Subscription {
  _id: string;
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
  _id: string;
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
  user: Pick<User, '_id' | 'name' | 'email' | 'role'>;
  accessToken: string;
  refreshToken: string;
}
