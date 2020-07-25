import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './ModalTransaction.module.css';

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
  }
};
const radioStyle = {
  padding: '15px 0px',
  'border-bottom': '1px solid #bdbdbd'
};
const divErrorMessage = {
  margin: '-20px 0 10px 0',
}

Modal.setAppElement('#root');

export default function ModalTransaction({ onSave, onClose, selectedTransaction }) {  

  const { description, value, category, year, month, day, yearMonth, yearMonthDay, type } = selectedTransaction;

  const [transaction, setTransaction] = useState(selectedTransaction);

  const [errorMessage, setErrorMessage] = useState('');

  // caso esteja inserindo uma nova transação, valores padrão: despesa e data de hoje
  if (!transaction.type) {
    transaction.type = '-'
  }

  if (!transaction.yearMonthDay) {
    const hoje = new Date();
    const a = hoje.getFullYear();
    const mm = hoje.getMonth()+1;
    const m = mm.toString().padStart(2,'0');
    const d = hoje.getDate().toString().padStart(2,'0');
    transaction.yearMonthDay = `${a}-${m}-${d}`;
  }  

  // validar campos preenchidos
  useEffect(() => {
    if (transaction.description &&
      transaction.value &&
      (transaction.value > 0) &&
      transaction.category &&
      transaction.yearMonthDay &&
      transaction.type) {
        setErrorMessage('');
      return;
    }
      setErrorMessage('Todos os campos devem ser preenchidos. O valor não pode ser negativo ou zero.');
  }, [transaction])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  })

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  }

  const handleClose = () => {
    onClose(null)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSave(transaction);
  }

  const handleFormChange = (event) => {
    const { id, value } = event.target;
    setTransaction({ ...transaction, [id]: value });
  }

  return (
    <div>
      <Modal isOpen={true} style={modalStyle}>

        <div className={styles.modalTitle}>
          <span>Edição de Lançamento</span>
          <button className="right waves-effect waves-light btn-small red dark-4" onClick={handleClose}><i className="material-icons">close</i></button>
        </div>


        <form className={`row ${styles.formInputs}`} onSubmit={handleFormSubmit}>
          <div className="row" style={radioStyle}>
            <label className="col s6 center-align">
              <input className={`with-gap ${styles.radioRed}`} id="type" name="tipo" type="radio" onChange={handleFormChange} required checked={transaction.type === '-' && 'checked'} value="-" />
              <span>Despesa</span>
            </label>

            <label className="col s6 center-align">
              <input className="with-gap" id="type" name="tipo" type="radio" onChange={handleFormChange} required checked={transaction.type === '+' && 'checked'} value="+" />
              <span>Receita</span>
            </label>
          </div>

          <div className="input-field col s12">
            <input id="description" type="text" onChange={handleFormChange} required value={transaction.description} />
            <label htmlFor="description" className="active">Descrição:</label>
          </div>

          <div className="input-field col s12">
            <input id="category" type="text" onChange={handleFormChange} required value={transaction.category} />
            <label htmlFor="category" className="active">Categoria:</label>
          </div>

          <div className="row">
            <div className="input-field col s6">
              <input id="value" type="number" min='0' onChange={handleFormChange} required value={transaction.value} />
              <label htmlFor="value" className="active">Valor:</label>
            </div>
            <div className="input-field col s6">
              <input id="yearMonthDay" placeholder="Data" type="date" onChange={handleFormChange} required value={transaction.yearMonthDay} />
              <label htmlFor="yearMonthDay" className="active">Data:</label>
            </div>
          </div>
          
          <div className="center-align red-text" style={divErrorMessage}>
            {errorMessage}
          </div>

          <div className={`right-align ${styles.formButtons}`}>
            <button type="button" className="waves-effect waves-light btn-small grey" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="waves-effect waves-light btn-small" disabled={errorMessage.trim() !== ''}>Salvar</button>
          </div>          

        </form>
      </Modal>
    </div>
  )
}
