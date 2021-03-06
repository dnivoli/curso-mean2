'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
const { use } = require('../app');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción del controlador de usuarios del API Rest con Node y Mongo'
    });
}

function saveUser(req,res){
    var user = new User();

    var params = req.body;

    //console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        // Encripta contraseña
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;

            if(user.name != null && user.surname != null && user.email != null){
                // Guardo los datos del usuario
                user.save((err,userStored)=> {
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                })
            }else{
                res.status(200).send({message: 'Ingrese todos los campos.'});        
            }
        })
    }else{
        res.status(200).send({message: 'Introduce la contraseña'});
    }
}

function loginUser(req,res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()},(err,user) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                // Comprobar la contraseña
                bcrypt.compare(password, user.password, function(err,check){
                    if(check){
                        //Devuelve los datos del usuario logueado
                        if(params.gethash){
                            // Devoler un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)

                            })
                        }else{
                            res.status(200).send({user});
                        }

                    }else{
                        res.status(400).send({message: 'El usuario no pudo loguearse'});
                    }
                })
            }
        }
    })

}

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdate)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!userUpdate){
                res.status(404).send({message: 'No se a podido actualizar el usuario'}); 
            }else{
                res.status(200).send({user: userUpdate});
            }
        }
    });

}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido ...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg'|| file_ext == 'gif'){

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdate) =>{
                if(!userUpdate){
                    res.status(404).send({message: 'No se a podido actualizar el usuario'}); 
                }else{
                    res.status(200).send({image: file_name, user: userUpdate});
                }
            });
        }else{
            res.status(200).send({message: 'La extención del archivo no es valida'});
        }


        console.log(file_path);
    }else{
        res.status(200).send({message: 'No se ha subido ninguna imagen...'});
    }

}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+ imageFile;

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

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};