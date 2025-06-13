import React from "react";
import Alert from "react-bootstrap/Alert";

const FieldAlerts = ({ messages, variant = "warning" }) => {
  return (
    <>
      {messages?.map((message, idx) => (
        <Alert variant={variant} key={idx} className="mt-2 py-1">
          {message}
        </Alert>
      ))}
    </>
  );
};

export default FieldAlerts;
