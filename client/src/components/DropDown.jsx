import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import { MainContext } from "@contexts/main";
import SelectComp from "@components/Select";
import { isUserLoggedIn, getUserData, guidGenerator } from "@utils";
import TextInput from "@components/TextInput";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "react-bootstrap/Spinner";
import {
  faCoffee,
  faCaretUp,
  faCaretDown,
  faSkull,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router";
const Dropdown = (props) => {
  const { children, label } = props;
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <div>
        <h6
          style={{ float: "left", cursor: "pointer", lineHeight: "10px" }}
          onClick={() => {
            setOpen(!open);
          }}
        >
          {label}
        </h6>
        <div style={{ width: "100%", paddingTop: "25px" }}>
          <span
            style={{ float: "right", cursor: "pointer" }}
            className="p-2"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? (
              <MDBIcon fas icon="chevron-down" />
            ) : (
              <MDBIcon fas icon="chevron-up" />
            )}
          </span>
        </div>
      </div>
      <div className="p-2">{open ? children : null}</div>
    </div>
  );
};

export default Dropdown;
