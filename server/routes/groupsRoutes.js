const express = require('express');
const router = express.Router();
const Group = require('../models/group');

router.post('/', async (req, res) => {
  const { name, creatorId } = req.body;
  const group = new Group({ name, creatorId, members: [creatorId] });
  await group.save();
  res.status(201).send(group);
});

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

module.exports = router;

