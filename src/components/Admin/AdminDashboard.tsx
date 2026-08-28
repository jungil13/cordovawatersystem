import { useState, useEffect } from "react";
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
  X,
} from "lucide-react";

interface Props {
  userEmail: string;
  onLogout: () => void;
  onClose: () => void;
}

export default function AdminDashboard({ userEmail, onLogout, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<
    "inquiries" | "news" | "gallery" | "team" | "rates"
  >("inquiries");

  // State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [inquiries, setInquiries] = useState<InquiryApplication[]>([]);
  const [rates] = useState<RateBracket[]>(initialRates);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState("ALL");

  // News Form Modal
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsUploading, setNewsUploading] = useState(false);

  // Gallery Form Modal
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    src: "",
    alt: "",
    caption: "",
    tag: "Facilities",
  });
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Team Edit Modal
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [teamUploading, setTeamUploading] = useState(false);

  // Initial Load from Supabase
  const loadData = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Image Upload Handlers ---
  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingNews) return;
    setNewsUploading(true);
    try {
      const uploadedUrl = await uploadImageFile(file);
      setEditingNews({ ...editingNews, img: uploadedUrl });
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
      const uploadedUrl = await uploadImageFile(file);
      setNewPhoto({ ...newPhoto, src: uploadedUrl });
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
      const uploadedUrl = await uploadImageFile(file);
      setEditingMember({ ...editingMember, img: uploadedUrl });
    } catch (err) {
      alert("Failed to upload portrait.");
    } finally {
      setTeamUploading(false);
    }
  };

  // --- CRUD Handlers ---
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

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

    // Local state update
    if (editingNews.id) {
      setNews(news.map((item) => (item.id === editingNews.id ? editingNews : item)));
    } else {
      setNews([
        {
          ...editingNews,
          id: `news-${Date.now()}`,
          date: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        },
        ...news,
      ]);
    }

    setIsNewsModalOpen(false);
    setEditingNews(null);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    if (isSupabaseConfigured && supabase && !id.startsWith("news-")) {
      await supabase.from("news").delete().eq("id", id);
    }
    setNews(news.filter((n) => n.id !== id));
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.src || !newPhoto.caption) return;

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

    const photo: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      src: newPhoto.src,
      alt: newPhoto.caption,
      caption: newPhoto.caption,
      tag: newPhoto.tag,
    };
    setGallery([photo, ...gallery]);
    setNewPhoto({ src: "", alt: "", caption: "", tag: "Facilities" });
    setIsGalleryModalOpen(false);
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Delete this photo from gallery?")) return;
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
    if (!confirm("Delete this inquiry record?")) return;
    if (isSupabaseConfigured && supabase && !id.startsWith("inq-")) {
      await supabase.from("inquiries").delete().eq("id", id);
    }
    setInquiries(inquiries.filter((inq) => inq.id !== id));
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-0 sm:p-4">
      <div className="bg-slate-50 w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header */}
        <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg">CWSI Admin Console</h1>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSupabaseConfigured
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                  }`}
                >
                  {isSupabaseConfigured ? "Connected to Supabase" : "Configured via .env"}
                </span>
              </div>
              <p className="text-xs text-slate-400">Signed in as {userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Exit to Website
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: "inquiries", label: "Applications & Inquiries", icon: MessageSquare, count: inquiries.length },
            { id: "news", label: "News & Advisories", icon: Newspaper, count: news.length },
            { id: "gallery", label: "Gallery Photos", icon: ImageIcon, count: gallery.length },
            { id: "team", label: "Team Members (4)", icon: Users, count: team.length },
            { id: "rates", label: "Water Tariff Rates", icon: DollarSign, count: rates.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "border-blue-600 text-blue-600 bg-blue-50/40"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* TAB 1: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Incoming Inquiries & Connection Applications
                  </h2>
                  <p className="text-xs text-slate-500">
                    Directly synced with the Supabase database.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, email, subject..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={inquiryFilter}
                    onChange={(e) => setInquiryFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ALL">All Categories & Statuses</option>
                    <option value="Application">Application</option>
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-3">
                {filteredInquiries.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No submissions found</p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                            {inq.type}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm">{inq.subject}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {inq.createdAt}
                          </span>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="py-3 text-xs text-slate-600 leading-relaxed">
                        <p>{inq.message}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
                          <span>
                            <strong>Name:</strong> {inq.name}
                          </span>
                          <span>
                            <strong>Phone:</strong> {inq.phone}
                          </span>
                          <span>
                            <strong>Email:</strong> {inq.email}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-medium">Status:</span>
                          {(["Pending", "In Review", "Contacted", "Resolved"] as const).map(
                            (st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  inq.status === st
                                    ? st === "Resolved"
                                      ? "bg-emerald-600 text-white"
                                      : st === "Pending"
                                      ? "bg-amber-500 text-white"
                                      : "bg-blue-600 text-white"
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

          {/* TAB 2: NEWS */}
          {activeTab === "news" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">News & Announcements</h2>
                  <p className="text-xs text-slate-500">
                    Publish updates with image file uploads.
                  </p>
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
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Announcement</span>
                </button>
              </div>

              <div className="grid gap-3">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.excerpt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setIsNewsModalOpen(true);
                        }}
                        className="p-2 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
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

          {/* TAB 3: GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Infinite Carousel Gallery</h2>
                  <p className="text-xs text-slate-500">
                    Upload photos directly from your device.
                  </p>
                </div>
                <button
                  onClick={() => setIsGalleryModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm group relative flex flex-col"
                  >
                    <div className="h-36 relative bg-slate-100">
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase">
                        {photo.tag || "Facilities"}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 mt-0.5">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM MEMBERS */}
          {activeTab === "team" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">CWSI Key Personnel</h2>
                <p className="text-xs text-slate-500">
                  Update staff details, titles, and upload portraits directly.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/5] w-full rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-800">
                          {member.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                      <p className="text-xs text-slate-500 mb-3">{member.role}</p>
                    </div>

                    <button
                      onClick={() => setEditingMember(member)}
                      className="w-full py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit & Upload Photo</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WATER RATES */}
          {activeTab === "rates" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Water Consumption Tariff Schedule</h2>
                <p className="text-xs text-slate-500">
                  Current active rate brackets shown across the public website and bill calculator.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-3">Konsumo (Kubiko)</th>
                      <th className="p-3">Residential / Commercial Rate</th>
                      <th className="p-3">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rates.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{r.range}</td>
                        <td className="p-3 font-bold text-blue-700">₱{r.rate}</td>
                        <td className="p-3 text-slate-600">{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT NEWS MODAL WITH IMAGE UPLOAD */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              {editingNews.id ? "Edit Announcement" : "Create New Announcement"}
            </h3>
            <form onSubmit={handleSaveNews} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Category</label>
                <select
                  value={editingNews.category}
                  onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option>Announcement</option>
                  <option>Notice</option>
                  <option>Achievement</option>
                  <option>Program</option>
                  <option>Update</option>
                </select>
              </div>

              {/* Upload Image Section */}
              <div>
                <label className="font-semibold block text-slate-700 mb-1">
                  Announcement Cover Image *
                </label>
                <div className="flex items-center gap-3">
                  {editingNews.img && (
                    <img
                      src={editingNews.img}
                      alt="Preview"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                  <label className="flex-1 px-3 py-2 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-lg cursor-pointer flex items-center justify-center gap-2">
                    {newsUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{newsUploading ? "Uploading image..." : "Upload Image from Device"}</span>
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Full Content</label>
                <textarea
                  rows={4}
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newsUploading}
                  className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD GALLERY MODAL */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 mb-4">Upload Photo to Gallery</h3>
            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Upload Photo File *</label>
                <div className="flex items-center gap-3">
                  {newPhoto.src && (
                    <img
                      src={newPhoto.src}
                      alt="Preview"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                  <label className="flex-1 px-3 py-3 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-lg cursor-pointer flex items-center justify-center gap-2">
                    {galleryUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{galleryUploading ? "Uploading photo..." : "Choose Image File"}</span>
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
                <label className="font-semibold block text-slate-700 mb-1">Photo Caption / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reservoir Pumping Station Inspection"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Category Tag</label>
                <select
                  value={newPhoto.tag}
                  onChange={(e) => setNewPhoto({ ...newPhoto, tag: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
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
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPhoto.src || galleryUploading}
                  className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEAM MEMBER & UPLOAD PORTRAIT MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              Edit Team Member: {editingMember.name}
            </h3>
            <form onSubmit={handleSaveTeamMember} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Role Badge Text *</label>
                <input
                  type="text"
                  required
                  value={editingMember.badge}
                  onChange={(e) => setEditingMember({ ...editingMember, badge: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Upload Portrait Image */}
              <div>
                <label className="font-semibold block text-slate-700 mb-1">
                  Upload Portrait Photo *
                </label>
                <div className="flex items-center gap-3">
                  {editingMember.img && (
                    <img
                      src={editingMember.img}
                      alt="Preview"
                      className="w-14 h-16 rounded-lg object-cover object-top border border-slate-200"
                    />
                  )}
                  <label className="flex-1 px-3 py-2.5 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-lg cursor-pointer flex items-center justify-center gap-2">
                    {teamUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{teamUploading ? "Uploading..." : "Upload New Portrait"}</span>
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
                  className="px-4 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={teamUploading}
                  className="px-4 py-2 bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
