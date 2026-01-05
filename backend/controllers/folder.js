const Folder = require("../model/folder");
const Note = require("../model/note");

exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.create({ name, user: req.user.id });
    res.status(201).json({ folder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const { range, q } = req.query;
    const filter = { user: req.user.id };
    if (q) {
      filter.name = { $regex: q, $options: "i" };
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
    const folders = await Folder.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    res.status(200).json({ folder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name },
      { new: true }
    );
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    res.status(200).json({ folder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    await Note.updateMany({ user: req.user.id, folder: folder._id }, { $set: { folder: null } });
    await folder.deleteOne();
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    res.status(200).json({ message: "Folder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
