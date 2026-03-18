import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeList } from "../store/useResumeStore";

export default function Home() {
  const { resumes, addResume, deleteResume, duplicateResume, renameResume } =
    useResumeList();
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check if logged in on mount — redirect to /login if not
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setUserEmail(data.user?.email || "");
        setAuthChecked(true);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    navigate("/login");
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  const handleCreate = () => {
    const name = newName.trim() || "Untitled Resume";
    const id = addResume(name);
    setNewName("");
    setShowCreate(false);
    navigate(`/builder/${id}`);
  };

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const confirmRename = () => {
    if (editingId && editName.trim()) {
      renameResume(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">MR</span>
            </div>
            <div>
              <h1 className="text-foreground font-semibold text-lg leading-tight">
                Mini Resume
              </h1>
              <p className="text-muted text-xs">Build beautiful resumes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-muted text-xs hidden sm:inline">
                {userEmail}
              </span>
            )}
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Resume
            </button>
            <button
              onClick={handleLogout}
              className="btn-ghost text-xs flex items-center gap-1.5"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Create Dialog */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
              <h2 className="text-foreground font-semibold text-lg mb-1">
                Create New Resume
              </h2>
              <p className="text-muted text-sm mb-5">
                Give your resume a name to get started.
              </p>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="My Awesome Resume"
                autoFocus
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted input-focus mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowCreate(false); setNewName(""); }}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button onClick={handleCreate} className="btn-primary">
                  Create & Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Cards Grid */}
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-foreground font-semibold text-lg mb-2">
              No resumes yet
            </h2>
            <p className="text-muted text-sm mb-6 text-center max-w-md">
              Create your first resume to get started. You can build, edit, and
              manage multiple resumes right from this dashboard.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Your First Resume
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground font-semibold text-base">
                Your Resumes{" "}
                <span className="text-muted font-normal text-sm">
                  ({resumes.length})
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((r) => (
                <div
                  key={r.id}
                  className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-200 hover:shadow-glow animate-fade-in"
                >
                  {/* Card Preview Area */}
                  <div
                    onClick={() => navigate(`/builder/${r.id}`)}
                    className="cursor-pointer px-5 pt-5 pb-3"
                  >
                    {/* Mini preview thumbnail */}
                    <div className="bg-white rounded-lg h-32 mb-4 p-3 overflow-hidden relative">
                      <div className="bg-indigo-500 h-6 rounded-sm mb-2 flex items-center px-2">
                        <span className="text-white text-[6px] font-bold truncate">
                          {r.data.basics.name || "Your Name"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-200 rounded w-3/4" />
                        <div className="h-1 bg-gray-200 rounded w-1/2" />
                        <div className="h-1 bg-gray-100 rounded w-full" />
                        <div className="h-1 bg-gray-100 rounded w-5/6" />
                      </div>
                      {r.data.experience.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="h-1 bg-indigo-100 rounded w-1/3" />
                          <div className="h-1 bg-gray-100 rounded w-full" />
                          <div className="h-1 bg-gray-100 rounded w-2/3" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                    </div>

                    {/* Name */}
                    {editingId === r.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={confirmRename}
                        onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-background border border-primary rounded px-2 py-1 text-sm text-foreground input-focus"
                      />
                    ) : (
                      <h3 className="text-foreground font-medium text-sm truncate">
                        {r.name}
                      </h3>
                    )}
                    <p className="text-muted text-[11px] mt-0.5">
                      Updated {formatDate(r.updatedAt)}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-4 pt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => navigate(`/builder/${r.id}`)}
                      className="btn-ghost text-xs !px-2 !py-1 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => startRename(r.id, r.name)}
                      className="btn-ghost text-xs !px-2 !py-1"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => duplicateResume(r.id)}
                      className="btn-ghost text-xs !px-2 !py-1"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${r.name}"? This cannot be undone.`))
                          deleteResume(r.id);
                      }}
                      className="btn-danger text-xs !px-2 !py-1 ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
