const express = require('express');
const transactionRouter = express.Router();

const transaction = require('../services/transactionService.js');


transactionRouter.get('/', transaction.find);
transactionRouter.delete('/delete', transaction.deleteTransaction);
transactionRouter.patch('/update', transaction.updateTransaction);
transactionRouter.post('/insert', transaction.insertTransaction);


module.exports = transactionRouter;
