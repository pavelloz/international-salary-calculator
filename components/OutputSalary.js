const OutputSalary = ({ hourlySalary, dailySalary, monthlySalary, yearlySalary }) => {
  // TODO: Add contract type selector
  // TODO: Add est. gross, net

  if (!hourlySalary || !dailySalary || !monthlySalary || !yearlySalary) {
    return <div>Please provide salary in given currency</div>;
  }

  return (
    <div className="container px-4 md:px-0 max-w-6xl mx-auto">
      <p>Hourly: {hourlySalary} PLN</p>
      <p>Daily: {dailySalary} PLN</p>
      <p>Monthly: {monthlySalary} PLN</p>
      <p>Yearly: {yearlySalary} PLN</p>
    </div>
  );
};

export default OutputSalary;
