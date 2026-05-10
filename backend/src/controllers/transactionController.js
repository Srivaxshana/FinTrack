const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    const filter = { user: req.user.id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }
    if (category) filter.category = category;
    if (type)     filter.type = type;
    const txns = await Transaction.find(filter).sort({ date: -1 });
    res.json(txns);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createTransaction = async (req, res) => {
  try {
    const { title, amount, category, type, date, note } = req.body;
    if (!title || !amount || !category || !type || !date)
      return res.status(400).json({ message: 'Required fields missing' });
    const txn = await Transaction.create({ user: req.user.id, title, amount, category, type, date, note });
    res.status(201).json(txn);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateTransaction = async (req, res) => {
  try {
    const txn = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true }
    );
    if (!txn) return res.status(404).json({ message: 'Not found' });
    res.json(txn);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const txn = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!txn) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
