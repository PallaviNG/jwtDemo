var router = require('express').Router();

/*GET Home Page */
router.get("/", function(req,res) {
    res.send({status:1,message:`webRouter`});
});

module.exports = router;