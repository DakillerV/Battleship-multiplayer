import Button from "react-bootstrap/Button";
import { CSSTransition, Transition } from "react-transition-group";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MainContext } from "@contexts/main";
import Container from "react-bootstrap/Container";
import ModalButton from "@components/ModalButton";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { toast } from "react-hot-toast";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Dropdown from "@components/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "rc-scrollbars";
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
  MDBPopover,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBBadge,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBDropdown,
  MDBPopoverBody,
  MDBDropdownMenu,
  MDBPopoverHeader,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import axios from "axios";

const Message = (props) => {
  const { data, key2 } = props;
  const [isHovering, setIsHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const context = useContext(MainContext);
  const socket = context.socket;
  const getUserFromCache = context.getUserFromCache;
  return (
    <>
      <div
        className={`d-flex flex-row justify-content-start mb-2 ${
          isHovering && "bg-dark"
        }`}
        key={key2}
        style={isHovering ? { borderRadius: "5px" } : {}}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        <img
          className="rounded-circle"
          src={getUserFromCache(data.sender)?.googleData?.picture}
          alt="user-avatar"
          style={{ width: "45px", height: "100%" }}
        />
        <div style={{ width: "100%" }}>
          <span style={{ paddingLeft: "15px" }} className="text-light">
            {getUserFromCache(data.sender)?.userName ||
              getUserFromCache(data.sender)?.googleData?.displayName}{" "}
            <span
              className="text-muted"
              style={{
                lineHeight: "14px",
                fontSize: "14px",
              }}
            >
              {`${data.timeStamp}`}
            </span>
          </span>
          <p
            className="small p-2 ms-3 mb-1 rounded-3"
            style={{
              backgroundColor: "#f5f6f7",
              width: "95%",
            }}
          >
            {data.message}
            {isHovering && !isEditing && (
              <span style={{ float: "right" }}>
                <MDBPopover
                  color="primary"
                  btnChildren={<>Edit</>}
                  style={{ position: "relative", top: -7, height: "32px" }}
                  placement="bottom"
                >
                  <MDBPopoverHeader>Edit Message</MDBPopoverHeader>
                  <MDBPopoverBody>Edit Delete</MDBPopoverBody>
                </MDBPopover>
              </span>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default Message;
