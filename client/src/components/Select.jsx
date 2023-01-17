// ** React Imports
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { MDBInput } from "mdb-react-ui-kit";
const SelectComp = (props) => {
  return (
    <div className="p-2">
      <div style={{ fontSize: "14px", fontWeight: 400, lineHeight: "20px" }}>
        {props.label}
      </div>
      <Select
        className="basic-single"
        classNamePrefix="select"
        name='select'
        aria-label={props.label}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(val) => {
          props.onChange && props.onChange(val.value);
        }}
        options={props.options}
      />
    </div>
  );
};

export default SelectComp;
