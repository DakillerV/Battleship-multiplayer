// ** React Imports
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import {
  MDBInput,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalTitle,
} from "mdb-react-ui-kit";
const ModalButton = (props) => {
  const { title, footerButtons, children, buttonTitle } = props;
  const [open, setOpen] = useState(false);

  const toggleShow = () => setOpen(!open);
  return (
    <>
      <MDBBtn onClick={toggleShow}>{buttonTitle}</MDBBtn>
      <MDBModal show={open} setShow={setOpen} tabIndex="-1">
        <MDBModalDialog {...props.dialogProps}>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{title}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>{children}</MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleShow}>
                Close
              </MDBBtn>
              {footerButtons}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default ModalButton;
