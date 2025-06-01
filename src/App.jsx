import { useState, useEffect } from "react";
import InputBox from "./components/InputBox"; // Custom input component for currency and amount
import useCurrencyInfo from "./hooks/useCurrencyInfo"; // Hook to fetch currency conversion rates
import BackgroundImage from "./assets/bg.jpg"; // Background image for the app
import { PacmanLoader } from "react-spinners"; // Loading spinner component
import "./App.css";

function App() {
  // State to track if loading spinner should show
  const [loading, setLoading] = useState(true);

  // State to store the user input amount
  const [amount, setAmount] = useState(null);

  // State for the "from" currency (default USD)
  const [from, setFrom] = useState("usd");

  // State for the "to" currency (default INR)
  const [to, setTo] = useState("inr");

  // State for the converted amount based on exchange rate
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Fetch currency info/rates based on "from" currency using custom hook
  const currencyInfo = useCurrencyInfo(from);

  // Extract currency codes from the fetched data for dropdown options
  const options = Object.keys(currencyInfo || {});

  // On component mount, show loader for 2.5 seconds then hide it
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Clear timeout if component unmounts before timeout completes
    return () => clearTimeout(timer);
  }, []);

  // Whenever amount, from, to, or currencyInfo changes, calculate converted amount
  useEffect(() => {
    if (currencyInfo && currencyInfo[to] && amount !== null) {
      // Multiply input amount by the rate of "to" currency, round to 2 decimals
      setConvertedAmount((amount * currencyInfo[to]).toFixed(2));
    } else {
      // Reset converted amount if data is missing
      setConvertedAmount(null);
    }
  }, [amount, from, to, currencyInfo]);

  // Function to swap the selected currencies between "from" and "to"
  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // Optional manual conversion triggered on form submit
  const convert = () => {
    if (currencyInfo && currencyInfo[to] && amount !== null) {
      setConvertedAmount((amount * currencyInfo[to]).toFixed(2));
    }
  };

  // Show loading spinner while loading state is true
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {/* PacmanLoader with increased size for better visibility */}
        <PacmanLoader color="rgb(1 129 46)" size={30} />
      </div>
    );
  }

  // Main UI rendering after loading completes
  return (
    <div
      className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${BackgroundImage})`, // Set background image
      }}
    >
      <div className="w-full">
        {/* Container box with max width, padding, rounded corners, blurred semi-transparent background */}
        <div className="w-full max-w-lg mx-auto border border-gray-300 rounded-2xl p-8 backdrop-blur-sm bg-white/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert(); // Convert currencies on form submit
            }}
          >
            {/* Input for "From" currency and amount */}
            <div className="w-full mb-4">
              <InputBox
                label="From"
                amount={amount}
                onAmountChange={(value) => {
                  if (value >= 0) setAmount(value); // Prevent negative input
                }}
                onCurrencyChange={(currency) => setFrom(currency)}
                currencyOption={options}
                selectCurrency={from}
              />
            </div>

            {/* Swap button positioned between the two inputs */}
            <div className="relative w-full h-0.5 mb-6">
              <button
                onClick={swap}
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-lg bg-blue-700 text-white px-5 py-2 text-lg"
              >
                Swap
              </button>
            </div>

            {/* Input for "To" currency and converted amount (amount input disabled) */}
            <div className="w-full mb-6">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOption={options}
                onCurrencyChange={(currency) => setTo(currency)}
                amountDisable // Disable manual typing in "To" amount
                selectCurrency={to}
              />
            </div>

            {/* Submit button with larger font and padding */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white px-6 py-4 rounded-2xl text-2xl font-semibold"
            >
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
