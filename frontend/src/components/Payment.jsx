import React, { useState } from "react";

function Payment() {
  const [method, setMethod] = useState("");
  const [paid, setPaid] = useState(false);

  const handlePayment = () => {
    if (!method) {
      alert("Payment method select karo.");
      return;
    }

    setPaid(true);
  };

  return (
    <div className="payment">
      <h1>💳 Online Payment</h1>

      <div className="payment-box">
        <h2>Select Payment Method</h2>

        <label>
          <input
            type="radio"
            name="payment"
            value="PhonePe"
            onChange={(e) => setMethod(e.target.value)}
          />
          📱 PhonePe
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="payment"
            value="Google Pay"
            onChange={(e) => setMethod(e.target.value)}
          />
          🟢 Google Pay
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="payment"
            value="Paytm"
            onChange={(e) => setMethod(e.target.value)}
          />
          🔵 Paytm
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="payment"
            value="UPI"
            onChange={(e) => setMethod(e.target.value)}
          />
          🇮🇳 UPI
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="payment"
            value="Card"
            onChange={(e) => setMethod(e.target.value)}
          />
          💳 Debit / Credit Card
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="payment"
            value="Net Banking"
            onChange={(e) => setMethod(e.target.value)}
          />
          🏦 Net Banking
        </label>

        <br />
        <br />

        <button onClick={handlePayment}>
          Pay Now
        </button>

        {paid && (
          <div className="payment-success">
            <h2>✅ Payment Successful!</h2>
            <p>Payment Method: {method}</p>
            <p>Order placed successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;