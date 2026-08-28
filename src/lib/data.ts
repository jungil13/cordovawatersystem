import { supabase, isSupabaseConfigured } from "./supabase";

export interface RateBracket {
  id?: string;
  range: string;
  minCuM: number;
  maxCuM: number | null;
  rate: number;
  isMinimum: boolean;
  remarks: string;
}

export const initialRates: RateBracket[] = [
  {
    range: "0 – 5 cu. m",
    minCuM: 0,
    maxCuM: 5,
    rate: 220,
    isMinimum: true,
    remarks: "Minimum charge",
  },
  {
    range: "6 – 10 cu. m",
    minCuM: 6,
    maxCuM: 10,
    rate: 48,
    isMinimum: false,
    remarks: "Per cubic meter",
  },
  {
    range: "11 – 20 cu. m",
    minCuM: 11,
    maxCuM: 20,
    rate: 54,
    isMinimum: false,
    remarks: "Per cubic meter",
  },
  {
    range: "21 – 30 cu. m",
    minCuM: 21,
    maxCuM: 30,
    rate: 65,
    isMinimum: false,
    remarks: "Per cubic meter",
  },
  {
    range: "31+ cu. m",
    minCuM: 31,
    maxCuM: null,
    rate: 92,
    isMinimum: false,
    remarks: "Per cubic meter",
  },
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  badge: string;
  img: string;
  display_order?: number;
}

// Exactly 3 Team Members
export const initialTeam: TeamMember[] = [
  {
    id: "1",
    name: "Angelo Dalapo",
    role: "Officer-in-Charge",
    badge: "OIC",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&auto=format",
    display_order: 1,
  },
  {
    id: "2",
    name: "Joann F. Adoldo",
    role: "Billing Officer",
    badge: "BILLING OFFICER",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop&auto=format",
    display_order: 2,
  },
  {
    id: "3",
    name: "ARIEL JANE L. FERRER",
    role: "Admin & Accounting",
    badge: "ADMIN & ACCOUNTING",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=600&fit=crop&auto=format",
    display_order: 3,
  },
];

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag?: string;
  display_order?: number;
}

export const initialPhotos: GalleryPhoto[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1774789599304-cca1e1ffbb95?w=800&h=600&fit=crop&auto=format",
    alt: "Water treatment facility aerial view",
    caption: "Our Main Water Treatment Facility in Gabi",
    tag: "Facilities",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1787150741378-ad5a5dee8501?w=800&h=600&fit=crop&auto=format",
    alt: "Water reservoir",
    caption: "Elevated Water Reservoir & Storage Tank",
    tag: "Storage",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop&auto=format",
    alt: "Water distribution pipes",
    caption: "High-Pressure Main Distribution Pipeline",
    tag: "Piping",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1693907986952-3cd372e4c9d8?w=800&h=600&fit=crop&auto=format",
    alt: "Pipeline installation",
    caption: "New Pipeline Expansion & House Connections",
    tag: "Projects",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1649516394864-9596d50872ba?w=800&h=600&fit=crop&auto=format",
    alt: "Children at water faucet",
    caption: "Clean, Safe Water for Every Cordova Household",
    tag: "Community",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1783393208952-5cf06f930c42?w=800&h=600&fit=crop&auto=format",
    alt: "Industrial water facility",
    caption: "Electro-Mechanical Filtration Unit Upgrades",
    tag: "Technology",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1538474705339-e87de81450e8?w=800&h=600&fit=crop&auto=format",
    alt: "Pump station equipment",
    caption: "Monitored Automatic Booster Pump Station",
    tag: "Pumping",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1759860002248-356d31d06195?w=800&h=600&fit=crop&auto=format",
    alt: "Community water access",
    caption: "Barangay Public Tap Stand Program",
    tag: "Community",
  },
];

export interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  img: string;
  published?: boolean;
}

