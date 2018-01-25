var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/check.auth');

var Note = require('../models/notes')

// FARMER SIGN UP
router.post('/add-note', checkAuth, (req, res, next) => {

    var note = Note.schema.methods.save(req.body.farmerId, req.body.farmId, req.body.noteTitle, req.body.noteContent, req.body.noteImg);
    note.then(() => {
        
        // NOTE CREATED SUCCESSFULLY
        res.status(201).json({
            message: 'Note created'
        })

    }).catch(err => {

        // RETURN ERROR
        res.status(401).json({
            message: 'Auth failed'
        }) 
    
    });

});

// DELETE NOTE
router.get('delete/:id', checkAuth, (req, res, next) => {

    var note = Note.schema.methods.delete(req.params.noteId);
    note.then(() => {

        // NOTE DELETED SUCCESFULLY
        res.status(201).json({
            message: 'Note deleted'
        })

    }).catch(err => {

        res.status(401).json({
            message: 'Auth failed'
        });

    });

});