import useRatesStore from "../stores/useRatesStore";

export default () => {
  const { salary, setSalary, setCurrency, period, setPeriod } = useRatesStore();

  const isNumber = (value) => {
    return !isNaN(parseInt(value, 10));
  };
  return (
    <div className="flex justify-between flex-wrap pb-8">
      <h3 className="w-full">Salary in foreign currency</h3>
      <select
        className="space-x-4"
        id="period"
        onChange={({ target: { value } }) => {
          setPeriod(value);
        }}
        value={period}
      >
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <input
        className="space-x-4"
        id="monthly-salary"
        name="monthly-salary"
        defaultValue={salary || 0}
        onChange={({ target: { value } }) => {
          if (value === "" || isNumber(value) === false) {
            setSalary(0);
          } else {
            setSalary(parseInt(value, 10));
          }
        }}
        pattern="/\d*/"
      />
      <select
        className="space-x-4"
        id="currency"
        onChange={({ target: { value } }) => setCurrency(value)}
      >
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
        <option value="gbp">GBP</option>
        <option value="chf">CHF</option>
      </select>
    </div>
  );
};
