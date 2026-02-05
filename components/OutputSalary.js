const OutputSalary = ({ salary, rates, currency }) => {
  // TODO: Add contract type selector
  // TODO: Add est. gross, net

  if (!rates) return null;

  const monthlySalary = () => parseInt(salary * rates[currency], 10);
  const yearlySalary = () => parseInt(monthlySalary() * 12, 10);
  const hourlySalary = () => parseInt(monthlySalary() / 160, 10);
  const dailySalary = () => parseInt(hourlySalary() * 8, 10);

  return (
    <div className="container px-4 md:px-0 max-w-6xl mx-auto">
      <p>Hourly: {hourlySalary() || 0} PLN</p>
      <p>Daily: {dailySalary() || 0} PLN</p>
      <p>Monthly: {monthlySalary() || 0} PLN</p>
      <p>Yearly: {yearlySalary() || 0} PLN</p>
    </div>
  );
};

export default OutputSalary;
