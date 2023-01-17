import React, { useState, useContext } from "react";
import { MainContext } from "@contexts/main";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useLocation, useNavigate } from "react-router";
const MiniChat = (props) => {
  const navigate = useNavigate();
  const location = useLocation()
  const { miniChatOpen, setMiniChatOpen, windowSize } = useContext(MainContext);
  const { innerWidth } = windowSize;
  return innerWidth > 450 && !location.pathname.includes("messages") && (
    <>
    </>
  );
};

export default MiniChat;
