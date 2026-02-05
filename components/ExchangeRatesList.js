const ExchangeRatesList = ({ rates, fetchedAt }) => {
  if (!rates) {
    return <div>Loading...</div>;
  }

  const formattedFetchedAt = new Date(fetchedAt).toLocaleTimeString();

  return (
    <div>
      <h3>Exchange rates (last updated at: {formattedFetchedAt})</h3>
      <ul>
        {Object.keys(rates).map((rate) => {
          return (
            <li key={rate}>
              {rate.toUpperCase()}: {rates[rate]}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExchangeRatesList;
