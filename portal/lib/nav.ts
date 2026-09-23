import { type Icon, Bell, BookOpen, CalendarBlank as CalendarDays, ClipboardText as ClipboardCheck, FileText, FolderOpen, GraduationCap, Handshake as HeartHandshake, House as Home, Tray as Inbox, SquaresFour as LayoutGrid, Lifebuoy as LifeBuoy, ListChecks, MapPin, ChatCircle as MessageCircle, Megaphone, Newspaper, Airplane as Plane, Scales as Scale, Scroll as ScrollText, Gear as Settings, ShieldCheck, User, Users, CheckSquare as Vote, ChartBar as BarChart3 } from "@phosphor-icons/react";
import type { Role } from "./types";

export interface NavItem {
  href: string;
  label: string;
  icon: Icon;
  badge?: "notices" | "queue" | "appeals" | "welfare" | "nominations" | "enquiries";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const association: NavItem[] = [
  { href: "/regions", label: "Cities", icon: MapPin },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/elections", label: "Elections", icon: Vote },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/guides", label: "University guides", icon: BookOpen },
];

export const NAV: Record<Role, { groups: NavGroup[]; tabs: NavItem[] }> = {
  student: {
    groups: [
      {
        label: "My file",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/profile", label: "Profile", icon: User },
          { href: "/documents", label: "Documents", icon: FolderOpen },
          { href: "/semesters", label: "Semesters", icon: GraduationCap },
          { href: "/notices", label: "Notices", icon: Bell, badge: "notices" },
        ],
      },
      {
        label: "Association",
        items: [
          ...association,
          { href: "/travel", label: "Travel", icon: Plane },
          { href: "/help", label: "Help", icon: LifeBuoy },
        ],
      },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/semesters", label: "Semesters", icon: GraduationCap },
      { href: "/documents", label: "Documents", icon: FolderOpen },
      { href: "/elections", label: "Elections", icon: Vote },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
  applicant: {
    groups: [
      {
        label: "Before you travel",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/regions", label: "Cities", icon: MapPin },
          { href: "/enquiries", label: "Ask a representative", icon: MessageCircle, badge: "enquiries" },
        ],
      },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/regions", label: "Cities", icon: MapPin },
      { href: "/enquiries", label: "Ask", icon: MessageCircle, badge: "enquiries" },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
  rep: {
    groups: [
      {
        label: "Your city",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/admin/enquiries", label: "Applicant enquiries", icon: Inbox, badge: "enquiries" },
          { href: "/admin/city-brief", label: "Good, bad, ugly", icon: FileText },
          { href: "/admin/city-articles", label: "City news", icon: Newspaper },
          { href: "/regions", label: "All cities", icon: MapPin },
        ],
      },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/admin/enquiries", label: "Ask inbox", icon: Inbox, badge: "enquiries" },
      { href: "/admin/city-brief", label: "Brief", icon: FileText },
      { href: "/regions", label: "Cities", icon: MapPin },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
  verifier: {
    groups: [
      {
        label: "Admin",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/admin/queue", label: "Queue", icon: Inbox, badge: "queue" },
          { href: "/admin/semesters", label: "Semester windows", icon: GraduationCap },
          { href: "/admin/students", label: "Students", icon: Users },
        ],
      },
      { label: "Association", items: [{ href: "/notices", label: "Notices", icon: Bell }, ...association] },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/admin/queue", label: "Queue", icon: Inbox, badge: "queue" },
      { href: "/admin/semesters", label: "Semesters", icon: GraduationCap },
      { href: "/admin/students", label: "Students", icon: Users },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
  appeals: {
    groups: [
      {
        label: "Admin",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/admin/appeals", label: "Appeals", icon: Scale, badge: "appeals" },
          { href: "/admin/students", label: "Students", icon: Users },
        ],
      },
      { label: "Association", items: [{ href: "/notices", label: "Notices", icon: Bell }, ...association] },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/admin/appeals", label: "Appeals", icon: Scale, badge: "appeals" },
      { href: "/admin/students", label: "Students", icon: Users },
      { href: "/notices", label: "Notices", icon: Bell },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
  welfare: {
    groups: [
      {
        label: "Admin",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/admin/welfare", label: "Welfare office", icon: HeartHandshake, badge: "welfare" },
        ],
      },
      { label: "Association", items: [{ href: "/notices", label: "Notices", icon: Bell }, ...association] },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/admin/welfare", label: "Welfare", icon: HeartHandshake, badge: "welfare" },
      { href: "/notices", label: "Notices", icon: Bell },
      { href: "/elections", label: "Elections", icon: Vote },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
  coordinator: {
    groups: [
      {
        label: "Admin",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/admin/coordinator", label: "Moscow students", icon: Users },
          { href: "/admin/coordinator/guide", label: "Guide editor", icon: BookOpen },
          { href: "/admin/coordinator/mentors", label: "Mentors", icon: HeartHandshake },
          { href: "/admin/students", label: "Student files", icon: FileText },
        ],
      },
      { label: "Association", items: [{ href: "/notices", label: "Notices", icon: Bell }, ...association] },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/admin/coordinator", label: "Students", icon: Users },
      { href: "/admin/coordinator/guide", label: "Guide", icon: BookOpen },
      { href: "/admin/coordinator/mentors", label: "Mentors", icon: HeartHandshake },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
  executive: {
    groups: [
      {
        label: "Admin",
        items: [
          { href: "/admin/analytics", label: "Oversight", icon: BarChart3 },
          { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
          { href: "/admin/blog", label: "Blog", icon: Newspaper },
          { href: "/admin/events", label: "Events", icon: CalendarDays },
          { href: "/admin/committee", label: "Committee cards", icon: ShieldCheck },
          { href: "/admin/files", label: "Constitution and minutes", icon: ScrollText },
          { href: "/admin/reports", label: "Semester report", icon: ClipboardCheck },
          { href: "/admin/semesters", label: "Semester windows", icon: GraduationCap },
          { href: "/admin/audit", label: "Audit log", icon: ListChecks },
        ],
      },
      { label: "Association", items: [{ href: "/notices", label: "Notices", icon: Bell }, ...association] },
    ],
    tabs: [
      { href: "/admin/analytics", label: "Oversight", icon: BarChart3 },
      { href: "/admin/announcements", label: "Notices", icon: Megaphone },
      { href: "/admin/committee", label: "Committee", icon: ShieldCheck },
      { href: "/admin/reports", label: "Reports", icon: ClipboardCheck },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
  officer: {
    groups: [
      {
        label: "Admin",
        items: [
          { href: "/home", label: "Home", icon: Home },
          { href: "/admin/elections", label: "Election console", icon: Vote, badge: "nominations" },
        ],
      },
      { label: "Association", items: [{ href: "/notices", label: "Notices", icon: Bell }, ...association] },
    ],
    tabs: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/admin/elections", label: "Console", icon: Vote, badge: "nominations" },
      { href: "/elections", label: "Public page", icon: Users },
      { href: "/notices", label: "Notices", icon: Bell },
      { href: "/more", label: "More", icon: LayoutGrid },
    ],
  },
};

export const SETTINGS_ITEM: NavItem = { href: "/settings", label: "Settings", icon: Settings };
