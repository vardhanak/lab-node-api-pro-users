const express = require('express');
var router = express.Router()
var ObjectId = require('mongoose').Types.ObjectId;

var User = require('../model/User')

router.get('/', (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error in retriving Users', JSON.stringify(err, undefined, 2));
        }
    })
})

router.get('/:name', (req, res) => {
    User.findOne({ "name": req.params.name }, (err, docs) => {
        if (err) {
            res.status(404).json({ error: "Not able to fetch the data! Try again after some time" })
        }
        else {
            res.send(docs)
        }
    })
})

router.post('/', (req, res) => {
    if (req.body.name == '' || req.body.prograd_id == '') {
        res.status(400).json({ error: 'Please enter name or id of the user' })
    }
    var usr = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        prograd_id: req.body.prograd_id,
        squad: req.body.squad
    })
    usr.save((err, docs) => {
        if (!err) {
            res.status(201).json({ User_Created: user })
        } else {
            return res.status(500).json({ errorMessage: "There was error while save the data to the database." })
        }
    })
})
router.put('/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
    else if (req.body.name == '' || req.body.email == '') {
        res.status(400).json({ error: 'Please provide name/email for the user' })
    }
    else {
        var usr = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            type: req.body.type
        }

        User.updateOne({ "_id": req.params.id }, usr, (err, docs) => {
            if (!err) {
                res.send(docs)
            } else {
                return res.status(500).json({ errorMessage: "There was error while Updating the data to the database." })
            }
        })
    }


})

router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
           return res.status(400).send(`No record with given id: ${req.params.id}`);
    } else {
        User.findByIdAndRemove(req.params.id, (err, docs) => {
            if (!err) { res.send(docs) }
            else {
                return res.status(500).json({ errorMessage: "There was error while deleting the data to the database." })
            }
        })
    }
})


module.exports = router
