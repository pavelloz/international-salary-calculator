export const getExchangeRates = async () => {
  const response = await fetch("/api/getRates", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rates: ${response.statusText}`);
  }

  return await response.json();
};
