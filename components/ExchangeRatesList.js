import useRatesStore from "../stores/useRatesStore";

export default () => {
  const rates = useRatesStore((state) => state.rates);
  const currency = useRatesStore((state) => state.currency);

  const selectedRate = rates[currency];

  return (
    <div className="border-t border-gray-500 mt-4 pt-4">
      <p className="pt-0 italic text-sm">
        1 PLN = {selectedRate} {currency.toUpperCase()}
      </p>
    </div>
  );
};
