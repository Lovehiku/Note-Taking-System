const Note = require("../model/note");
const Folder = require("../model/folder");

/**
 * Create note
 */
exports.createNote = async (req, res) => {
  try {
    const { title, content, folder } = req.body;

    const note = new Note({
      title,
      content,
      folder: folder || null,
      user: req.user.id // ✅ correct
    });

    await note.save();

    res.status(201).json({
      message: "Note created successfully",
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all notes for logged-in user
 */
exports.getNotes = async (req, res) => {
  try {
    const { range, q } = req.query;
    const filter = { user: req.user.id };
    if (q) {
      const matchedFolders = await Folder.find({
        user: req.user.id,
        name: { $regex: q, $options: "i" },
      }).select("_id");
      const folderIds = matchedFolders.map((f) => f._id);
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { folder: { $in: folderIds } },
      ];
    }
    if (range) {
      const now = new Date();
      let start;
      if (range === "today") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (range === "week") {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(now.getFullYear(), now.getMonth(), diff);
      } else if (range === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      if (start) filter.createdAt = { $gte: start, $lte: now };
    }
    const notes = await Note.find(filter).sort({ createdAt: -1 }).populate("folder");

    res.status(200).json({
      notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Update note
 */
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, folder } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user.id }, // ✅ FIXED
      { title, content, folder: folder || null },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * Delete note
 */
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user.id // ✅ FIXED
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
