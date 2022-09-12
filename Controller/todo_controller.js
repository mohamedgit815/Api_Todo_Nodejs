const DB = require("../Models/todo_models");
const slugify = require("slugify");
const joi = require('joi');
const lodash = require('lodash');
const ApiError = require("../Core/api_errors");
const _badReq = "BadRequest";
const _notFound = "NotFound";

module.exports = {

    postTodo: async (req,res) => {
        try{
            const _keys = joi.object().keys({
                name: joi.string().min(2).max(32) ,
                body: joi.string().min(2).max(1080) ,
            });
    
            const _joiKeys = _keys.validate(req.body);
    
            const _pick = lodash.pick(_joiKeys.value,['name','body']);
    
    
           if(_joiKeys.error) {
    
            res.status(404).json({message:_joiKeys.error.details[0].message});
    
           } else {
            const _TodoDB = await DB({
                name: _pick.name ,
                body: _pick.body ,
                slug: slugify(_pick.name
                )}).save();

            if(!_TodoDB) {
                res.status(404).json({
                    message : false , 
                    message: new ApiError(_notFound,404)});
            } 

                res.status(201).json({
                    message: true , 
                    data: _TodoDB
                });
            
           }
        } catch(e){
            res.status(400).json({
                message : false , 
                error: new ApiError(_badReq,400)
            })
        }
    } ,



    getTodo: async (req,res) => {
        try{
        const DBTodo = await DB.find().select('_id name body');

        if(!DBTodo) {
            res.status(404).json({
                message : false ,
                message: new ApiError(_notFound,404)});
        } 

        res.status(200).json({
            message: true , 
            data: DBTodo
        });

    } catch(e) {
        res.status(400).json({
            message : false , 
            error: new ApiError(_badReq,400)
        })
    }
    } ,


    
    getTodoPagination: async (req,res)=> {
        try{
            const {_limit = 8 ,_page = 1} = req.query;

            const _TodoDB = await DB.find()
            .select('_id name slug body')
            .limit(_limit * 1)
            .skip((_page -1) * _limit);

            if(!_TodoDB) {
                return res.status(404).json({
                    message : false ,
                    error : new ApiError(_notFound , 404)
                });
            }

            return res.status(200).json({
                message : true ,
                length: _TodoDB.length , 
                results : _TodoDB
            });

           
        }catch(e){
           res.status(400).json({
               message : false ,
               error : new ApiError(_badReq,400)
           });
        }
    },



    getTodoById: async (req,res) => {
        try{
            const DBTodo = await DB.find({_id:req.params.id});
    
            if(!DBTodo) {
                res.status(404).json({
                    message: false ,
                    error: new ApiError(_notFound , 404)
                });
            } 
    
            res.status(200).json({
                message: true , 
                data: DBTodo
            });
    
        } catch(e) {
            res.status(400).json({
                message : false , 
                error: new ApiError(_badReq,400)
            })
        }
    } ,



    deleteTodoById: async (req,res) => {
        try{
            const DBTodo = await DB.findOneAndDelete({_id:req.params.id});

            if(!DBTodo) {
                res.status(204).json({
                    message: false ,
                    error: new ApiError(_notFound , 404)
                });
            } 
    
            res.status(200).json({
                message: true , 
                data: DBTodo
            });
        } catch(e) {
            res.status(400).json({
                message : false ,
                err: e , 
                error: new ApiError(_badReq,400)
            })
        } 
    } ,


    updateTodoById: async (req,res) => {
        try{
            const _keys = joi.object().keys({
                name: joi.string().min(2).max(32) ,
                body: joi.string().min(2).max(1080) ,
            });
    
            const _joiKeys = _keys.validate(req.body);
    
            const _pick = lodash.pick(_joiKeys.value,['name','body']);
    
    
           if(_joiKeys.error) {
    
            res.status(404).json({message:_joiKeys.error.details[0].message});
    
           } else {
            const _TodoDB = await DB.findOneAndUpdate({
                _id:req.params.id},{
                    name: _pick.name , 
                    body:_pick.body ,
                    slug: slugify(_pick.name)
            },{new:true});

            if(!_TodoDB) {
                res.status(404).json({
                    message : false , 
                    message: new ApiError(_notFound,404)});
            } 

                res.status(200).json({
                    message: true , 
                    data: _TodoDB
                });
            
           }
        } catch(e){
            res.status(400).json({
                message : false , 
                error: new ApiError(_badReq,400)
            })
        }
    }



    
}