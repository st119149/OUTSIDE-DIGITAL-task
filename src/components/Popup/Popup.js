import React from 'react';

import './Popup.scss';

function Popup({ addToHistory, onClosePopup }) {

  const [salary, setSalary] = React.useState('');
  const [years, setYears] = React.useState([]);
  const [decreased, setDecreased] = React.useState(null);

  const [salaryDirty, setSalaryDirty] = React.useState(false);
  const [decreasedDirty, setDecreasedDirty] = React.useState(false);

  const [salaryError, setSalaryError] = React.useState('Поле обязательно для заполнения');
  const [decreasedError, setDecreasedError] = React.useState('Обязательно для заполнения');

  const [formValid, setFormValid] = React.useState(false);

  React.useEffect(() => {
    if (salaryError || decreasedError)
      setFormValid(false);
    else
      setFormValid(true);
  }, [salaryError, decreasedError]);

  const blurHandler = e => {
    switch (e.target.name) {
      case 'salary':
        setSalaryDirty(true)
        break;
      case 'decreased':
        setDecreasedDirty(true);
        break
      default:
        break;
    }
  }

  const salaryHandler = e => {
    const value = e.target.value;
    setSalary(value);
    if (Number(value) > 4999)
      setSalaryError('');
    else
      setSalaryError('Некорректные данные')
  }

  const decreasedHandler = e => {
    setDecreased(e.target.value);
    setDecreasedError('');
  }

  const yearsHandler = e => {
    setYears(prev => {
      const index = Number(e.target.value);
      return [
        ...prev.slice(0, index),
        {
          ...prev[index],
          earlyRepayment: e.target.checked
        },
        ...prev.slice(index + 1)
      ]
    });
  };

  const calculateTaxDeduction = e => {
    e.preventDefault();

    if (!salaryError) {
      const maxSumDeduction = 260000;
      const maxYearDeduction = Math.round(salary * 12 * 0.13);
      const yearsCount = Math.ceil(260000 / maxYearDeduction);
      const years = [];
      for (let i = 1; i <= yearsCount; i++) {
        if (i !== yearsCount)
          years.push({
            year: i,
            maxYearDeduction,
            earlyRepayment: false
          })
        else
          years.push({
            year: i,
            maxYearDeduction: maxSumDeduction - maxYearDeduction * (yearsCount - 1),
            earlyRepayment: false
          })
      }
      setYears(years);
    }
    else
      setSalaryDirty(true);
  }

  const HistoryHandler = e => {
    e.preventDefault();
    if (!salaryError && !decreasedError)
      addToHistory({
        salary,
        years,
        decreased
      });
    else {
      setSalaryDirty(true);
      setDecreasedDirty(true);
    }
  }

  const salaryClassName = salaryDirty && salaryError ?
    "input popup__input input__error" :
    "input popup__input";

  return (
    <div className="popup">

      <h3 className="popup__title">Налоговый вычет</h3>

      <p className="popup__descr">Используйте налоговый вычет чтобы погасить ипотеку досрочно. Размер налогового вычета составляет не более 13% от своего официального годового дохода.</p>

      <form action="#">
        <div className={salaryClassName}>
          <label className="input-label" htmlFor="input">Ваша зарплата в месяц</label>
          <input
            required
            type="text" id="input"
            placeholder="Введите данные"
            name="salary"
            value={salary}
            onChange={salaryHandler}
            onBlur={blurHandler}
          />
          <label className="input-error">{salaryError}</label>
        </div>

        <button className="text-button popup__text-button" onClick={calculateTaxDeduction}>Рассчитать</button>

        {
          !years.length ?
            null :
            <div className="popup__checkboxes">
              <h2>Итого можете внести в качестве досрочных:</h2>
              <div className="popup__wrapper">
                {
                  years.map((item, index) => (
                    <div className="popup__checkbox" key={index}>
                      <input
                        className="checkbox"
                        type="checkbox"
                        id={`checkbox${index}`}
                        onChange={yearsHandler}
                        value={index}
                      />
                      <label htmlFor={`checkbox${index}`}></label>
                      <label className="popup__checkbox-label" htmlFor={`checkbox${index}`}>
                        {item.maxYearDeduction} рублей
                        <span> в {item.year}-ый год</span>
                      </label>
                    </div>
                  ))
                }
              </div>
            </div>
        }

        <div className="popup__radio">
          <span>Что уменьшаем?</span>

          <input
            required
            className="tag"
            type="radio"
            id="tag1"
            value="payment"
            name="decreased"
            onChange={decreasedHandler}
            onBlur={blurHandler}
          />
          <label htmlFor="tag1">Платёж</label>

          <input
            required
            className="tag"
            type="radio"
            id="tag2"
            value="period"
            name="decreased"
            onChange={decreasedHandler}
            onBlur={blurHandler}
          />
          <label htmlFor="tag2">Срок</label>

          {
            (decreasedError && decreasedDirty) &&
            <div className="radio-error">{decreasedError}</div>
          }
        </div>

        <button
          type="submit"
          className="button popup__button"
          onClick={HistoryHandler}
          disabled={formValid ? false : true}
        >Добавить</button>
      </form>
      
      <button className="popup__close" onClick={onClosePopup}></button>

    </div>
  )
}

export default Popup;