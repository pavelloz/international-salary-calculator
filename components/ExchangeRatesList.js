const ExchangeRatesList = ({ rates }) => {
  return (
    <div>
      <h3>Rates</h3>
      <ul>
        {Object.keys(rates).map((rate) => {
          return (
            <li key={rate}>
              {rate}: {rates[rate]}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExchangeRatesList;
