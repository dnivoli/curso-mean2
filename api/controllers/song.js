'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Albun = require('../models/album');
var Song = require('../models/song');
//const albun = require('../models/album');

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'albun'}).exec((err, song) =>{
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!song) {
                res.status(404).send({message: 'Cancion no exiete'});
            } else {
                res.status(200).send({song});
            }
        }
    });
}

function saveSong(req, res){
    var song = new Song();

    var params = req.body;
    song.numbre = params.numbre;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored)=>{
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!songStored) {
                res.status(404).send({message: 'Cancion sin guardar'});
            } else {
                res.status(200).send({song: songStored});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.album;
    if (!albumId) {
        var find = Stog.find({}).sort('number');        
    } else {
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path:'album',
        populate:{
            path: 'artst',
            model: 'Artist'
        }
    }).exec(function(err, songs){
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!songs) {
                res.status(404).send({message: 'No hay canciones'});
            } else {
                res.status(200).send({songs});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdate) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!songUpdate) {
                res.status(404).send({message: 'Cancion sin actualizar'});
            } else {
                res.status(200).send({song: songUpdate});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) =>{
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!songRemoved) {
                res.status(404).send({message: 'Cancion sin borrar'});
            } else {
                res.status(200).send({song: songRemoved});
            }
        }
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'ogg'){

            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if (!songUpdate) {
                    res.status(404).send({message: 'No se pudo actualizar la cancion'});
                } else {
                    res.status(200).send({song: songUpdated});
                }
            });            
        } else {
            res.status(200).send({message: 'Extension no valida'});
        }
    } else {
        res.status(200).send({message: 'No has subido ninguna cancion...'});
    }
}

function getSongFile(req, res){
    var imageFile = req.params.songFile;
    var path_file = './uploads/songs/'+imageFile;

    fs.Stats(path_file, (err) => {
        console.log(err);
        if(!err){
            console.log(path_file);
            res.sendFile(path_file);
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports =  {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    getSongFile,
    uploadFile
};