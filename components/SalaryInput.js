const SalaryInput = ({ salary, setSalary, setCurrency, period, setPeriod }) => {
  return (
    <div className="flex items-start">
      <select
        id="period"
        onChange={({ target: { value } }) => setPeriod(value)}
        value={period}
      >
        <option value="h">Hourly</option>
        <option value="m">Monthly</option>
        <option value="y">Yearly</option>
      </select>

      <input
        id="monthly-salary"
        name="monthly-salary"
        type="number"
        value={salary}
        onChange={({ target: { value } }) =>
          setSalary(() => parseInt(value, 10))
        }
        placeholder="Salary"
        pattern="/\d*/"
      />
      <select
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
export default SalaryInput;
