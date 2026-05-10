const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const enriched = await Promise.all(budgets.map(async (b) => {
      const agg = await Transaction.aggregate([
        { $match: { user: b.user, category: b.category, type: 'expense',
            date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const spent = agg[0]?.total || 0;
      return { ...b.toObject(), spent, percentage: Math.round((spent / b.amount) * 100) };
    }));
    res.json(enriched);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createBudget = async (req, res) => {
  try {
    const { category, amount, period } = req.body;
    if (!category || !amount) return res.status(400).json({ message: 'Category and amount required' });
    const budget = await Budget.create({ user: req.user.id, category, amount, period: period || 'monthly' });
    res.status(201).json(budget);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true }
    );
    if (!budget) return res.status(404).json({ message: 'Not found' });
    res.json(budget);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
