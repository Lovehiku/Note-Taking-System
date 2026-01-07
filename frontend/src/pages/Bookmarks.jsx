import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, updateNote } from "../api/note.jsx";

function Bookmarks() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotes();
        setNotes(Array.isArray(data) ? data.filter((n) => n.bookmarked) : []);
      } catch {
        setError("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function highlight(text, query, truncateLen) {
    let t = text || "";
    if (truncateLen && t.length > truncateLen) t = t.slice(0, truncateLen) + "...";
    if (!query) return t;
    try {
      const re = new RegExp(escapeRegExp(query), "gi");
      return t.replace(re, (m) => `<mark>${m}</mark>`);
    } catch {
      return t;
    }
  }

  const palettes = [
    "bg-[#F3F6A5]",
    "bg-[#F6C3C3]",
    "bg-[#9FD5F1]",
    "bg-[#7EC2E6]",
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#0F172A] dark:text-white py-6 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl tracking-wide font-semibold text-[#1C1C1C] dark:text-white">BOOKMARKS</h1>
              <input
                type="text"
                placeholder="Search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="ml-4 w-[280px] h-10 rounded-xl border border-[#E6E8EC] dark:border-[#334155] px-3 text-[#7A7F87] dark:text-[#CBD5E1] placeholder-[#B0B5BD] dark:placeholder-[#64748B] focus:outline-none dark:bg-[#0B1220]"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 h-10 rounded-md bg-[#E6E8EC] dark:bg-[#334155] dark:text-white"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {loading && <div className="text-[#7A7F87] dark:text-[#CBD5E1]">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-4 gap-6">
            {notes
              .sort((a, b) => Number(b.pinned) - Number(a.pinned))
              .map((note, idx) => (
                <div
                  key={note._id}
                  className={`rounded-2xl ${palettes[idx % palettes.length]} dark:bg-[#1E293B] p-5 shadow-sm`}
                  onClick={() => navigate(`/notes/${note._id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs uppercase tracking-wide text-[#7A7F87] dark:text-[#CBD5E1]">
                      {note.folder?.name || "category"}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        title="Unbookmark"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const updated = await updateNote(note._id, { bookmarked: false });
                          setNotes(notes.filter((n) => n._id !== updated._id));
                        }}
                      >
                        🔖
                      </button>
                      <button
                        title={note.pinned ? "Unpin" : "Pin"}
                        onClick={async (e) => {
                          e.stopPropagation();
                          const updated = await updateNote(note._id, { pinned: !note.pinned });
                          setNotes(
                            notes
                              .map((n) => (n._id === note._id ? updated : n))
                              .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                          );
                        }}
                      >
                        {note.pinned ? "📌" : "📍"}
                      </button>
                    </div>
                  </div>
                  <div className="text-[#1C1C1C] dark:text-white font-semibold mb-2">
                    <span dangerouslySetInnerHTML={{ __html: highlight(note.title, q) }} />
                  </div>
                  <div className="text-[#3E434A] dark:text-[#CBD5E1] text-sm leading-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: highlight(note.content || "", q, 160),
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
