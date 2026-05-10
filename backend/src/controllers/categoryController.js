const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const cats = await Category.find({ user: req.user.id }).sort('name');
  res.json(cats);
};

exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Name and type required' });
    const cat = await Category.create({ user: req.user.id, name, type });
    res.status(201).json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true }
    );
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
