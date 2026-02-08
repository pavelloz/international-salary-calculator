import Link from "next/link";
import useRatesStore from "../stores/useRatesStore";

export default () => {
  const { rates, fetchedAt, currency } = useRatesStore();

  const formattedFetchedAt = new Date(fetchedAt).toLocaleTimeString();
  const selectedRate = rates[currency];

  return (
    <div className="border-t border-gray-600">
      <p className="pt-0 italic text-sm">
        1 PLN = {selectedRate} {currency.toUpperCase()} (last updated at:{" "}
        {formattedFetchedAt} from{" "}
        <Link className="font-normal" href="https://nbp.pl/en/" target="_blank">
          NBP API
        </Link>
        )
      </p>
    </div>
  );
};
