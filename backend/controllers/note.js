const Note = require('../model/note');

// Create a new note
exports.createNote = async (req, res) => {
    try {       
        const { title, content } = req.body;
        const note = new Note({ title, content ,user: req.user.id  });
        await note.save();
        res.status(201).json({ message: 'Note created successfully', note });
    } catch (error) {
console.error(error); // log the actual error
res.status(500).json({ message: 'Server error', error: error.message });    }   
};

// Get all notes for the logged-in user
exports.getNotes = async (req, res) => {
    try {   
        const notes = await Note.find({ owner: req.user.id });
        res.status(200).json({ notes });
    } catch (error) {
console.error(error); // log the actual error
res.status(500).json({ message: 'Server error', error: error.message });    }   
};

// Update a note
exports.updateNote = async (req, res) => {
    try {       
        const { id } = req.params;
        const { title, content } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: id, owner: req.user.id },
            { title, content },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
       console.error(error); // log the actual error
res.status(500).json({ message: 'Server error', error: error.message });
    }   
};      

// Delete a note
exports.deleteNote = async (req, res) => {
    try {       
        const { id } = req.params;
        const note = await Note.findOneAndDelete({ _id: id, owner: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }   
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {

     console.error(error); // log the actual error
res.status(500).json({ message: 'Server error', error: error.message });    }
};