import fs from "fs";
import path from "path";
import * as ph from "@phosphor-icons/react";

/** Lucide export name → Phosphor export name */
const MAP = {
  Home: "House",
  Bell: "Bell",
  User: "User",
  Vote: "CheckSquare",
  Newspaper: "Newspaper",
  CalendarDays: "CalendarBlank",
  CalendarPlus: "CalendarPlus",
  BookOpen: "BookOpen",
  Plane: "Airplane",
  LifeBuoy: "Lifebuoy",
  LayoutGrid: "SquaresFour",
  Settings: "Gear",
  Inbox: "Tray",
  GraduationCap: "GraduationCap",
  Users: "Users",
  Scale: "Scales",
  HeartHandshake: "Handshake",
  MapPin: "MapPin",
  FileText: "FileText",
  ShieldCheck: "ShieldCheck",
  ScrollText: "Scroll",
  ListChecks: "ListChecks",
  Megaphone: "Megaphone",
  ClipboardCheck: "ClipboardText",
  BarChart3: "ChartBar",
  MessageCircle: "ChatCircle",
  ArrowRight: "ArrowRight",
  ArrowLeft: "ArrowLeft",
  Printer: "Printer",
  Send: "PaperPlaneTilt",
  Check: "Check",
  Lock: "Lock",
  Plus: "Plus",
  Trash2: "Trash",
  X: "X",
  ChevronDown: "CaretDown",
  ChevronRight: "CaretRight",
  ChevronLeft: "CaretLeft",
  Hourglass: "Hourglass",
  UserPlus: "UserPlus",
  RefreshCw: "ArrowsClockwise",
  UploadCloud: "CloudArrowUp",
  CalendarClock: "Calendar",
  CheckCircle2: "CheckCircle",
  HelpCircle: "Question",
  XCircle: "XCircle",
  CheckCheck: "Checks",
  Gavel: "Gavel",
  Info: "Info",
  MessageSquare: "ChatText",
  Phone: "Phone",
  Siren: "Siren",
  Upload: "UploadSimple",
  Search: "MagnifyingGlass",
  ArrowDown: "ArrowDown",
  ArrowUp: "ArrowUp",
  Eye: "Eye",
  Pencil: "PencilSimple",
  PlaneLanding: "AirplaneLanding",
  ChevronsRight: "CaretDoubleRight",
  Trophy: "Trophy",
  Download: "DownloadSimple",
  ImageIcon: "Image",
  Mail: "Envelope",
  UserX: "UserMinus",
  AlertOctagon: "WarningOctagon",
  Monitor: "Monitor",
  Moon: "Moon",
  Sun: "Sun",
  LogOut: "SignOut",
  AlertCircle: "WarningCircle",
  UserRound: "UserCircle",
  CircleDot: "Circle",
  Clock: "Clock",
  AlertTriangle: "Warning",
  RotateCcw: "ArrowCounterClockwise",
  RotateCw: "ArrowClockwise",
  ZoomIn: "MagnifyingGlassPlus",
  ZoomOut: "MagnifyingGlassMinus",
  Compass: "Compass",
  Camera: "Camera",
  FileJson: "FileJs",
  FolderOpen: "FolderOpen",
  MailCheck: "EnvelopeSimple",
  ShieldAlert: "ShieldWarning",
  WifiOff: "WifiSlash",
  FilePlus2: "FilePlus",
  Loader2: "CircleNotch",
  Keyboard: "Keyboard",
  FileWarning: "Warning",
  UserRoundPen: "PencilSimpleLine",
  BookUser: "AddressBook",
  CreditCard: "CreditCard",
  FileBadge: "Certificate",
  FileCheck2: "File",
  HeartPulse: "Heartbeat",
  IdCard: "IdentificationCard",
  Landmark: "Buildings",
  ShieldPlus: "ShieldPlus",
  Stamp: "Stamp",
};

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (["node_modules", ".next", "scripts", "prisma"].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const missing = Object.entries(MAP)
  .filter(([, to]) => typeof ph[to] !== "object" && typeof ph[to] !== "function")
  .map(([from, to]) => `${from}→${to}`);
if (missing.length) {
  console.error("Missing phosphor icons:", missing);
  process.exit(1);
}

function rewriteImportBody(body) {
  const parts = body
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const out = [];
  let needIconType = false;
  for (const p of parts) {
    const isType = /^type\s+/.test(p);
    const raw = p.replace(/^type\s+/, "").trim();
    const [name, alias] = raw.split(/\s+as\s+/).map((s) => s.trim());
    if (name === "LucideIcon") {
      needIconType = true;
      continue;
    }
    const mapped = MAP[name];
    if (!mapped) throw new Error(`Unmapped icon: ${name}`);
    const local = alias || name;
    // Keep Lucide local names so JSX `<Vote />` still works via alias
    if (mapped === local) out.push(isType ? `type ${mapped}` : mapped);
    else out.push(`${mapped} as ${local}`);
  }
  if (needIconType) out.unshift("type Icon");
  return out.join(", ");
}

let changed = 0;
for (const file of walk(".")) {
  let text = fs.readFileSync(file, "utf8");
  if (!text.includes("lucide-react")) continue;
  const orig = text;

  text = text.replace(
    /import\s+type\s*\{([^}]+)\}\s*from\s*["']lucide-react["']\s*;?/g,
    (_, body) => {
      const rewritten = rewriteImportBody(body);
      // only type Icon expected
      return `import type { ${rewritten.replace(/^type\s+/, "")} } from "@phosphor-icons/react";`;
    },
  );

  text = text.replace(
    /import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']\s*;?/g,
    (_, body) => `import { ${rewriteImportBody(body)} } from "@phosphor-icons/react";`,
  );

  text = text.replace(/\bLucideIcon\b/g, "Icon");
  text = text.replace(/\s*strokeWidth=\{[^}]+\}/g, "");

  // CircleNotch used as Loader2 — add spin class where Loader2 was used with animate-spin already
  // Phosphor CircleNotch needs animate-spin; button already has it likely

  if (text !== orig) {
    fs.writeFileSync(file, text);
    changed++;
    console.log("updated", file);
  }
}
console.log("files changed:", changed);
