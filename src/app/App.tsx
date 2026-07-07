import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import firstDayPhoto from "@/imports/first_day_at_school.jpg";
import aehLogo from "@/imports/AEH_LOGO.jpeg";
import chopBoxImg from "@/imports/chop_box.jpg";
import aneresPillow from "@/imports/aneres_pillow_for_shs.jpg";
import aneresBed from "@/imports/aneres_bed.jpg";
import {
  ShoppingCart, Search, Menu, X, Star, Package, BookOpen, Truck,
  CreditCard, User, Heart, ArrowRight, Check, Plus, Minus,
  GraduationCap, Ticket, ShoppingBag, Download, Clock, Calendar,
  Shield, Headphones, Zap, Newspaper, ChevronLeft, BookMarked,
  Wallet, RefreshCcw, Facebook, Twitter, Instagram, Youtube,
  ChevronDown, MapPin, Phone, Globe, Trash2, Building2,
  SlidersHorizontal, LayoutDashboard, Settings, Users, Tag,
  LogOut, Bell, Pencil, Eye, EyeOff, BarChart3, TrendingUp,
  Upload, FileText, ChevronRight, Lock, AlertCircle, ToggleLeft,
  ToggleRight, UserCheck, PackageCheck,
} from "lucide-react";

type Page = "home" | "prospectus" | "tvet" | "shop" | "packages" | "vouchers" | "schools" | "dashboard" | "news" | "admin";

// ── Types ─────────────────────────────────────────────────────────────────────

type BuilderItem = { id: string; name: string; qty: number; price: number; category: string; icon: string };

type School = {
  id: string; name: string; region: string; district: string;
  category: "A" | "B" | "C"; type: "Public" | "Private";
  gender: "Boys" | "Girls" | "Mixed"; boarding: "Boarding" | "Day" | "Both";
  programmes: string[]; badges: string[]; description: string;
  established: number; population: number; motto: string;
  image: string; facilities: string[]; featured: boolean;
};

// ── Data ─────────────────────────────────────────────────────────────────────

const PROSPECTUS_BOARDING = [
  { id: 1, name: "Foam Mattress (Single)", price: 280, image: "photo-1555041469-a586c61ea9bc", available: true, category: "Bedding", desc: "Standard SHS-approved single foam mattress" },
  { id: 2, name: "Bedsheet Set (2 pairs)", price: 85, image: "photo-1540518614846-7eded433c457", available: true, category: "Bedding", desc: "2 pairs white bedsheets as per prospectus" },
  { id: 3, name: "Pillow & Pillowcase", price: 45, image: "photo-1592789705501-f9ae4278a9c9", available: true, category: "Bedding", desc: "Standard pillow with 2 pillowcases" },
  { id: 4, name: "Metal Storage Trunk", price: 320, image: "photo-1586348943529-beaae6c28db9", available: true, category: "Storage", desc: "Durable metal trunk for secure storage" },
  { id: 5, name: "Plastic Bucket (Set of 2)", price: 35, image: "photo-1585386959984-a4155224a1ad", available: true, category: "Utilities", desc: "2 standard plastic buckets" },
  { id: 6, name: "School Backpack", price: 150, image: "photo-1553062407-98eeb64c6a62", available: true, category: "Bags", desc: "Heavy-duty school backpack with compartments" },
  { id: 7, name: "Cutlery & Plate Set", price: 55, image: "photo-1584568694244-14fbdf83bd30", available: true, category: "Utilities", desc: "Plate, cup, spoon, fork, knife" },
  { id: 8, name: "Stationery Bundle", price: 120, image: "photo-1497633762265-9d179a990aa6", available: true, category: "Stationery", desc: "Exercise books, pens, pencils, ruler, eraser" },
];

const PROSPECTUS_DAY = [
  { id: 1, name: "School Backpack", price: 150, image: "photo-1553062407-98eeb64c6a62", available: true, category: "Bags", desc: "Heavy-duty school backpack" },
  { id: 2, name: "Stationery Bundle", price: 120, image: "photo-1497633762265-9d179a990aa6", available: true, category: "Stationery", desc: "Exercise books, pens, pencils, ruler, eraser" },
  { id: 3, name: "Black School Shoes", price: 180, image: "photo-1542291026-7eec264c27ff", available: true, category: "Footwear", desc: "Durable black leather school shoes" },
  { id: 4, name: "Lunch Box Set", price: 45, image: "photo-1583863788434-e58a36330cf0", available: true, category: "Utilities", desc: "Insulated lunch box with compartments" },
  { id: 5, name: "Water Bottle (1L)", price: 30, image: "photo-1585386959984-a4155224a1ad", available: true, category: "Utilities", desc: "BPA-free 1L water bottle" },
];

// ── Prospectus category data (GES Harmonized) ────────────────────────────────

const PROSPECTUS_CATEGORIES_BOARDING = [
  { name: "School Essentials", icon: "🎒", items: [
    { id: 101, name: "Metal Storage Trunk", price: 320, desc: "Secure lockable trunk — boarding school standard", image: "photo-1586348943529-beaae6c28db9" },
    { id: 102, name: "School Backpack", price: 150, desc: "Heavy-duty backpack with compartments", image: "photo-1553062407-98eeb64c6a62" },
    { id: 103, name: "Plastic Buckets ×2", price: 35, desc: "Standard plastic buckets for washing", image: "photo-1585386959984-a4155224a1ad" },
    { id: 104, name: "Cutlery & Plate Set", price: 55, desc: "Plate, cup, spoon, fork and knife set", image: "photo-1584568694244-14fbdf83bd30" },
    { id: 105, name: "Padlock (for trunk)", price: 25, desc: "Heavy-duty padlock for trunk security", image: "photo-1586348943529-beaae6c28db9" },
  ]},
  { name: "Bedding", icon: "🛏️", items: [
    { id: 201, name: "Foam Mattress (Single)", price: 280, desc: "Standard SHS-approved single foam mattress", image: "__local__aneresBed" },
    { id: 202, name: "Bedsheet Set (2 pairs)", price: 85, desc: "White bedsheets — 2 pairs as per GES requirements", image: "photo-1540518614846-7eded433c457" },
    { id: 203, name: "Pillow & Pillowcase ×2", price: 65, desc: "Aneres SHS pillow with 2 pillowcases", image: "__local__aneresPillow" },
    { id: 204, name: "Blanket / Duvet", price: 95, desc: "Warm blanket for cold nights", image: "photo-1555041469-a586c61ea9bc" },
  ]},
  { name: "Clothing", icon: "👕", items: [
    { id: 301, name: "School Shoes (Black)", price: 180, desc: "Durable black leather school shoes", image: "photo-1542291026-7eec264c27ff" },
    { id: 302, name: "School Sandals / Slippers", price: 55, desc: "Durable sandals for general use", image: "photo-1542291026-7eec264c27ff" },
    { id: 303, name: "Socks (6 pairs)", price: 40, desc: "White school socks — 6 pairs", image: "photo-1585386959984-a4155224a1ad" },
  ]},
  { name: "Stationery", icon: "📝", items: [
    { id: 401, name: "Exercise Books (pack of 20)", price: 80, desc: "80-leaf exercise books for all subjects", image: "photo-1497633762265-9d179a990aa6" },
    { id: 402, name: "Pens & Pencils Set", price: 25, desc: "Blue, black, red pens + pencils and eraser", image: "photo-1497633762265-9d179a990aa6" },
    { id: 403, name: "Ruler & Mathematical Set", price: 35, desc: "30cm ruler, geometry set and compass", image: "photo-1497633762265-9d179a990aa6" },
    { id: 404, name: "File Jackets ×5", price: 20, desc: "Durable file jackets for organizing notes", image: "photo-1497633762265-9d179a990aa6" },
    { id: 405, name: "Scientific Calculator", price: 95, desc: "GES-approved scientific calculator", image: "photo-1498049794561-7780e7231661" },
  ]},
  { name: "Personal Care", icon: "🧴", items: [
    { id: 501, name: "Toiletries Bundle", price: 85, desc: "Soap, shampoo, toothbrush, toothpaste, deodorant", image: "photo-1585386959984-a4155224a1ad" },
    { id: 502, name: "Bath Towels ×2", price: 55, desc: "2 medium-sized quality bath towels", image: "photo-1585386959984-a4155224a1ad" },
    { id: 503, name: "Nail & Grooming Kit", price: 30, desc: "Nail cutter, comb, mirror and brush set", image: "photo-1585386959984-a4155224a1ad" },
  ]},
  { name: "Food Storage", icon: "🍱", items: [
    { id: 601, name: "Food Containers with Lids ×3", price: 45, desc: "Airtight plastic containers for food storage", image: "photo-1583863788434-e58a36330cf0" },
    { id: 602, name: "Water Bottle (1.5L)", price: 35, desc: "BPA-free 1.5L water bottle", image: "photo-1585386959984-a4155224a1ad" },
  ]},
  { name: "Cleaning Items", icon: "🧹", items: [
    { id: 701, name: "Washing Detergent", price: 25, desc: "Washing powder for laundry and dishes", image: "photo-1585386959984-a4155224a1ad" },
    { id: 702, name: "Broom & Dustpan Set", price: 40, desc: "For keeping your hostel area tidy", image: "photo-1585386959984-a4155224a1ad" },
    { id: 703, name: "Disinfectant Spray", price: 30, desc: "For sanitizing surfaces and spaces", image: "photo-1585386959984-a4155224a1ad" },
  ]},
  { name: "Learning Materials", icon: "📚", items: [
    { id: 801, name: "English Dictionary", price: 65, desc: "Comprehensive English dictionary for all students", image: "photo-1481627834876-b7833e8f5570" },
    { id: 802, name: "Atlas", price: 75, desc: "School atlas for geography and social studies", image: "photo-1481627834876-b7833e8f5570" },
  ]},
];

const PROSPECTUS_CATEGORIES_DAY = [
  { name: "School Essentials", icon: "🎒", items: [
    { id: 111, name: "School Backpack", price: 150, desc: "Heavy-duty backpack with compartments", image: "photo-1553062407-98eeb64c6a62" },
    { id: 112, name: "Lunch Box Set", price: 45, desc: "Insulated lunch box with compartments", image: "photo-1583863788434-e58a36330cf0" },
    { id: 113, name: "Water Bottle (1L)", price: 30, desc: "BPA-free 1L water bottle", image: "photo-1585386959984-a4155224a1ad" },
  ]},
  { name: "Clothing", icon: "👕", items: [
    { id: 311, name: "School Shoes (Black)", price: 180, desc: "Durable black leather school shoes", image: "photo-1542291026-7eec264c27ff" },
    { id: 312, name: "Socks (4 pairs)", price: 30, desc: "White school socks — 4 pairs", image: "photo-1585386959984-a4155224a1ad" },
  ]},
  { name: "Stationery", icon: "📝", items: [
    { id: 411, name: "Exercise Books (pack of 20)", price: 80, desc: "80-leaf exercise books for all subjects", image: "photo-1497633762265-9d179a990aa6" },
    { id: 412, name: "Pens & Pencils Set", price: 25, desc: "Blue, black, red pens + pencils and eraser", image: "photo-1497633762265-9d179a990aa6" },
    { id: 413, name: "Ruler & Mathematical Set", price: 35, desc: "30cm ruler, geometry set and compass", image: "photo-1497633762265-9d179a990aa6" },
    { id: 414, name: "File Jackets ×5", price: 20, desc: "Durable file jackets for organizing notes", image: "photo-1497633762265-9d179a990aa6" },
    { id: 415, name: "Scientific Calculator", price: 95, desc: "GES-approved scientific calculator", image: "photo-1498049794561-7780e7231661" },
  ]},
  { name: "Personal Care", icon: "🧴", items: [
    { id: 511, name: "Basic Toiletries Set", price: 55, desc: "Soap, toothbrush, toothpaste and deodorant", image: "photo-1585386959984-a4155224a1ad" },
    { id: 512, name: "Bath Towel", price: 35, desc: "Quality bath towel", image: "photo-1585386959984-a4155224a1ad" },
  ]},
  { name: "Learning Materials", icon: "📚", items: [
    { id: 811, name: "English Dictionary", price: 65, desc: "Comprehensive English dictionary", image: "photo-1481627834876-b7833e8f5570" },
    { id: 812, name: "Atlas", price: 75, desc: "School atlas for geography and social studies", image: "photo-1481627834876-b7833e8f5570" },
  ]},
];

