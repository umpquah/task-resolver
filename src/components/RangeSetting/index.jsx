import { useState } from "react";
import { Form } from "react-bootstrap";

const RangeSetting = ({ label, min, max }) => {
  return (
    <div>
      <h3>{label}</h3>
        <Form className="d-flex">
        <Form.Control
          type="number"
          defaultValue={min}
        />
        &nbsp;&hArr;&nbsp;
        <Form.Control
          type="number"
          defaultValue={max}
        />
      </Form>
    </div>
  )
};

export default RangeSetting;
