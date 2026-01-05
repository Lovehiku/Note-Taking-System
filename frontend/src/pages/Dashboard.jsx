import React, { useEffect, useState } from "react";
import { getNotes, createNote } from "../api/note";
import { getFolders, createFolder } from "../api/folder";
import { getMe } from "../api/auth";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [folderRange, setFolderRange] = useState("week");
  const [noteRange, setNoteRange] = useState("today");
  const [q, setQ] = useState("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: "", content: "", folder: "" });
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderForm, setFolderForm] = useState({ name: "" });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes({ range: noteRange, q });
        setNotes(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    const fetchFolders = async () => {
      try {
        const data = await getFolders({ range: folderRange, q });
        setFolders(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load folders");
      }
    };
    const fetchUser = async () => {
      try {
        const u = await getMe();
        setUser(u);
      } catch {
        setUser(null);
      }
    };
    fetchNotes();
    fetchFolders();
    fetchUser();
  }, [noteRange, folderRange, q]);

  const noteColors = [
    { bg: "bg-[#F3F6A5]", dot: "bg-[#1C1C1C]" },
    { bg: "bg-[#F6C3C3]", dot: "bg-[#1C1C1C]" },
    { bg: "bg-[#9FD5F1]", dot: "bg-[#1C1C1C]" },
    { bg: "bg-[#7EC2E6]", dot: "bg-[#1C1C1C]" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-6 px-4">
      <div className="max-w-[1200px] mx-auto flex">
        <aside className="w-[220px] mr-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-[#1F3B64] flex items-center justify-center text-white font-bold">
                {(user?.username || "U").slice(0,1).toUpperCase()}
              </div>
              <span className="text-[#1F3B64] font-semibold">{user?.username || "User"}</span>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-900 font-medium mb-3">Add new</div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1F3B64]" />
                <span className="w-3 h-3 rounded-full bg-[#FF3B3B]" />
                <span className="w-3 h-3 rounded-full bg-[#2ECC71]" />
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
            <div className="text-[#1C1C1C] text-sm mb-3">
              Want to access advanced metrics and features?
            </div>
            <button className="w-full bg-[#1F3B64] text-white rounded-xl py-2 text-sm">
              Upgrade pro
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl tracking-wide font-semibold text-[#1C1C1C]">
                MY NOTES
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={q}
                  onChange={(e) => {
                      setQ(e.target.value);
                    }}
                  className="w-[360px] h-11 rounded-xl border border-[#E6E8EC] pl-10 pr-4 text-[#7A7F87] placeholder-[#B0B5BD] focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B5BD]">
                  🔍
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#7A7F87]">{user?.username || "User"}</span>
                <div className="w-9 h-9 rounded-full bg-[#E6E8EC]" />
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                  className="w-10 h-10 rounded-md bg-[#E6E8EC] flex items-center justify-center"
                  title="Logout"
                >
                  🚪
                </button>
              </div>
            </div>
          </div>

            <section className="mb-8">
              <div className="flex items-center gap-6 mb-4 text-sm">
                <button
                  className={`transition ${folderRange === "today" ? "text-[#1C1C1C] font-semibold" : "text-[#7A7F87]"}`}
                  onClick={() => setFolderRange("today")}
                >
                  Todays
                </button>
                <button
                  className={`transition ${folderRange === "week" ? "text-[#1C1C1C] font-semibold" : "text-[#7A7F87]"}`}
                  onClick={() => setFolderRange("week")}
                >
                  This Week
                </button>
                <button
                  className={`transition ${folderRange === "month" ? "text-[#1C1C1C] font-semibold" : "text-[#7A7F87]"}`}
                  onClick={() => setFolderRange("month")}
                >
                  This Month
                </button>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {folders.map((f) => (
                  <div key={f._id} className="rounded-2xl bg-[#DCEEFE] p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#A8CDED]" />
                      <div className="flex gap-2">
                        <button
                          className="text-[#7A7F87]"
                          onClick={() => {
                            setEditingFolder(f);
                            setFolderForm({ name: f.name });
                            setShowFolderModal(true);
                          }}
                        >
                          ✎
                        </button>
                        <button
                          className="text-[#7A7F87]"
                          onClick={async () => {
                            const res = await fetch(`http://localhost:5000/api/folders/${f._id}`, {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                              },
                            });
                            if (res.ok) {
                              setFolders(folders.filter((x) => x._id !== f._id));
                            }
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                    <div className="text-[#1C1C1C] font-medium">{f.name}</div>
                    <div className="text-[#7A7F87] text-sm">
                      {new Date(f.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditingFolder(null);
                    setFolderForm({ name: "" });
                    setShowFolderModal(true);
                  }}
                  className="rounded-2xl border border-dashed border-[#D7D9DE] p-5 text-center text-[#7A7F87] shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E6E8EC] mx-auto mb-3" />
                  <div>New folder</div>
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6 text-sm">
                  <button
                    className={`transition ${noteRange === "today" ? "text-[#1C1C1C] font-semibold" : "text-[#7A7F87]"}`}
                    onClick={() => setNoteRange("today")}
                  >
                    Todays
                  </button>
                  <button
                    className={`transition ${noteRange === "week" ? "text-[#1C1C1C] font-semibold" : "text-[#7A7F87]"}`}
                    onClick={() => setNoteRange("week")}
                  >
                    This Week
                  </button>
                  <button
                    className={`transition ${noteRange === "month" ? "text-[#1C1C1C] font-semibold" : "text-[#7A7F87]"}`}
                    onClick={() => setNoteRange("month")}
                  >
                    This Month
                  </button>
                </div>
                <div className="text-[#7A7F87] text-sm">
                  {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" })}
                </div>
              </div>

              {loading && <div className="text-[#7A7F87]">Loading...</div>}
              {error && <div className="text-red-600">{error}</div>}

              {!loading && !error && (
                <div className="grid grid-cols-4 gap-6">
                  {notes.length > 0 &&
                    notes.slice(0, 4).map((note, idx) => {
                        const palette = noteColors[idx % noteColors.length];
                        return (
                          <div
                            key={note._id}
                            className={`rounded-2xl ${palette.bg} p-5 shadow-sm`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs uppercase tracking-wide text-[#7A7F87]">
                                {note.folder?.name || "category"}
                              </div>
                              <span className={`w-3 h-3 rounded-full ${palette.dot}`} />
                            </div>
                            <div className="text-[#1C1C1C] font-semibold mb-2">
                              {note.title}
                            </div>
                            <div className="text-[#3E434A] text-sm leading-6 mb-6">
                              {note.content?.length > 120
                                ? note.content.slice(0, 120) + "..."
                                : note.content}
                            </div>
                            <div className="flex items-center justify-between text-[#7A7F87] text-xs">
                              <span>
                                {new Date(note.createdAt).toLocaleString(undefined, {
                                  weekday: "long",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingNote(note);
                                    setNoteForm({
                                      title: note.title,
                                      content: note.content,
                                      folder: note.folder?._id || "",
                                    });
                                    setShowNoteModal(true);
                                  }}
                                >
                                  ✎
                                </button>
                                <button
                                  onClick={async () => {
                                    const res = await fetch(`http://localhost:5000/api/notes/${note._id}`, {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                                      },
                                    });
                                    if (res.ok) {
                                      setNotes(notes.filter((x) => x._id !== note._id));
                                    }
                                  }}
                                >
                                  🗑
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                  <button
                    onClick={() => {
                      setEditingNote(null);
                      setNoteForm({ title: "", content: "", folder: "" });
                      setShowNoteModal(true);
                    }}
                    className="rounded-2xl border border-dashed border-[#D7D9DE] p-5 text-center text-[#7A7F87] shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#E6E8EC] mx-auto mb-3" />
                    <div>New Note</div>
                  </button>
                </div>
              )}
            </section>
            {showNoteModal && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-6 w-[420px]">
                  <div className="text-lg font-semibold mb-4">{editingNote ? "Edit Note" : "New Note"}</div>
                  <div className="space-y-3">
                    <input
                      className="w-full h-10 rounded-md border border-[#E6E8EC] px-3"
                      placeholder="Title"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    />
                    <textarea
                      className="w-full rounded-md border border-[#E6E8EC] px-3 py-2 h-24"
                      placeholder="Description"
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    />
                    <select
                      className="w-full h-10 rounded-md border border-[#E6E8EC] px-3"
                      value={noteForm.folder}
                      onChange={(e) => setNoteForm({ ...noteForm, folder: e.target.value })}
                    >
                      <option value="">No folder</option>
                      {folders.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="px-4 py-2 rounded-md bg-[#E6E8EC]"
                      onClick={() => setShowNoteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-md bg-[#1F3B64] text-white"
                      onClick={async () => {
                        if (editingNote) {
                          const res = await fetch(`http://localhost:5000/api/notes/${editingNote._id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                            },
                            body: JSON.stringify({
                              title: noteForm.title,
                              content: noteForm.content,
                              folder: noteForm.folder || null,
                            }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setNotes(
                              notes.map((n) => (n._id === editingNote._id ? updated.note : n))
                            );
                            setShowNoteModal(false);
                          }
                        } else {
                          const created = await createNote({
                            title: noteForm.title,
                            content: noteForm.content,
                            folder: noteForm.folder || null,
                          });
                          setNotes([created, ...notes]);
                          setShowNoteModal(false);
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showFolderModal && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-6 w-[360px]">
                  <div className="text-lg font-semibold mb-4">{editingFolder ? "Edit Folder" : "New Folder"}</div>
                  <input
                    className="w-full h-10 rounded-md border border-[#E6E8EC] px-3"
                    placeholder="Folder name"
                    value={folderForm.name}
                    onChange={(e) => setFolderForm({ name: e.target.value })}
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="px-4 py-2 rounded-md bg-[#E6E8EC]"
                      onClick={() => setShowFolderModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-md bg-[#1F3B64] text-white"
                      onClick={async () => {
                        if (editingFolder) {
                          const res = await fetch(`http://localhost:5000/api/folders/${editingFolder._id}`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                            },
                            body: JSON.stringify({ name: folderForm.name }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setFolders(folders.map((f) => (f._id === editingFolder._id ? updated.folder : f)));
                            setShowFolderModal(false);
                          }
                        } else {
                          const created = await createFolder(folderForm.name);
                          setFolders([created, ...folders]);
                          setShowFolderModal(false);
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
