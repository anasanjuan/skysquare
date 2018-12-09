'use strict'

function cors(req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'DELETE, PUT, PATCH, POST' 
    })

    next()
}

module.exports = cors