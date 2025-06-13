import React from "react";
import Alert from "react-bootstrap/Alert";
import styles from "../styles/FieldAlerts.module.css"; // adjust path if needed

const FieldAlerts = ({ messages, variant = "warning" }) => {
  // Converts "success" → "Success", "warning" → "Warning"
  const styleClass = styles[variant.charAt(0).toUpperCase() + variant.slice(1)];

  return (
    <>
      {messages?.map((message, idx) => (
        <Alert
          key={idx}
          variant={variant}
          className={`mt-2 py-1 ${styleClass}`}
        >
          {message}
        </Alert>
      ))}
    </>
  );
};

export default FieldAlerts;
