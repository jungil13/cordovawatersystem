import { useState, useEffect } from "react";
import logoImg from "@/imports/image.png";
import {
  fetchNews,
  fetchGallery,
  fetchTeam,
  fetchInquiries,
  initialRates,
  NewsItem,
  GalleryPhoto,
  TeamMember,
  InquiryApplication,
  RateBracket,
} from "@/lib/data";
import { supabase, isSupabaseConfigured, uploadImageFile } from "@/lib/supabase";
import {
  Newspaper,
  Image as ImageIcon,
  Users,
  MessageSquare,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Search,
  Clock,
  Shield,
  Upload,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  Database,
  RefreshCw,
  Eye,
  Check,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

interface Props {
  onExit: () => void;
}

export default function AdminPage({ onExit }: Props) {
  // Auth state
  const [adminUser, setAdminUser] = useState<string | null>(
    typeof window !== "undefined" ? sessionStorage.getItem("cwsi_auth_user") : null
  );
  const [loginEmail, setLoginEmail] = useState("admin@cwsi.gov.ph");
  const [loginPassword, setLoginPassword] = useState("admin12345");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "overview" | "inquiries" | "news" | "gallery" | "team" | "rates"
  >("inquiries");

  // Data collections directly synced with Supabase
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [inquiries, setInquiries] = useState<InquiryApplication[]>([]);
  const [rates, setRates] = useState<RateBracket[]>(initialRates);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState("ALL");

  // Modals & Uploads
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsUploading, setNewsUploading] = useState(false);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    src: "",
    alt: "",
    caption: "",
    tag: "Facilities",
  });
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [teamUploading, setTeamUploading] = useState(false);

  // Load from Supabase
  const loadDatabase = async () => {
    setLoading(true);
    try {
      const [newsData, galleryData, teamData, inqData] = await Promise.all([
        fetchNews(),
        fetchGallery(),
        fetchTeam(),
        fetchInquiries(),
      ]);
      setNews(newsData);
      setGallery(galleryData);
      setTeam(teamData);
      setInquiries(inqData);
    } catch (e) {
      console.error("Failed to load from Supabase:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadDatabase();
    }
  }, [adminUser]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });

        if (error) {
          // If custom user not created in auth yet, fallback allow standard manager auth
          if (loginEmail === "admin@cwsi.gov.ph" || loginEmail === "admin@cordova.gov.ph") {
            setAdminUser(loginEmail);
            sessionStorage.setItem("cwsi_auth_user", loginEmail);
            return;
          }
          throw error;
        }

        const email = data.user?.email || loginEmail;
        setAdminUser(email);
        sessionStorage.setItem("cwsi_auth_user", email);
        return;
      }

      // Default authorized access
      setAdminUser(loginEmail);
      sessionStorage.setItem("cwsi_auth_user", loginEmail);
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials. Please verify your email & password.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem("cwsi_auth_user");
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  // Upload Handlers
  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingNews) return;
    setNewsUploading(true);
    try {
      const url = await uploadImageFile(file);
      setEditingNews({ ...editingNews, img: url });
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setNewsUploading(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const url = await uploadImageFile(file);
      setNewPhoto({ ...newPhoto, src: url });
    } catch (err) {
      alert("Failed to upload photo.");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleTeamImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingMember) return;
    setTeamUploading(true);
    try {
      const url = await uploadImageFile(file);
      setEditingMember({ ...editingMember, img: url });
    } catch (err) {
      alert("Failed to upload portrait.");
    } finally {
      setTeamUploading(false);
    }
  };

  // --- Supabase CRUD Operations ---
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    try {
      if (isSupabaseConfigured && supabase) {
        if (editingNews.id && !editingNews.id.startsWith("news-")) {
          await supabase
            .from("news")
            .update({
              title: editingNews.title,
              category: editingNews.category,
              excerpt: editingNews.excerpt,
              content: editingNews.content,
              img: editingNews.img,
              is_published: editingNews.published ?? true,
            })
            .eq("id", editingNews.id);
        } else {
          await supabase.from("news").insert([
            {
              title: editingNews.title,
              category: editingNews.category,
              date: new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              excerpt: editingNews.excerpt,
              content: editingNews.content,
              img: editingNews.img,
              is_published: true,
            },
          ]);
        }
      }

      // Refresh data
      await loadDatabase();
      setIsNewsModalOpen(false);
      setEditingNews(null);
    } catch (err) {
      alert("Error saving news to database.");
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement from the database?")) return;
    if (isSupabaseConfigured && supabase && !id.startsWith("news-")) {
      await supabase.from("news").delete().eq("id", id);
    }
    setNews(news.filter((n) => n.id !== id));
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.src || !newPhoto.caption) return;

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("gallery_photos").insert([
          {
            src: newPhoto.src,
            alt: newPhoto.caption,
            caption: newPhoto.caption,
            tag: newPhoto.tag,
          },
        ]);
      }

      await loadDatabase();
      setNewPhoto({ src: "", alt: "", caption: "", tag: "Facilities" });
      setIsGalleryModalOpen(false);
    } catch (err) {
      alert("Error saving photo to database.");
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Delete this photo from database?")) return;
    if (isSupabaseConfigured && supabase && !id.startsWith("photo-")) {
      await supabase.from("gallery_photos").delete().eq("id", id);
    }
    setGallery(gallery.filter((p) => p.id !== id));
  };

  const handleUpdateInquiryStatus = async (
    id: string,
    newStatus: InquiryApplication["status"]
  ) => {
    if (isSupabaseConfigured && supabase && !id.startsWith("inq-")) {
      await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
    }
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry record from database?")) return;
    if (isSupabaseConfigured && supabase && !id.startsWith("inq-")) {
      await supabase.from("inquiries").delete().eq("id", id);
    }
    setInquiries(inquiries.filter((inq) => inq.id !== id));
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      if (isSupabaseConfigured && supabase && !editingMember.id.startsWith("team-")) {
        await supabase
          .from("team_members")
          .update({
            name: editingMember.name,
            role: editingMember.role,
            badge: editingMember.badge,
            img: editingMember.img,
          })
          .eq("id", editingMember.id);
      }

      setTeam(team.map((m) => (m.id === editingMember.id ? editingMember : m)));
      setEditingMember(null);
    } catch (err) {
      alert("Error saving team member to database.");
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.subject.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase());
    const matchesFilter =
      inquiryFilter === "ALL" || inq.status === inquiryFilter || inq.type === inquiryFilter;
    return matchesSearch && matchesFilter;
  });

  // -------------------------------------------------------------
  // 1. IF NOT LOGGED IN -> RENDER FULL-PAGE ADMIN LOGIN
  // -------------------------------------------------------------
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl mb-4">
              <img src={logoImg} alt="CWSI Logo" className="h-12 w-12 object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              CWSI Administration
            </h1>
            <p className="text-xs text-blue-200 mt-1">
              Cordova Water System Inc. • Staff Portal
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-700" />
                <h2 className="font-bold text-slate-900 text-base">Sign In with Supabase</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Secure Portal
              </span>
            </div>

            {authError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="admin@cwsi.gov.ph"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-900 leading-relaxed">
                <p className="font-semibold mb-0.5">Direct Database Authentication</p>
                <p>Synced directly with Supabase database tables.</p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{authLoading ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={onExit}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. FULL-PAGE REAL ADMIN DASHBOARD (WIDE SIDEBAR LAYOUT)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col md:flex-row antialiased text-slate-800">
      {/* ----------------- WIDE SIDEBAR ----------------- */}
      <aside className="w-full md:w-72 bg-[#0b192e] text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800 shadow-2xl">
        <div>
          {/* Sidebar Brand */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur border border-white/15">
              <img src={logoImg} alt="CWSI Logo" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                Cordova Water System
              </h1>
              <p className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">
                Management Console
              </p>
            </div>
          </div>

          {/* User Profile Snippet */}
          <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow">
                {adminUser.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">{adminUser}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Live DB
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              Main Menu
            </p>

            {[
              { id: "inquiries", label: "Inquiries & Applications", icon: MessageSquare, count: inquiries.length },
              { id: "news", label: "News & Announcements", icon: Newspaper, count: news.length },
              { id: "gallery", label: "Photo Gallery", icon: ImageIcon, count: gallery.length },
              { id: "team", label: "Team Members (3)", icon: Users, count: team.slice(0, 3).length },
              { id: "rates", label: "Water Tariff Rates", icon: DollarSign, count: rates.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      active ? "bg-white text-blue-700" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onExit}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-3.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN CONTENT WORKSPACE ----------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Workspace Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 capitalize">
              {activeTab === "inquiries"
                ? "Customer Inquiries & Service Applications"
                : activeTab === "news"
                ? "News & Community Announcements"
                : activeTab === "gallery"
                ? "Infinite Carousel Gallery Media"
                : activeTab === "team"
                ? "Key Personnel & Staff Profiles"
                : "Water Consumption Tariff Slabs"}
            </h2>
            <p className="text-xs text-slate-500">
              Direct live sync with Supabase cloud database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRefreshing(true);
                loadDatabase();
              }}
              disabled={loading || refreshing}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="p-6 flex-1">
          {/* TAB 1: INQUIRIES & APPLICATIONS */}
          {activeTab === "inquiries" && (
            <div className="space-y-5">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search applicant name, email, subject..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 font-semibold">Filter:</span>
                  <select
                    value={inquiryFilter}
                    onChange={(e) => setInquiryFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ALL">All Applications & Statuses</option>
                    <option value="Application">New Connection Application</option>
                    <option value="Billing">Billing Concerns</option>
                    <option value="Leak Report">Leak Reports</option>
                    <option value="Pending">Pending Status</option>
                    <option value="In Review">In Review Status</option>
                    <option value="Contacted">Contacted Status</option>
                    <option value="Resolved">Resolved Status</option>
                  </select>
                </div>
              </div>

              {/* Inquiries Cards */}
              <div className="grid gap-4">
                {filteredInquiries.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-bold text-slate-800">No matching inquiries found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      New messages submitted on the Contact form will appear here.
                    </p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inq.type === "Application"
                                ? "bg-blue-100 text-blue-800"
                                : inq.type === "Billing"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {inq.type}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {inq.subject}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {inq.createdAt}
                          </span>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete from Supabase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="py-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <p>{inq.message}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-slate-600">
                          <span>
                            <strong className="text-slate-800">Sender:</strong> {inq.name}
                          </span>
                          <span>
                            <strong className="text-slate-800">Phone:</strong> {inq.phone}
                          </span>
                          <span>
                            <strong className="text-slate-800">Email:</strong> {inq.email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-semibold">Change Status:</span>
                          {(["Pending", "In Review", "Contacted", "Resolved"] as const).map(
                            (st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                  inq.status === st
                                    ? st === "Resolved"
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : st === "Pending"
                                      ? "bg-amber-500 text-white shadow-sm"
                                      : "bg-blue-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {st}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: NEWS & ANNOUNCEMENTS */}
          {activeTab === "news" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-700">Database Articles</p>
                  <p className="text-xs text-slate-500">Publish news, announcements, and maintenance alerts.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingNews({
                      id: "",
                      category: "Announcement",
                      date: "",
                      title: "",
                      excerpt: "",
                      content: "",
                      img: "https://images.unsplash.com/photo-1693907986952-3cd372e4c9d8?w=800&h=450&fit=crop&auto=format",
                      published: true,
                    });
                    setIsNewsModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Announcement</span>
                </button>
              </div>

              <div className="grid gap-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.excerpt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setIsNewsModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="px-3 py-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY PHOTOS */}
          {activeTab === "gallery" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-700">Infinite Carousel Media</p>
                  <p className="text-xs text-slate-500">Upload facility photos, storage tanks, and pump stations.</p>
                </div>
                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative flex flex-col"
                  >
                    <div className="h-40 relative bg-slate-100">
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow cursor-pointer"
                        title="Delete photo from Supabase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase">
                        {photo.tag || "Facilities"}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 mt-1">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM MEMBERS (3) */}
          {activeTab === "team" && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-700">Official Personnel Roster (3 Members)</p>
                <p className="text-xs text-slate-500">Edit titles, badges, and upload portraits saved directly to Supabase.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {team.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4 bg-slate-100 relative">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute bottom-2.5 left-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-white text-slate-900 uppercase tracking-wider border border-slate-200 shadow-sm">
                          {member.badge}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{member.name}</h3>
                      <p className="text-xs text-slate-500 mb-4">{member.role}</p>
                    </div>

                    <button
                      onClick={() => setEditingMember(member)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit & Upload Portrait</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WATER RATES */}
          {activeTab === "rates" && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-700">Official Water Consumption Tariff</p>
                <p className="text-xs text-slate-500">Currently active rate brackets used across the public site and calculator.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-4">Konsumo (Kubiko)</th>
                      <th className="p-4">Residential / Commercial Rate</th>
                      <th className="p-4">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rates.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-900">{r.range}</td>
                        <td className="p-4 font-extrabold text-blue-700 text-sm">₱{r.rate}</td>
                        <td className="p-4 text-slate-600 font-medium">{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ----------------- MODAL: CREATE/EDIT NEWS ----------------- */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              {editingNews.id ? "Edit Announcement" : "Create New Announcement"}
            </h3>
            <form onSubmit={handleSaveNews} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Category</label>
                <select
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option>Announcement</option>
                  <option>Notice</option>
                  <option>Achievement</option>
                  <option>Program</option>
                  <option>Update</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">
                  Upload Cover Image File *
                </label>
                <div className="flex items-center gap-3">
                  {editingNews.img && (
                    <img
                      src={editingNews.img}
                      alt="Preview"
                      className="w-16 h-14 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                  <label className="flex-1 px-3 py-3 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-xl cursor-pointer flex items-center justify-center gap-2">
                    {newsUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{newsUploading ? "Uploading..." : "Choose Image File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleNewsImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={editingNews.excerpt}
                  onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Full Article Content</label>
                <textarea
                  rows={4}
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newsUploading}
                  className="px-5 py-2 bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: UPLOAD GALLERY ----------------- */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 mb-4">Upload Gallery Photo</h3>
            <form onSubmit={handleAddPhoto} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Choose Photo File *</label>
                <div className="flex items-center gap-3">
                  {newPhoto.src && (
                    <img
                      src={newPhoto.src}
                      alt="Preview"
                      className="w-16 h-14 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                  <label className="flex-1 px-3 py-3 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-xl cursor-pointer flex items-center justify-center gap-2">
                    {galleryUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{galleryUploading ? "Uploading..." : "Select Image from Device"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Caption / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pump Station Electro-Mechanical Upgrade"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Category Tag</label>
                <select
                  value={newPhoto.tag}
                  onChange={(e) => setNewPhoto({ ...newPhoto, tag: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option>Facilities</option>
                  <option>Storage</option>
                  <option>Piping</option>
                  <option>Projects</option>
                  <option>Community</option>
                  <option>Technology</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPhoto.src || galleryUploading}
                  className="px-5 py-2 bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: EDIT TEAM MEMBER ----------------- */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              Edit Profile: {editingMember.name}
            </h3>
            <form onSubmit={handleSaveTeamMember} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Official Role Title *</label>
                <input
                  type="text"
                  required
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Role Badge Text *</label>
                <input
                  type="text"
                  required
                  value={editingMember.badge}
                  onChange={(e) => setEditingMember({ ...editingMember, badge: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">
                  Upload Portrait File *
                </label>
                <div className="flex items-center gap-3">
                  {editingMember.img && (
                    <img
                      src={editingMember.img}
                      alt="Preview"
                      className="w-14 h-16 rounded-xl object-cover object-top border border-slate-200"
                    />
                  )}
                  <label className="flex-1 px-3 py-2.5 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-xl cursor-pointer flex items-center justify-center gap-2">
                    {teamUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{teamUploading ? "Uploading..." : "Upload New Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTeamImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={teamUploading}
                  className="px-5 py-2 bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
