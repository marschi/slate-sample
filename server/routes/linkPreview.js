const express = require('express');
const router = express.Router();
const preview =  require('page-previewer');
/* GET link preview */
router.get('/:url', (req, res, next) => {
  const url  = decodeURIComponent(req.params.url);
  if (url) {
    preview({ url }, (err, data) => {
      if(!err) {
        res.status(200).json(data);
      } else {
        res.status(204);
      }
    });
  } else {
    res.status(400);
  }
});

module.exports = router;
