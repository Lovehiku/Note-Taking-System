const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const folderController = require("../controllers/folder");

router.post("/", authenticate, folderController.createFolder);
router.get("/", authenticate, folderController.getFolders);
router.get("/:id", authenticate, folderController.getFolder);
router.put("/:id", authenticate, folderController.updateFolder);
router.delete("/:id", authenticate, folderController.deleteFolder);

module.exports = router;
