import React, { useState, useEffect } from "react";
import axios from "axios";

function Khata() {
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pendingAmount, setPendingAmount] = useState("");

  const [paymentAmount, setPaymentAmount] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/customers"
      );

      setCustomers(response.data);
    } catch (error) {
      console.log("Customers error:", error);
    }
  };

  const addCustomer = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/customers", {
        name: name,
        phone: phone,
        pendingAmount: Number(pendingAmount),
      });

      setName("");
      setPhone("");
      setPendingAmount("");

      fetchCustomers();

      alert("Customer added successfully!");
    } catch (error) {
      console.log("Add customer error:", error);

      alert(
        error.response?.data?.message ||
          "Customer add nahi hua."
      );
    }
  };

  const makePayment = async (id) => {
    const amount = Number(paymentAmount[id]);

    if (!amount || amount <= 0) {
      alert("Valid payment amount enter karo.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/customers/${id}/payment`,
        {
          amount: amount,
        }
      );

      setPaymentAmount({
        ...paymentAmount,
        [id]: "",
      });

      fetchCustomers();

      alert("Payment updated successfully!");
    } catch (error) {
      console.log("Payment error:", error);

      alert(
        error.response?.data?.message ||
          "Payment update nahi hua."
      );
    }
  };

  return (
    <div className="khata">
      <h1>Customer Khata</h1>

      <div className="inventory-form">
        <h2>Add Customer</h2>

        <form onSubmit={addCustomer}>
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="number"
            placeholder="Pending Amount"
            min="0"
            value={pendingAmount}
            onChange={(e) =>
              setPendingAmount(e.target.value)
            }
            required
          />

          <button type="submit">
            Add Customer
          </button>
        </form>
      </div>

      <div className="inventory-list">
        <h2>Customers</h2>

        {customers.length === 0 ? (
          <p>No customers added yet.</p>
        ) : (
          customers.map((customer) => (
            <div
              className="customer-card"
              key={customer._id}
            >
              <h3>{customer.name}</h3>

              <p>
                <strong>Phone:</strong>{" "}
                {customer.phone || "Not provided"}
              </p>

              <p>
                <strong>Pending:</strong> ₹
                {customer.pendingAmount || 0}
              </p>

              <input
                type="number"
                placeholder="Payment Amount"
                min="1"
                value={paymentAmount[customer._id] || ""}
                onChange={(e) =>
                  setPaymentAmount({
                    ...paymentAmount,
                    [customer._id]: e.target.value,
                  })
                }
              />

              <button
                onClick={() =>
                  makePayment(customer._id)
                }
              >
                Record Payment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Khata;