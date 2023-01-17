var router = require('express').Router()
const {keyCreate} = require('../services/GlobalService')

router.route("/key/create").post(keyCreate)


module.exports = router;