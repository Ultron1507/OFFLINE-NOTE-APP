const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Auth route is ready' });
});

module.exports = router;
