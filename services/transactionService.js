const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

/**
 * /api/transaction/
 * traz a lista de receitas e despesas do mês (?period=yyyy-mm)
 * deve trazer também:
 * - quantidade de lançamentos
 * - total de receitas
 * - total de despesas
 * - saldo (total receitas - total despesas)
 *  (ou tratar no front end?)
 */
const find = async (req, res) => {
  const period = req.query.period;

  if (period) {
    const transaction = await TransactionModel.find({ yearMonth: period }).sort({ yearMonthDay: 1 });
    res.status(200).send(transaction);
  } else {
    res
      .status(500)
      .send({ error: "É necessário informar o parâmetro \period, cujo valor deve estar no formato yyyy-mm" });
  }
};

/**
 * DELETAR TRANSAÇÃO
 */
const deleteTransaction = async (req, res) => {
  const id = req.query.id;

  if (id) {
    const deletedTransaction = await TransactionModel.findOneAndDelete({ _id: id });
    res.status(200).send(deletedTransaction);
  } else {
    res
      .status(500)
      .send({ error: "É necessário informar o parâmetro \id para excluir" });
  }
};

/**
 * ATUALIZAR TRANSAÇÃO
 */
const updateTransaction = async (req, res) => {
  const { _id, description, value, category, year, month, day, yearMonth, yearMonthDay, type } = req.body;

  try {
  
    const updatedTransaction = await TransactionModel.findOneAndUpdate(
      { _id: _id },
      { $set: {
        description: description,
        value: value,
        category: category,
        year: year,
        month: month,
        day: day,
        yearMonth: yearMonth,
        yearMonthDay: yearMonthDay,
        type: type,
      } },
      { new: true }
    );

    res.status(200).send(updatedTransaction);

  } catch (error) {
    res.status(500).send(error);
  }
  
};

/**
 * INSERIR TRANSAÇÃO
 */
const insertTransaction = async (req, res) => {
  try {
  
    const insertedTransaction = new TransactionModel(req.body);
    await insertedTransaction.save();

    res.status(200).send(insertedTransaction);

  } catch (error) {
    res.status(500).send(error);
  }
  
};


module.exports = { find, deleteTransaction, updateTransaction, insertTransaction };