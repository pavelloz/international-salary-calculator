const OutputSalary = ({ hourlySalary, monthlySalary, yearlySalary }) => {
  // TODO: Add contract type selector
  // TODO: Add est. gross, net
  return (
    <div className="container px-4 md:px-0 max-w-6xl mx-auto">
      <p>Hourly: {hourlySalary} PLN</p>
      <p>Monthly: {monthlySalary} PLN</p>
      <p>Yearly: {yearlySalary} PLN</p>
    </div>
  );
};

export default OutputSalary;
