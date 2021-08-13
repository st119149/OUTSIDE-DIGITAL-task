import React from 'react';

import Popup from '../Popup/Popup';
import './App.scss';

function App() {

  const [popupIsActive, setPopupIsActive] = React.useState(false);

  const [taxDeductionHistory, setTaxDeductionHistory] = React.useState({});

  React.useEffect(() => console.log(taxDeductionHistory), [taxDeductionHistory]);

  const addToHistory = item => {
    setTaxDeductionHistory({
      ...taxDeductionHistory,
      [Object.keys(taxDeductionHistory).length]: item
    });
  }

  const onShowPopup = () => setPopupIsActive(true);

  const onClosePopup = () => setPopupIsActive(false);

  return (
    <div className={popupIsActive ? "wrapper opened" : "wrapper"}>

      <div className={popupIsActive ? "wrapper__popup active" : "wrapper__popup"}>
        <Popup addToHistory={addToHistory} onClosePopup={onClosePopup} />
      </div>

      <button
        onClick={onShowPopup}
        className={!popupIsActive ? "button button_outline wrapper__button active" : "button button_outline wrapper__button"}
      >Налоговый вычет</button>


    </div>
  )
}

export default App;