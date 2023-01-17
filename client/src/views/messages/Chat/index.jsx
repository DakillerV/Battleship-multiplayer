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
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router";
import SelectComp from "../../../components/Select";
import Message from "./components/message";

const Chat = (props) => {
  const chatRef = useRef(null);
  const { chatData, setChatData } = props;
  const [message, setMessage] = useState("");
  const context = useContext(MainContext);
  const socket = context.socket;
  const getUserFromCache = context.getUserFromCache;
  const userData = context.userData.userData;
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      try {
        socket.emit(
          "joinRoom",
          { roomId: chatData.id, userId: userData.id },
          () => {}
        );
        socket.on("message", (messageData) => {
          if (chatData.id === messageData.roomId) {
            receivedMessage(messageData);
          }
        });
        socket.on("roomData", (payload) => {
          console.log(payload);
        });
      } catch (error) {
        console.log(error);
      }
      firstUpdate.current = false;
      return;
    }
  }, []);

  useEffect(() => {
    chatRef.current.scrollToBottom(1000);
  }, [chatData]);

  const receivedMessage = (messageData) => {
    setChatData((prev) => ({
      ...prev,
      messages: [...prev.messages, messageData],
    }));
  };

  const sendMessage = (message) => {
    if (message) {
      socket.emit("sendMessage", message, () => {});
      axios
        .post("/api/rooms/message", {
          roomId: chatData.id,
          sender: userData.id,
          message,
          timeStamp: new Date(),
        })
        .then((res) => {
          const resData = res.data;
          if (resData.success) {
            console.log(resData.messageData);
            setChatData(resData.roomData);
          } else {
            toast.error(resData.error);
          }
        });
      setMessage("");
    }
  };
  return (
    <div
      className="rounded"
      style={{
        backgroundColor: "#2b2d42",
        height: "550px",
        maxWidth: "100%",
      }}
    >
      <Scrollbars
        ref={chatRef}
        style={{
          height: "480px",
          width: "100%",
          cursor: "default",
        }}
      >
        <div className="p-2">
          <div className="divider d-flex align-items-center mb-4">
            <p className="text-center mx-3 mb-0" style={{ color: "#a2aab7" }}>
              Today
            </p>
          </div>
          {chatData.messages.map((elem, key) => {
            return (
              <Message data={elem} key={key} key2={key}></Message>
            );
          })}
        </div>
      </Scrollbars>
      <div style={{ position: "relative", bottom: 0 }}>
        <div className="d-flex justify-content-start align-items-center p-3">
          <a
            className="ms-1 text-light"
            style={{ paddingRight: "20px" }}
            href="#!"
          >
            <MDBIcon fas icon="plus" />
          </a>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const message = e.target.message.value;
              sendMessage(message);
            }}
            style={{ width: "100%" }}
          >
            <input
              type="text"
              name="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              className="form-control form-control-lg"
              id="exampleFormControlInput1"
              placeholder="Type message"
            ></input>
          </form>
          <a className="ms-3 text-light" href="#!">
            <MDBIcon fas icon="smile" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Chat;
