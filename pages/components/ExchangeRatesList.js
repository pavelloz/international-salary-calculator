import useRatesStore from "../stores/useRatesStore";

export default () => {
  const rates = useRatesStore((state) => state.rates);
  const fetchedAt = useRatesStore((state) => state.fetchedAt);
  const currency = useRatesStore((state) => state.currency);

  const formattedFetchedAt = new Date(fetchedAt).toLocaleTimeString();
  const selectedRate = rates[currency];

  return (
    <>
      <p
        className="pt-0 italic text-sm"
        title={`Updated at ${formattedFetchedAt}`}
      >
        1 PLN = {selectedRate} {currency.toUpperCase()}
      </p>
    </>
  );
};
