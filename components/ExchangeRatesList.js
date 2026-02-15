import useRatesStore from "../stores/useRatesStore";

export default () => {
  const rates = useRatesStore((state) => state.rates);
  const currency = useRatesStore((state) => state.currency);

  const selectedRate = rates[currency];

  return (
    <>
      <p className="pt-0 italic text-sm">
        1 PLN = {selectedRate} {currency.toUpperCase()}
      </p>
    </>
  );
};
