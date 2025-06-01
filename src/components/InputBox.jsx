import React, { useId } from "react";

function InputBox({
  label, // Label text for the input
  amount, // Amount value shown in the input box
  onAmountChange, // Callback to update amount state in parent
  onCurrencyChange, // Callback to update currency selection in parent
  currencyOption = [], // List of currency codes for dropdown
  selectCurrency = "usd", // Currently selected currency
  amountDisable = false, // Whether to disable the amount input
  currencyDisable = false, // Whether to disable the currency dropdown
  className = "", // Additional CSS classes
}) {
  // Unique id for label-input association (accessibility)
  const amountInputId = useId();

  return (
    <div
      className={`bg-white p-8 rounded-2xl text-base flex gap-6 ${className}`} // Container styling with padding and rounded corners
    >
      {/* Amount input field and label */}
      <div className="w-1/2">
        <label
          htmlFor={amountInputId}
          className="text-black/70 mb-3 inline-block text-lg" // Larger, readable label
        >
          {label}
        </label>
        <input
          id={amountInputId}
          className="outline-none w-full bg-transparent py-3 text-2xl" // Bigger input box text and padding
          type="number"
          placeholder="Amount"
          disabled={amountDisable} // Disable input if needed (like for converted amount)
          value={amount}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0) {
              onAmountChange && onAmountChange(value); // Only allow non-negative numbers
            }
          }}
        />
      </div>

      {/* Currency selection dropdown */}
      <div className="w-1/2 flex flex-wrap justify-end text-right">
        <p className="text-black/70 mb-3 w-full text-lg">Currency Type</p>
        <select
          className="rounded-xl px-3 py-3 bg-gray-100 text-xl" // Bigger dropdown font and padding
          value={selectCurrency}
          onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
          disabled={currencyDisable} // Disable dropdown if needed
        >
          {/* Map over currency options to create dropdown entries */}
          {currencyOption.map((cur) => (
            <option key={cur} value={cur}>
              {cur.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default InputBox;
