interface WhatWeDoItem {
  title: string;
  description: string;
}

interface LeadershipMember {
  photo: File | null;
  photoPreview: string;
  name: string;
  title: string;
  bio: string;
}

interface Program {
  title: string;
  description: string;
  impact: string;
}

export interface SiteData {
  orgName: string;
  slug: string;
  logo: File | null;
  logoPreview: string;
  tagline: string;
  accentColor: string;
  fontFamily: string;
  heroImage: File | null;
  heroImagePreview: string;
  missionStatement: string;
  whatWeDo: WhatWeDoItem[];
  ctaText: string;
  aboutMission: string;
  leadership: LeadershipMember[];
  partners: string;
  sponsers: File | null;
  sponsersPreview: string;
  programs: Program[];
  volunteerText: string;
  googleFormEmbed: string;
  donateText: string;
  paymentInfo: string;
  venmoLink: string;
  paypalLink: string;
  address: string;
  email: string;
  phone: string;
  officeHours: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export interface Website {
  id: string;
  user_id: string;
  slug: string;
  org_name: string;
  site_data: SiteData;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email?: string;
}