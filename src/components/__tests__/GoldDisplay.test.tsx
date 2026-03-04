import { render, screen } from "@solidjs/testing-library";
import { formatInGold } from "../../lib/calculateSalaries";
import { $ratesStore } from "../../stores/rates";
import GoldDisplay from "../GoldDisplay";

describe("GoldDisplay Component", () => {
  beforeEach(() => {
    $ratesStore.set({
      rates: { pln: 1 },
      goldPrice: 10000,
      loading: false,
    });
  });

  test("renders correctly for positive gold value", () => {
    // 10000 PLN / 10000 PLN/oz = 1 oz
    render(() => <GoldDisplay valueInPln={10000} />);
    expect(screen.getByText(new RegExp(`${formatInGold(1)} oz of gold`, "i"))).toBeInTheDocument();
  });

  test("does not render when gold value is zero", () => {
    render(() => <GoldDisplay valueInPln={0} />);
    expect(screen.queryByText(/oz of gold/i)).not.toBeInTheDocument();
  });

  test("does not render when gold value is negative", () => {
    render(() => <GoldDisplay valueInPln={-5000} />);
    expect(screen.queryByText(/oz of gold/i)).not.toBeInTheDocument();
  });

  test("renders range correctly when valueInPlnMax is provided", () => {
    // 10000 PLN / 10000 = 1 oz
    // 20000 PLN / 10000 = 2 oz
    render(() => <GoldDisplay valueInPln={10000} valueInPlnMax={20000} />);
    const minText = formatInGold(1);
    const maxText = formatInGold(2);
    expect(screen.getByText(new RegExp(`${minText} - ${maxText} oz of gold`, "i"))).toBeInTheDocument();
  });
});
