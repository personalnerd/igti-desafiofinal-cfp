import axios from 'axios';

const API_URL = 'http://localhost:3001/api/transaction';


async function getTransactions(period) {
    const res = await axios.get(API_URL+'?period='+period);
    const transactions = res.data.map((transaction) => {
        return {
            ...transaction,
        }
    })
    return transactions;
}

async function deleteTransaction(id) {
    const res = await axios.delete(API_URL+'/delete?id='+id);
    return res;
}

async function updateTransaction(transaction) {
	const data = transaction;
	const headers = { "Content-Type" : "application/json" };
	const res = await axios.patch(API_URL+'/update', data, headers);
	return res;
}

async function insertTransaction(transaction) {
    const data = transaction;
	const headers = { "Content-Type" : "application/json" };
	const res = await axios.post(API_URL+'/insert', data, headers);
	return res;
}



export { getTransactions, deleteTransaction, updateTransaction, insertTransaction };