const PACKAGES = [
  {
    id: "standard",
    name: "Starter ChopBox",
    subtitle: "The Essentials",
    tagline: "Perfect for students who need the essentials.",
    price: 350,
    originalPrice: 420,
    badge: "Recommended",
    badgeColor: "bg-blue-500",
    emoji: "🎒",
    items: [
      { name: "Shemima Biscuits", qty: 2, icon: "🍪" },
      { name: "White/Brown Sugar", qty: 1, icon: "🍬" },
      { name: "Liquid Milk", qty: 2, icon: "🥛" },
      { name: "Bel Cola", qty: 1, icon: "🥤" },
      { name: "Obaaya Sardines", qty: 5, icon: "🐟" },
      { name: "Groundnuts", qty: 1, icon: "🥜" },
      { name: "Gari", qty: 1, icon: "🫙" },
      { name: "Milo Sachets", qty: 1, icon: "☕" },
      { name: "Digestive Biscuits", qty: 1, icon: "🍪" },
      { name: "Lizzy Shito", qty: 2, icon: "🌶️" },
      { name: "Fruity Drink", qty: 1, icon: "🧃" },
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe ChopBox",
    subtitle: "The Comfortable Student Package",
    tagline: "Ideal for students who want comfort throughout the term.",
    price: 650,
    originalPrice: 790,
    badge: "Most Popular",
    badgeColor: "bg-[#F59E0B]",
    emoji: "🍱",
    items: [
      { name: "Gari", qty: 2, icon: "🫙" },
      { name: "White/Brown Sugar", qty: 1, icon: "🍬" },
      { name: "Groundnuts", qty: 1, icon: "🥜" },
      { name: "Margarine", qty: 1, icon: "🧈" },
      { name: "Coated Groundnut Snacks", qty: 1, icon: "🥜" },
      { name: "Milo Tin", qty: 1, icon: "☕" },
      { name: "Nido Tin", qty: 1, icon: "🥛" },
      { name: "Digestive Biscuits", qty: 1, icon: "🍪" },
      { name: "Trident Gum", qty: 1, icon: "🍬" },
      { name: "Juice", qty: 1, icon: "🧃" },
      { name: "Malt", qty: 1, icon: "🍺" },
      { name: "Shemima Biscuits", qty: 2, icon: "🍪" },
      { name: "Titus Sardines", qty: 12, icon: "🐟" },
      { name: "Lizzy Shito", qty: 4, icon: "🌶️" },
      { name: "Cowbell Drinks", qty: 1, icon: "🥛" },
      { name: "Cornflakes", qty: 1, icon: "🥣" },
      { name: "Peanut Butter", qty: 1, icon: "🥜" },
      { name: "Chocolate Spread", qty: 1, icon: "🍫" },
      { name: "Storage Containers", qty: 2, icon: "📦" },
    ],
  },
  {
    id: "premium",
    name: "Premium ChopBox",
    subtitle: "The Hostel Celebrity Package",
    tagline: "Everything a boarding student needs for maximum comfort.",
    price: 980,
    originalPrice: 1200,
    badge: "Best Value",
    badgeColor: "bg-purple-600",
    emoji: "👑",
    items: [
      { name: "Gari", qty: 2, icon: "🫙" },
      { name: "White/Brown Sugar", qty: 1, icon: "🍬" },
      { name: "Groundnuts", qty: 1, icon: "🥜" },
      { name: "Margarine", qty: 1, icon: "🧈" },
      { name: "Coated Groundnut Snacks", qty: 2, icon: "🥜" },
      { name: "Milo Tin", qty: 1, icon: "☕" },
      { name: "Nido Tin", qty: 1, icon: "🥛" },
      { name: "Digestive Biscuits", qty: 1, icon: "🍪" },
      { name: "Trident Gum", qty: 2, icon: "🍬" },
      { name: "Apple & Eve Juice", qty: 2, icon: "🧃" },
      { name: "Malt", qty: 2, icon: "🍺" },
      { name: "Mita Milk", qty: 1, icon: "🥛" },
      { name: "Shemima Biscuits", qty: 2, icon: "🍪" },
      { name: "Titus Sardines", qty: 24, icon: "🐟" },
      { name: "Lizzy Shito", qty: 12, icon: "🌶️" },
      { name: "Cowbell Drinks", qty: 1, icon: "🥛" },
      { name: "Cornflakes", qty: 1, icon: "🥣" },
      { name: "Bottle of Honey", qty: 1, icon: "🍯" },
      { name: "Oreo Biscuits", qty: 1, icon: "🍪" },
      { name: "Corned Beef", qty: 1, icon: "🥩" },
      { name: "Baked Beans", qty: 2, icon: "🫘" },
      { name: "Peanut Butter", qty: 1, icon: "🥜" },
      { name: "Chocolate Spread", qty: 1, icon: "🍫" },
      { name: "Storage Containers", qty: 4, icon: "📦" },
    ],
  },
];

const CATALOG_ITEMS: BuilderItem[] = [
  { id: "shemima", name: "Shemima Biscuits", category: "Snacks", price: 8, icon: "🍪", qty: 0 },
  { id: "digestive", name: "Digestive Biscuits", category: "Snacks", price: 12, icon: "🍪", qty: 0 },
  { id: "oreo", name: "Oreo Biscuits", category: "Snacks", price: 15, icon: "🍪", qty: 0 },
  { id: "groundnuts", name: "Groundnuts", category: "Snacks", price: 10, icon: "🥜", qty: 0 },
  { id: "coated-gnut", name: "Coated Groundnut Snacks", category: "Snacks", price: 12, icon: "🥜", qty: 0 },
  { id: "trident", name: "Trident Gum", category: "Snacks", price: 5, icon: "🍬", qty: 0 },
  { id: "milo-sachet", name: "Milo Sachets", category: "Drinks", price: 5, icon: "☕", qty: 0 },
  { id: "milo-tin", name: "Milo Tin", category: "Drinks", price: 45, icon: "☕", qty: 0 },
  { id: "nido", name: "Nido Tin", category: "Drinks", price: 55, icon: "🥛", qty: 0 },
  { id: "cowbell", name: "Cowbell Drinks", category: "Drinks", price: 6, icon: "🥛", qty: 0 },
  { id: "malt", name: "Malt", category: "Drinks", price: 8, icon: "🍺", qty: 0 },
  { id: "juice", name: "Juice", category: "Drinks", price: 8, icon: "🧃", qty: 0 },
  { id: "apple-eve", name: "Apple & Eve Juice", category: "Drinks", price: 12, icon: "🧃", qty: 0 },
  { id: "fruity-drink", name: "Fruity Drink", category: "Drinks", price: 5, icon: "🧃", qty: 0 },
  { id: "mita-milk", name: "Mita Milk", category: "Drinks", price: 20, icon: "🥛", qty: 0 },
  { id: "liquid-milk", name: "Liquid Milk", category: "Drinks", price: 15, icon: "🥛", qty: 0 },
  { id: "bel-cola", name: "Bel Cola", category: "Drinks", price: 8, icon: "🥤", qty: 0 },
  { id: "cornflakes", name: "Cornflakes", category: "Breakfast", price: 35, icon: "🥣", qty: 0 },
  { id: "gari", name: "Gari", category: "Breakfast", price: 20, icon: "🫙", qty: 0 },
  { id: "honey", name: "Bottle of Honey", category: "Breakfast", price: 40, icon: "🍯", qty: 0 },
  { id: "sugar", name: "White/Brown Sugar", category: "Breakfast", price: 12, icon: "🍬", qty: 0 },
  { id: "titus", name: "Titus Sardines", category: "Protein", price: 8, icon: "🐟", qty: 0 },
  { id: "obaaya", name: "Obaaya Sardines", category: "Protein", price: 7, icon: "🐟", qty: 0 },
  { id: "corned-beef", name: "Corned Beef", category: "Protein", price: 30, icon: "🥩", qty: 0 },
  { id: "baked-beans", name: "Baked Beans", category: "Protein", price: 18, icon: "🫘", qty: 0 },
  { id: "peanut-butter", name: "Peanut Butter", category: "Essentials", price: 20, icon: "🥜", qty: 0 },
  { id: "choc-spread", name: "Chocolate Spread", category: "Essentials", price: 25, icon: "🍫", qty: 0 },
  { id: "margarine", name: "Margarine", category: "Essentials", price: 18, icon: "🧈", qty: 0 },
  { id: "shito", name: "Lizzy Shito", category: "Essentials", price: 10, icon: "🌶️", qty: 0 },
  { id: "storage", name: "Storage Container", category: "Storage", price: 35, icon: "📦", qty: 0 },
];

const COMPARISON_ROWS = [
  { label: "Total Items", standard: "11", deluxe: "19", premium: "24+" },
  { label: "Storage Containers", standard: false, deluxe: "2", premium: "4" },
  { label: "Drink Varieties", standard: "3", deluxe: "6", premium: "8" },
  { label: "Snack Types", standard: "4", deluxe: "6", premium: "9" },
  { label: "Breakfast Items", standard: "2", deluxe: "3", premium: "4" },
  { label: "Protein Sources", standard: "1", deluxe: "1", premium: "4" },
  { label: "Honey / Premium Extras", standard: false, deluxe: false, premium: true },
  { label: "Fully Customizable", standard: true, deluxe: true, premium: true },
];

const SCHOOLS: School[] = [
  { id: "achimota", name: "Achimota School", region: "Greater Accra", district: "Ayawaso North", category: "A", type: "Public", gender: "Mixed", boarding: "Both", programmes: ["General Science", "General Arts", "Business", "Visual Arts"], badges: ["Top Performing", "Sports Excellence"], description: "One of Ghana's most prestigious schools, founded in 1927 with a tradition of academic and sporting excellence.", established: 1927, population: 4200, motto: "Ut Omnes Unum Sint", image: "photo-1580582932707-520aed937b7b", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Sports Complex", "Dining Hall", "Chapel"], featured: true },
  { id: "prempeh", name: "Prempeh College", region: "Ashanti", district: "Kumasi Metro", category: "A", type: "Public", gender: "Boys", boarding: "Boarding", programmes: ["General Science", "General Arts", "Business", "Home Economics"], badges: ["Top Performing"], description: "Prestigious boys' school in Kumasi known for academic excellence and a strong alumni network across Ghana.", established: 1948, population: 3800, motto: "Seek Wisdom", image: "photo-1503676260728-1c00da094a0b", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel", "Sports Field"], featured: true },
  { id: "wesleygirls", name: "Wesley Girls' High School", region: "Central", district: "Cape Coast Metro", category: "A", type: "Public", gender: "Girls", boarding: "Boarding", programmes: ["General Science", "General Arts", "Business", "Visual Arts", "Home Economics"], badges: ["Top Performing", "STEM School"], description: "Renowned girls' school in Cape Coast producing some of Ghana's most successful women leaders.", established: 1946, population: 2800, motto: "Love, Loyalty, Learning", image: "photo-1522202176988-66273c2fd55f", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel", "Clinic"], featured: true },
  { id: "mfantsipim", name: "Mfantsipim School", region: "Central", district: "Cape Coast Metro", category: "A", type: "Public", gender: "Boys", boarding: "Boarding", programmes: ["General Science", "General Arts", "Business"], badges: ["Top Performing"], description: "Historic boys' school founded in 1905 — alma mater of Kofi Annan. A bastion of academic tradition.", established: 1905, population: 2600, motto: "Esse Quam Videri", image: "photo-1523050854058-8df90110c9f1", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel"], featured: false },
  { id: "adisadel", name: "Adisadel College", region: "Central", district: "Cape Coast Metro", category: "A", type: "Public", gender: "Boys", boarding: "Boarding", programmes: ["General Science", "General Arts", "Business", "Visual Arts"], badges: ["Top Performing", "Sports Excellence"], description: "Anglican school in Cape Coast with a proud heritage of excellence in academics and sports.", established: 1910, population: 2400, motto: "In Hoc Signo Vinces", image: "photo-1434030216411-0b793f4b6f2e", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel"], featured: false },
  { id: "holychild", name: "Holy Child School", region: "Central", district: "Cape Coast Metro", category: "A", type: "Public", gender: "Girls", boarding: "Boarding", programmes: ["General Science", "General Arts", "Business", "Home Economics"], badges: ["Top Performing"], description: "Leading girls' school in Cape Coast known for academic excellence and moral values.", established: 1946, population: 2200, motto: "Ora et Labora", image: "photo-1481627834876-b7833e8f5570", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel", "Clinic"], featured: false },
  { id: "opokuware", name: "Opoku Ware School", region: "Ashanti", district: "Kumasi Metro", category: "A", type: "Public", gender: "Boys", boarding: "Boarding", programmes: ["General Science", "General Arts", "Business"], badges: ["Top Performing"], description: "Premier boys' school in Kumasi with a strong tradition of academic and cultural excellence.", established: 1952, population: 3200, motto: "Knowledge is Power", image: "photo-1456513080510-7bf3a84b82f8", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel"], featured: false },
  { id: "presboys", name: "Presbyterian Boys' SHS", region: "Greater Accra", district: "Legon", category: "A", type: "Public", gender: "Boys", boarding: "Boarding", programmes: ["General Science", "General Arts", "Business", "Visual Arts"], badges: ["Top Performing", "STEM School"], description: "Affectionately known as PRESEC, this Legon school is one of Ghana's finest academic institutions.", established: 1938, population: 3000, motto: "Lux et Veritas", image: "photo-1503676260728-1c00da094a0b", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel"], featured: true },
  { id: "accraacademy", name: "Accra Academy", region: "Greater Accra", district: "Accra Metro", category: "B", type: "Public", gender: "Mixed", boarding: "Both", programmes: ["General Science", "General Arts", "Business"], badges: ["Sports Excellence"], description: "Well-known mixed school in Accra serving both boarding and day students from diverse backgrounds.", established: 1931, population: 2800, motto: "Forward Ever", image: "photo-1580582932707-520aed937b7b", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Sports Field"], featured: false },
  { id: "labone", name: "Labone SHS", region: "Greater Accra", district: "Accra Metro", category: "B", type: "Public", gender: "Mixed", boarding: "Day", programmes: ["General Science", "General Arts", "Business", "Home Economics"], badges: [], description: "Popular day school in Accra offering quality education across multiple programmes.", established: 1963, population: 3500, motto: "Excellence in Service", image: "photo-1434030216411-0b793f4b6f2e", facilities: ["Science Lab", "ICT Lab", "Library", "Sports Field", "Dining Hall"], featured: false },
  { id: "tiahmadiyya", name: "T.I. Ahmadiyya SHS", region: "Ashanti", district: "Ashanti-Akim North", category: "B", type: "Public", gender: "Mixed", boarding: "Both", programmes: ["General Science", "General Arts", "Business", "Technical"], badges: ["Technical School"], description: "Mixed school offering both academic and technical programmes for well-rounded student development.", established: 1955, population: 2100, motto: "Faith, Integrity, Excellence", image: "photo-1522202176988-66273c2fd55f", facilities: ["Science Lab", "ICT Lab", "Library", "Dormitories", "Technical Workshop"], featured: false },
  { id: "kumasigirls", name: "Kumasi Girls' SHS", region: "Ashanti", district: "Kumasi Metro", category: "B", type: "Public", gender: "Girls", boarding: "Both", programmes: ["General Arts", "Business", "Home Economics", "Visual Arts"], badges: [], description: "Dedicated girls' school in Kumasi fostering academic growth and female leadership.", established: 1960, population: 1900, motto: "Knowledge Builds the Future", image: "photo-1481627834876-b7833e8f5570", facilities: ["ICT Lab", "Library", "Dormitories", "Dining Hall"], featured: false },
  { id: "tamaleSHS", name: "Tamale SHS", region: "Northern", district: "Tamale Metro", category: "B", type: "Public", gender: "Mixed", boarding: "Both", programmes: ["General Science", "General Arts", "Business", "Agriculture"], badges: [], description: "Leading school in the Northern Region offering diverse programmes including agriculture.", established: 1951, population: 2600, motto: "Education for Development", image: "photo-1456513080510-7bf3a84b82f8", facilities: ["Science Lab", "Library", "Dormitories", "Farm", "Dining Hall"], featured: false },
  { id: "aburigirls", name: "Aburi Girls' SHS", region: "Eastern", district: "Akuapem North", category: "B", type: "Public", gender: "Girls", boarding: "Boarding", programmes: ["General Arts", "Business", "Home Economics"], badges: [], description: "Girls' boarding school in Aburi known for discipline and academic focus.", established: 1961, population: 1600, motto: "Arise and Shine", image: "photo-1522202176988-66273c2fd55f", facilities: ["ICT Lab", "Library", "Dormitories", "Dining Hall", "Chapel"], featured: false },
  { id: "temaSHS", name: "Tema SHS", region: "Greater Accra", district: "Tema Metro", category: "B", type: "Public", gender: "Mixed", boarding: "Day", programmes: ["General Science", "General Arts", "Business", "Technical"], badges: ["Technical School"], description: "Prominent school in the industrial city of Tema, offering technical and academic programmes.", established: 1960, population: 3200, motto: "Building Leaders", image: "photo-1580582932707-520aed937b7b", facilities: ["Science Lab", "ICT Lab", "Library", "Technical Workshop", "Sports Field"], featured: false },
];

const SHOP_CATEGORIES = [
  { name: "School Bags", image: "photo-1553062407-98eeb64c6a62", count: 48 },
  { name: "Stationery", image: "photo-1497633762265-9d179a990aa6", count: 124 },
  { name: "Mattresses & Bedding", image: "photo-1555041469-a586c61ea9bc", count: 32 },
  { name: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", count: 45 },
  { name: "Toiletries", image: "photo-1585386959984-a4155224a1ad", count: 67 },
  { name: "Food Items", image: "photo-1583863788434-e58a36330cf0", count: 89 },
  { name: "Shoes", image: "photo-1542291026-7eec264c27ff", count: 56 },
  { name: "Electronics", image: "photo-1498049794561-7780e7231661", count: 38 },
];

type ShopBadge = "New" | "Best Seller" | "Flash Sale" | "Featured";
type ShopProduct = {
  id: number; name: string; desc: string; price: number; originalPrice?: number;
  rating: number; reviews: number; category: string; image: string;
  badge?: ShopBadge; inStock: boolean; brand: string;
};

const SHOP_PRODUCTS: ShopProduct[] = [
  // ── School Bags ──
  { id: 1,  name: "Standard SHS Backpack", desc: "Durable 30L backpack with padded straps and multiple compartments, perfect for daily school use.", price: 150, rating: 4.8, reviews: 312, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", badge: "Best Seller", inStock: true, brand: "SportsPro" },
  { id: 2,  name: "Waterproof Backpack 35L", desc: "Water-resistant ripstop fabric, USB charging port, and reflective strips for safety.", price: 220, originalPrice: 280, rating: 4.7, reviews: 189, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", badge: "Flash Sale", inStock: true, brand: "AquaPack" },
  { id: 3,  name: "Large Boarding Backpack", desc: "Extra-large 45L backpack designed for boarding students carrying books and personal items.", price: 280, rating: 4.6, reviews: 97, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", badge: "Featured", inStock: true, brand: "BoarderPro" },
  { id: 4,  name: "Laptop Backpack 15.6\"", desc: "Padded laptop compartment, anti-theft zipper, and ergonomic back support.", price: 320, rating: 4.5, reviews: 74, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", inStock: true, brand: "TechBag" },
  { id: 5,  name: "Sports Backpack", desc: "Breathable mesh back, shoe compartment, and quick-access water bottle pocket.", price: 180, rating: 4.4, reviews: 62, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", inStock: true, brand: "ActiveGear" },
  { id: 6,  name: "Pencil Case / Pouch", desc: "Large capacity pencil case with dual zips, holds pens, rulers, and calculator.", price: 25, rating: 4.6, reviews: 241, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", badge: "New", inStock: true, brand: "ClassMate" },
  { id: 7,  name: "Lunch Bag Insulated", desc: "Thermal-lined lunch bag keeps food fresh for up to 6 hours.", price: 55, rating: 4.3, reviews: 88, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", inStock: true, brand: "FreshPack" },
  { id: 8,  name: "Drawstring Bag", desc: "Lightweight polyester drawstring bag for PE, sports, and casual use.", price: 30, rating: 4.2, reviews: 156, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", inStock: true, brand: "QuickPack" },
  { id: 9,  name: "Document File Bag", desc: "Slim A4 file bag with double compartment for documents, notebooks, and tablets.", price: 75, rating: 4.4, reviews: 43, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", inStock: true, brand: "ProFile" },
  { id: 10, name: "Messenger Shoulder Bag", desc: "Cross-body messenger bag with padded laptop sleeve and organizer pockets.", price: 195, rating: 4.5, reviews: 67, category: "School Bags", image: "photo-1553062407-98eeb64c6a62", inStock: true, brand: "UrbanCarry" },

  // ── Stationery ──
  { id: 11, name: "Blue Pens — Pack of 10", desc: "Smooth-writing 0.7mm blue ballpoint pens, suitable for all school exercises.", price: 15, rating: 4.7, reviews: 445, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", badge: "Best Seller", inStock: true, brand: "Bic" },
  { id: 12, name: "HB Pencils — Set of 12", desc: "Pre-sharpened HB pencils for sketching, technical drawing, and general writing.", price: 12, rating: 4.6, reviews: 302, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", inStock: true, brand: "Staedtler" },
  { id: 13, name: "Highlighters — 5 Colours", desc: "Vibrant chisel-tip highlighters — yellow, pink, green, blue, orange.", price: 25, rating: 4.5, reviews: 178, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", badge: "New", inStock: true, brand: "Stabilo" },
  { id: 14, name: "Exercise Books — Pack of 20", desc: "80-leaf exercise books for all school subjects, GES-standard format.", price: 80, rating: 4.9, reviews: 512, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", badge: "Best Seller", inStock: true, brand: "PaperMate" },
  { id: 15, name: "Hardcover Notebook A5", desc: "200-page hardcover notebook with ruled pages and ribbon bookmark.", price: 35, rating: 4.4, reviews: 134, category: "Stationery", image: "photo-1456513080510-7bf3a84b82f8", inStock: true, brand: "Moleskine" },
  { id: 16, name: "A3 Drawing Book — 30 Sheets", desc: "Heavy 120gsm cartridge paper for technical and freehand drawing.", price: 40, rating: 4.6, reviews: 89, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", inStock: true, brand: "Canson" },
  { id: 17, name: "Casio fx-991ES Plus Calculator", desc: "GES-approved scientific calculator with 417 functions, natural display.", price: 95, rating: 4.9, reviews: 687, category: "Stationery", image: "photo-1498049794561-7780e7231661", badge: "Featured", inStock: true, brand: "Casio" },
  { id: 18, name: "Mathematical Set — 9 pieces", desc: "Precision compass, set squares, protractor, rulers in a sturdy tin box.", price: 35, rating: 4.7, reviews: 234, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", inStock: true, brand: "Helix" },
  { id: 19, name: "Graph Book — 4mm Squares", desc: "40-page A4 graph book for maths, physics, and data plotting.", price: 18, rating: 4.5, reviews: 156, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", inStock: true, brand: "PaperMate" },
  { id: 20, name: "Plastic Ring Binder — A4", desc: "Heavy-duty ring binder with 2\" rings, holds up to 400 sheets.", price: 35, rating: 4.3, reviews: 78, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", inStock: true, brand: "Bantex" },
  { id: 21, name: "Glue Stick + Liquid Glue Set", desc: "21g glue stick and 125ml liquid glue — essential craft and school supplies.", price: 20, rating: 4.4, reviews: 112, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", inStock: true, brand: "Pritt" },
  { id: 22, name: "Plastic Folders — Pack of 5", desc: "A4 clear plastic pockets with reinforced spine for note protection.", price: 25, rating: 4.5, reviews: 198, category: "Stationery", image: "photo-1497633762265-9d179a990aa6", inStock: true, brand: "Esselte" },

  // ── Mattresses & Bedding ──
  { id: 23, name: "High Density Foam Mattress", desc: "4-inch high-density foam single mattress, SHS-approved, with non-slip base.", price: 280, rating: 4.9, reviews: 234, category: "Mattresses & Bedding", image: "__local__aneresBed", badge: "Best Seller", inStock: true, brand: "Aneres" },
  { id: 24, name: "Foldable Student Mattress", desc: "Portable foldable foam mattress, easy to store under bunk beds.", price: 220, originalPrice: 280, rating: 4.7, reviews: 145, category: "Mattresses & Bedding", image: "__local__aneresBed", badge: "Flash Sale", inStock: true, brand: "Aneres" },
  { id: 25, name: "Waterproof Mattress Protector", desc: "Fitted waterproof cover for single mattress, machine washable.", price: 65, rating: 4.5, reviews: 89, category: "Mattresses & Bedding", image: "photo-1555041469-a586c61ea9bc", inStock: true, brand: "DryGuard" },
  { id: 26, name: "SHS Pillow & Pillowcase", desc: "Aneres SHS-standard pillow with 2 pillow cases, diamond pattern design.", price: 65, rating: 4.8, reviews: 178, category: "Mattresses & Bedding", image: "__local__aneresPillow", badge: "Featured", inStock: true, brand: "Aneres" },
  { id: 27, name: "Bedsheet Set — 2 Pairs White", desc: "GES-approved white bedsheet set, 2 pairs, soft poly-cotton blend.", price: 85, rating: 4.7, reviews: 312, category: "Mattresses & Bedding", image: "photo-1540518614846-7eded433c457", badge: "Best Seller", inStock: true, brand: "SleepWell" },
  { id: 28, name: "Warm Fleece Blanket", desc: "Soft anti-pilling fleece blanket, ideal for cold hostel nights.", price: 120, rating: 4.6, reviews: 134, category: "Mattresses & Bedding", image: "photo-1555041469-a586c61ea9bc", inStock: true, brand: "CozyHome" },
  { id: 29, name: "Mosquito Net (Single Bed)", desc: "Fine mesh mosquito net for single bunk beds, treated with insect repellent.", price: 45, rating: 4.8, reviews: 89, category: "Mattresses & Bedding", image: "photo-1555041469-a586c61ea9bc", badge: "New", inStock: true, brand: "SafeNet" },
  { id: 30, name: "Student Sleeping Bag", desc: "Lightweight sleeping bag rated to 10°C, compact roll-up design.", price: 180, rating: 4.5, reviews: 47, category: "Mattresses & Bedding", image: "photo-1555041469-a586c61ea9bc", inStock: true, brand: "OutdoorPro" },

  // ── Trunks & Storage ──
  { id: 31, name: "Metallic Chop Box (Large)", desc: "Heavy-duty steel chop box with secure padlock latch, boarding school standard.", price: 180, rating: 4.8, reviews: 289, category: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", badge: "Best Seller", inStock: true, brand: "Aneres" },
  { id: 32, name: "Plastic Chop Box — Black/Yellow", desc: "Impact-resistant plastic storage box with snap-lock yellow lid, stackable.", price: 85, rating: 4.6, reviews: 156, category: "Trunks & Storage", image: "__local__chopBox", badge: "Featured", inStock: true, brand: "Aneres" },
  { id: 33, name: "Aluminium Trunk (Standard)", desc: "Lightweight aluminium trunk with corner protectors and double latch locks.", price: 450, rating: 4.7, reviews: 98, category: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", inStock: true, brand: "IronClad" },
  { id: 34, name: "Hard Shell Suitcase 24\"", desc: "Polycarbonate hard-shell trolley suitcase with TSA lock and spinner wheels.", price: 380, originalPrice: 450, rating: 4.5, reviews: 67, category: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", badge: "Flash Sale", inStock: true, brand: "TravelPro" },
  { id: 35, name: "Travel / Kit Bag (60L)", desc: "Heavy-duty nylon duffel bag with padded handles and detachable shoulder strap.", price: 160, rating: 4.4, reviews: 89, category: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", inStock: true, brand: "GoBag" },
  { id: 36, name: "Laundry Basket with Lid", desc: "Collapsible hamper with ventilation holes, holds up to 40L of laundry.", price: 55, rating: 4.3, reviews: 124, category: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", badge: "New", inStock: true, brand: "HomeBase" },
  { id: 37, name: "Heavy-Duty Padlock", desc: "50mm stainless steel shackle padlock, anti-pick, anti-drill.", price: 35, rating: 4.7, reviews: 201, category: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", inStock: true, brand: "MasterLock" },
  { id: 38, name: "Combination Lock (3-dial)", desc: "Resettable 3-digit combination lock for trunks and lockers, no key needed.", price: 25, rating: 4.5, reviews: 134, category: "Trunks & Storage", image: "photo-1586348943529-beaae6c28db9", inStock: true, brand: "SafeLock" },
  { id: 39, name: "Plastic Storage Containers (Set 3)", desc: "Stackable plastic containers with airtight lids for food and personal items.", price: 75, rating: 4.6, reviews: 178, category: "Trunks & Storage", image: "__local__chopBox", inStock: true, brand: "OrgaHome" },

  // ── Toiletries ──
  { id: 40, name: "Complete Toiletries Bundle", desc: "12-piece bundle: soap, shampoo, conditioner, toothbrush, toothpaste, lotion, and more.", price: 95, rating: 4.9, reviews: 334, category: "Toiletries", image: "photo-1585386959984-a4155224a1ad", badge: "Best Seller", inStock: true, brand: "Aneres" },
  { id: 41, name: "Bath Soap — Pack of 6", desc: "Gentle moisturising bath soap, 90g bars, long-lasting fragrance.", price: 35, rating: 4.6, reviews: 189, category: "Toiletries", image: "photo-1585386959984-a4155224a1ad", inStock: true, brand: "Lux" },
  { id: 42, name: "Shampoo + Conditioner Set", desc: "Anti-dandruff shampoo 400ml + deep conditioner 300ml, salon quality.", price: 55, originalPrice: 70, rating: 4.7, reviews: 145, category: "Toiletries", image: "photo-1585386959984-a4155224a1ad", badge: "Flash Sale", inStock: true, brand: "Dove" },
  { id: 43, name: "Bath Towel Set — 2 pieces", desc: "Soft 100% cotton bath towels, 70x140cm, fast-drying and absorbent.", price: 75, rating: 4.8, reviews: 212, category: "Toiletries", image: "photo-1585386959984-a4155224a1ad", inStock: true, brand: "CozyTex" },
  { id: 44, name: "Toothbrush + Toothpaste Pack", desc: "Medium bristle toothbrush plus 100ml whitening toothpaste twin pack.", price: 25, rating: 4.5, reviews: 289, category: "Toiletries", image: "photo-1585386959984-a4155224a1ad", inStock: true, brand: "Oral-B" },
  { id: 45, name: "Body Lotion 400ml", desc: "Deep moisturising cocoa butter lotion, non-greasy, 24-hour hydration.", price: 40, rating: 4.6, reviews: 167, category: "Toiletries", image: "photo-1585386959984-a4155224a1ad", inStock: true, brand: "Vaseline" },
  { id: 46, name: "Washing Powder 1kg", desc: "Concentrated bio washing powder, effective in cold and warm water.", price: 45, rating: 4.7, reviews: 198, category: "Toiletries", inStock: true, image: "photo-1585386959984-a4155224a1ad", brand: "OMO" },
  { id: 47, name: "Hand Sanitizer 500ml", desc: "70% alcohol hand sanitizer with moisturising aloe vera gel formula.", price: 20, rating: 4.8, reviews: 312, category: "Toiletries", image: "photo-1585386959984-a4155224a1ad", badge: "New", inStock: true, brand: "Dettol" },

  // ── Food Items ──
  { id: 48, name: "Milo 900g Tin", desc: "Classic Nestlé Milo chocolate malt drink tin, rich in nutrients.", price: 65, rating: 4.9, reviews: 567, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", badge: "Best Seller", inStock: true, brand: "Nestlé" },
  { id: 49, name: "Nido Full Cream Milk Tin", desc: "Fortified full cream milk powder, 900g tin with 26 essential vitamins.", price: 85, rating: 4.8, reviews: 234, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", inStock: true, brand: "Nestlé" },
  { id: 50, name: "Titus Sardines — 12-can Pack", desc: "Popular Titus sardines in tomato sauce, 125g per can, good protein source.", price: 95, originalPrice: 115, rating: 4.9, reviews: 445, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", badge: "Flash Sale", inStock: true, brand: "Titus" },
  { id: 51, name: "Digestive Biscuits — 4 Packs", desc: "McVitie's original digestive biscuits, 400g per pack, great for snacking.", price: 48, rating: 4.7, reviews: 289, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", inStock: true, brand: "McVitie's" },
  { id: 52, name: "Peanut Butter 500g", desc: "Smooth and crunchy groundnut paste, rich in protein, locally made in Ghana.", price: 32, rating: 4.6, reviews: 198, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", inStock: true, brand: "Farm Fresh" },
  { id: 53, name: "Cornflakes 500g", desc: "Kellogg's original cornflakes, lightly toasted, fortified with vitamins.", price: 45, rating: 4.7, reviews: 167, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", inStock: true, brand: "Kellogg's" },
  { id: 54, name: "Apple & Eve Juice — 6-pack", desc: "250ml Apple & Eve 100% fruit juice boxes, great for hostel snacking.", price: 72, rating: 4.8, reviews: 312, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", inStock: true, brand: "Apple & Eve" },
  { id: 55, name: "Gari (2kg Pack)", desc: "Fine fermented cassava flakes (gari), essential SHS hostel staple food.", price: 40, rating: 4.9, reviews: 378, category: "Food Items", image: "photo-1583863788434-e58a36330cf0", badge: "Best Seller", inStock: true, brand: "Local" },

  // ── Shoes ──
  { id: 56, name: "Black Leather School Shoes", desc: "Genuine leather formal school shoes, rubber sole, GES-standard design.", price: 180, rating: 4.8, reviews: 389, category: "Shoes", image: "photo-1542291026-7eec264c27ff", badge: "Best Seller", inStock: true, brand: "Bata" },
  { id: 57, name: "White Canvas Sneakers", desc: "Classic white canvas sneakers, rubber sole, great for PE and casual wear.", price: 120, originalPrice: 160, rating: 4.6, reviews: 245, category: "Shoes", image: "photo-1491553895911-0055eca6402d", badge: "Flash Sale", inStock: true, brand: "Converse" },
  { id: 58, name: "School Sandals (Leather)", desc: "Adjustable strap leather sandals for hostel and leisure use.", price: 85, rating: 4.5, reviews: 134, category: "Shoes", image: "photo-1542291026-7eec264c27ff", inStock: true, brand: "Bata" },
  { id: 59, name: "Bathroom Slippers / Flip Flops", desc: "Anti-slip rubber bathroom slippers, essential for communal bathrooms.", price: 30, rating: 4.7, reviews: 512, category: "Shoes", image: "photo-1542291026-7eec264c27ff", badge: "New", inStock: true, brand: "Dunlop" },
  { id: 60, name: "Sports Running Shoes", desc: "Cushioned EVA midsole, breathable mesh upper, for PE and athletics.", price: 260, rating: 4.6, reviews: 189, category: "Shoes", image: "photo-1491553895911-0055eca6402d", inStock: true, brand: "Adidas" },
  { id: 61, name: "Black Sneakers", desc: "Versatile black sneakers suitable for school, sports, and casual wear.", price: 195, rating: 4.5, reviews: 167, category: "Shoes", image: "photo-1491553895911-0055eca6402d", inStock: true, brand: "Nike" },
  { id: 62, name: "Shoe Polish Kit", desc: "Black and brown shoe polish with brush applicator and buffing cloth.", price: 25, rating: 4.8, reviews: 234, category: "Shoes", image: "photo-1542291026-7eec264c27ff", inStock: true, brand: "Kiwi" },
  { id: 63, name: "Leather Slippers", desc: "Durable leather slippers with non-slip sole, comfortable for daily wear.", price: 75, rating: 4.4, reviews: 98, category: "Shoes", image: "photo-1542291026-7eec264c27ff", inStock: true, brand: "Bata" },

  // ── Electronics ──
  { id: 64, name: "Rechargeable LED Study Lamp", desc: "Adjustable brightness LED desk lamp with 3 colour modes, USB rechargeable.", price: 95, rating: 4.8, reviews: 298, category: "Electronics", image: "photo-1498049794561-7780e7231661", badge: "Best Seller", inStock: true, brand: "Philips" },
  { id: 65, name: "Power Bank 10000mAh", desc: "Dual USB output, fast-charge compatible, LED power indicator display.", price: 145, originalPrice: 185, rating: 4.7, reviews: 234, category: "Electronics", image: "photo-1498049794561-7780e7231661", badge: "Flash Sale", inStock: true, brand: "Anker" },
  { id: 66, name: "Casio fx-991EX Scientific Calculator", desc: "576 functions, high-resolution LCD, spreadsheet and equation solver.", price: 110, rating: 4.9, reviews: 445, category: "Electronics", image: "photo-1498049794561-7780e7231661", badge: "Featured", inStock: true, brand: "Casio" },
  { id: 67, name: "USB Wired Earphones", desc: "Clear stereo sound, inline microphone, compatible with phones and tablets.", price: 45, rating: 4.4, reviews: 178, category: "Electronics", image: "photo-1498049794561-7780e7231661", inStock: true, brand: "Samsung" },
  { id: 68, name: "4-Socket Extension Board", desc: "1.8m cable, surge protection, individual switch for each socket.", price: 55, rating: 4.6, reviews: 312, category: "Electronics", image: "photo-1498049794561-7780e7231661", inStock: true, brand: "Clipsal" },
  { id: 69, name: "Fast Charge Phone Charger", desc: "18W USB-A fast charger with 1m cable, compatible with most smartphones.", price: 65, rating: 4.5, reviews: 189, category: "Electronics", image: "photo-1498049794561-7780e7231661", inStock: true, brand: "Anker" },
  { id: 70, name: "USB Flash Drive 32GB", desc: "USB 3.0 flash drive, 100MB/s read speed, compact metal design.", price: 45, rating: 4.7, reviews: 256, category: "Electronics", image: "photo-1498049794561-7780e7231661", badge: "New", inStock: true, brand: "SanDisk" },
  { id: 71, name: "Mini Rechargeable Fan", desc: "USB rechargeable portable fan with 3 speeds, 8-hour battery life.", price: 120, rating: 4.6, reviews: 134, category: "Electronics", image: "photo-1498049794561-7780e7231661", inStock: true, brand: "Xiaomi" },
  { id: 72, name: "Digital Alarm Clock", desc: "Dual alarm, backlight display, snooze function, battery-powered.", price: 55, rating: 4.5, reviews: 167, category: "Electronics", image: "photo-1498049794561-7780e7231661", inStock: true, brand: "Casio" },
];

const VOUCHERS = [
  { id: "bece", name: "BECE", fullName: "Basic Education Certificate Examination", price: 30, currency: "GHS", icon: "🎓", color: "blue", description: "Junior High School final examination voucher" },
  { id: "wassce", name: "WASSCE", fullName: "West African Senior School Certificate Exam", price: 50, currency: "GHS", icon: "📜", color: "green", description: "Senior High School final examination voucher" },
  { id: "novdec", name: "NOVDEC", fullName: "November/December WASSCE", price: 50, currency: "GHS", icon: "📋", color: "purple", description: "WASSCE for private candidates" },
  { id: "sat", name: "SAT", fullName: "Scholastic Assessment Test", price: 60, currency: "$", icon: "🌍", color: "orange", description: "US college admissions test registration" },
  { id: "act", name: "ACT", fullName: "American College Testing", price: 65, currency: "$", icon: "🏫", color: "red", description: "Alternative US college admissions test" },
  { id: "nabptex", name: "NABPTEX", fullName: "National Board for Professional Examinations", price: 40, currency: "GHS", icon: "⚙️", color: "teal", description: "Technical and vocational examination voucher" },
  { id: "teacher", name: "Teacher Licensure", fullName: "Ghana Teacher Licensure Examination", price: 100, currency: "GHS", icon: "👩‍🏫", color: "pink", description: "Professional teacher certification exam" },
  { id: "university", name: "University Entrance", fullName: "University Entrance & Placement Exam", price: 35, currency: "GHS", icon: "🏛️", color: "indigo", description: "Tertiary institution placement examination" },
];

const TESTIMONIALS = [
  { name: "Adwoa Mensah", role: "Parent · Accra", rating: 5, text: "AES made my daughter's SHS preparation so easy. I ordered her prospectus items and they were delivered to our door. The installment plan was a lifesaver!", avatar: "AM" },
  { name: "Kwame Asante", role: "Student · Kumasi", rating: 5, text: "I bought my WASSCE voucher in minutes. No queuing, no stress. The dashboard even tracks my order. This is the future!", avatar: "KA" },
  { name: "Ama Boateng", role: "Parent · Takoradi", rating: 5, text: "The chop box package saved me hours of shopping. Everything my son needed was in one package, delivered to his school gates.", avatar: "AB" },
  { name: "Kofi Darko", role: "Student · Kumasi", rating: 5, text: "Best platform for SHS preparation in Ghana. Clean website, fast delivery, and customer support is amazing.", avatar: "KD" },
];

const NEWS_ARTICLES = [
  { id: 1, category: "Admissions", title: "2025/2026 SHS Placement Results Released — Full Guide", excerpt: "CSSPS has released placement results for 2025/2026. Everything you need to know about reporting dates and school requirements.", date: "June 15, 2025", readTime: "5 min read", image: "photo-1434030216411-0b793f4b6f2e" },
  { id: 2, category: "Scholarships", title: "Ghana Scholarship Secretariat Opens Applications for 2025", excerpt: "The Ghana Scholarship Secretariat is accepting applications for multiple scholarship programs. Find out eligibility and how to apply.", date: "June 10, 2025", readTime: "4 min read", image: "photo-1503676260728-1c00da094a0b" },
  { id: 3, category: "Education", title: "GES: Schools Must Now Accept Digital Prospectus Receipts", excerpt: "The Ghana Education Service has announced all SHS must accept digital payment receipts from September 2025.", date: "June 5, 2025", readTime: "3 min read", image: "photo-1481627834876-b7833e8f5570" },
  { id: 4, category: "Study Tips", title: "10 Proven Study Techniques for SHS Students", excerpt: "Master these study techniques to excel in your examinations and achieve top grades.", date: "May 28, 2025", readTime: "7 min read", image: "photo-1456513080510-7bf3a84b82f8" },
  { id: 5, category: "Career", title: "Top 10 University Courses to Study in Ghana 2025", excerpt: "Discover the most in-demand university programs in Ghana for 2025.", date: "May 20, 2025", readTime: "6 min read", image: "photo-1523050854058-8df90110c9f1" },
  { id: 6, category: "Government", title: "GES Announces New SHS Academic Calendar for 2025", excerpt: "The Ghana Education Service has released the official academic calendar for the 2025/2026 school year.", date: "May 15, 2025", readTime: "3 min read", image: "photo-1580582932707-520aed937b7b" },
];

// ── TVET Data ─────────────────────────────────────────────────────────────────

const TVET_DEPARTMENTS = [
  {
    id: "technical", name: "Technical SHS", price: 500, icon: "⚙️",
    cardColor: "bg-blue-50 border-blue-200", accent: "text-blue-700",
    desc: "Technical drawing, workshop tools and safety equipment for all Technical programmes.",
    itemCount: 33,
    categories: [
      { name: "Drawing & Technical Drawing Basics", icon: "📐", items: [
        { name: "A3 Cartridge Paper Pad", qty: 2, required: true },
        { name: "A4 Graph Book", qty: 2, required: true },
        { name: "Pencil Set (2H, H, HB, B, 2B)", required: true },
        { name: "Kneaded Eraser", required: true },
        { name: "Metal Sharpener", required: true },
        { name: "50cm Metal Edge Ruler", required: true },
        { name: "30cm Ruler", required: true },
        { name: "1:20 / 1:50 Scale Rule", required: true },
        { name: "Bow Compass", required: true },
        { name: "Divider", required: true },
      ]},
      { name: "Technical Drawing Tools", icon: "📏", items: [
        { name: "T-Square 80cm", required: true },
        { name: "45° Set Square", required: true },
        { name: "30° / 60° Set Square", required: true },
        { name: "A3 Drawing Board", required: true },
        { name: "Board Clips", required: true },
        { name: "Masking Tape", required: true },
        { name: "Erasing Shield", required: false },
        { name: "180° Protractor", required: true },
      ]},
      { name: "Workshop / Practical Tools", icon: "🔧", items: [
        { name: "Navy Blue / Brown Overall Apron", required: true },
        { name: "Safety Glasses", required: true },
        { name: "Measuring Tape 3m or 5m", required: true },
        { name: "Scriber", required: true },
        { name: "Center Punch", required: true },
        { name: "Flat File", required: true },
        { name: "Half-Round File", required: true },
        { name: "Ball Pein Hammer 0.5kg", required: true },
        { name: "Flat Screwdriver", required: true },
        { name: "Phillips Screwdriver", required: true },
        { name: "Combination Pliers 6 inch", required: true },
      ]},
      { name: "Other Useful Items", icon: "🎒", items: [
        { name: "Scientific Calculator", required: true },
        { name: "A3 Portfolio Bag / Envelope", required: false },
        { name: "Dust Coat", required: false },
      ]},
    ],
    buyLater: ["Vernier Calipers", "Micrometer", "Soldering Iron", "Full Tool Box"],
    subOptions: [
      { id: "electrical", name: "Electrical Installation", icon: "⚡", price: 400, items: ["Insulated Screwdriver Set", "Cutting Pliers", "Long Nose Pliers", "Test Lamp / Voltage Tester", "Wire Stripper"], buyLater: ["Multimeter", "Soldering Iron", "Solder Wire"] },
      { id: "mechanical", name: "Mechanical Engineering", icon: "🔩", price: 340, items: ["Vernier Calipers 150mm", "Outside Micrometer 0–25mm", "Engineer's Square", "Center Punch"], buyLater: ["Surface Plate", "Dial Gauge"] },
      { id: "auto", name: "Auto Mechanics", icon: "🚗", price: 350, items: ["Spanner Set 8–19mm", "Socket Set 1/4 inch", "Long Screwdriver Set", "Tire Pressure Gauge"], buyLater: ["Torque Wrench", "Feeler Gauge", "Oil Filter Wrench"] },
      { id: "building", name: "Building Construction", icon: "🏗️", price: 400, items: ["Spirit Level 60cm", "Brick Trowel", "Mason's Square", "Plumb Bob + Line"], buyLater: ["Tape Rule 30m", "Builder's Square", "Pointing Trowel"] },
      { id: "woodwork", name: "Woodwork", icon: "🪚", price: 430, items: ["Coping Saw + Blades", "Chisel Set 12mm + 25mm", "Try Square 300mm", "Marking Gauge"], buyLater: ["Hand Plane", "Mallet", "G-Clamps"] },
      { id: "metalwork", name: "Metalwork", icon: "🔨", price: 450, items: ["Hacksaw Frame + Blades", "Ball Pein Hammer 0.5kg", "Flat File", "Triangular File", "Scribe", "Divider"], buyLater: ["Center Punch Set", "Pop Rivet Gun"] },
    ],
  },
  {
    id: "homeec", name: "Home Economics", price: 380, icon: "🍳",
    cardColor: "bg-rose-50 border-rose-200", accent: "text-rose-700",
    desc: "Cooking tools, practical equipment and safety wear for Home Economics students.",
    itemCount: 23,
    categories: [
      { name: "Uniform & Safety", icon: "👗", items: [
        { name: "Full-Length Apron", required: true },
        { name: "Hairnet", required: true },
        { name: "Head Tie", required: true },
        { name: "Nose Mask Pack", required: true },
        { name: "Overcoat / Lab Coat", required: false },
      ]},
      { name: "Practical Tools", icon: "🥄", items: [
        { name: "Measuring Cups", required: true },
        { name: "Measuring Spoons", required: true },
        { name: "Mixing Bowls", qty: 2, required: true },
        { name: "Spatula", required: true },
        { name: "Wooden Spoon", required: true },
        { name: "Knife", required: true },
        { name: "Chopping Board", required: true },
        { name: "Manual Whisk", required: true },
        { name: "Scissors", required: true },
        { name: "Pastry Brush", required: false },
        { name: "Cake Baking Set", required: false },
      ]},
      { name: "Books & Notes", icon: "📚", items: [
        { name: "Food & Nutrition Notebooks", required: true },
        { name: "Recipe Book", required: true },
        { name: "Food & Nutrition Textbook", required: true },
      ]},
      { name: "Chop Box Extras", icon: "📦", items: [
        { name: "Plastic Containers with Lids", required: false },
        { name: "Plate", required: false },
        { name: "Bowl", required: false },
        { name: "Spoon", required: false },
        { name: "Cup", required: false },
        { name: "Hand Towel", required: false },
      ]},
    ],
    buyLater: [],
    subOptions: [],
  },
  {
    id: "science", name: "Science", price: 450, icon: "🔬",
    cardColor: "bg-teal-50 border-teal-200", accent: "text-teal-700",
    desc: "Lab equipment, safety gear and scientific instruments for Science students.",
    itemCount: 17,
    categories: [
      { name: "Lab Coat & Safety", icon: "🥼", items: [
        { name: "White Long Sleeve Lab Coat", required: true },
        { name: "Safety Goggles", required: true },
        { name: "Nose Mask Pack of 20", required: true },
        { name: "Disposable Hand Gloves", required: true },
        { name: "Reusable Rubber Gloves", required: false },
      ]},
      { name: "Math & Physics Tools", icon: "📐", items: [
        { name: "Scientific Calculator", required: true },
        { name: "Mathematical Set", required: true },
        { name: "Graph Books", required: true },
        { name: "Geometry Board", required: false },
      ]},
      { name: "Notebooks & Files", icon: "📒", items: [
        { name: "Hardcover Exercise Books", required: true },
        { name: "Physics Practical Lab Book", required: true },
        { name: "Chemistry Practical Lab Book", required: true },
        { name: "File Jackets", required: false },
      ]},
      { name: "Biology Tools", icon: "🔭", items: [
        { name: "Hand Lens", required: true },
        { name: "Dissecting Kit", required: true },
      ]},
    ],
    buyLater: [],
    subOptions: [],
  },
  {
    id: "visualarts", name: "Visual Arts", price: 400, icon: "🎨",
    cardColor: "bg-purple-50 border-purple-200", accent: "text-purple-700",
    desc: "Art materials, drawing tools and creative supplies for Visual Arts students.",
    itemCount: 26,
    categories: [
      { name: "Drawing & Sketching Basics", icon: "✏️", items: [
        { name: "A3 Drawing Books", qty: 3, required: true },
        { name: "A4 Drawing Books", qty: 2, required: true },
        { name: "Pencil Set (HB, 2B, 4B, 6B, 8B)", required: true },
        { name: "Kneaded Eraser", required: true },
        { name: "Metal Sharpener", required: true },
        { name: "50cm Ruler", required: true },
        { name: "30cm Ruler", required: true },
        { name: "Compass", required: true },
        { name: "Divider", required: true },
      ]},
      { name: "Painting & Colour", icon: "🖌️", items: [
        { name: "Watercolor Set", required: true },
        { name: "Poster Colour / Acrylics", required: true },
        { name: "Brush Set", required: true },
        { name: "Palette", required: true },
        { name: "Water Container", required: true },
      ]},
      { name: "Technical Drawing Tools", icon: "📏", items: [
        { name: "T-Square", required: true },
        { name: "Set Squares", required: true },
        { name: "A3 Drawing Board", required: true },
        { name: "Masking Tape", required: true },
      ]},
      { name: "Other Useful Items", icon: "🎭", items: [
        { name: "Scissors", required: false },
        { name: "Glue Stick", required: false },
        { name: "Clay Modeling Tools", required: false },
        { name: "Apron / Overall", required: true },
      ]},
    ],
    buyLater: [],
    subOptions: [
      { id: "picture", name: "Picture Making", icon: "🖼️", price: 150, items: ["Canvas Board 10×12 inches ×2", "Palette Knife", "Charcoal Sticks", "Fixative Spray"], buyLater: [] },
      { id: "graphic", name: "Graphic Design", icon: "✏️", price: 120, items: ["A3 Tracing Paper Pad", "Fine Liner Pens (0.1, 0.3, 0.5)", "Cutting Mat", "Craft Knife"], buyLater: [] },
      { id: "ceramics", name: "Ceramics", icon: "🏺", price: 130, items: ["Pottery Clay 5kg", "Wire Clay Cutter", "Sponge", "Kidney Tool"], buyLater: [] },
      { id: "textiles", name: "Textiles", icon: "🧵", price: 140, items: ["Fabric Scissors", "Needles", "Thread Set", "Tie-Dye / Batik Wax", "Tjanting Tool"], buyLater: [] },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`;

const LOCAL_IMAGES: Record<string, string> = {
  __local__aneresBed: aneresBed,
  __local__aneresPillow: aneresPillow,
  __local__chopBox: chopBoxImg,
};

const resolveImg = (id: string, w: number, h: number): string =>
  LOCAL_IMAGES[id] ?? unsplash(id, w, h);

const voucherGradients: Record<string, string> = {
  blue: "from-blue-500 to-blue-700", green: "from-green-500 to-green-700",
  purple: "from-purple-500 to-purple-700", orange: "from-orange-500 to-orange-700",
  red: "from-red-500 to-red-700", teal: "from-teal-500 to-teal-700",
  pink: "from-pink-500 to-pink-700", indigo: "from-indigo-500 to-indigo-700",
};

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" }, { label: "Prospectus", page: "prospectus" },
    { label: "TVET Prospectus", page: "tvet" }, { label: "Shop", page: "shop" },
    { label: "ChopBox", page: "packages" }, { label: "Exam Vouchers", page: "vouchers" },
    { label: "Schools", page: "schools" }, { label: "News", page: "news" },
  ];
  const go = (p: Page) => { setPage(p); setMobileOpen(false); };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => go("home")} className="flex items-center">
            <ImageWithFallback
              src={aehLogo}
              alt="Everything HighSchool — Results, Essentials, Prospectus"
              className="h-10 w-auto object-contain"
            />
          </button>
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map(link => (
              <button key={link.page} onClick={() => go(link.page)}
                className={`text-sm font-medium transition-colors ${page === link.page ? "text-[#1D4ED8]" : "text-[#475569] hover:text-[#0F172A]"}`}>
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-[#475569] hover:text-[#1D4ED8] transition-colors hidden sm:flex rounded-lg hover:bg-blue-50"><Search className="w-5 h-5" /></button>
            <button className="p-2 text-[#475569] hover:text-[#1D4ED8] transition-colors hidden sm:flex rounded-lg hover:bg-blue-50"><Heart className="w-5 h-5" /></button>
            <button className="relative p-2 text-[#475569] hover:text-[#1D4ED8] transition-colors rounded-lg hover:bg-blue-50">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => go("dashboard")} className="hidden sm:flex items-center gap-1.5 ml-1 px-3.5 py-2 bg-[#1D4ED8] text-white rounded-xl text-sm font-medium hover:bg-[#1E40AF] transition-colors">
              <User className="w-4 h-4" /> Login
            </button>
            <button className="lg:hidden p-2 text-[#475569] rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden py-3 border-t border-border space-y-0.5">
            {navLinks.map(link => (
              <button key={link.page} onClick={() => go(link.page)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${page === link.page ? "bg-blue-50 text-[#1D4ED8]" : "text-[#475569] hover:bg-[#F8FAFC]"}`}>
                {link.label}
              </button>
            ))}
            <button onClick={() => go("dashboard")} className="w-full mt-2 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold">Login / Register</button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Homepage Sections ─────────────────────────────────────────────────────────

function HeroSection({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0A1F5E] via-[#1D4ED8] to-[#1E40AF] overflow-hidden pt-16 flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 rounded-full text-sm text-white/90 mb-6 backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" /> Ghana's #1 SHS Preparation Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.12] mb-6 tracking-tight">
              Everything You Need For <span className="text-[#F59E0B]">Senior High School</span> In One Place.
            </h1>
            <p className="text-lg text-white/75 mb-8 max-w-xl leading-relaxed">
              Buy prospectus, admission packages, exam vouchers, chop boxes, and school supplies — delivered anywhere in Ghana.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
              <button onClick={() => setPage("prospectus")} className="flex items-center gap-2 px-6 py-3 bg-white text-[#1D4ED8] rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"><BookOpen className="w-5 h-5" /> Buy Prospectus</button>
              <button onClick={() => setPage("shop")} className="flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-[#1C1917] rounded-xl font-semibold hover:bg-[#D97706] transition-all shadow-lg"><ShoppingBag className="w-5 h-5" /> Shop Now</button>
              <button onClick={() => setPage("vouchers")} className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/25 rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"><Ticket className="w-5 h-5" /> Buy Voucher</button>
              <a href="https://wa.me/233596109399" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-400 transition-all shadow-lg">
                💬 WhatsApp Us
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold rounded-full">✅ GES Approved Prospectus</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold rounded-full">🏫 Trusted by 300+ Schools</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold rounded-full">🇬🇭 Across Ghana</span>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              {[{ value: "300+", label: "Schools Trusted" }, { value: "WAEC, BECE", label: "Exam Vouchers" }, { value: "48hr", label: "Delivery" }].map(s => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#F59E0B]">{s.value}</div>
                  <div className="text-sm text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-sm lg:max-w-none">
            <div className="relative h-80 lg:h-[460px]">
              <div className="absolute top-0 right-0 w-64 lg:w-80 h-56 lg:h-72 rounded-3xl overflow-hidden shadow-2xl bg-blue-900">
                <ImageWithFallback
                  src={firstDayPhoto}
                  alt="First day at Ghana Senior High School — parents and students arriving with mattresses, trunks, and school supplies"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D4ED8]/40 to-transparent" />
              </div>
              <div className="absolute top-6 left-0 bg-white rounded-2xl p-3.5 shadow-2xl max-w-[190px]">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-green-600" /></div>
                  <div><div className="text-xs font-bold text-[#0F172A]">Order Placed!</div><div className="text-[10px] text-[#64748B]">Prospectus Bundle</div></div>
                </div>
                <div className="text-sm font-bold text-[#1D4ED8]">GHS 850.00</div>
              </div>
              <div className="absolute bottom-24 left-0 bg-white rounded-2xl p-3.5 shadow-2xl max-w-[210px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-lg">💬</div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">WhatsApp Us</div>
                    <div className="text-[10px] text-green-600 font-semibold">0596109399</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 right-0 bg-[#F59E0B] rounded-2xl p-3.5 shadow-2xl max-w-[170px]">
                <div className="text-sm font-bold text-white mb-0.5">Pay Small Small</div>
                <div className="text-[10px] text-white/85">Flexible installment plans available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 64" fill="none" className="w-full"><path d="M0 64L1440 64L1440 32C1200 64 960 0 720 16C480 32 240 56 0 32L0 64Z" fill="white" /></svg>
      </div>
    </section>
  );
}

function QuickAccessSection({ setPage }: { setPage: (p: Page) => void }) {
  const cards = [
    { icon: BookOpen, label: "Buy Prospectus", desc: "Official SHS items", bg: "bg-blue-50", fg: "text-blue-600", page: "prospectus" as Page },
    { icon: Ticket, label: "Exam Vouchers", desc: "BECE, WASSCE & more", bg: "bg-purple-50", fg: "text-purple-600", page: "vouchers" as Page },
    { icon: ShoppingBag, label: "Shop Supplies", desc: "12+ categories", bg: "bg-orange-50", fg: "text-orange-600", page: "shop" as Page },
    { icon: Package, label: "ChopBox", desc: "Customize your box", bg: "bg-amber-50", fg: "text-amber-600", page: "packages" as Page },
    { icon: Truck, label: "Track Order", desc: "Real-time tracking", bg: "bg-green-50", fg: "text-green-600", page: "dashboard" as Page },
    { icon: Wallet, label: "Pay Balance", desc: "Installment plans", bg: "bg-teal-50", fg: "text-teal-600", page: "dashboard" as Page },
    { icon: Newspaper, label: "Latest News", desc: "Admissions & more", bg: "bg-rose-50", fg: "text-rose-600", page: "news" as Page },
    { icon: Building2, label: "Schools", desc: "Find your school", bg: "bg-indigo-50", fg: "text-indigo-600", page: "schools" as Page },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1">What are you looking for?</h2>
          <p className="text-[#64748B]">Quick access to our most popular services</p>
        </div>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {cards.map(card => (
            <button key={card.label} onClick={() => setPage(card.page)}
              className="flex flex-col items-center p-3 sm:p-4 rounded-2xl border border-border hover:border-[#1D4ED8]/40 hover:shadow-md transition-all group text-center">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${card.bg} ${card.fg} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#0F172A] leading-tight">{card.label}</span>
              <span className="text-[9px] sm:text-[10px] text-[#64748B] mt-0.5 hidden sm:block">{card.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopCategoriesSection({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div><h2 className="text-2xl font-bold text-[#0F172A]">Shop by Category</h2><p className="text-[#64748B] mt-1">Everything your student needs</p></div>
          <button onClick={() => setPage("shop")} className="flex items-center gap-1 text-[#1D4ED8] font-medium text-sm hover:gap-2 transition-all">View All <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SHOP_CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => setPage("shop")} className="group relative rounded-2xl overflow-hidden aspect-square bg-blue-100">
              <img src={unsplash(cat.image, 300, 300)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/75 via-[#0F172A]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <div className="text-white font-semibold text-sm">{cat.name}</div>
                <div className="text-white/65 text-xs">{cat.count} items</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProspectusPreviewSection({ setPage }: { setPage: (p: Page) => void }) {
  const [type, setType] = useState<"boarding" | "day">("boarding");
  const items = type === "boarding" ? PROSPECTUS_BOARDING.slice(0, 4) : PROSPECTUS_DAY.slice(0, 4);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#1D4ED8] text-sm font-semibold mb-2"><BookMarked className="w-4 h-4" />Official Prospectus</div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Shop Your Prospectus Items</h2>
            <p className="text-[#64748B] mt-1">All official SHS items, available for delivery</p>
          </div>
          <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1">
            {(["boarding", "day"] as const).map(t => (
              <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === t ? "bg-white text-[#1D4ED8] shadow-sm" : "text-[#64748B]"}`}>
                {t === "boarding" ? "🏠 Boarding" : "🏃 Day"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-44 bg-[#F1F5F9] overflow-hidden">
                <img src={unsplash(item.image, 300, 200)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2"><span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-medium rounded-full">In Stock</span></div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#0F172A] text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-[#64748B] mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1D4ED8] text-base">GHS {item.price}</span>
                  <button className="px-3 py-1.5 bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={() => setPage("prospectus")} className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D4ED8] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition-colors shadow-lg shadow-blue-200">
            View Full Prospectus <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="py-10 bg-[#1D4ED8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[{ icon: Shield, label: "Secure Payments", desc: "Bank-level encryption" }, { icon: Truck, label: "Nationwide Delivery", desc: "All 16 regions" }, { icon: Headphones, label: "WhatsApp Support", desc: "0596109399" }, { icon: RefreshCcw, label: "GES Approved", desc: "Official prospectus" }].map(t => (
            <div key={t.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0"><t.icon className="w-5 h-5 text-white" /></div>
              <div><div className="font-semibold text-white text-sm">{t.label}</div><div className="text-xs text-white/65">{t.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesPreviewSection({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-[#F59E0B] text-sm font-semibold mb-2"><Package className="w-4 h-4" />ChopBox</div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Choose Your ChopBox</h2>
          <p className="text-[#64748B] mt-2">Curated food packages for boarding students. Fully customizable.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg, i) => {
            const bgs = ["bg-blue-50", "bg-amber-50", "bg-purple-50"];
            return (
              <div key={pkg.id} className={`relative rounded-3xl border-2 overflow-hidden ${pkg.badge === "Most Popular" ? "border-[#F59E0B] shadow-xl shadow-amber-100" : "border-border"}`}>
                {pkg.badge && <div className={`absolute top-4 right-4 px-3 py-1 ${pkg.badgeColor} text-white text-xs font-bold rounded-full z-10`}>{pkg.badge}</div>}
                <div className={`p-6 ${bgs[i]}`}>
                  <div className="text-4xl mb-2">{pkg.emoji}</div>
                  <h3 className="text-xl font-bold text-[#0F172A]">{pkg.name}</h3>
                  <p className="text-sm text-[#64748B]">{pkg.tagline}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#0F172A]">GHS {pkg.price}</span>
                    <span className="text-sm text-[#94A3B8] line-through">GHS {pkg.originalPrice}</span>
                  </div>
                  <div className="text-xs text-green-600 font-semibold mt-0.5">Save GHS {pkg.originalPrice - pkg.price}</div>
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-1.5 mb-5">
                    {pkg.items.slice(0, 5).map(item => (
                      <li key={item.name} className="flex items-center gap-2 text-sm text-[#475569]"><Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{item.name} {item.qty > 1 ? `×${item.qty}` : ""}</li>
                    ))}
                    {pkg.items.length > 5 && <li className="text-xs text-[#94A3B8] pl-5">+{pkg.items.length - 5} more items</li>}
                  </ul>
                  <button onClick={() => setPage("packages")} className="w-full py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1E40AF] transition-colors">View Package</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VouchersPreviewSection({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#7C3AED] text-sm font-semibold mb-2"><Ticket className="w-4 h-4" />Exam Vouchers</div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Buy Examination Vouchers</h2>
            <p className="text-[#64748B] mt-1">Instant delivery. No queuing. No stress.</p>
          </div>
          <button onClick={() => setPage("vouchers")} className="flex items-center gap-1 text-[#1D4ED8] font-medium text-sm hover:gap-2 transition-all">All Vouchers <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {VOUCHERS.slice(0, 4).map(v => (
            <button key={v.id} onClick={() => setPage("vouchers")} className="bg-white border-2 border-border hover:border-[#1D4ED8] rounded-2xl p-5 text-left transition-all hover:shadow-lg group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${voucherGradients[v.color]} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>{v.icon}</div>
              <h3 className="font-bold text-[#0F172A] mb-1">{v.name}</h3>
              <p className="text-xs text-[#64748B] mb-3 line-clamp-2">{v.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1D4ED8]">{v.currency} {v.price}</span>
                <span className="text-xs flex items-center gap-0.5 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3" /> Instant</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0F172A]">Trusted by Parents & Students</h2>
          <p className="text-[#64748B] mt-1">Join thousands of families across Ghana</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-0.5 mb-3">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />)}</div>
              <p className="text-sm text-[#475569] mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{t.avatar}</div>
                <div><div className="text-sm font-semibold text-[#0F172A]">{t.name}</div><div className="text-xs text-[#64748B]">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsPreviewSection({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div><h2 className="text-2xl font-bold text-[#0F172A]">Latest News</h2><p className="text-[#64748B] mt-1">Stay informed on admissions and education</p></div>
          <button onClick={() => setPage("news")} className="flex items-center gap-1 text-[#1D4ED8] font-medium text-sm hover:gap-2 transition-all">All News <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {NEWS_ARTICLES.slice(0, 3).map(article => (
            <div key={article.id} className="group rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
              <div className="h-48 bg-blue-100 overflow-hidden">
                <img src={unsplash(article.image, 400, 250)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#1D4ED8] text-[10px] font-bold rounded-full">{article.category}</span>
                  <span className="text-[#94A3B8] text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                </div>
                <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-xs text-[#64748B] line-clamp-2 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#94A3B8]">{article.date}</span>
                  <button className="text-xs text-[#1D4ED8] font-semibold hover:underline flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="mb-4 inline-block bg-white rounded-xl px-3 py-2">
              <ImageWithFallback
                src={aehLogo}
                alt="Everything HighSchool"
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-2">Ghana's complete Senior High School preparation platform. GES-approved prospectus, exam vouchers, school supplies, and ChopBox packages — all in one place.</p>
            <p className="text-[#F59E0B] text-sm font-semibold italic mb-4">"Everything High School, Everything You Need!"</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">✓ GES Approved Prospectus</span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/70 text-xs font-semibold rounded-full border border-white/20">🏫 Trusted by 300+ Schools</span>
            </div>
            <div className="flex gap-2">
              {([
                { Icon: Facebook, label: "Facebook", href: "https://facebook.com/everythinghighschool" },
                { Icon: Instagram, label: "Instagram", href: "https://instagram.com/everythinghighschool" },
                { Icon: Twitter, label: "TikTok", href: "https://tiktok.com/@everythinghighschool" },
                { Icon: Youtube, label: "YouTube", href: "https://youtube.com/@everythinghighschool" },
              ] as const).map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={`@everythinghighschool on ${label}`}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Services", links: [{ label: "Buy Prospectus", page: "prospectus" as Page }, { label: "Exam Vouchers", page: "vouchers" as Page }, { label: "Chop Boxes", page: "packages" as Page }, { label: "Shop", page: "shop" as Page }] },
            { title: "Discover", links: [{ label: "Schools", page: "schools" as Page }, { label: "News", page: "news" as Page }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">{col.links.map(link => <li key={link.label}><button onClick={() => setPage(link.page)} className="text-white/50 text-sm hover:text-white transition-colors">{link.label}</button></li>)}</ul>
            </div>
          ))}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://wa.me/233596109399" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">📱 <span>0596109399 (WhatsApp)</span></a></li>
              <li><a href="tel:+233552616188" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">📞 <span>+233 55 261 6188</span></a></li>
              <li><a href="mailto:everythinghighschool01@gmail.com" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">📧 <span className="break-all">everythinghighschool01@gmail.com</span></a></li>
              <li><a href="https://www.everythinghighschool.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">🌐 <span>everythinghighschool.com</span></a></li>
              <li className="pt-1">
                <a href="https://wa.me/233596109399" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl transition-colors">
                  💬 Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/35 text-xs flex items-center gap-3 flex-wrap">
            <span>© 2025 Everything HighSchool · everythinghighschool.com · All rights reserved.</span>
            <button onClick={() => setPage("admin")} className="text-white/30 hover:text-white/60 transition-colors underline-offset-2 hover:underline text-[10px]">Admin Portal</button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-white/40 text-xs">@everythinghighschool</span>
            <span className="text-white/20">·</span>
            {["MTN MoMo", "Telecel Cash", "Visa", "Mastercard", "Paystack"].map(p => <span key={p} className="px-2 py-1 bg-white/10 rounded text-[10px] text-white/50">{p}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      <HeroSection setPage={setPage} />
      <QuickAccessSection setPage={setPage} />
      <ShopCategoriesSection setPage={setPage} />
      <ProspectusPreviewSection setPage={setPage} />
      <TrustBar />
      <PackagesPreviewSection setPage={setPage} />
      <VouchersPreviewSection setPage={setPage} />
      <TestimonialsSection />
      <NewsPreviewSection setPage={setPage} />
      <Footer setPage={setPage} />
    </>
  );
}

// ── Prospectus Page ───────────────────────────────────────────────────────────

function ProspectusPage() {
  const [studentType, setStudentType] = useState<"boarding" | "day" | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const updateQty = (id: number, delta: number) =>
    setQuantities(prev => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      if (next === 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: next };
    });

  const toggleWishlist = (id: number) =>
    setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const categories = studentType === "boarding" ? PROSPECTUS_CATEGORIES_BOARDING : PROSPECTUS_CATEGORIES_DAY;
  const allItems = categories.flatMap(c => c.items);
  const totalItems = Object.values(quantities).reduce((s, q) => s + q, 0);
  const totalPrice = allItems.reduce((s, item) => s + (quantities[item.id] ?? 0) * item.price, 0);
  const totalCount = allItems.length;

  const addAll = () => {
    const all: Record<number, number> = {};
    allItems.forEach(i => { all[i.id] = 1; });
    setQuantities(all);
  };

  // Hero + student type selection
  if (!studentType) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        <div className="bg-gradient-to-br from-[#0A1F5E] to-[#1D4ED8] text-white text-center py-16 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm mb-4 border border-white/10">
            <BookOpen className="w-4 h-4 text-[#F59E0B]" /> Official GES Prospectus
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">GES Harmonized SHS Prospectus</h1>
          <p className="text-white/75 max-w-lg mx-auto text-base leading-relaxed">
            Select whether you are a Boarding or Day Student to view the official GES-approved prospectus and begin your shopping journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { type: "boarding" as const, title: "Boarding Student", emoji: "🏠", desc: "You live on campus and need the full set of bedding, storage, clothing, personal care, food items, and school essentials.", image: "photo-1522202176988-66273c2fd55f", count: `${PROSPECTUS_CATEGORIES_BOARDING.reduce((s, c) => s + c.items.length, 0)}+ items` },
              { type: "day" as const, title: "Day Student", emoji: "🏃", desc: "You travel from home daily. You need school bags, shoes, stationery, and key learning materials.", image: "photo-1503676260728-1c00da094a0b", count: `${PROSPECTUS_CATEGORIES_DAY.reduce((s, c) => s + c.items.length, 0)}+ items` },
            ].map(opt => (
              <button key={opt.type} onClick={() => { setStudentType(opt.type); setQuantities({}); }}
                className="group relative rounded-3xl overflow-hidden border-2 border-border hover:border-[#1D4ED8] transition-all hover:shadow-xl text-left bg-white">
                <div className="relative h-52 bg-blue-200 overflow-hidden">
                  <img src={unsplash(opt.image, 500, 300)} alt={opt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-4xl">{opt.emoji}</div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0F172A] mb-2">{opt.title}</h2>
                  <p className="text-sm text-[#64748B] mb-4 leading-relaxed">{opt.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1D4ED8] bg-blue-50 px-3 py-1 rounded-full">{opt.count}</span>
                    <span className="flex items-center gap-1 text-[#1D4ED8] font-semibold text-sm group-hover:gap-2 transition-all">
                      View Prospectus <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <BookMarked className="w-5 h-5 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#0F172A] text-sm mb-1">About the GES Harmonized Prospectus</div>
                <p className="text-xs text-[#64748B] leading-relaxed">The Ghana Education Service (GES) publishes an official harmonized prospectus listing all required items for Senior High School students. This list is updated every academic year and is the same across all GES public schools.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category items view
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      {/* Sticky header */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setStudentType(null)} className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="h-4 w-px bg-border" />
              <div>
                <h1 className="font-bold text-[#0F172A] text-sm">GES Harmonized SHS Prospectus</h1>
                <p className="text-xs text-[#64748B]">{studentType === "boarding" ? "🏠 Boarding Student" : "🏃 Day Student"} · {totalCount} items · {categories.length} categories</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="px-3 py-2 border border-border text-[#475569] rounded-xl text-xs font-semibold hover:border-[#1D4ED8] transition-colors">Save List</button>
              <button onClick={addAll} className="px-3 py-2 bg-[#F1F5F9] text-[#475569] rounded-xl text-xs font-semibold hover:bg-[#E2E8F0] transition-colors">Add All</button>
            </div>
          </div>
          <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#1D4ED8] rounded-full transition-all duration-500" style={{ width: `${totalCount > 0 ? Math.min(100, (Object.keys(quantities).length / totalCount) * 100) : 0}%` }} />
          </div>
          <div className="flex justify-between text-xs text-[#64748B] mt-1">
            <span>{Object.keys(quantities).length} of {totalCount} items selected</span>
            <span className="font-semibold text-[#1D4ED8]">GHS {totalPrice.toFixed(2)} estimated</span>
          </div>
        </div>
      </div>

      {/* Category sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {categories.map(cat => (
          <div key={cat.name} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="text-lg font-bold text-[#0F172A]">{cat.name}</h2>
              <span className="text-xs text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">{cat.items.length} items</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {cat.items.map(item => {
                const qty = quantities[item.id] ?? 0;
                const inWishlist = wishlist.has(item.id);
                return (
                  <div key={item.id} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${qty > 0 ? "border-[#1D4ED8] shadow-md shadow-blue-100" : "border-border hover:shadow-md"}`}>
                    <div className="relative h-36 bg-[#F1F5F9] overflow-hidden">
                      <img src={resolveImg(item.image, 250, 180)} alt={item.name} className="w-full h-full object-cover" />
                      {qty > 0 && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center shadow">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <button onClick={() => toggleWishlist(item.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                        <Heart className={`w-3 h-3 ${inWishlist ? "fill-red-500 text-red-500" : "text-[#94A3B8]"}`} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-[#0F172A] text-xs leading-tight mb-1">{item.name}</h3>
                      <p className="text-[10px] text-[#64748B] mb-2 line-clamp-2">{item.desc}</p>
                      <div className="font-bold text-[#1D4ED8] text-sm mb-2">GHS {item.price}</div>
                      {qty > 0 ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors flex-shrink-0">
                            <Minus className="w-3 h-3 text-[#475569]" />
                          </button>
                          <span className="flex-1 text-center text-sm font-bold text-[#0F172A]">{qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-[#1D4ED8] flex items-center justify-center hover:bg-[#1E40AF] transition-colors flex-shrink-0">
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => updateQty(item.id, 1)} className="w-full py-1.5 bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg hover:bg-[#1E40AF] transition-colors">
                          + Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky checkout bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A] text-white shadow-2xl z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-white/80">{Object.keys(quantities).length} items · {totalItems} units</div>
              <div className="text-xl font-bold text-[#F59E0B]">GHS {totalPrice.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2.5 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors hidden sm:block">Save List</button>
              <button className="px-6 py-2.5 bg-[#1D4ED8] text-white rounded-xl font-bold text-sm hover:bg-[#1E40AF] transition-colors">Proceed to Checkout →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ProductCard ───────────────────────────────────────────────────────────────

function ProductCard({ product, inWishlist, onWishlist, onAddToCart, onQuickView, cartQty, compact = false }: {
  product: ShopProduct; inWishlist: boolean; onWishlist: () => void;
  onAddToCart: () => void; onQuickView: () => void; cartQty: number; compact?: boolean;
}) {
  const badgeStyle: Record<string, string> = {
    "New": "bg-blue-500", "Best Seller": "bg-[#F59E0B]",
    "Flash Sale": "bg-red-500", "Featured": "bg-purple-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all group flex flex-col">
      <div className={`relative overflow-hidden bg-[#F1F5F9] flex-shrink-0 ${compact ? "h-28" : "h-44"}`}>
        <img src={resolveImg(product.image, 300, 220)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 ${badgeStyle[product.badge]} text-white text-[10px] font-bold rounded-full`}>{product.badge}</span>
        )}
        <button onClick={onWishlist} className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10">
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? "fill-red-500 text-red-500" : "text-[#94A3B8]"}`} />
        </button>
        {/* Quick View overlay */}
        <button onClick={onQuickView} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-[#0F172A] text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">Quick View</span>
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-[#0F172A] text-white text-xs font-semibold px-3 py-1.5 rounded-xl">Out of Stock</span>
          </div>
        )}
      </div>
      <div className={`flex flex-col flex-1 ${compact ? "p-2" : "p-3"}`}>
        {!compact && <div className="text-[10px] text-[#94A3B8] mb-0.5">{product.brand}</div>}
        <h3 className={`font-semibold text-[#0F172A] leading-tight line-clamp-2 flex-1 ${compact ? "text-[10px] mb-1" : "text-xs mb-1.5"}`}>{product.name}</h3>
        {!compact && (
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-[#F59E0B] text-[9px] leading-none">{"★".repeat(Math.floor(product.rating))}</span>
            <span className="text-[10px] font-semibold text-[#0F172A]">{product.rating}</span>
            <span className="text-[10px] text-[#94A3B8]">({product.reviews})</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`font-bold text-[#1D4ED8] ${compact ? "text-xs" : "text-sm"}`}>GHS {product.price}</span>
          {product.originalPrice && <span className="text-[10px] text-[#94A3B8] line-through">GHS {product.originalPrice}</span>}
        </div>
        {product.inStock ? (
          cartQty > 0 ? (
            <button onClick={onAddToCart} className="w-full py-1.5 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 transition-colors">
              ✓ In Cart ({cartQty}) — Add More
            </button>
          ) : (
            <div className="flex gap-1">
              <button onClick={onAddToCart} className={`flex-1 bg-[#1D4ED8] text-white font-semibold rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-1 ${compact ? "py-1 text-[9px]" : "py-1.5 text-[10px]"}`}>
                <Plus className="w-2.5 h-2.5" /> Add
              </button>
              {!compact && (
                <button onClick={onQuickView} className="px-2 py-1.5 border border-border rounded-lg text-[10px] text-[#475569] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors">
                  ···
                </button>
              )}
            </div>
          )
        ) : (
          <button disabled className="w-full py-1.5 bg-[#E2E8F0] text-[#94A3B8] text-[10px] font-semibold rounded-lg cursor-not-allowed">Out of Stock</button>
        )}
      </div>
    </div>
  );
}

// ── QuickViewModal ────────────────────────────────────────────────────────────

function QuickViewModal({ product, onClose, inWishlist, onWishlist, onAddToCart, cartQty, related, onViewRelated }: {
  product: ShopProduct; onClose: () => void; inWishlist: boolean; onWishlist: () => void;
  onAddToCart: () => void; cartQty: number; related: ShopProduct[]; onViewRelated: (p: ShopProduct) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full sm:rounded-3xl sm:max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border sticky top-0 bg-white z-10 rounded-t-3xl">
          <div>
            <div className="text-xs text-[#64748B]">{product.category} · {product.brand}</div>
            <h2 className="font-bold text-[#0F172A] text-lg leading-tight mt-0.5">{product.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors flex-shrink-0 ml-4">
            <X className="w-4 h-4 text-[#475569]" />
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-[#F1F5F9] h-64">
              <img src={resolveImg(product.image, 400, 400)} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {/* Info */}
            <div className="flex flex-col">
              {product.badge && (
                <span className={`self-start px-2.5 py-0.5 text-white text-xs font-bold rounded-full mb-2 ${{ "New": "bg-blue-500", "Best Seller": "bg-[#F59E0B]", "Flash Sale": "bg-red-500", "Featured": "bg-purple-500" }[product.badge]}`}>{product.badge}</span>
              )}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#F59E0B]">{"★".repeat(Math.floor(product.rating))}</span>
                <span className="text-sm font-semibold text-[#0F172A]">{product.rating}</span>
                <span className="text-sm text-[#94A3B8]">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-[#1D4ED8]">GHS {product.price}</span>
                {product.originalPrice && <span className="text-sm text-[#94A3B8] line-through">GHS {product.originalPrice}</span>}
                {product.originalPrice && <span className="text-sm font-bold text-green-600">Save GHS {product.originalPrice - product.price}</span>}
              </div>
              <p className="text-sm text-[#475569] leading-relaxed mb-4 flex-1">{product.desc}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`} />
                <span className={`text-sm font-semibold ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                  {product.inStock ? "In Stock — Ready to Ship" : "Out of Stock"}
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <button onClick={onAddToCart} disabled={!product.inStock}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${product.inStock ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>
                  <ShoppingCart className="w-4 h-4" />
                  {cartQty > 0 ? `In Cart (${cartQty}) — Add More` : "Add to Cart"}
                </button>
                <button onClick={onWishlist}
                  className={`px-3.5 py-3 rounded-xl border-2 transition-all ${inWishlist ? "border-red-300 bg-red-50" : "border-border hover:border-[#1D4ED8]"}`}>
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-[#94A3B8]"}`} />
                </button>
              </div>
              <button disabled={!product.inStock}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${product.inStock ? "bg-[#F59E0B] text-[#1C1917] hover:bg-[#D97706]" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>
                Buy Now →
              </button>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h3 className="font-bold text-[#0F172A] text-sm mb-3">Related Products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {related.map(p => (
                  <button key={p.id} onClick={() => onViewRelated(p)}
                    className="text-left rounded-xl overflow-hidden border border-border hover:border-[#1D4ED8] transition-colors group/rel">
                    <div className="h-24 bg-[#F1F5F9] overflow-hidden">
                      <img src={resolveImg(p.image, 200, 150)} alt={p.name} className="w-full h-full object-cover group-hover/rel:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-semibold text-[#0F172A] line-clamp-2 leading-tight">{p.name}</div>
                      <div className="text-[10px] font-bold text-[#1D4ED8] mt-0.5">GHS {p.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shop Page ─────────────────────────────────────────────────────────────────

function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<Record<number, number>>({});
  const [quickView, setQuickView] = useState<ShopProduct | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = ["All", ...SHOP_CATEGORIES.map(c => c.name)];

  const filtered = useMemo(() => {
    let result = SHOP_PRODUCTS.filter(p => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.desc.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (inStockOnly && !p.inStock) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });
    switch (sortBy) {
      case "price-asc": return [...result].sort((a, b) => a.price - b.price);
      case "price-desc": return [...result].sort((a, b) => b.price - a.price);
      case "rating": return [...result].sort((a, b) => b.rating - a.rating);
      case "newest": return [...result].sort((a, b) => (a.badge === "New" ? -1 : 1));
      default: return result;
    }
  }, [selectedCategory, searchQuery, inStockOnly, minRating, minPrice, maxPrice, sortBy]);

  const flashSale = SHOP_PRODUCTS.filter(p => p.badge === "Flash Sale");
  const bestSellers = SHOP_PRODUCTS.filter(p => p.badge === "Best Seller");
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  const toggleWishlist = (id: number) => setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const addToCart = (id: number) => setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  const clearFilters = () => { setSelectedCategory("All"); setSearchQuery(""); setMinRating(0); setInStockOnly(false); setMinPrice(0); setMaxPrice(5000); };
  const hasFilters = selectedCategory !== "All" || searchQuery || minRating > 0 || inStockOnly || minPrice > 0 || maxPrice < 5000;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      {/* Flash Sale Banner */}
      {flashSale.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-sm flex items-center gap-1">⚡ Flash Sale!</span>
              {flashSale.slice(0, 2).map(p => (
                <span key={p.id} className="text-xs text-red-200">
                  {p.name} — <span className="line-through">GHS {p.originalPrice}</span> → <span className="text-white font-bold">GHS {p.price}</span>
                </span>
              ))}
            </div>
            <span className="text-xs text-red-200 flex items-center gap-1.5">
              ⏱ Limited time offer
            </span>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">Shop School Supplies</h1>
              <p className="text-[#64748B] text-sm mt-0.5">Everything your student needs for SHS — all in one place</p>
            </div>
            <div className="flex items-center gap-2">
              {wishlist.size > 0 && <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200"><Heart className="w-3.5 h-3.5 fill-red-500" />{wishlist.size} saved</span>}
              {cartCount > 0 && <span className="flex items-center gap-1 px-3 py-1.5 bg-[#1D4ED8] text-white text-xs font-bold rounded-xl"><ShoppingCart className="w-3.5 h-3.5" />{cartCount} in cart</span>}
            </div>
          </div>
          {/* Search + sort */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input type="text" placeholder="Search products, brands…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all" />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 border border-border rounded-xl text-sm text-[#475569] focus:outline-none focus:border-[#1D4ED8] bg-white">
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-border rounded-xl text-sm text-[#475569] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors lg:hidden">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${selectedCategory === cat ? "bg-[#1D4ED8] text-white" : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <div className={`w-52 flex-shrink-0 ${filtersOpen ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-36 space-y-5">
              <h3 className="font-bold text-[#0F172A] text-sm flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-[#1D4ED8]" /> Filters</h3>

              {/* Price */}
              <div>
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Price (GHS)</div>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice || ""} onChange={e => setMinPrice(+e.target.value || 0)} min={0}
                    className="w-full px-2 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:border-[#1D4ED8]" />
                  <input type="number" placeholder="Max" value={maxPrice === 5000 ? "" : maxPrice} onChange={e => setMaxPrice(+e.target.value || 5000)} min={0}
                    className="w-full px-2 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:border-[#1D4ED8]" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Min Rating</div>
                <div className="space-y-1">
                  {[0, 3, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${minRating === r ? "bg-blue-50 text-[#1D4ED8] font-semibold" : "text-[#475569] hover:bg-[#F8FAFC]"}`}>
                      <span className="text-[#F59E0B]">{"★".repeat(Math.floor(r) || 0)}</span>
                      <span>{r === 0 ? "All Ratings" : `${r}+ Stars`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div>
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Availability</div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#475569]">
                  <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-[#1D4ED8]" />
                  In Stock Only
                </label>
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="w-full py-2 text-xs text-red-500 font-semibold hover:underline text-center">Clear All Filters</button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Flash Sale grid */}
            {flashSale.length > 0 && selectedCategory === "All" && !searchQuery && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⚡</span>
                  <h2 className="font-bold text-red-700 text-sm">Flash Sale — Limited Time Deals</h2>
                  <span className="ml-auto text-xs text-red-500 font-semibold bg-red-100 px-2 py-0.5 rounded-full">{flashSale.length} items</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {flashSale.map(p => (
                    <ProductCard key={p.id} product={p} compact inWishlist={wishlist.has(p.id)} onWishlist={() => toggleWishlist(p.id)} onAddToCart={() => addToCart(p.id)} onQuickView={() => setQuickView(p)} cartQty={cart[p.id] ?? 0} />
                  ))}
                </div>
              </div>
            )}

            {/* Best Sellers horizontal scroll */}
            {bestSellers.length > 0 && selectedCategory === "All" && !searchQuery && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🏆</span>
                  <h2 className="font-bold text-[#0F172A] text-sm">Best Sellers</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-0.5 px-0.5">
                  {bestSellers.map(p => (
                    <div key={p.id} className="flex-shrink-0 w-36">
                      <ProductCard product={p} compact inWishlist={wishlist.has(p.id)} onWishlist={() => toggleWishlist(p.id)} onAddToCart={() => addToCart(p.id)} onQuickView={() => setQuickView(p)} cartQty={cart[p.id] ?? 0} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#64748B]"><span className="font-bold text-[#0F172A]">{filtered.length}</span> products{selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}</span>
              {hasFilters && <button onClick={clearFilters} className="text-xs text-red-500 font-semibold hover:underline">Clear filters</button>}
            </div>

            {/* Product grid */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border py-16 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-semibold text-[#0F172A]">No products found</div>
                <div className="text-[#64748B] text-sm mt-1">Try adjusting your search or filters</div>
                <button onClick={clearFilters} className="mt-4 px-5 py-2 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1E40AF] transition-colors">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} inWishlist={wishlist.has(p.id)} onWishlist={() => toggleWishlist(p.id)} onAddToCart={() => addToCart(p.id)} onQuickView={() => setQuickView(p)} cartQty={cart[p.id] ?? 0} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <QuickViewModal
          product={quickView}
          onClose={() => setQuickView(null)}
          inWishlist={wishlist.has(quickView.id)}
          onWishlist={() => toggleWishlist(quickView.id)}
          onAddToCart={() => addToCart(quickView.id)}
          cartQty={cart[quickView.id] ?? 0}
          related={SHOP_PRODUCTS.filter(p => p.category === quickView.category && p.id !== quickView.id).slice(0, 4)}
          onViewRelated={p => setQuickView(p)}
        />
      )}
    </div>
  );
}

// ── ChopBox Page ──────────────────────────────────────────────────────────────

function PackagesPage() {
  const [view, setView] = useState<"cards" | "builder">("cards");
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<BuilderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Wizard state
  const [wizardStep, setWizardStep] = useState(0); // 0 = off, 1-4 = active
  const [storageChoice, setStorageChoice] = useState<"metallic" | "plastic" | "own" | "">("");
  const [paymentChoice, setPaymentChoice] = useState<"now" | "installment" | "">("");

  const budgetLimits: Record<string, number> = { standard: 420, deluxe: 790, premium: 1200 };
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const budgetLimit = selectedPkgId ? budgetLimits[selectedPkgId] : 1200;
  const budgetPct = Math.min(100, (cartTotal / budgetLimit) * 100);
  const savings = budgetLimit - cartTotal;

  const selectPackage = (pkgId: string) => {
    const pkg = PACKAGES.find(p => p.id === pkgId);
    if (!pkg) return;
    const initial: BuilderItem[] = pkg.items.map((item, idx) => {
      const catalog = CATALOG_ITEMS.find(c => item.name.toLowerCase().includes(c.name.toLowerCase().split(" ")[0]));
      return { id: catalog?.id ?? `pkg-item-${idx}`, name: item.name, qty: item.qty, price: catalog?.price ?? 10, category: catalog?.category ?? "Essentials", icon: item.icon };
    });
    setCartItems(initial);
    setSelectedPkgId(pkgId);
    setView("builder");
    setActiveCategory("All");
    setSearchQuery("");
  };

  const openWizard = (pkgId: string) => {
    selectPackage(pkgId);
    setWizardStep(1);
    setStorageChoice("");
    setPaymentChoice("");
  };

  const updateQty = (id: string, delta: number) =>
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

  const removeItem = (id: string) => setCartItems(prev => prev.filter(i => i.id !== id));

  const addFromCatalog = (item: BuilderItem) =>
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });

  const catalogCategories = ["All", "Snacks", "Drinks", "Breakfast", "Protein", "Essentials", "Storage"];
  const filteredCatalog = useMemo(() => CATALOG_ITEMS.filter(item => {
    if (activeCategory !== "All" && item.category !== activeCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [activeCategory, searchQuery]);

  const pkgBgs = ["from-blue-50 to-blue-100/50", "from-amber-50 to-amber-100/50", "from-purple-50 to-purple-100/50"];

  // ── Wizard view ─────────────────────────────────────────────────────────────
  if (wizardStep > 0 && selectedPkgId) {
    const pkg = PACKAGES.find(p => p.id === selectedPkgId)!;
    const storagePrices = { metallic: 180, plastic: 85, own: 0 };
    const deliveryFee = 80;
    const storagePrice = storageChoice ? storagePrices[storageChoice] : 0;
    const chopboxTotal = pkg.price;
    const grandTotal = chopboxTotal + storagePrice + (wizardStep >= 3 ? deliveryFee : 0);
    const wizardLabels = ["Review Contents", "Storage Option", "Review Order", "Payment"];

    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        {/* Wizard header */}
        <div className="bg-white border-b border-border sticky top-16 z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => wizardStep === 1 ? (setWizardStep(0), setView("cards")) : setWizardStep(s => s - 1)}
                className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="h-4 w-px bg-border" />
              <div>
                <span className="font-bold text-[#0F172A] text-sm">{pkg.name}</span>
                <span className="text-xs text-[#64748B] ml-2">· Step {wizardStep} of 4</span>
              </div>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {wizardLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-1 flex-shrink-0">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${i + 1 === wizardStep ? "bg-[#1D4ED8] text-white" : i + 1 < wizardStep ? "bg-green-100 text-green-700" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>
                    {i + 1 < wizardStep ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < wizardLabels.length - 1 && <div className={`h-0.5 w-5 flex-shrink-0 ${i + 1 < wizardStep ? "bg-green-400" : "bg-[#E2E8F0]"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Step 1: Review & customize contents */}
          {wizardStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">Review Your ChopBox Contents</h2>
              <p className="text-[#64748B] text-sm mb-6">Add, remove, or adjust quantities before continuing.</p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left: item list */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-[#F8FAFC]">
                    <span className="font-bold text-[#0F172A] text-sm">{pkg.name} Contents</span>
                    <span className="text-xs text-[#64748B]">{cartItems.length} items</span>
                  </div>
                  <div className="divide-y divide-border max-h-96 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="text-xl flex-shrink-0">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#0F172A] truncate">{item.name}</div>
                          <div className="text-[10px] text-[#64748B]">GHS {item.price} each</div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0]"><Minus className="w-2.5 h-2.5 text-[#475569]" /></button>
                          <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-[#1D4ED8] text-white flex items-center justify-center hover:bg-[#1E40AF]"><Plus className="w-2.5 h-2.5" /></button>
                          <button onClick={() => removeItem(item.id)} className="w-6 h-6 rounded bg-red-50 flex items-center justify-center hover:bg-red-100 ml-1"><Trash2 className="w-2.5 h-2.5 text-red-400" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right: summary */}
                <div className="bg-white rounded-2xl border border-border p-5">
                  <div className="text-sm font-bold text-[#0F172A] mb-3">ChopBox Summary</div>
                  <div className={`p-4 rounded-xl border-2 bg-gradient-to-br ${["from-blue-50 to-blue-100/50","from-amber-50 to-amber-100/50","from-purple-50 to-purple-100/50"][PACKAGES.findIndex(p=>p.id===selectedPkgId)]} mb-4`}>
                    <div className="text-2xl mb-1">{pkg.emoji}</div>
                    <div className="font-bold text-[#0F172A]">{pkg.name}</div>
                    <div className="text-2xl font-bold text-[#1D4ED8] mt-2">GHS {pkg.price}</div>
                    <div className="text-xs text-green-600 font-medium">Save GHS {pkg.originalPrice - pkg.price}</div>
                  </div>
                  <button onClick={() => setWizardStep(2)} className="w-full py-3 bg-[#1D4ED8] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-colors">
                    Continue to Storage →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Storage option */}
          {wizardStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">How would you like your ChopBox packed?</h2>
              <p className="text-[#64748B] text-sm mb-6">Select a storage box for your ChopBox contents, or use your own.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {([
                  { id: "metallic" as const, name: "Metallic Chop Box", price: 180, img: null as string | null, desc: "Traditional metal storage box", features: ["Heavy-duty steel construction", "Lockable with padlock", "Boarding school standard", "Durable for all weather"], badge: "Most Popular" },
                  { id: "plastic" as const, name: "Plastic Storage Box", price: 85, img: chopBoxImg as string | null, desc: "Heavy-duty plastic with snap-lock yellow lid", features: ["Impact-resistant thick plastic", "Yellow snap-lock lid", "Stackable and airtight", "Weatherproof design"], badge: null },
                ] as const).map(opt => (
                  <button key={opt.id} onClick={() => setStorageChoice(opt.id)}
                    className={`relative rounded-2xl border-2 overflow-hidden text-left transition-all ${storageChoice === opt.id ? "border-[#1D4ED8] shadow-lg shadow-blue-100" : "border-border bg-white hover:border-[#1D4ED8]/40 hover:shadow-md"}`}>
                    {opt.badge && <div className="absolute top-4 right-4 px-2 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full z-10">{opt.badge}</div>}
                    <div className="h-44 bg-[#F1F5F9] overflow-hidden">
                      {opt.img ? (
                        <ImageWithFallback src={opt.img} alt={opt.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-6xl">🔒</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#0F172A] text-base mb-0.5">{opt.name}</h3>
                      <p className="text-xs text-[#64748B] mb-3">{opt.desc}</p>
                      <ul className="space-y-1 mb-4">
                        {opt.features.map(f => <li key={f} className="flex items-center gap-2 text-xs text-[#475569]"><Check className="w-3 h-3 text-green-500 flex-shrink-0" />{f}</li>)}
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1D4ED8] text-lg">GHS {opt.price}</span>
                        {storageChoice === opt.id && <div className="w-6 h-6 rounded-full bg-[#1D4ED8] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all mb-5 ${storageChoice === "own" ? "border-[#1D4ED8] bg-blue-50" : "border-border bg-white hover:border-[#1D4ED8]/40"}`}>
                <input type="checkbox" checked={storageChoice === "own"} onChange={e => setStorageChoice(e.target.checked ? "own" : "")} className="w-4 h-4 accent-[#1D4ED8]" />
                <div>
                  <div className="font-semibold text-[#0F172A] text-sm">I already have my own storage box</div>
                  <div className="text-xs text-[#64748B]">No storage box needed — just pack the contents for me</div>
                </div>
                <span className="ml-auto font-bold text-green-600 text-sm">Free</span>
              </label>
              <button onClick={() => storageChoice && setWizardStep(3)}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${storageChoice ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>
                Continue to Review →
              </button>
            </div>
          )}

          {/* Step 3: Order review */}
          {wizardStep === 3 && (
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">Review Your Order</h2>
              <p className="text-[#64748B] text-sm mb-6">Check everything before payment.</p>
              <div className="space-y-4 mb-6">
                {/* ChopBox */}
                <div className="bg-white rounded-2xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[#0F172A] text-sm">Selected ChopBox</span>
                    <span className="font-bold text-[#1D4ED8]">GHS {pkg.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{pkg.emoji}</div>
                    <div>
                      <div className="font-semibold text-[#0F172A]">{pkg.name}</div>
                      <div className="text-xs text-[#64748B]">{cartItems.length} items</div>
                    </div>
                  </div>
                </div>
                {/* Storage */}
                <div className="bg-white rounded-2xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[#0F172A] text-sm">Storage Box</span>
                    <span className="font-bold text-[#1D4ED8]">
                      {storageChoice === "own" ? "Free" : `GHS ${storageChoice === "metallic" ? 180 : 85}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{storageChoice === "metallic" ? "🔒" : storageChoice === "plastic" ? "📦" : "✅"}</div>
                    <div>
                      <div className="font-semibold text-[#0F172A]">
                        {storageChoice === "metallic" ? "Metallic Chop Box" : storageChoice === "plastic" ? "Plastic Storage Box" : "Using own storage box"}
                      </div>
                      <div className="text-xs text-[#64748B]">{storageChoice === "own" ? "No storage added" : "Included in delivery"}</div>
                    </div>
                  </div>
                </div>
                {/* Items list (collapsed) */}
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-[#F8FAFC]">
                    <span className="font-bold text-[#0F172A] text-sm">Items Included ({cartItems.length})</span>
                  </div>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {cartItems.slice(0, 12).map(item => (
                      <span key={item.id} className="text-[10px] flex items-center gap-1 bg-[#F1F5F9] px-2 py-1 rounded-lg text-[#475569]">
                        {item.icon} {item.name} {item.qty > 1 ? `×${item.qty}` : ""}
                      </span>
                    ))}
                    {cartItems.length > 12 && <span className="text-[10px] text-[#94A3B8] px-2 py-1">+{cartItems.length - 12} more</span>}
                  </div>
                </div>
                {/* Totals */}
                <div className="bg-[#F8FAFC] rounded-2xl border border-border p-5 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#64748B]">ChopBox</span><span className="font-medium text-[#0F172A]">GHS {chopboxTotal}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#64748B]">Storage Box</span><span className="font-medium text-[#0F172A]">{storageChoice === "own" ? "Free" : `GHS ${storagePrice}`}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#64748B]">Est. Delivery</span><span className="font-medium text-[#0F172A]">GHS {deliveryFee}</span></div>
                  <div className="flex justify-between text-sm text-[#94A3B8]"><span>Est. Weight</span><span>~12–18 kg</span></div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between"><span className="font-bold text-[#0F172A]">Grand Total</span><span className="font-bold text-xl text-[#1D4ED8]">GHS {grandTotal}</span></div>
                </div>
              </div>
              <button onClick={() => setWizardStep(4)} className="w-full py-3 bg-[#1D4ED8] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-colors">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 4: Payment */}
          {wizardStep === 4 && (
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mb-1">Choose Payment Method</h2>
              <p className="text-[#64748B] text-sm mb-6">Pay in full or spread payments over time with Pay Small Small.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {[
                  { id: "now" as const, label: "Pay Now", icon: "⚡", price: `GHS ${grandTotal}`, desc: "Complete your payment immediately", features: ["Instant order confirmation", "Priority processing", "MTN MoMo, Visa, Mastercard accepted", "Delivery within 48 hours"], color: "border-[#1D4ED8]" },
                  { id: "installment" as const, label: "Pay Small Small", icon: "📅", price: `From GHS ${Math.round(grandTotal / 3)}/mo`, desc: "Pay in 3 easy monthly instalments", features: ["Automatic account created for you", "Track balance and payments", "Payment schedule & reminders", "Order dispatched after first payment"], color: "border-[#F59E0B]" },
                ].map(opt => (
                  <button key={opt.id} onClick={() => setPaymentChoice(opt.id)}
                    className={`rounded-2xl border-2 p-5 text-left transition-all ${paymentChoice === opt.id ? `${opt.color} shadow-lg bg-blue-50` : "border-border bg-white hover:border-[#1D4ED8]/40 hover:shadow-md"}`}>
                    <div className="text-3xl mb-2">{opt.icon}</div>
                    <h3 className="font-bold text-[#0F172A] text-base mb-0.5">{opt.label}</h3>
                    <p className="text-xs text-[#64748B] mb-2">{opt.desc}</p>
                    <div className="text-xl font-bold text-[#1D4ED8] mb-3">{opt.price}</div>
                    <ul className="space-y-1">
                      {opt.features.map(f => <li key={f} className="flex items-center gap-2 text-xs text-[#475569]"><Check className="w-3 h-3 text-green-500 flex-shrink-0" />{f}</li>)}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-border p-4 mb-5 flex items-center justify-between">
                <span className="font-bold text-[#0F172A]">Total</span>
                <span className="text-2xl font-bold text-[#1D4ED8]">GHS {grandTotal}</span>
              </div>
              <button disabled={!paymentChoice}
                className={`w-full py-3.5 rounded-xl font-bold transition-colors ${paymentChoice ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>
                {paymentChoice === "installment" ? "Create Account & Start Instalment →" : paymentChoice === "now" ? "Complete Payment →" : "Select a payment method"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Builder view
  if (view === "builder") {
    const selectedPkg = PACKAGES.find(p => p.id === selectedPkgId);
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        <div className="bg-white border-b border-border sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <button onClick={() => setView("cards")} className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors"><ChevronLeft className="w-4 h-4" /> Back</button>
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="font-bold text-[#0F172A] text-sm sm:text-base">Customize Your ChopBox</h1>
              <p className="text-xs text-[#64748B]">Based on {selectedPkg?.name} · Adjust freely</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Catalog */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all" />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {catalogCategories.map(cat => (
                      <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeCategory === cat ? "bg-[#1D4ED8] text-white" : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"}`}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto">
                  {filteredCatalog.map(item => {
                    const inCart = cartItems.find(c => c.id === item.id);
                    return (
                      <div key={item.id} className={`rounded-xl border-2 p-3 transition-all ${inCart ? "border-[#1D4ED8] bg-blue-50" : "border-border hover:border-[#1D4ED8]/40"}`}>
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div className="font-semibold text-[#0F172A] text-xs mb-0.5 leading-tight">{item.name}</div>
                        <div className="text-[10px] text-[#64748B] mb-2">{item.category}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1D4ED8]">GHS {item.price}</span>
                          {inCart ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded bg-[#1D4ED8] text-white flex items-center justify-center hover:bg-[#1E40AF]"><Minus className="w-2.5 h-2.5" /></button>
                              <span className="text-xs font-bold w-4 text-center">{inCart.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded bg-[#1D4ED8] text-white flex items-center justify-center hover:bg-[#1E40AF]"><Plus className="w-2.5 h-2.5" /></button>
                            </div>
                          ) : (
                            <button onClick={() => addFromCatalog(item)} className="w-6 h-6 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center hover:bg-[#1E40AF] transition-colors"><Plus className="w-3 h-3" /></button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredCatalog.length === 0 && <div className="col-span-3 py-8 text-center text-[#94A3B8] text-sm">No products found</div>}
                </div>
              </div>
            </div>

            {/* Right: Cart */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-border overflow-hidden lg:sticky lg:top-36">
                <div className="p-4 border-b border-border bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF]">
                  <h2 className="font-bold text-white text-sm">Your Chop Box</h2>
                  <p className="text-white/70 text-xs mt-0.5">{cartItems.length} items · GHS {cartTotal.toFixed(2)}</p>
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <div className="p-6 text-center text-[#94A3B8] text-sm">Add items from the catalog</div>
                  ) : cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3">
                      <div className="text-xl flex-shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#0F172A] truncate">{item.name}</div>
                        <div className="text-[10px] text-[#64748B]">GHS {item.price} each</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0]"><Minus className="w-2.5 h-2.5 text-[#475569]" /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded bg-[#1D4ED8] text-white flex items-center justify-center hover:bg-[#1E40AF]"><Plus className="w-2.5 h-2.5" /></button>
                        <button onClick={() => removeItem(item.id)} className="w-5 h-5 rounded bg-red-50 flex items-center justify-center hover:bg-red-100 ml-1"><Trash2 className="w-2.5 h-2.5 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border bg-[#F8FAFC]">
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#64748B] font-medium">Budget used</span>
                      <span className={`font-bold ${budgetPct > 90 ? "text-red-500" : "text-[#1D4ED8]"}`}>{budgetPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${budgetPct > 90 ? "bg-red-500" : "bg-[#1D4ED8]"}`} style={{ width: `${budgetPct}%` }} />
                    </div>
                    {savings > 0 && <div className="text-[10px] text-green-600 font-medium mt-1">GHS {savings.toFixed(0)} under budget</div>}
                  </div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-[#64748B]">Subtotal</span><span className="font-bold text-[#0F172A]">GHS {cartTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-xs mb-3"><span className="text-[#64748B]">Delivery</span><span className="text-green-600 font-medium">Calculated at checkout</span></div>
                  <button className="w-full py-3 bg-[#1D4ED8] text-white rounded-xl font-bold text-sm hover:bg-[#1E40AF] transition-colors mb-2">Proceed to Checkout →</button>
                  <button className="w-full py-2.5 border border-border text-[#475569] rounded-xl font-semibold text-sm hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Save Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cards + comparison view
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      <div className="bg-gradient-to-br from-[#0A1F5E] to-[#1D4ED8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm mb-4 backdrop-blur-sm border border-white/10">
            <Package className="w-4 h-4 text-[#F59E0B]" /> ChopBox
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Choose Your ChopBox</h1>
          <p className="text-white/75 max-w-xl mx-auto text-base leading-relaxed">
            Whether you need a simple starter pack or a fully stocked hostel ChopBox, we have you covered. Select and customize to fit your budget.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PACKAGES.map((pkg, i) => {
            const isExpanded = expandedPkg === pkg.id;
            return (
              <div key={pkg.id} className={`relative rounded-3xl border-2 overflow-hidden flex flex-col ${pkg.badge === "Most Popular" ? "border-[#F59E0B] shadow-2xl shadow-amber-100" : "border-border"}`}>
                {pkg.badge && <div className={`absolute top-4 right-4 px-3 py-1 ${pkg.badgeColor} text-white text-xs font-bold rounded-full z-10 shadow-sm`}>{pkg.badge}</div>}
                <div className={`p-6 bg-gradient-to-br ${pkgBgs[i]}`}>
                  <div className="text-5xl mb-3">{pkg.emoji}</div>
                  <h3 className="text-2xl font-bold text-[#0F172A]">{pkg.name}</h3>
                  <p className="text-sm text-[#64748B] mb-1">{pkg.subtitle}</p>
                  <p className="text-xs text-[#64748B] italic mb-4">{pkg.tagline}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#0F172A]">GHS {pkg.price}</span>
                    <span className="text-sm text-[#94A3B8] line-through">GHS {pkg.originalPrice}</span>
                  </div>
                  <div className="text-sm text-green-600 font-semibold mt-1">You save GHS {pkg.originalPrice - pkg.price}</div>
                  <div className="mt-2 text-xs text-[#64748B]">{pkg.items.length} items included</div>
                </div>

                <div className="bg-white flex-1 flex flex-col">
                  <button onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                    className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold text-[#475569] border-b border-border hover:bg-[#F8FAFC] transition-colors">
                    <span>{isExpanded ? "Hide" : "View"} all {pkg.items.length} items</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[500px] overflow-y-auto" : "max-h-52"}`}>
                    <ul className="divide-y divide-border">
                      {pkg.items.map(item => (
                        <li key={item.name} className="flex items-center justify-between px-5 py-2.5">
                          <span className="flex items-center gap-2 text-sm text-[#475569]">
                            <span className="text-base">{item.icon}</span>{item.name}
                          </span>
                          {item.qty > 1 && <span className="text-xs text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded flex-shrink-0">×{item.qty}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!isExpanded && pkg.items.length > 6 && (
                    <div className="text-center py-2 text-xs text-[#94A3B8] border-t border-border">+{pkg.items.length - 6} more items</div>
                  )}

                  <div className="p-5 border-t border-border mt-auto flex gap-2">
                    <button onClick={() => openWizard(pkg.id)} className="flex-1 py-3 bg-[#1D4ED8] text-white rounded-xl text-sm font-bold hover:bg-[#1E40AF] transition-colors">Select ChopBox</button>
                    <button onClick={() => selectPackage(pkg.id)} className="px-4 py-3 border border-border rounded-xl text-sm text-[#475569] font-semibold hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors whitespace-nowrap">Customize</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm mb-12">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-[#0F172A]">ChopBox Comparison</h2>
            <p className="text-[#64748B] text-sm mt-1">See what's included in each ChopBox at a glance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] w-48">Feature</th>
                  {PACKAGES.map((pkg, i) => (
                    <th key={pkg.id} className="px-6 py-4 text-center">
                      <div className="text-lg mb-1">{pkg.emoji}</div>
                      <div className={`text-sm font-bold ${i === 1 ? "text-[#D97706]" : i === 2 ? "text-purple-600" : "text-[#0F172A]"}`}>{pkg.name}</div>
                      <div className="text-xs text-[#64748B] font-normal">GHS {pkg.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARISON_ROWS.map(row => (
                  <tr key={row.label} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#475569] font-medium">{row.label}</td>
                    {(["standard", "deluxe", "premium"] as const).map(col => {
                      const val = row[col];
                      return (
                        <td key={col} className="px-6 py-4 text-center">
                          {typeof val === "boolean" ? (
                            val
                              ? <div className="inline-flex w-6 h-6 rounded-full bg-green-100 items-center justify-center mx-auto"><Check className="w-3.5 h-3.5 text-green-600" /></div>
                              : <div className="inline-flex w-6 h-6 rounded-full bg-[#F1F5F9] items-center justify-center mx-auto"><Minus className="w-3 h-3 text-[#94A3B8]" /></div>
                          ) : <span className="text-sm font-semibold text-[#0F172A]">{val}</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-[#F8FAFC] border-t-2 border-[#E2E8F0]">
                  <td className="px-6 py-5" />
                  {PACKAGES.map(pkg => (
                    <td key={pkg.id} className="px-6 py-5 text-center">
                      <button onClick={() => openWizard(pkg.id)} className="px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-bold hover:bg-[#1E40AF] transition-colors">Select</button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Build custom CTA */}
        <div className="bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] rounded-3xl p-8 sm:p-10 text-white text-center">
          <div className="text-4xl mb-4">🛠️</div>
          <h2 className="text-2xl font-bold mb-2">Build Your Own ChopBox</h2>
          <p className="text-white/75 max-w-md mx-auto mb-6 text-sm leading-relaxed">
            Remove items you don't need, add extras, and create a ChopBox that perfectly fits your budget and preferences.
          </p>
          <button onClick={() => selectPackage("deluxe")} className="px-8 py-3.5 bg-[#F59E0B] text-[#1C1917] rounded-xl font-bold hover:bg-[#D97706] transition-colors">
            Start Building →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Vouchers Page ─────────────────────────────────────────────────────────────

function VouchersPage() {
  const [selected, setSelected] = useState<typeof VOUCHERS[0] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", school: "", year: "" });
  const [submitted, setSubmitted] = useState(false);

  if (submitted && selected) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-border p-10 text-center max-w-sm w-full mx-4 shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-600" /></div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Payment Successful!</h2>
          <p className="text-[#64748B] text-sm mb-1">Your {selected.name} voucher has been sent to</p>
          <p className="font-semibold text-[#1D4ED8] text-sm mb-6">{form.email || "your email"}</p>
          <button onClick={() => { setSelected(null); setSubmitted(false); setForm({ name: "", email: "", phone: "", school: "", year: "" }); }} className="w-full py-3 bg-[#1D4ED8] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition-colors">Buy Another Voucher</button>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] mb-6 text-sm font-medium transition-colors"><ChevronLeft className="w-4 h-4" /> Back to Vouchers</button>
          <div className={`bg-gradient-to-br ${voucherGradients[selected.color]} rounded-2xl p-6 text-white mb-6 shadow-lg`}>
            <div className="text-4xl mb-3">{selected.icon}</div>
            <h2 className="text-xl font-bold mb-1">{selected.fullName}</h2>
            <p className="text-white/75 text-sm mb-4">{selected.description}</p>
            <div className="text-3xl font-bold">{selected.currency} {selected.price}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-bold text-[#0F172A] mb-4">Student Information</h3>
            <div className="space-y-4">
              {[{ key: "name", label: "Full Name", placeholder: "Enter your full name" }, { key: "email", label: "Email Address", placeholder: "your@email.com" }, { key: "phone", label: "Phone Number", placeholder: "+233 XX XXX XXXX" }, { key: "school", label: "School / Institution", placeholder: "Your school name" }, { key: "year", label: "Exam Year", placeholder: "2025" }].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} value={form[field.key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all" />
                </div>
              ))}
            </div>
            <button onClick={() => setSubmitted(true)} className="w-full mt-6 py-3 bg-[#1D4ED8] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Pay {selected.currency} {selected.price} — Get Voucher
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Examination Vouchers</h1>
          <p className="text-[#64748B] mt-1">Buy your exam voucher instantly. Delivered to your email.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VOUCHERS.map(v => (
            <button key={v.id} onClick={() => setSelected(v)} className="bg-white rounded-2xl border-2 border-border hover:border-[#1D4ED8] hover:shadow-xl transition-all p-6 text-left group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${voucherGradients[v.color]} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>{v.icon}</div>
              <h3 className="font-bold text-[#0F172A] text-lg mb-1">{v.name}</h3>
              <p className="text-xs text-[#64748B] mb-4 leading-relaxed">{v.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1D4ED8] text-lg">{v.currency} {v.price}</span>
                <span className="text-xs flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3" /> Instant</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Schools Page ──────────────────────────────────────────────────────────────

function SchoolsPage() {
  const [view, setView] = useState<"directory" | "detail" | "select">("directory");
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ boarding: "", name: "", phone: "", email: "", payment: "" });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ region: "", gender: "", boarding: "", category: "", programme: "" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const regions = ["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Northern", "Volta", "Brong-Ahafo", "Upper East", "Upper West"];
  const programmes = ["General Science", "General Arts", "Business", "Visual Arts", "Home Economics", "Technical", "Agriculture"];

  const filtered = useMemo(() => SCHOOLS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.district.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.region && s.region !== filters.region) return false;
    if (filters.gender && s.gender !== filters.gender) return false;
    if (filters.boarding && s.boarding !== filters.boarding) return false;
    if (filters.category && s.category !== filters.category) return false;
    if (filters.programme && !s.programmes.includes(filters.programme)) return false;
    return true;
  }), [search, filters]);

  const toggleFav = (id: string) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const badgeColors: Record<string, string> = {
    "Top Performing": "bg-yellow-50 text-yellow-700 border border-yellow-200",
    "STEM School": "bg-blue-50 text-blue-700 border border-blue-200",
    "Sports Excellence": "bg-green-50 text-green-700 border border-green-200",
    "Technical School": "bg-orange-50 text-orange-700 border border-orange-200",
  };

  // Selection flow
  if (view === "select" && selectedSchool) {
    const steps = ["Confirm School", "Student Type", "Your Details", "Payment"];
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
          <button onClick={() => { setView("detail"); setStep(1); }} className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] mb-6 text-sm font-medium"><ChevronLeft className="w-4 h-4" /> Back</button>
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i + 1 < step ? "bg-green-500 text-white" : i + 1 === step ? "bg-[#1D4ED8] text-white" : "bg-[#E2E8F0] text-[#94A3B8]"}`}>
                  {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-6 sm:w-10 ${i + 1 < step ? "bg-green-500" : "bg-[#E2E8F0]"}`} />}
              </div>
            ))}
          </div>
          <p className="text-xs text-[#64748B] text-center mb-6">Step {step} of {steps.length}: <span className="font-semibold text-[#0F172A]">{steps[step - 1]}</span></p>

          <div className="bg-white rounded-2xl border border-border p-6">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Confirm School Selection</h2>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-blue-200 flex-shrink-0">
                    <img src={unsplash(selectedSchool.image, 56, 56)} alt={selectedSchool.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A]">{selectedSchool.name}</div>
                    <div className="text-sm text-[#64748B]">{selectedSchool.region} · Category {selectedSchool.category}</div>
                    <div className="flex gap-1 mt-1">
                      <span className="px-2 py-0.5 bg-white text-[#475569] text-[10px] rounded-full border border-border">{selectedSchool.gender}</span>
                      <span className="px-2 py-0.5 bg-white text-[#475569] text-[10px] rounded-full border border-border">{selectedSchool.boarding}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-3 bg-[#1D4ED8] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-colors">Confirm & Continue →</button>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-2">Student Type</h2>
                <p className="text-sm text-[#64748B] mb-5">Select the student type for accurate prospectus items.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["Boarding", "Day"].map(opt => (
                    <button key={opt} onClick={() => setFormData(f => ({ ...f, boarding: opt }))}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${formData.boarding === opt ? "border-[#1D4ED8] bg-blue-50" : "border-border hover:border-[#1D4ED8]/40"}`}>
                      <div className="text-2xl mb-1">{opt === "Boarding" ? "🏠" : "🏃"}</div>
                      <div className="font-semibold text-[#0F172A] text-sm">{opt} Student</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-border text-[#475569] rounded-xl font-semibold hover:border-[#1D4ED8] transition-colors">Back</button>
                  <button onClick={() => formData.boarding && setStep(3)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${formData.boarding ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>Continue →</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Your Details</h2>
                <div className="space-y-4 mb-6">
                  {[{ key: "name", label: "Full Name", placeholder: "Enter your full name" }, { key: "phone", label: "Phone Number", placeholder: "+233 XX XXX XXXX" }, { key: "email", label: "Email Address", placeholder: "your@email.com" }].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">{field.label}</label>
                      <input type="text" placeholder={field.placeholder} value={formData[field.key as keyof typeof formData]} onChange={e => setFormData(f => ({ ...f, [field.key]: e.target.value }))} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border border-border text-[#475569] rounded-xl font-semibold hover:border-[#1D4ED8] transition-colors">Back</button>
                  <button onClick={() => setStep(4)} className="flex-1 py-3 bg-[#1D4ED8] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-colors">Continue →</button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-2">Choose Payment</h2>
                <p className="text-sm text-[#64748B] mb-5">Select how you'd like to pay for your prospectus.</p>
                <div className="space-y-3 mb-6">
                  {[{ id: "now", label: "Pay Now", desc: "Complete payment immediately with MoMo, Visa, or Mastercard", icon: "⚡" }, { id: "installment", label: "Pay Small Small", desc: "Flexible installment plan — pay in 3–5 monthly instalments", icon: "📅" }].map(opt => (
                    <button key={opt.id} onClick={() => setFormData(f => ({ ...f, payment: opt.id }))}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.payment === opt.id ? "border-[#1D4ED8] bg-blue-50" : "border-border hover:border-[#1D4ED8]/40"}`}>
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{opt.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-[#0F172A] text-sm">{opt.label}</div>
                          <div className="text-xs text-[#64748B] mt-0.5">{opt.desc}</div>
                        </div>
                        {formData.payment === opt.id && <Check className="w-4 h-4 text-[#1D4ED8] flex-shrink-0 mt-0.5" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(3)} className="flex-1 py-3 border border-border text-[#475569] rounded-xl font-semibold hover:border-[#1D4ED8] transition-colors">Back</button>
                  <button className={`flex-1 py-3 rounded-xl font-bold transition-colors ${formData.payment ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>Proceed to Checkout →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // School detail
  if (view === "detail" && selectedSchool) {
    const tabs = ["about", "programmes", "facilities", "location"];
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        <div className="relative h-56 sm:h-72 bg-blue-200 overflow-hidden">
          <img src={unsplash(selectedSchool.image, 1200, 400)} alt={selectedSchool.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/30 to-transparent" />
          <button onClick={() => setView("directory")} className="absolute top-4 left-4 flex items-center gap-2 text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl hover:bg-black/50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Directory
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedSchool.badges.map(b => <span key={b} className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${badgeColors[b] ?? "bg-gray-100 text-gray-700"}`}>{b}</span>)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{selectedSchool.name}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1"><MapPin className="w-4 h-4" />{selectedSchool.district}, {selectedSchool.region}</div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2 py-4 border-b border-border">
            {[
              { label: `Category ${selectedSchool.category}`, color: "bg-blue-50 text-blue-700" },
              { label: selectedSchool.type, color: "bg-gray-100 text-gray-700" },
              { label: selectedSchool.gender, color: "bg-purple-50 text-purple-700" },
              { label: selectedSchool.boarding, color: selectedSchool.boarding === "Boarding" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700" },
              { label: `Est. ${selectedSchool.established}`, color: "bg-gray-100 text-gray-600" },
              { label: `${selectedSchool.population.toLocaleString()} students`, color: "bg-gray-100 text-gray-600" },
            ].map(p => <span key={p.label} className={`px-3 py-1 rounded-full text-xs font-semibold ${p.color}`}>{p.label}</span>)}
          </div>

          <div className="flex gap-0 border-b border-border mt-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-[#1D4ED8] text-[#1D4ED8]" : "border-transparent text-[#64748B] hover:text-[#0F172A]"}`}>{tab}</button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === "about" && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-3">About {selectedSchool.name}</h2>
                <p className="text-[#475569] leading-relaxed mb-4">{selectedSchool.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-border"><div className="text-xs text-[#64748B] mb-1">School Motto</div><div className="font-semibold text-[#0F172A] text-sm italic">"{selectedSchool.motto}"</div></div>
                  <div className="bg-white p-4 rounded-2xl border border-border"><div className="text-xs text-[#64748B] mb-1">Year Established</div><div className="font-bold text-[#0F172A]">{selectedSchool.established}</div></div>
                </div>
              </div>
            )}
            {activeTab === "programmes" && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Programmes Offered</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedSchool.programmes.map(prog => (
                    <div key={prog} className="bg-white rounded-xl p-4 border border-border text-center hover:border-[#1D4ED8] transition-colors">
                      <div className="text-2xl mb-2">📚</div>
                      <div className="text-sm font-semibold text-[#0F172A]">{prog}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "facilities" && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">School Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedSchool.facilities.map(f => {
                    const icons: Record<string, string> = { "Science Lab": "🔬", "ICT Lab": "💻", "Library": "📚", "Dormitories": "🏠", "Sports Complex": "⚽", "Sports Field": "⚽", "Dining Hall": "🍽️", "Chapel": "⛪", "Clinic": "🏥", "Technical Workshop": "⚙️", "Farm": "🌾", "Assembly Hall": "🎭" };
                    return (
                      <div key={f} className="bg-white rounded-xl p-4 border border-border flex items-center gap-2 hover:border-[#1D4ED8] transition-colors">
                        <span className="text-xl">{icons[f] ?? "✓"}</span>
                        <span className="text-sm font-medium text-[#0F172A]">{f}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {activeTab === "location" && (
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Location & Contact</h2>
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-10 h-10 mx-auto mb-2 text-[#1D4ED8]" />
                      <div className="font-semibold text-[#0F172A]">{selectedSchool.district}</div>
                      <div className="text-sm text-[#64748B]">{selectedSchool.region}, Ghana</div>
                      <div className="mt-3 px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-sm font-medium inline-block cursor-pointer hover:bg-[#1E40AF] transition-colors">Get Directions</div>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-[#475569]"><MapPin className="w-4 h-4 text-[#1D4ED8] flex-shrink-0" />{selectedSchool.district}, {selectedSchool.region}</div>
                    <div className="flex items-center gap-2 text-sm text-[#475569]"><Phone className="w-4 h-4 text-[#1D4ED8] flex-shrink-0" />+233 XX XXX XXXX</div>
                    <div className="flex items-center gap-2 text-sm text-[#475569]"><Globe className="w-4 h-4 text-[#1D4ED8] flex-shrink-0" />www.{selectedSchool.id}.edu.gh</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-border py-4 flex gap-3">
            <button onClick={() => toggleFav(selectedSchool.id)} className={`px-4 py-3 rounded-xl border-2 transition-all font-semibold text-sm ${favorites.includes(selectedSchool.id) ? "border-red-300 bg-red-50 text-red-600" : "border-border text-[#475569] hover:border-[#1D4ED8]"}`}>
              {favorites.includes(selectedSchool.id) ? "❤️ Saved" : "🤍 Save"}
            </button>
            <button onClick={() => { setView("select"); setStep(1); }} className="flex-1 py-3 bg-[#1D4ED8] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-colors">
              Select This School & Buy Prospectus →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Directory
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      <div className="bg-gradient-to-br from-[#0A1F5E] to-[#1D4ED8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm mb-4 backdrop-blur-sm border border-white/10"><Building2 className="w-4 h-4 text-[#F59E0B]" /> School Directory</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Explore Senior High Schools Across Ghana</h1>
            <p className="text-white/75 max-w-lg mx-auto">Find the right Senior High School based on region, gender, boarding status, programmes, and more.</p>
          </div>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input type="text" placeholder="Search by school name or district..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl text-[#0F172A] text-base focus:outline-none focus:ring-2 focus:ring-[#F59E0B] placeholder-[#94A3B8] shadow-xl" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]"><SlidersHorizontal className="w-4 h-4 text-[#1D4ED8]" /> Filters</div>
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="text-xs text-[#1D4ED8] font-semibold sm:hidden">{filtersOpen ? "Hide" : "Show"}</button>
          </div>
          <div className={`grid grid-cols-2 sm:grid-cols-5 gap-3 ${filtersOpen ? "" : "hidden sm:grid"}`}>
            {[
              { key: "region", label: "Region", options: regions },
              { key: "gender", label: "Gender", options: ["Boys", "Girls", "Mixed"] },
              { key: "boarding", label: "Boarding", options: ["Boarding", "Day", "Both"] },
              { key: "category", label: "Category", options: ["A", "B", "C"] },
              { key: "programme", label: "Programme", options: programmes },
            ].map(f => (
              <select key={f.key} value={filters[f.key as keyof typeof filters]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="px-3 py-2 border border-border rounded-xl text-sm text-[#475569] focus:outline-none focus:border-[#1D4ED8] bg-white">
                <option value="">All {f.label}s</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
          </div>
          {Object.values(filters).some(Boolean) && (
            <button onClick={() => setFilters({ region: "", gender: "", boarding: "", category: "", programme: "" })} className="mt-3 text-xs text-red-500 font-semibold hover:underline">Clear all filters</button>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[#64748B]"><span className="font-bold text-[#0F172A]">{filtered.length}</span> schools found</p>
          {favorites.length > 0 && <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-semibold">❤️ {favorites.length} saved</span>}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-semibold text-[#0F172A]">No schools found</div>
            <div className="text-[#64748B] text-sm mt-1">Try adjusting your filters or search term</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(school => (
              <div key={school.id} className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow group">
                <div className="relative h-44 bg-blue-100 overflow-hidden">
                  <img src={unsplash(school.image, 400, 200)} alt={school.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/50 to-transparent" />
                  <button onClick={() => toggleFav(school.id)} className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(school.id) ? "fill-red-500 text-red-500" : "text-[#94A3B8]"}`} />
                  </button>
                  {school.featured && <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full">⭐ Featured</div>}
                  <div className="absolute bottom-2 left-3 flex gap-1 flex-wrap">
                    {school.badges.slice(0, 2).map(b => <span key={b} className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${badgeColors[b] ?? "bg-gray-100 text-gray-700"}`}>{b}</span>)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0F172A] mb-1.5">{school.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">{school.region}</span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-full">{school.gender}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${school.boarding === "Boarding" ? "bg-green-50 text-green-700" : school.boarding === "Day" ? "bg-orange-50 text-orange-700" : "bg-teal-50 text-teal-700"}`}>{school.boarding}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-full">Cat. {school.category}</span>
                  </div>
                  <div className="text-[10px] text-[#64748B] mb-3 flex flex-wrap gap-x-1">
                    {school.programmes.slice(0, 3).join(" · ")}
                    {school.programmes.length > 3 && ` +${school.programmes.length - 3}`}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedSchool(school); setView("detail"); setActiveTab("about"); }} className="flex-1 py-2 border border-[#1D4ED8] text-[#1D4ED8] rounded-xl text-xs font-bold hover:bg-[#1D4ED8] hover:text-white transition-colors">View Details</button>
                    <button onClick={() => { setSelectedSchool(school); setView("select"); setStep(1); }} className="flex-1 py-2 bg-[#1D4ED8] text-white rounded-xl text-xs font-bold hover:bg-[#1E40AF] transition-colors">Select School</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

function DashboardPage() {
  const stats = [
    { label: "Active Orders", value: "2", icon: Package, bg: "bg-blue-50", fg: "text-blue-600" },
    { label: "Remaining Balance", value: "GHS 340", icon: Wallet, bg: "bg-amber-50", fg: "text-amber-600" },
    { label: "Next Payment", value: "Jul 1", icon: Calendar, bg: "bg-green-50", fg: "text-green-600" },
    { label: "Downloads", value: "3", icon: Download, bg: "bg-purple-50", fg: "text-purple-600" },
  ];
  const orders = [
    { id: "AES-2025-001", item: "Boarding Prospectus Bundle", status: "Delivered", date: "Jun 10, 2025", amount: "GHS 850" },
    { id: "AES-2025-002", item: "Deluxe Chop Box Package", status: "In Transit", date: "Jun 25, 2025", amount: "GHS 650" },
    { id: "AES-2025-003", item: "WASSCE Voucher × 1", status: "Completed", date: "Jun 5, 2025", amount: "GHS 50" },
  ];
  const statusStyles: Record<string, string> = { Delivered: "bg-green-50 text-green-700", "In Transit": "bg-blue-50 text-blue-700", Completed: "bg-purple-50 text-purple-700" };
  const installments = [
    { date: "May 1", amount: "GHS 170", paid: true }, { date: "Jun 1", amount: "GHS 170", paid: true },
    { date: "Jun 30", amount: "GHS 170", paid: true }, { date: "Jul 1", amount: "GHS 170", paid: false }, { date: "Aug 1", amount: "GHS 170", paid: false },
  ];
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] rounded-3xl p-6 sm:p-8 text-white mb-6 shadow-xl">
          <div className="flex items-start justify-between">
            <div><p className="text-white/65 text-sm mb-1">Welcome back,</p><h1 className="text-2xl sm:text-3xl font-bold mb-1">Adwoa Mensah 👋</h1><p className="text-white/65 text-sm">Your SHS preparation is 65% complete</p></div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold flex-shrink-0">AM</div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-xs text-white/65 mb-1.5"><span>Preparation Progress</span><span>65%</span></div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-[#F59E0B] rounded-full w-[65%]" /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-border shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.fg} flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
              <div className="text-xl font-bold text-[#0F172A]">{s.value}</div>
              <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        {/* ChopBox + Prospectus summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Selected ChopBox", value: "Deluxe ChopBox", sub: "19 items · GHS 650", icon: "🍱", color: "bg-amber-50 border-amber-200" },
            { label: "Storage Box", value: "Metallic Chop Box", sub: "Lockable · GHS 180", icon: "🔒", color: "bg-blue-50 border-blue-200" },
            { label: "Delivery Status", value: "In Transit", sub: "Est. arrival: Jul 3, 2025", icon: "🚚", color: "bg-green-50 border-green-200" },
          ].map(w => (
            <div key={w.label} className={`rounded-2xl border-2 ${w.color} p-4`}>
              <div className="text-2xl mb-2">{w.icon}</div>
              <div className="text-xs text-[#64748B] mb-0.5">{w.label}</div>
              <div className="font-bold text-[#0F172A] text-sm">{w.value}</div>
              <div className="text-xs text-[#64748B]">{w.sub}</div>
            </div>
          ))}
        </div>

        {/* Shopping checklist */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#0F172A] text-sm">Shopping Checklist</h2>
            <span className="text-xs text-[#64748B]">3 of 8 complete</span>
          </div>
          <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-[#1D4ED8] rounded-full w-[37.5%]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Prospectus Purchased", done: true },
              { label: "ChopBox Selected", done: true },
              { label: "Storage Box Chosen", done: true },
              { label: "School Supplies", done: false },
              { label: "Exam Voucher", done: false },
              { label: "TVET Tools", done: false },
              { label: "Payment Complete", done: false },
              { label: "Delivery Scheduled", done: false },
            ].map(item => (
              <div key={item.label} className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${item.done ? "bg-green-50 text-green-700" : "bg-[#F8FAFC] text-[#64748B]"}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-green-500" : "bg-[#E2E8F0]"}`}>
                  {item.done && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-border"><h2 className="font-bold text-[#0F172A]">My Orders</h2><button className="text-xs text-[#1D4ED8] font-semibold">View all</button></div>
            <div className="divide-y divide-border">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0"><div className="font-semibold text-[#0F172A] text-sm truncate">{order.item}</div><div className="text-xs text-[#64748B] mt-0.5">{order.id} · {order.date}</div></div>
                  <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyles[order.status]}`}>{order.status}</span>
                    <span className="font-bold text-sm text-[#0F172A]">{order.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <h2 className="font-bold text-[#0F172A] mb-4">Payment Plan</h2>
            <div className="p-4 bg-blue-50 rounded-xl mb-4 border border-blue-100">
              <div className="text-xs text-[#64748B] mb-0.5">Prospectus Bundle</div>
              <div className="text-lg font-bold text-[#0F172A]">GHS 850.00</div>
              <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-[#1D4ED8] rounded-full w-3/5" /></div>
              <div className="flex justify-between text-xs mt-1.5"><span className="text-green-600 font-semibold">Paid: GHS 510</span><span className="text-[#64748B]">Left: GHS 340</span></div>
            </div>
            <div className="space-y-2.5 mb-4">
              {installments.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${p.paid ? "bg-green-500" : "bg-[#E2E8F0]"}`}>{p.paid && <Check className="w-3 h-3 text-white" />}</div>
                    <span className={p.paid ? "text-[#94A3B8] line-through" : "text-[#0F172A] font-medium"}>{p.date}</span>
                  </div>
                  <span className={`font-semibold ${p.paid ? "text-green-600" : "text-[#0F172A]"}`}>{p.amount}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-[#F59E0B] text-white rounded-xl text-sm font-bold hover:bg-[#D97706] transition-colors">Pay Next Installment</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── News Page ─────────────────────────────────────────────────────────────────

function NewsPage() {
  const categories = ["All", "Admissions", "Scholarships", "Education", "Study Tips", "Career", "Government"];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? NEWS_ARTICLES : NEWS_ARTICLES.filter(n => n.category === active);
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">News & Updates</h1>
          <p className="text-[#64748B] mt-1">Stay informed on education, admissions, and scholarships</p>
          <div className="flex gap-2 flex-wrap mt-5">
            {categories.map(cat => (<button key={cat} onClick={() => setActive(cat)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${active === cat ? "bg-[#1D4ED8] text-white" : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"}`}>{cat}</button>))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(article => (
            <div key={article.id} className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow group">
              <div className="h-48 bg-blue-100 overflow-hidden"><img src={unsplash(article.image, 400, 250)} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#1D4ED8] text-[10px] font-bold rounded-full">{article.category}</span>
                  <span className="text-[#94A3B8] text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                </div>
                <h3 className="font-bold text-[#0F172A] leading-snug mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-[#64748B] line-clamp-2 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#94A3B8]">{article.date}</span>
                  <button className="text-sm text-[#1D4ED8] font-semibold hover:underline flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TVET Prospectus Page ─────────────────────────────────────────────────────

function TVETPage() {
  const [view, setView] = useState<"landing" | "flow">("landing");
  const [step, setStep] = useState(1);
  const [studentType, setStudentType] = useState("");
  const [formData, setFormData] = useState({ region: "", school: "", gender: "", studentName: "", parentName: "", phone: "", email: "" });
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedSubId, setSelectedSubId] = useState("");
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [buyLaterSet, setBuyLaterSet] = useState<Set<string>>(new Set());

  const dept = TVET_DEPARTMENTS.find(d => d.id === selectedDeptId) ?? null;
  const subOption = dept?.subOptions.find(s => s.id === selectedSubId) ?? null;
  const totalItems = dept ? dept.categories.reduce((s, c) => s + c.items.length, 0) : 0;
  const addedCount = addedItems.size;
  const totalPrice = (dept?.price ?? 0) + (subOption?.price ?? 0);

  const toggleItem = (key: string) =>
    setAddedItems(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const toggleBuyLater = (key: string) =>
    setBuyLaterSet(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const goFlow = (d?: string, s = 1) => {
    if (d) setSelectedDeptId(d);
    setSelectedSubId("");
    setView("flow");
    setStep(s);
  };

  const steps = ["Student Type", "School Info", "Department", "Items"];

  // ── Landing ─────────────────────────────────────────────────────────────────
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0A1F5E] to-[#1D4ED8] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-sm mb-4 backdrop-blur-sm border border-white/10">
                <BookOpen className="w-4 h-4 text-[#F59E0B]" /> TVET Prospectus
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">TVET Prospectus & Department Tools</h1>
              <p className="text-white/75 max-w-xl mx-auto leading-relaxed">
                Get the complete school prospectus plus department-specific tools and materials for Technical, Science, Home Economics, Visual Arts, and other practical programmes.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <button onClick={() => { setStudentType("boarding"); goFlow(undefined, 1); }} className="px-5 py-2.5 bg-white text-[#1D4ED8] rounded-xl font-semibold hover:bg-blue-50 transition-colors text-sm">View Boarding Prospectus</button>
                <button onClick={() => { setStudentType("day"); goFlow(undefined, 1); }} className="px-5 py-2.5 bg-white/15 text-white border border-white/25 rounded-xl font-semibold hover:bg-white/25 transition-colors text-sm">View Day Prospectus</button>
                <button onClick={() => goFlow(undefined, 3)} className="px-5 py-2.5 bg-[#F59E0B] text-[#1C1917] rounded-xl font-semibold hover:bg-[#D97706] transition-colors text-sm">Select Department</button>
              </div>
            </div>
            {/* Department quick grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {TVET_DEPARTMENTS.map(d => (
                <button key={d.id} onClick={() => goFlow(d.id, 4)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-left hover:bg-white/20 transition-colors">
                  <div className="text-3xl mb-2">{d.icon}</div>
                  <div className="font-bold text-white text-sm mb-1">{d.name}</div>
                  <div className="text-white/60 text-xs mb-2">{d.itemCount}+ items</div>
                  <div className="text-[#F59E0B] font-bold text-sm">GHS {d.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Department browse */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6 text-center">Browse by Department</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TVET_DEPARTMENTS.map(d => (
              <div key={d.id} className={`rounded-2xl border-2 ${d.cardColor} p-5 hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl flex-shrink-0">{d.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-[#0F172A]">{d.name}</h3>
                      {d.subOptions.length > 0 && <span className="px-2 py-0.5 bg-white text-[#64748B] text-[10px] font-semibold rounded-full border border-border flex-shrink-0">+{d.subOptions.length} options</span>}
                    </div>
                    <div className={`text-xs ${d.accent} font-semibold`}>{d.itemCount}+ items · GHS {d.price}</div>
                  </div>
                </div>
                <p className="text-xs text-[#64748B] mb-3">{d.desc}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {d.categories.map(c => <span key={c.name} className="text-[10px] px-2 py-0.5 bg-white rounded-full text-[#475569] border border-border">{c.icon} {c.name}</span>)}
                </div>
                {d.subOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {d.subOptions.map(s => <span key={s.id} className="text-[10px] px-2 py-0.5 bg-white/80 rounded-full text-[#64748B] border border-border">{s.icon} {s.name}</span>)}
                  </div>
                )}
                <button onClick={() => goFlow(d.id, 4)} className="w-full py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1E40AF] transition-colors">
                  View {d.name} Prospectus →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Flow ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      {/* Sticky step header */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => step === 1 ? setView("landing") : setStep(s => Math.max(1, s - 1))}
              className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-4 w-px bg-border" />
            <span className="font-bold text-[#0F172A] text-sm">TVET Prospectus</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${i + 1 === step ? "bg-[#1D4ED8] text-white" : i + 1 < step ? "bg-green-100 text-green-700" : "bg-[#F1F5F9] text-[#94A3B8]"}`}>
                  {i + 1 < step ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                  <span>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-5 sm:w-8 flex-shrink-0 ${i + 1 < step ? "bg-green-400" : "bg-[#E2E8F0]"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Step 1: Student Type ── */}
        {step === 1 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-[#0F172A] mb-1">Select Student Type</h2>
            <p className="text-[#64748B] text-sm mb-5">Choose your student type to see the correct prospectus items.</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {(["boarding", "day"] as const).map(type => (
                <button key={type} onClick={() => setStudentType(type)}
                  className={`p-6 rounded-2xl border-2 text-center transition-all ${studentType === type ? "border-[#1D4ED8] bg-blue-50" : "border-border hover:border-[#1D4ED8]/40 bg-white"}`}>
                  <div className="text-4xl mb-2">{type === "boarding" ? "🏠" : "🏃"}</div>
                  <div className="font-bold text-[#0F172A]">{type === "boarding" ? "Boarding Student" : "Day Student"}</div>
                  <div className="text-xs text-[#64748B] mt-1">{type === "boarding" ? "Full prospectus incl. bedding, trunk & food" : "Day prospectus with bags, shoes & stationery"}</div>
                </button>
              ))}
            </div>
            {studentType && (
              <div className="bg-white rounded-2xl border border-border p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookMarked className="w-4 h-4 text-[#1D4ED8]" />
                  <span className="text-sm font-semibold text-[#0F172A]">General SHS Prospectus Included</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full">✓ Included</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(studentType === "boarding" ? PROSPECTUS_BOARDING : PROSPECTUS_DAY).map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
                      <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-[#475569] truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => studentType && setStep(2)}
              className={`w-full py-3 rounded-xl font-bold transition-colors ${studentType ? "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>
              Continue to School Info →
            </button>
          </div>
        )}

        {/* ── Step 2: School Info ── */}
        {step === 2 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-[#0F172A] mb-1">School Information</h2>
            <p className="text-[#64748B] text-sm mb-5">Enter your school and personal details.</p>
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4 mb-5">
              {[
                { key: "region", label: "Region", type: "select", options: ["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Northern", "Volta", "Brong-Ahafo"] },
                { key: "school", label: "School Name", type: "text", placeholder: "Enter your school name" },
                { key: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
                { key: "studentName", label: "Student Full Name", type: "text", placeholder: "Enter student's full name" },
                { key: "parentName", label: "Parent / Guardian Name", type: "text", placeholder: "Enter parent or guardian name" },
                { key: "phone", label: "Phone Number", type: "text", placeholder: "+233 XX XXX XXXX" },
                { key: "email", label: "Email Address", type: "text", placeholder: "your@email.com" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">{field.label}</label>
                  {field.type === "select" ? (
                    <select value={formData[field.key as keyof typeof formData]} onChange={e => setFormData(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 bg-white">
                      <option value="">Select {field.label}</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" placeholder={field.placeholder} value={formData[field.key as keyof typeof formData]} onChange={e => setFormData(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all" />
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="w-full py-3 bg-[#1D4ED8] text-white rounded-xl font-bold hover:bg-[#1E40AF] transition-colors">
              Continue to Department →
            </button>
          </div>
        )}

        {/* ── Step 3: Department Selection ── */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-1">Choose Your Department</h2>
            <p className="text-[#64748B] text-sm mb-6">Select the TVET department to see department-specific tools and materials.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TVET_DEPARTMENTS.map(d => (
                <button key={d.id} onClick={() => { setSelectedDeptId(d.id); setSelectedSubId(""); setStep(4); }}
                  className={`rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md ${d.cardColor} hover:border-[#1D4ED8]`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-4xl flex-shrink-0">{d.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-[#0F172A] text-base">{d.name}</h3>
                        <span className="text-lg font-bold text-[#1D4ED8] flex-shrink-0">GHS {d.price}</span>
                      </div>
                      <div className="text-xs text-[#64748B]">{d.itemCount}+ items included</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">{d.desc}</p>
                  {d.subOptions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {d.subOptions.map(s => <span key={s.id} className="text-[10px] px-2 py-0.5 bg-white rounded-full text-[#475569] border border-border">{s.icon} {s.name}</span>)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 4: Department Items ── */}
        {step === 4 && dept && (
          <div className="pb-32">
            {/* Dept header */}
            <div className={`rounded-2xl border-2 ${dept.cardColor} p-5 mb-6`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{dept.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A]">{dept.name} Prospectus</h2>
                    <p className="text-sm text-[#64748B]">{dept.itemCount}+ items · {studentType || "boarding"} student</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0F172A]">GHS {totalPrice}</div>
                  {subOption && <div className="text-xs text-[#64748B]">Base GHS {dept.price} + {subOption.name} GHS {subOption.price}</div>}
                </div>
              </div>
            </div>

            {/* Sub-option selector */}
            {dept.subOptions.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-5 mb-6">
                <h3 className="font-bold text-[#0F172A] text-sm mb-0.5">
                  {dept.id === "technical" ? "Select Your Technical Specialisation" : "Select Your Visual Arts Option"}
                </h3>
                <p className="text-xs text-[#64748B] mb-4">Choose an option to add department-specific tools. Optional but recommended.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {dept.subOptions.map(s => (
                    <button key={s.id} onClick={() => setSelectedSubId(selectedSubId === s.id ? "" : s.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${selectedSubId === s.id ? "border-[#1D4ED8] bg-blue-50" : "border-border hover:border-[#1D4ED8]/40"}`}>
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="text-xs font-semibold text-[#0F172A] leading-tight">{s.name}</div>
                      <div className="text-[10px] font-bold text-[#1D4ED8] mt-0.5">+GHS {s.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active sub-option add-ons */}
            {subOption && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{subOption.icon}</span>
                  <h3 className="font-bold text-[#0F172A]">{subOption.name} Add-ons</h3>
                  <span className="px-2 py-0.5 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full ml-auto">+GHS {subOption.price}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {subOption.items.map(item => (
                    <div key={item} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-200">
                      <span className="flex items-center gap-2 text-xs text-[#475569]"><Check className="w-3 h-3 text-amber-500 flex-shrink-0" />{item}</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex-shrink-0 ml-2">Required</span>
                    </div>
                  ))}
                </div>
                {subOption.buyLater.length > 0 && (
                  <>
                    <div className="text-xs font-semibold text-[#64748B] mb-2">Buy After First Month:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {subOption.buyLater.map(item => <span key={item} className="text-[10px] px-2 py-1 bg-white border border-amber-200 text-amber-700 rounded-lg">{item}</span>)}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Category item cards */}
            <div className="space-y-5 mb-6">
              {dept.categories.map(cat => (
                <div key={cat.name} className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-[#F8FAFC]">
                    <span className="text-lg">{cat.icon}</span>
                    <h3 className="font-bold text-[#0F172A] text-sm">{cat.name}</h3>
                    <span className="ml-auto text-xs text-[#64748B]">{cat.items.length} items</span>
                  </div>
                  <div className="divide-y divide-border">
                    {cat.items.map(item => {
                      const key = `${cat.name}::${item.name}`;
                      const inCart = addedItems.has(key);
                      const isBuyLater = buyLaterSet.has(key);
                      return (
                        <div key={key} className={`flex items-center gap-3 px-5 py-3 transition-colors ${isBuyLater ? "bg-amber-50/40" : ""}`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="text-sm font-medium text-[#0F172A]">{item.name}</span>
                              {"qty" in item && (item as { qty?: number }).qty && (item as { qty?: number }).qty! > 1 && (
                                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">×{(item as { qty?: number }).qty}</span>
                              )}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.required ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                                {item.required ? "Required" : "Optional"}
                              </span>
                              {isBuyLater && <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">Buy Later</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => toggleBuyLater(key)}
                              className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${isBuyLater ? "bg-amber-50 border-amber-300 text-amber-700" : "border-border text-[#94A3B8] hover:border-amber-300 hover:text-amber-600"}`}>
                              {isBuyLater ? "✓ Later" : "Later"}
                            </button>
                            <button onClick={() => toggleItem(key)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${inCart ? "bg-[#1D4ED8] text-white" : "bg-[#F1F5F9] text-[#475569] hover:bg-[#1D4ED8] hover:text-white"}`}>
                              {inCart ? "✓ Added" : "+ Add"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Buy Later section */}
            {dept.buyLater.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-[#0F172A] text-sm">Buy After First Month</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold ml-auto">Not urgent</span>
                </div>
                <p className="text-xs text-[#64748B] mb-3">Your teacher will advise when these are needed. No rush on day one.</p>
                <div className="grid grid-cols-2 gap-2">
                  {dept.buyLater.map(item => (
                    <div key={item} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-amber-200">
                      <span className="text-base">⏱</span>
                      <span className="text-xs text-[#475569]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky checkout bar (Step 4 only) */}
      {step === 4 && dept && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-5">
                <div>
                  <div className="text-xs text-[#64748B]">Package Total</div>
                  <div className="text-xl font-bold text-[#0F172A]">GHS {totalPrice}</div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B]">Items added</div>
                  <div className="text-sm font-bold text-[#1D4ED8]">{addedCount} of {totalItems}</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs text-[#64748B] mb-1">Progress</div>
                  <div className="w-28 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1D4ED8] rounded-full transition-all" style={{ width: `${totalItems > 0 ? (addedCount / totalItems) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2.5 border border-border text-[#475569] rounded-xl text-sm font-semibold hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors">Save</button>
                <button className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F59E0B] text-[#1C1917] rounded-xl text-sm font-bold hover:bg-[#D97706] transition-colors">Pay Small Small</button>
                <button className="flex-1 sm:flex-none px-5 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-bold hover:bg-[#1E40AF] transition-colors">Pay Now →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin Portal ─────────────────────────────────────────────────────────────

type AdminSection = "dashboard"|"products"|"categories"|"orders"|"customers"|"schools"|"prospectus"|"tvet"|"chopboxes"|"storage"|"vouchers"|"payments"|"installments"|"delivery"|"news"|"events"|"reports"|"users"|"settings";

const ADMIN_NAV: { id: AdminSection; label: string; icon: React.ElementType; group: string }[] = [
  { id: "dashboard",    label: "Dashboard",      icon: LayoutDashboard, group: "" },
  { id: "products",     label: "Products",       icon: Package,         group: "Catalogue" },
  { id: "categories",  label: "Categories",     icon: Tag,             group: "Catalogue" },
  { id: "orders",      label: "Orders",         icon: ShoppingCart,    group: "Sales" },
  { id: "customers",   label: "Customers",      icon: Users,           group: "Sales" },
  { id: "payments",    label: "Payments",       icon: CreditCard,      group: "Sales" },
  { id: "installments",label: "Installments",   icon: Calendar,        group: "Sales" },
  { id: "schools",     label: "Schools",        icon: Building2,       group: "Content" },
  { id: "prospectus",  label: "GES Prospectus", icon: BookOpen,        group: "Content" },
  { id: "tvet",        label: "TVET Prospectus",icon: BookMarked,      group: "Content" },
  { id: "chopboxes",   label: "ChopBoxes",      icon: PackageCheck,    group: "Content" },
  { id: "storage",     label: "Storage Boxes",  icon: Package,         group: "Content" },
  { id: "vouchers",    label: "Exam Vouchers",  icon: Ticket,          group: "Content" },
  { id: "delivery",    label: "Delivery",       icon: Truck,           group: "Operations" },
  { id: "news",        label: "News",           icon: Newspaper,       group: "Media" },
  { id: "events",      label: "Events",         icon: Calendar,        group: "Media" },
  { id: "reports",     label: "Reports",        icon: BarChart3,       group: "Analytics" },
  { id: "users",       label: "Admin Users",    icon: UserCheck,       group: "System" },
  { id: "settings",    label: "Settings",       icon: Settings,        group: "System" },
];

const ADMIN_REVENUE = [
  { month: "Jan", revenue: 4200, orders: 18 },
  { month: "Feb", revenue: 5800, orders: 24 },
  { month: "Mar", revenue: 7100, orders: 31 },
  { month: "Apr", revenue: 6300, orders: 27 },
  { month: "May", revenue: 8900, orders: 38 },
  { month: "Jun", revenue: 12950, orders: 52 },
];

const ADMIN_CAT_SALES = [
  { name: "Prospectus", value: 45 }, { name: "Shop", value: 67 },
  { name: "ChopBox", value: 35 }, { name: "Vouchers", value: 156 }, { name: "TVET", value: 23 },
];

const ADMIN_ORDERS = [
  { id: "AES-2025-127", customer: "Adwoa Mensah", product: "Boarding Prospectus + Bedding", amount: 850, status: "Delivered", date: "Jun 28" },
  { id: "AES-2025-126", customer: "Kwame Asante", product: "WASSCE Voucher ×1", amount: 50, status: "Completed", date: "Jun 27" },
  { id: "AES-2025-125", customer: "Ama Boateng", product: "Deluxe ChopBox + Plastic Box", amount: 735, status: "In Transit", date: "Jun 26" },
  { id: "AES-2025-124", customer: "Kofi Darko", product: "School Backpack + Stationery", amount: 230, status: "Processing", date: "Jun 25" },
  { id: "AES-2025-123", customer: "Abena Osei", product: "BECE Voucher ×2", amount: 60, status: "Completed", date: "Jun 24" },
  { id: "AES-2025-122", customer: "Yaw Mensah", product: "Premium ChopBox + Metallic Box", amount: 1160, status: "Delivered", date: "Jun 23" },
  { id: "AES-2025-121", customer: "Akosua Appiah", product: "Day Prospectus Items", amount: 480, status: "In Transit", date: "Jun 22" },
];

const ADMIN_CUSTOMERS = [
  { id: 1, name: "Adwoa Mensah", email: "adwoa@gmail.com", phone: "0244112233", orders: 3, balance: 340, status: "Active" },
  { id: 2, name: "Kwame Asante", email: "kwame@gmail.com", phone: "0551234567", orders: 1, balance: 0, status: "Active" },
  { id: 3, name: "Ama Boateng", email: "ama@gmail.com", phone: "0271234567", orders: 2, balance: 735, status: "Active" },
  { id: 4, name: "Kofi Darko", email: "kofi@gmail.com", phone: "0209876543", orders: 1, balance: 0, status: "Active" },
  { id: 5, name: "Abena Osei", email: "abena@gmail.com", phone: "0557654321", orders: 2, balance: 120, status: "Active" },
  { id: 6, name: "Yaw Mensah", email: "yaw@gmail.com", phone: "0244999888", orders: 4, balance: 0, status: "Active" },
];

const PIE_COLORS = ["#1D4ED8", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444"];

// Reusable admin helpers
const statusBadge = (s: string) => {
  const m: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700", Completed: "bg-purple-50 text-purple-700",
    "In Transit": "bg-blue-50 text-blue-700", Processing: "bg-amber-50 text-amber-700",
    Active: "bg-green-50 text-green-700", Inactive: "bg-red-50 text-red-700",
    Enabled: "bg-green-50 text-green-700", Disabled: "bg-red-50 text-red-700",
    Published: "bg-green-50 text-green-700", Draft: "bg-gray-100 text-gray-600",
    "In Stock": "bg-green-50 text-green-700", "Low Stock": "bg-amber-50 text-amber-700",
  };
  return `px-2 py-0.5 rounded-full text-[10px] font-bold ${m[s] ?? "bg-gray-100 text-gray-600"}`;
};

function AdminPageHeader({ title, action, actionLabel, actionIcon: ActionIcon }: { title: string; action?: () => void; actionLabel?: string; actionIcon?: React.ElementType }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold text-[#0F172A]">{title}</h1>
      {action && actionLabel && (
        <button onClick={action} className="flex items-center gap-2 px-4 py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold hover:bg-[#1E40AF] transition-colors">
          {ActionIcon && <ActionIcon className="w-4 h-4" />}{actionLabel}
        </button>
      )}
    </div>
  );
}

function AdminTable({ columns, rows }: { columns: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-[#F8FAFC]">
            {columns.map(c => <th key={c} className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">{c}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                {row.map((cell, j) => <td key={j} className="px-4 py-3 text-sm text-[#0F172A]">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminRowActions({ onEdit, onDelete, onToggle, toggleLabel }: { onEdit?: () => void; onDelete?: () => void; onToggle?: () => void; toggleLabel?: string }) {
  return (
    <div className="flex items-center gap-1">
      {onEdit && <button onClick={onEdit} className="p-1.5 text-[#64748B] hover:text-[#1D4ED8] hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>}
      {onToggle && <button onClick={onToggle} title={toggleLabel} className="p-1.5 text-[#64748B] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Eye className="w-3.5 h-3.5" /></button>}
      {onDelete && <button onClick={onDelete} className="p-1.5 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
    </div>
  );
}

// ── Admin section pages ───────────────────────────────────────────────────────

function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "GHS 45,250", change: "+18%", icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: "127", change: "+12%", icon: ShoppingCart, color: "bg-amber-50 text-amber-600" },
    { label: "Active Customers", value: "89", change: "+24%", icon: Users, color: "bg-green-50 text-green-600" },
    { label: "Prospectus Sold", value: "234", change: "+8%", icon: BookOpen, color: "bg-purple-50 text-purple-600" },
    { label: "Vouchers Sold", value: "156", change: "+31%", icon: Ticket, color: "bg-rose-50 text-rose-600" },
    { label: "ChopBoxes", value: "45", change: "+5%", icon: PackageCheck, color: "bg-teal-50 text-teal-600" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#0F172A]">Dashboard</h1>
        <div className="flex items-center gap-2 text-xs text-[#64748B] bg-white border border-border px-3 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5" /> June 2025
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <div className="text-xl font-bold text-[#0F172A]">{s.value}</div>
            <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] text-sm mb-4">Revenue & Orders (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ADMIN_REVENUE} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#1D4ED8" strokeWidth={2.5} dot={{ r: 4, fill: "#1D4ED8" }} name="Revenue (GHS)" />
              <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: "#F59E0B" }} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] text-sm mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ADMIN_CAT_SALES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {ADMIN_CAT_SALES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ADMIN_CAT_SALES.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} /><span className="text-[#64748B]">{item.name}</span></div>
                <span className="font-semibold text-[#0F172A]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-bold text-[#0F172A] text-sm">Recent Orders</h2>
            <span className="text-xs text-[#1D4ED8] font-semibold cursor-pointer hover:underline">View all</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#F8FAFC] border-b border-border">
                {["Order ID","Customer","Product","Amount","Status","Date"].map(h => <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-border">
                {ADMIN_ORDERS.map(o => (
                  <tr key={o.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-[#1D4ED8]">{o.id}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#0F172A]">{o.customer}</td>
                    <td className="px-4 py-3 text-xs text-[#64748B] max-w-[140px] truncate">{o.product}</td>
                    <td className="px-4 py-3 text-xs font-bold text-[#0F172A]">GHS {o.amount}</td>
                    <td className="px-4 py-3"><span className={statusBadge(o.status)}>{o.status}</span></td>
                    <td className="px-4 py-3 text-xs text-[#94A3B8]">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-4">
            <h2 className="font-bold text-[#0F172A] text-sm mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Add Product", icon: Plus, color: "bg-blue-50 text-blue-600" },
                { label: "Add School", icon: Building2, color: "bg-green-50 text-green-600" },
                { label: "Create Voucher", icon: Ticket, color: "bg-purple-50 text-purple-600" },
                { label: "View Reports", icon: BarChart3, color: "bg-amber-50 text-amber-600" },
              ].map(a => (
                <button key={a.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors text-sm text-[#0F172A] font-medium">
                  <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}><a.icon className="w-3.5 h-3.5" /></div>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-4">
            <h2 className="font-bold text-[#0F172A] text-sm mb-3">Recent Customers</h2>
            <div className="space-y-2.5">
              {ADMIN_CUSTOMERS.slice(0, 4).map(c => (
                <div key={c.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#0F172A] truncate">{c.name}</div>
                    <div className="text-[10px] text-[#64748B] truncate">{c.email}</div>
                  </div>
                  <span className={statusBadge(c.status)}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = SHOP_PRODUCTS.filter(p =>
    (category === "All" || p.category === category) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div>
      <AdminPageHeader title="Products" action={() => {}} actionLabel="Add Product" actionIcon={Plus} />
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8]" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:border-[#1D4ED8]">
          <option>All</option>
          {SHOP_CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border bg-[#F8FAFC]">
              {["#","Product","Category","Brand","Price","Rating","Stock","Status","Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.slice(0, 20).map((p, i) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-xs text-[#94A3B8]">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] overflow-hidden flex-shrink-0">
                        <img src={resolveImg(p.image, 36, 36)} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A] line-clamp-1 max-w-[160px]">{p.name}</div>
                        {p.badge && <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{p.category}</td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{p.brand}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#1D4ED8]">GHS {p.price}</td>
                  <td className="px-4 py-3 text-xs text-[#F59E0B]">★ {p.rating}</td>
                  <td className="px-4 py-3"><span className={statusBadge(p.inStock ? "In Stock" : "Low Stock")}>{p.inStock ? "In Stock" : "Low Stock"}</span></td>
                  <td className="px-4 py-3"><span className={statusBadge("Published")}>Published</span></td>
                  <td className="px-4 py-3"><AdminRowActions onEdit={() => {}} onToggle={() => {}} onDelete={() => {}} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = ["All", "Processing", "In Transit", "Delivered", "Completed"];
  const filtered = statusFilter === "All" ? ADMIN_ORDERS : ADMIN_ORDERS.filter(o => o.status === statusFilter);
  return (
    <div>
      <AdminPageHeader title="Orders" />
      <div className="flex gap-2 flex-wrap mb-4">
        {statuses.map(s => <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? "bg-[#1D4ED8] text-white" : "bg-white border border-border text-[#475569] hover:border-[#1D4ED8]"}`}>{s}</button>)}
      </div>
      <AdminTable
        columns={["Order ID","Customer","Product","Amount","Status","Date","Actions"]}
        rows={filtered.map(o => [
          <span className="font-mono text-[10px] text-[#1D4ED8]">{o.id}</span>,
          <span className="font-semibold">{o.customer}</span>,
          <span className="text-[#64748B] text-xs max-w-[160px] block truncate">{o.product}</span>,
          <span className="font-bold">GHS {o.amount}</span>,
          <span className={statusBadge(o.status)}>{o.status}</span>,
          <span className="text-[#94A3B8] text-xs">{o.date}</span>,
          <AdminRowActions onEdit={() => {}} onDelete={() => {}} />,
        ])}
      />
    </div>
  );
}

function AdminCustomers() {
  return (
    <div>
      <AdminPageHeader title="Customers" />
      <AdminTable
        columns={["Customer","Email","Phone","Orders","Balance","Status","Actions"]}
        rows={ADMIN_CUSTOMERS.map(c => [
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{c.name.split(" ").map(n => n[0]).join("")}</div>
            <span className="font-semibold text-xs">{c.name}</span>
          </div>,
          <span className="text-xs text-[#64748B]">{c.email}</span>,
          <span className="text-xs text-[#64748B]">{c.phone}</span>,
          <span className="text-xs font-semibold">{c.orders}</span>,
          c.balance > 0 ? <span className="text-xs font-bold text-amber-600">GHS {c.balance}</span> : <span className="text-xs text-green-600 font-semibold">Paid</span>,
          <span className={statusBadge(c.status)}>{c.status}</span>,
          <AdminRowActions onEdit={() => {}} onToggle={() => {}} onDelete={() => {}} />,
        ])}
      />
    </div>
  );
}

function AdminSchools() {
  return (
    <div>
      <AdminPageHeader title="Schools" action={() => {}} actionLabel="Add School" actionIcon={Plus} />
      <AdminTable
        columns={["School","Region","Category","Gender","Boarding","Status","Actions"]}
        rows={SCHOOLS.map(s => [
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] overflow-hidden flex-shrink-0">
              <img src={unsplash(s.image, 36, 36)} alt={s.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0F172A]">{s.name}</div>
              <div className="text-[10px] text-[#64748B]">{s.district}</div>
            </div>
          </div>,
          <span className="text-xs text-[#64748B]">{s.region}</span>,
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Cat. {s.category}</span>,
          <span className="text-xs text-[#64748B]">{s.gender}</span>,
          <span className="text-xs text-[#64748B]">{s.boarding}</span>,
          <span className={statusBadge(s.featured ? "Enabled" : "Disabled")}>{s.featured ? "Featured" : "Active"}</span>,
          <AdminRowActions onEdit={() => {}} onToggle={() => {}} onDelete={() => {}} />,
        ])}
      />
    </div>
  );
}

function AdminProspectus() {
  const [tab, setTab] = useState<"boarding" | "day">("boarding");
  const items = tab === "boarding" ? PROSPECTUS_CATEGORIES_BOARDING : PROSPECTUS_CATEGORIES_DAY;
  const allItems = items.flatMap(c => c.items.map(i => ({ ...i, categoryName: c.name })));
  return (
    <div>
      <AdminPageHeader title="GES Prospectus" action={() => {}} actionLabel="Add Item" actionIcon={Plus} />
      <div className="flex gap-2 mb-4">
        {(["boarding", "day"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? "bg-[#1D4ED8] text-white" : "bg-white border border-border text-[#475569] hover:border-[#1D4ED8]"}`}>
            {t === "boarding" ? "🏠 Boarding" : "🏃 Day"}
          </button>
        ))}
      </div>
      <AdminTable
        columns={["#","Item","Category","Price","Status","Actions"]}
        rows={allItems.map((item, i) => [
          <span className="text-[#94A3B8] text-xs">{i + 1}</span>,
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] overflow-hidden flex-shrink-0">
              <img src={resolveImg(item.image, 36, 36)} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-semibold text-[#0F172A]">{item.name}</span>
          </div>,
          <span className="text-xs text-[#64748B]">{item.categoryName}</span>,
          <span className="text-xs font-bold text-[#1D4ED8]">GHS {item.price}</span>,
          <span className={statusBadge("Published")}>Published</span>,
          <AdminRowActions onEdit={() => {}} onToggle={() => {}} onDelete={() => {}} />,
        ])}
      />
    </div>
  );
}

function AdminVouchers() {
  return (
    <div>
      <AdminPageHeader title="Exam Vouchers" action={() => {}} actionLabel="Add Voucher Type" actionIcon={Plus} />
      <AdminTable
        columns={["Voucher","Full Name","Price","Sold","Stock","Status","Actions"]}
        rows={VOUCHERS.map(v => [
          <div className="flex items-center gap-2">
            <span className="text-xl">{v.icon}</span>
            <span className="text-xs font-bold text-[#0F172A]">{v.name}</span>
          </div>,
          <span className="text-xs text-[#64748B] max-w-[180px] block truncate">{v.fullName}</span>,
          <span className="text-xs font-bold text-[#1D4ED8]">{v.currency} {v.price}</span>,
          <span className="text-xs font-semibold text-[#0F172A]">{Math.floor(Math.random() * 80) + 10}</span>,
          <span className="text-xs font-semibold text-green-600">Available</span>,
          <span className={statusBadge("Enabled")}>Enabled</span>,
          <AdminRowActions onEdit={() => {}} onToggle={() => {}} onDelete={() => {}} />,
        ])}
      />
    </div>
  );
}

function AdminChopBoxes() {
  return (
    <div>
      <AdminPageHeader title="ChopBox Management" action={() => {}} actionLabel="Add ChopBox" actionIcon={Plus} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PACKAGES.map((pkg, i) => {
          const bgs = ["from-blue-50 to-blue-100/50", "from-amber-50 to-amber-100/50", "from-purple-50 to-purple-100/50"];
          return (
            <div key={pkg.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className={`p-4 bg-gradient-to-br ${bgs[i]}`}>
                <div className="flex items-start justify-between">
                  <div><div className="text-3xl mb-1">{pkg.emoji}</div><div className="font-bold text-[#0F172A]">{pkg.name}</div><div className="text-xs text-[#64748B]">{pkg.items.length} items</div></div>
                  <div className="text-right"><div className="text-xl font-bold text-[#1D4ED8]">GHS {pkg.price}</div><div className="text-xs text-[#94A3B8] line-through">GHS {pkg.originalPrice}</div></div>
                </div>
              </div>
              <div className="p-4">
                <div className="max-h-40 overflow-y-auto space-y-1 mb-4">
                  {pkg.items.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                      <span className="text-[#475569] flex items-center gap-1">{item.icon} {item.name}</span>
                      {item.qty > 1 && <span className="text-[10px] text-[#94A3B8] flex-shrink-0">×{item.qty}</span>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-1"><Pencil className="w-3 h-3" /> Edit</button>
                  <button className="px-3 py-2 border border-border rounded-xl text-xs text-[#64748B] hover:border-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminReports() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#0F172A]">Reports & Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: "GHS 45,250", sub: "Jun 2025" },
          { label: "Total Orders", value: "127", sub: "Jun 2025" },
          { label: "Vouchers Sold", value: "156", sub: "All time" },
          { label: "ChopBoxes", value: "45", sub: "Jun 2025" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
            <div className="text-xl font-bold text-[#0F172A]">{s.value}</div>
            <div className="text-xs text-[#64748B]">{s.label}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] text-sm mb-4">Monthly Revenue (GHS)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ADMIN_REVENUE} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#1D4ED8" radius={[6, 6, 0, 0]} name="Revenue (GHS)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] text-sm mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ADMIN_CAT_SALES} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748B" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} name="Sales">
                {ADMIN_CAT_SALES.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  const [contactForm, setContactForm] = useState({ phone1: "0596109399", phone2: "+233 55 261 6188", email: "everythinghighschool01@gmail.com", website: "www.everythinghighschool.com" });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <div>
      <AdminPageHeader title="Settings" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contact */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] mb-4 text-sm">Contact Information</h2>
          <div className="space-y-3">
            {[
              { key: "phone1", label: "Primary Phone (WhatsApp)" },
              { key: "phone2", label: "Secondary Phone" },
              { key: "email", label: "Email Address" },
              { key: "website", label: "Website URL" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">{f.label}</label>
                <input value={contactForm[f.key as keyof typeof contactForm]} onChange={e => setContactForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8]" />
              </div>
            ))}
          </div>
          <button onClick={save} className={`mt-4 w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${saved ? "bg-green-500 text-white" : "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"}`}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] mb-4 text-sm">Payment Methods</h2>
          <div className="space-y-3">
            {["MTN MoMo", "Telecel Cash", "AirtelTigo Money", "Visa / Mastercard", "Paystack", "Bank Transfer"].map(method => (
              <div key={method} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-[#0F172A] font-medium">{method}</span>
                <ToggleRight className="w-8 h-8 text-[#1D4ED8] cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        {/* Social media */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] mb-4 text-sm">Social Media Links</h2>
          <div className="space-y-3">
            {[
              { label: "Facebook", val: "https://facebook.com/everythinghighschool" },
              { label: "Instagram", val: "https://instagram.com/everythinghighschool" },
              { label: "TikTok", val: "https://tiktok.com/@everythinghighschool" },
              { label: "YouTube", val: "https://youtube.com/@everythinghighschool" },
            ].map(s => (
              <div key={s.label}>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">{s.label}</label>
                <input defaultValue={s.val} className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8]" />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-bold text-[#0F172A] mb-4 text-sm">Delivery Fees (GHS)</h2>
          <div className="space-y-3">
            {["Greater Accra", "Ashanti", "Central", "Western", "Eastern", "Northern"].map(region => (
              <div key={region} className="flex items-center justify-between">
                <span className="text-sm text-[#0F172A]">{region}</span>
                <input defaultValue={region === "Greater Accra" ? "50" : region === "Ashanti" ? "70" : "90"}
                  className="w-20 px-2 py-1 border border-border rounded-lg text-sm text-right focus:outline-none focus:border-[#1D4ED8]" />
              </div>
            ))}
          </div>
          <button onClick={save} className="mt-4 w-full py-2.5 bg-[#1D4ED8] text-white rounded-xl text-sm font-bold hover:bg-[#1E40AF] transition-colors">Save Delivery Fees</button>
        </div>
      </div>
    </div>
  );
}

function AdminGenericPage({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div>
      <AdminPageHeader title={title} action={() => {}} actionLabel={`Add ${title.split(" ")[0]}`} actionIcon={Plus} />
      <div className="bg-white rounded-2xl border border-border p-12 text-center">
        <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-8 h-8 text-[#64748B]" /></div>
        <h2 className="font-bold text-[#0F172A] mb-2">{title}</h2>
        <p className="text-[#64748B] text-sm max-w-sm mx-auto mb-6">{description}</p>
        <button className="px-6 py-2.5 bg-[#1D4ED8] text-white rounded-xl font-semibold text-sm hover:bg-[#1E40AF] transition-colors flex items-center gap-2 mx-auto"><Plus className="w-4 h-4" /> Add {title.split(" ")[0]}</button>
      </div>
    </div>
  );
}

// ── Admin Sidebar ─────────────────────────────────────────────────────────────

function AdminSidebar({ section, setSection, onLogout, onExit, open, setOpen }: {
  section: AdminSection; setSection: (s: AdminSection) => void;
  onLogout: () => void; onExit: () => void; open: boolean; setOpen: (b: boolean) => void;
}) {
  const groups = Array.from(new Set(ADMIN_NAV.map(n => n.group)));
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className={`fixed top-0 left-0 h-full w-56 bg-[#0F172A] z-40 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="bg-white rounded-xl px-3 py-2 inline-block">
            <ImageWithFallback src={aehLogo} alt="Everything HighSchool" className="h-7 w-auto object-contain" />
          </div>
          <div className="text-[10px] text-white/40 mt-1.5 font-semibold uppercase tracking-wider">Admin Portal</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {/* Dashboard (no group) */}
          {ADMIN_NAV.filter(n => !n.group).map(item => (
            <button key={item.id} onClick={() => { setSection(item.id); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${section === item.id ? "bg-[#1D4ED8] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />{item.label}
            </button>
          ))}
          {groups.filter(Boolean).map(group => (
            <div key={group} className="mb-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">{group}</div>
              {ADMIN_NAV.filter(n => n.group === group).map(item => (
                <button key={item.id} onClick={() => { setSection(item.id); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors mb-0.5 ${section === item.id ? "bg-[#1D4ED8] text-white" : "text-white/55 hover:bg-white/10 hover:text-white"}`}>
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button onClick={onExit} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Website
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

// ── Admin Top Bar ─────────────────────────────────────────────────────────────

function AdminTopBar({ section, onToggleSidebar }: { section: AdminSection; onToggleSidebar: () => void }) {
  const item = ADMIN_NAV.find(n => n.id === section);
  return (
    <div className="h-14 bg-white border-b border-border flex items-center justify-between px-5 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors lg:hidden">
          <Menu className="w-5 h-5 text-[#475569]" />
        </button>
        <div className="flex items-center gap-1.5 text-sm text-[#64748B]">
          <span>Admin</span><ChevronRight className="w-3.5 h-3.5" /><span className="font-semibold text-[#0F172A]">{item?.label ?? "Dashboard"}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
          <Bell className="w-5 h-5 text-[#475569]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center">AD</div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-[#0F172A]">Admin</div>
            <div className="text-[10px] text-[#64748B]">Super Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin Login ───────────────────────────────────────────────────────────────

function AdminLogin({ onLogin, onExit }: { onLogin: () => void; onExit: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    if (email === "wrong@test.com") { setError("Invalid email or password. Please try again."); return; }
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1F5E] to-[#1D4ED8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-block mb-4">
            <ImageWithFallback src={aehLogo} alt="Everything HighSchool" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <h1 className="text-xl font-bold text-[#0F172A]">Admin Portal</h1>
          <p className="text-[#64748B] text-sm mt-1">Sign in to manage the AES platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@everythinghighschool.com" autoComplete="email"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all pr-11" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 accent-[#1D4ED8]" />
              Remember me
            </label>
            <button type="button" className="text-sm text-[#1D4ED8] font-semibold hover:underline">Forgot Password?</button>
          </div>

          <button type="submit" disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${loading ? "bg-[#1D4ED8]/60 text-white cursor-wait" : "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"}`}>
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</> : <><Lock className="w-4 h-4" /> Sign In to Admin Portal</>}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button onClick={onExit} className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1.5 mx-auto">
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Website
          </button>
        </div>

        <div className="mt-6 p-3 bg-[#F8FAFC] rounded-xl text-center">
          <p className="text-[10px] text-[#94A3B8]">Demo: any valid email + password logs you in</p>
        </div>
      </div>
    </div>
  );
}

// ── AdminPortal root ──────────────────────────────────────────────────────────

function AdminPortal({ onExit }: { onExit: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} onExit={onExit} />;

  const renderSection = () => {
    switch (section) {
      case "dashboard":    return <AdminDashboard />;
      case "products":     return <AdminProducts />;
      case "categories":   return <AdminGenericPage title="Categories" description="Manage product categories displayed in the shop. Add, edit, and reorder categories." icon={Tag} />;
      case "orders":       return <AdminOrders />;
      case "customers":    return <AdminCustomers />;
      case "schools":      return <AdminSchools />;
      case "prospectus":   return <AdminProspectus />;
      case "tvet":         return <AdminGenericPage title="TVET Prospectus" description="Manage TVET departments, items, and department-specific tools for each programme." icon={BookMarked} />;
      case "chopboxes":    return <AdminChopBoxes />;
      case "storage":      return <AdminGenericPage title="Storage Boxes" description="Manage Metallic Chop Box and Plastic Storage Box options, prices, and descriptions." icon={Package} />;
      case "vouchers":     return <AdminVouchers />;
      case "payments":     return <AdminGenericPage title="Payments" description="View all payment transactions, MoMo receipts, and card payments from customers." icon={CreditCard} />;
      case "installments": return <AdminGenericPage title="Installments" description="Manage Pay Small Small plans, track outstanding balances, and send payment reminders." icon={Calendar} />;
      case "delivery":     return <AdminGenericPage title="Delivery" description="Track active deliveries, update statuses, and manage delivery partners across Ghana." icon={Truck} />;
      case "news":         return <AdminGenericPage title="News & Blog" description="Create, edit, and publish news articles and blog posts for parents and students." icon={Newspaper} />;
      case "events":       return <AdminGenericPage title="Events" description="Manage admission deadlines, school reopening dates, and educational events." icon={Calendar} />;
      case "reports":      return <AdminReports />;
      case "users":        return <AdminGenericPage title="Admin Users" description="Manage admin accounts, assign roles (Super Admin, Staff, Finance), and set permissions." icon={UserCheck} />;
      case "settings":     return <AdminSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      <AdminSidebar section={section} setSection={setSection} onLogout={() => setAuthed(false)} onExit={onExit} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">
        <AdminTopBar section={section} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cartCount] = useState(0);
  useEffect(() => { if (page !== "admin") window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  if (page === "admin") return <AdminPortal onExit={() => setPage("home")} />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar page={page} setPage={setPage} cartCount={cartCount} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "prospectus" && <ProspectusPage />}
      {page === "tvet" && <TVETPage />}
      {page === "shop" && <ShopPage />}
      {page === "packages" && <PackagesPage />}
      {page === "vouchers" && <VouchersPage />}
      {page === "schools" && <SchoolsPage />}
      {page === "dashboard" && <DashboardPage />}
      {page === "news" && <NewsPage />}
    </div>

  );
}
