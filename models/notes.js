var mongoose = require('mongoose');

var Farm = require('./farm');
var Farmer = require('./farmer');

var noteSchema = new mongoose.Schema({
    farmer: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Farmer", required: true },
    farm: { type: [ mongoose.Schema.Types.ObjectId ], ref: "Farm", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    img: { type: String },
    created: { type: Date, required: true, default: Date.now }
});

var Note = mongoose.model('Note', noteSchema);

// SAVE NOTE
noteSchema.methods.save = function(farmerId, farmId, noteTitle, noteContent, noteImg) {

    var note = new Note({
        farmer: farmerId,
        farm: farmId,
        title: noteTitle,
        content: noteContent,
        img: noteImg,
        created: new Date()
    });

}

// REMOVE NOTE
noteSchema.methods.delete = function(noteId) {
    return Note.findById(noteId).remove.exec();
}


module.exports = Note;