export const initialNews: NewsItem[] = [
  {
    id: "1",
    category: "Announcement",
    date: "August 20, 2026",
    title: "CWSI Completes Phase 2 Pipeline Expansion in Brgy. Gabi",
    excerpt: "The second phase of our major pipeline expansion project has been successfully completed, extending water service coverage to 300 additional households.",
    content: `Cordova Water System Inc. is proud to announce the successful completion of Phase 2 of our Pipeline Expansion Project in Brgy. Gabi, Cordova, Cebu. This milestone project extends our water distribution network to reach an additional 300 households that previously had limited access to reliable potable water.\n\nThe expansion involved the installation of over 2.5 kilometers of new HDPE pipes, two new pressure chambers, and connection points to service an estimated 1,200 new beneficiaries.\n\n"This is a major step in fulfilling our commitment to provide safe and reliable water to every resident in our coverage area," said Officer-in-Charge Angelo Dalapo.`,
    img: "https://images.unsplash.com/photo-1693907986952-3cd372e4c9d8?w=800&h=450&fit=crop&auto=format",
    published: true,
  },
  {
    id: "2",
    category: "Notice",
    date: "August 15, 2026",
    title: "Scheduled Maintenance: Water Interruption on August 22, 2026",
    excerpt: "CWSI informs all consumers that there will be a temporary water service interruption on August 22, 2026 from 8:00 AM to 5:00 PM due to scheduled maintenance.",
    content: `Cordova Water System Inc. would like to inform all valued consumers that there will be a temporary interruption of water service on August 22, 2026 (Saturday) from 8:00 AM to 5:00 PM.\n\nThe interruption is necessary to allow our technical crew to perform preventive maintenance on the main pump station and to replace aging gate valves along the primary distribution line.\n\nAffected areas include all zones covered by the Brgy. Gabi distribution network. We advise all consumers to store adequate water supply before 8:00 AM.`,
    img: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=450&fit=crop&auto=format",
    published: true,
  },
  {
    id: "3",
    category: "Achievement",
    date: "July 30, 2026",
    title: "CWSI Earns 'Outstanding Water Utility' Award from LWUA Region 7",
    excerpt: "We are honored to announce that Cordova Water System Inc. has received the Outstanding Water Utility Award from the Local Water Utilities Administration Region 7.",
    content: `Cordova Water System Inc. (CWSI) has been recognized as an Outstanding Water Utility for 2026 by the Local Water Utilities Administration (LWUA) Regional Office 7.\n\nThe recognition is given to water utilities that demonstrate excellence in water quality management, customer service, financial viability, and community development programs.`,
    img: "https://images.unsplash.com/photo-1774789599304-cca1e1ffbb95?w=800&h=450&fit=crop&auto=format",
    published: true,
  },
  {
    id: "4",
    category: "Program",
    date: "July 10, 2026",
    title: "CWSI Launches Free Water Conservation Seminar for Consumers",
    excerpt: "As part of our commitment to sustainable water management, CWSI is offering free water conservation seminars to all registered consumers and community members.",
    content: `In line with our commitment to sustainable water resource management, Cordova Water System Inc. is launching a series of free Water Conservation Seminars for all consumers and community members in Brgy. Gabi, Cordova, Cebu.\n\nRegistration is free and open to all residents.`,
    img: "https://images.unsplash.com/photo-1649516394864-9596d50872ba?w=800&h=450&fit=crop&auto=format",
    published: true,
  },
];

export interface InquiryApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Application" | "Inquiry" | "Leak Report" | "Billing" | "Other";
  subject: string;
  message: string;
  status: "Pending" | "In Review" | "Contacted" | "Resolved";
  createdAt: string;
}

export const initialInquiries: InquiryApplication[] = [
  {
    id: "inq-101",
    name: "Roberto Villamor",
    email: "roberto.v@gmail.com",
    phone: "0917-889-1234",
    type: "Application",
    subject: "New Residential Water Meter Application - Purok 4",
    message: "Good day. I am submitting our application for a new residential water line in Purok 4, Brgy. Gabi. Land title photocopy and barangay clearance are ready for inspection.",
    status: "Pending",
    createdAt: "2026-08-27 09:30 AM",
  },
  {
    id: "inq-102",
    name: "Elena Tan",
    email: "elena.tan@outlook.com",
    phone: "0922-456-7890",
    type: "Billing",
    subject: "Inquiry on GCash Billing Verification",
    message: "Sent my August payment via GCash with Ref #893472019. Kindly confirm if posted on account #CWSI-00482.",
    status: "Resolved",
    createdAt: "2026-08-26 02:15 PM",
  },
];

// Helper getters
export const getStoredRates = (): RateBracket[] => initialRates;
export const getStoredGallery = (): GalleryPhoto[] => initialPhotos;
export const getStoredNews = (): NewsItem[] => initialNews;
export const getStoredTeam = (): TeamMember[] => initialTeam;
export const getStoredInquiries = (): InquiryApplication[] => initialInquiries;

// Direct Supabase Query Functions
export async function fetchTeam(): Promise<TeamMember[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(3);
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          role: d.role,
          badge: d.badge || d.category || "STAFF",
          img: d.img,
          display_order: d.display_order,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch team error:", e);
    }
  }
  return initialTeam;
}

export async function fetchNews(): Promise<NewsItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          category: d.category,
          date: d.date,
          title: d.title,
          excerpt: d.excerpt,
          content: d.content,
          img: d.img,
          published: d.is_published,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch news error:", e);
    }
  }
  return initialNews;
}

export async function fetchGallery(): Promise<GalleryPhoto[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          src: d.src,
          alt: d.alt || d.caption || "Gallery Photo",
          caption: d.caption,
          tag: d.tag || "Facilities",
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch gallery error:", e);
    }
  }
  return initialPhotos;
}

export async function fetchInquiries(): Promise<InquiryApplication[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          phone: d.phone,
          type: d.inquiry_type,
          subject: d.subject,
          message: d.message,
          status: d.status,
          createdAt: new Date(d.created_at).toLocaleString(),
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch inquiries error:", e);
    }
  }
  return initialInquiries;
}
