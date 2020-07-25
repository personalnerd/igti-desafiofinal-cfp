import React from 'react'
import styles from './Header.module.css'
import {PERIODS} from '../helpers/periods';
import {formatSelectDate} from '../helpers/formatDate';

export default function Header( {currentPeriod, onSelectChange, onChangeFilter, filter, onInsert} ) {

  const handleSelectChange = (event) => {
    onSelectChange(event.target.value)
  }


  const handleDownSelect = () => {
    const select = document.getElementById('selectDate');
      select.selectedIndex--;
      onSelectChange(select.value);
  }

  const handleUpSelect = () => {
    const select = document.getElementById('selectDate');
      select.selectedIndex++;
      onSelectChange(select.value);
  }

  const handleInputChange = (event) => {
    const newText = event.target.value;
    onChangeFilter(newText);
    
    // desabilita o botão inserir enquanto está filtrando
    const btnInserir = document.getElementById('btnInserir');
    if (newText) {      
      btnInserir.setAttribute('disabled', 'disabled');
    } else {
      btnInserir.removeAttribute('disabled');
    }
  }


  const handleButtonInsert = () => {
			onInsert();
  }
  
  

  return (
    <div className="container">

      <div className="center">
        <h1>Bootcamp Full Stack - Desafio Final</h1>
        <h2>Controle Financeiro Pessoal</h2>
      </div>

      <div className={`center ${styles.datePicker}`}>
        <button className="btn-small" onClick={handleDownSelect}><i className="material-icons">chevron_left</i></button>

        <div className={styles.selectDate}>
        <select id="selectDate" className="browser-default" onChange={handleSelectChange}>
          
          {PERIODS.map(period => {
              if (period !== currentPeriod) {
                return <option value={period}>{formatSelectDate(period)}</option>
              } else {
                return <option value={period} selected>{formatSelectDate(period)}</option>
              }
          })}
        </select>
        </div>

        <button className="btn-small" onClick={handleUpSelect}><i className="material-icons">chevron_right</i></button>

      </div>

      <div className={styles.divFiltro}>
				<div>
					<input placeholder="Filtro" id="first_name" type="text" class="active" value={filter} onChange={handleInputChange}/>
				</div>
				<div className="center-align">
					<button className="btn" id="btnInserir" onClick={handleButtonInsert}><i className="material-icons" style={{ "line-height": "1" }}>+</i> Novo Lançamento</button>
				</div>
			</div>

    </div>
  )
}
