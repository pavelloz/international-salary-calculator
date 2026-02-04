const SalaryInput = ({ salary, setSalary, setCurrency, period, setPeriod }) => {
  const isNumber = (value) => {
    return !isNaN(parseInt(value, 10));
  }
  return (
    <div className="flex justify-between">
      {/* This select doesnt work. Fix it */}
      <select
        className="space-x-4"
        id="period"
        onChange={({ target: { value } }) => setPeriod(value)}
        value={period}
      >
        <option value="h">Hourly</option>
        <option value="m">Monthly</option>
        <option value="y">Yearly</option>
      </select>

      <input
        className="space-x-4"
        id="monthly-salary"
        name="monthly-salary"
        value={salary}
        onChange={({ target: { value } }) => {
          if (value === '' || isNumber(value) === false) {
            setSalary(0)
          } else {
            setSalary(() => parseInt(value, 10))
          }
        }}
        placeholder="Salary"
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
export default SalaryInput;
