import React from 'react';
import styles from './TransactionsControl.module.css';
import { formatDate } from '../helpers/formatDate.js';
import Action from './Action';
import formatReal from '../helpers/formatReal';

export default function TransactionsControl({ transactions, onDelete, onPersist, transactionsCount }) {

	const tableTransactions = [];

	let currentDate = transactions[0].yearMonthDay;
	let currentTransactions = [];
	let id = 1;

	transactions.forEach(transaction => {
		if (transaction.yearMonthDay !== currentDate) {
			tableTransactions.push({
				id: id++,
				yearMonthDay: currentDate,
				transactions: currentTransactions,
			});
			currentDate = transaction.yearMonthDay;
			currentTransactions = [];
		}
		currentTransactions.push(transaction)
	});

	/**
	 * após o loop, inserir o último elemento
	 */
	tableTransactions.push({
		id: id++,
		yearMonthDay: currentDate,
		transactions: currentTransactions,
	})


	/**
	 * status
	 */

	// separar receitas de despesas
	const transactionsRec = transactions.filter(transaction => transaction.type === '+');
	const transactionsDesp = transactions.filter(transaction => transaction.type === '-');

	// cálculo de receitas e despesas
	const transactionsRecSum = transactionsRec.reduce((acc, curr) => {
		return acc + curr.value
	}, 0);
	const transactionsDespSum = transactionsDesp.reduce((acc, curr) => {
		return acc + curr.value
	}, 0);

	// cálculo do saldo
	let type = null;
	const transactionsSaldo = transactionsRecSum - transactionsDespSum;
	if (transactionsSaldo < 0) {
		type = '-';
	} else { type = '+' };


	const handleActionClick = (id, type) => {

		const transaction = transactions.find(transaction => transaction._id === id);

		if (type === 'delete') {
			onDelete(transaction);
		} else if (type === 'edit') {
			onPersist(transaction);
		}

	}

	return (

		<div className={`container ${styles.listGroup}`}>

			<div className={`row ${styles.divStatus}`}>

				<div className={`col s12 m6 l3 center-align ${styles.linhaQuant}`}>Lançamentos: <span>{transactionsCount}</span></div>
				<div className={`col s12 m6 l3 center-align ${styles.linhaReceitas}`}>Receitas: <span className="teal-text text-darken-3">+ {formatReal(transactionsRecSum)}</span></div>
				<div className={`col s12 m6 l3 center-align ${styles.linhaDespesas}`}>Despesas: <span className="red-text text-darken-3">- {formatReal(transactionsDespSum)}</span></div>
				<div className={`col s12 m6 l3 center-align ${styles.linhaSaldo}`}>Saldo: <span className={`text-darken-3 ${type === '-' ? 'red-text' : 'teal-text'}`}>{formatReal(transactionsSaldo)}</span></div>

			</div>

			{tableTransactions.map(({ id, yearMonthDay, transactions }) => {
				return (
					<div key={id} className={styles.dateGroup}>
						<div className={styles.listDate}>{formatDate(yearMonthDay)}</div>

						{transactions.map(({ _id, description, category, type, value }) => {

							const classValue = type === '+' ? 'teal-text text-darken-3' : 'red-text text-darken-4';

							return (
								<div key={_id} className={`row ${styles.listLine} ${type === '-' ? styles.linhaDespesa : styles.linhaReceita}`}>
									<div className={`col l7 m7 s12 ${styles.listDescription}`}>{description}</div>
									<div className={`col l2 m2 s6 grey-text ${styles.listcategory}`}>{category}</div>
									<div className={`col l2 m3 s6 right-align ${classValue} ${styles.listValue}`}>{type} {formatReal(value)}</div>
									<div className={`col l1 m12 s12 right-align ${styles.listButtons}`}>
										<Action onActionClick={handleActionClick} id={_id} type="edit" />
										<Action onActionClick={handleActionClick} id={_id} type="delete" />
									</div>
								</div>
							)
						})}

					</div>
				)
			})}
		</div>
	)
}
