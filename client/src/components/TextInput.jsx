// ** React Imports
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MDBInput } from "mdb-react-ui-kit";
const TextFieldComp = (props) => {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    if (props.onChange && !props.realValue) {
      props.onChange(value);
    } else {
      console.log("No onChange");
    }
  }, [value]);
  return (
    <div className="p-2">
      <MDBInput
        label={props.label}
        value={value}
        onChange={(e) => {
          props.realValue
            ? props.onChange(e.target.value)
            : setValue(e.target.value);
        }}
        type="text"
        {...props.buttonProps}
      />
    </div>
  );
};

export default TextFieldComp;
