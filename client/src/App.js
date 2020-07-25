import React, { useState, useEffect } from 'react';
import * as api from './api/apiService'
import Preloader from './components/Preloader';
import TransactionsControl from './components/TransactionsControl';
import Header from './components/Header';
import Modal from './components/ModalTransaction';
import { startSelectedPeriod } from './helpers/periods';

export default function App() {

  const [currentPeriod, setCurrentPeriod] = useState(startSelectedPeriod);
  const [filter, setFilter] = useState('');
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getTransactions = async () => {
      const transactions = await api.getTransactions(currentPeriod);
      setAllTransactions(transactions);
      setFilteredTransactions(transactions);
    };

    getTransactions();
  }, [currentPeriod])

  const handleDelete = async (transactionToDelete) => {
    const deletedTransaction = await api.deleteTransaction(transactionToDelete._id);

    if (deletedTransaction) {
      const deletedTransactionIndex = allTransactions.findIndex(transaction => transaction._id === transactionToDelete._id)

      const newTransactions = Object.assign([], allTransactions);
      newTransactions.splice(deletedTransactionIndex, 1);

      setAllTransactions(newTransactions);
      setFilteredTransactions(newTransactions);
    }
  }

  const handlePersist = async (transactionToUpdate) => {

    if (transactionToUpdate) { setSelectedTransaction(transactionToUpdate); }
    setIsModalOpen(true);

  }
  const handlePersistData = async (formData) => {

    let { _id, description, value, category, year, month, day, yearMonth, yearMonthDay, type } = formData;


    if (!_id) {
      // se não tiver id está inserindo
      // pegar os valores do yearDateMonth para separar nos outros campos
      year = yearMonthDay.slice(0,4);
      month = yearMonthDay.slice(5,7);
      day = yearMonthDay.slice(8,10);
      yearMonth = yearMonthDay.slice(0,7);

      const transactionToInsert = {};

      transactionToInsert.description = description;
      transactionToInsert.value = parseInt(value);
      transactionToInsert.category = category;
      transactionToInsert.year = parseInt(year);
      transactionToInsert.month = parseInt(month);
      transactionToInsert.day = parseInt(day);
      transactionToInsert.yearMonth = yearMonth;
      transactionToInsert.yearMonthDay = yearMonthDay;
      transactionToInsert.type = type;

      await api.insertTransaction(transactionToInsert)

      // atualiza as transações
      const getTransactions = async () => {
        const transactions = await api.getTransactions(currentPeriod);
        setAllTransactions(transactions);
        setFilteredTransactions(transactions);
      };  
      getTransactions();
      

    } else {
      // se tiver id está editando

      const newAllTransactions = Object.assign([], allTransactions);

      const transactionToPersist = newAllTransactions.find((transaction) => transaction._id === _id);

      transactionToPersist._id = _id;
      transactionToPersist.description = description;
      transactionToPersist.value = parseInt(value);
      transactionToPersist.category = category;
      transactionToPersist.year = year;
      transactionToPersist.month = month;
      transactionToPersist.day = day;
      transactionToPersist.yearMonth = yearMonth;
      transactionToPersist.yearMonthDay = yearMonthDay;
      transactionToPersist.type = type;

      await api.updateTransaction(formData);

    }

    setIsModalOpen(false);
  }

  const handleChangeDate = (value) => {
    setCurrentPeriod(value);
  }

  const handleChangeFilter = (newText) => {
    setFilter(newText)

    const filteredTransactions = allTransactions.filter((transaction) => {
      return transaction.description.includes(newText);
    })
    setFilteredTransactions(filteredTransactions);

  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  return (
    <div>

      <Header
        currentPeriod={startSelectedPeriod}
        onSelectChange={handleChangeDate}
        onChangeFilter={handleChangeFilter}
        onInsert={handlePersist}
        filter={filter}
      />

      {filteredTransactions.length === 0 && <Preloader />}
      {filteredTransactions.length > 0 && (
        <TransactionsControl
          transactions={filteredTransactions}
          transactionsCount={filteredTransactions.length}
          onDelete={handleDelete}
          onPersist={handlePersist}
        />
      )}
      {isModalOpen && (
        <Modal
          onSave={handlePersistData}
          onClose={handleClose}
          selectedTransaction={selectedTransaction}
        />
      )}
    </div>
  )
}
