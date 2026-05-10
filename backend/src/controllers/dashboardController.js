const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const userId = req.user.id;

    // Summary
    const [incomeAgg, expenseAgg] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), type: 'income', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);
    const totalIncome  = incomeAgg[0]?.total  || 0;
    const totalExpense = expenseAgg[0]?.total || 0;

    // Budget usage
    const budgets = await Budget.find({ user: userId });
    const budgetTotal = budgets.reduce((s, b) => s + b.amount, 0);
    const budgetUsageAgg = await Transaction.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const budgetSpent = budgetUsageAgg[0]?.total || 0;

    // Expense by category
    const expenseByCategory = await Transaction.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    // Monthly income vs expense (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthly = await Transaction.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), date: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Recent transactions
    const recentTransactions = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(5);

    res.json({
      summary: { totalIncome, totalExpense, balance: totalIncome - totalExpense, budgetUsage: budgetTotal ? Math.round((budgetSpent / budgetTotal) * 100) : 0, budgetSpent, budgetTotal },
      expenseByCategory,
      monthly,
      recentTransactions
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
