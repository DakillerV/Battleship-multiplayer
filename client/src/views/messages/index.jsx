import Button from "react-bootstrap/Button";
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
  MDBAccordion,
  MDBAccordionItem,
} from "mdb-react-ui-kit";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router";
import CreateChat from "@views/messages/components/CreateChat";
import { toast } from "react-hot-toast";
import TextFieldComp from "@cc/TextInput";
import Chat from "./Chat";
const Message = (props) => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [hideCreate, setHideCreate] = useState(false);
  const firstUpdate = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const { gameLoading, setGameLoading, userData, setUserData, windowSize } =
    useContext(MainContext);
  const { innerWidth } = windowSize;
  const userdata = userData.userData;
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      try {
        axios({
          method: "GET",
          url: `/api/rooms/user/${userdata.id}/rooms`,
        }).then((res) => {
          const resData = res.data;
          if (resData.success) {
            setChats(resData.data);
            setLoaded(true);
          }
        });
      } catch (error) {
        console.log(error);
      }
      firstUpdate.current = false;
      return;
    }
  }, []);
  useEffect(() => {
    if (hideCreate) {
      setInterval(() => {
        setHideCreate(false);
      }, 1000);
    }
  }, [hideCreate]);

  const id = location.pathname.replace("/messages/", "");
  useEffect(() => {
    if (id && id !== "/messages") {
      axios.get(`/api/rooms/${id}`).then((res) => {
        const resData = res.data;
        if (resData.success) {
          setChatData(resData.data);
        } else {
          setChatData(null);
        }
      });
    } else {
      setChatData(null);
    }
  }, [location]);

  const HoverRoom = (props) => {
    const [isHovering, setIsHovering] = useState(false);
    const { key2, userdata, elem, id } = props;
    return (
      <MDBListGroupItem
        active={isHovering || id === elem.id}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        key={key2}
        style={{
          boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)`,
        }}
        onClick={() => {
          navigate(`/messages/${elem.id}`);
        }}
        noBorders
        aria-current="true"
        className="d-flex justify-content-between align-items-center m-1"
      >
        {" "}
        {elem.type === "direct" ? (
          <>
            <div className="d-flex">
              <MDBCardImage
                src={userdata.googleData.picture}
                referrerPolicy="no-referrer"
                alt="Avatar"
                className="rounded-circle"
                style={{ width: "40px", height: "40px" }}
                onClick={() => {
                  navigate(`/users/${elem.id}`);
                }}
                fluid
              />
              <div
                className="text-dark bold px-2"
                style={{
                  fontSize: "16px",
                  lineHeight: "20px",
                }}
              >
                {userdata.userName || userdata.googleData.displayName}{" "}
                <span className="text-muted">Time</span>
                <div className="text-muted">Message preview</div>
              </div>
            </div>
            <div className="d-flex">
              <MDBBadge className="m-2" color="danger">
                8
              </MDBBadge>
              <span>
                <MDBIcon
                  style={{ cursor: "pointer" }}
                  icon="xmark"
                  className="m-2 text-dark"
                ></MDBIcon>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex">
              <div
                className="rounded-circle bg-dark"
                style={{ width: "40px", height: "40px" }}
              >
                <MDBIcon icon="users" className="text-white p-2"></MDBIcon>
              </div>
              <div
                className="text-dark bold px-2"
                style={{
                  fontSize: "16px",
                  lineHeight: "20px",
                }}
              >
                Group Chat name
                <span className="text-muted">Time</span>
                <div className="text-muted">Message preview</div>
              </div>
            </div>
            <div className="d-flex">
              <MDBBadge className="m-2" color="danger">
                8
              </MDBBadge>
              <span>
                <MDBIcon
                  style={{ cursor: "pointer" }}
                  icon="xmark"
                  className="m-2 text-dark"
                ></MDBIcon>
              </span>
            </div>
          </>
        )}
      </MDBListGroupItem>
    );
  };
  return (
    <Container>
      {loaded ? (
        <MDBRow>
          <MDBCol lg="12">
            <MDBCard className="m-1" style={{ height: "100%" }}>
              <MDBCardHeader style={{ height: "100px" }}>
                <div style={{ height: "35px" }}>
                  <div style={{ height: "100%" }}>
                    <h4
                      style={{ paddingTop: "10px", cursor: "pointer" }}
                      onClick={() => {
                        navigate("/messages");
                      }}
                    >
                      Messages
                    </h4>
                  </div>
                  {chatData && (
                    <div
                      style={{
                        maxWidth: "600px",
                        width: "100%",
                        height: "100%",
                        float: "right",
                      }}
                      className="d-flex justify-content-between align-items-center m-1"
                    >
                      {chatData.type === "direct" ? (
                        <>
                          <div className="d-flex">
                            <MDBCardImage
                              src={userdata.googleData.picture}
                              referrerPolicy="no-referrer"
                              alt="Avatar"
                              className="rounded-circle"
                              style={{ width: "40px" }}
                              onClick={() => {
                                navigate(`/users/${chatData.id}`);
                              }}
                              fluid
                            />
                            <div
                              className="text-dark bold p-2"
                              style={{
                                fontSize: "16px",
                                lineHeight: "20px",
                              }}
                            >
                              {userdata.userName ||
                                userdata.googleData.displayName}{" "}
                            </div>
                          </div>
                          <div className="d-flex">
                            <span>
                              <MDBIcon
                                style={{ cursor: "pointer" }}
                                icon="xmark"
                                className="m-2 text-dark"
                                onClick={() => {
                                  navigate("/messages");
                                }}
                              ></MDBIcon>
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="d-flex">
                            <div
                              className="rounded-circle bg-dark"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <MDBIcon
                                icon="users"
                                className="text-white p-2"
                              ></MDBIcon>
                            </div>
                            <div
                              className="text-dark bold p-2"
                              style={{
                                fontSize: "16px",
                                lineHeight: "20px",
                              }}
                            >
                              Group Chat name
                            </div>
                          </div>
                          <div className="d-flex">
                            <span>
                              <MDBIcon
                                style={{ cursor: "pointer" }}
                                icon="xmark"
                                className="m-2 text-dark"
                                onClick={() => {
                                  navigate("/messages");
                                }}
                              ></MDBIcon>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </MDBCardHeader>
              <MDBCardBody>
                {innerWidth > 991 && (
                  <div
                    className="text-dark"
                    style={{
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "60px",
                      paddingBottom: "5px",
                    }}
                  >
                    Chats
                  </div>
                )}
                <MDBRow>
                  <MDBCol lg="5" className="py-2">
                    {innerWidth > 991 ? (
                      <>
                        <MDBListGroup flush="true" className="rounded-3">
                          {chats[0] ? (
                            chats.map((elem, key) => {
                              return (
                                <HoverRoom
                                  id={id}
                                  key={key}
                                  key2={key}
                                  elem={elem}
                                  userdata={userdata}
                                ></HoverRoom>
                              );
                            })
                          ) : (
                            <div>
                              <div>You have no chats</div>
                            </div>
                          )}
                        </MDBListGroup>
                        {!hideCreate && (
                          <div className="d-grid gap-2">
                            <ModalButton
                              block
                              buttonTitle="Start new chat"
                              title="Start new chat"
                              dialogProps={{ className: "modal-xl" }}
                            >
                              <CreateChat
                                setHideCreate={setHideCreate}
                                hideCreate={hideCreate}
                              ></CreateChat>
                            </ModalButton>
                          </div>
                        )}
                      </>
                    ) : (
                      <MDBAccordion borderless initialActive={false}>
                        <MDBAccordionItem
                          collapseId={1}
                          headerTitle={
                            <div
                              className="text-dark"
                              style={{
                                fontWeight: 500,
                                fontSize: "20px",
                                lineHeight: "20px",
                                paddingBottom: "5px",
                              }}
                            >
                              Chats
                            </div>
                          }
                        >
                          <MDBListGroup flush="true" className="rounded-3">
                            {chats[0] ? (
                              chats.map((elem, key) => {
                                return (
                                  <HoverRoom
                                    id={id}
                                    key={key}
                                    key2={key}
                                    elem={elem}
                                    userdata={userdata}
                                  ></HoverRoom>
                                );
                              })
                            ) : (
                              <div>
                                <div>You have no chats</div>
                              </div>
                            )}
                          </MDBListGroup>
                          {!hideCreate && (
                            <div className="d-grid gap-2">
                              <ModalButton
                                block
                                buttonTitle="Start new chat"
                                title="Start new chat"
                                dialogProps={{ className: "modal-xl" }}
                              >
                                <CreateChat
                                  setHideCreate={setHideCreate}
                                  hideCreate={hideCreate}
                                ></CreateChat>
                              </ModalButton>
                            </div>
                          )}
                        </MDBAccordionItem>
                      </MDBAccordion>
                    )}
                  </MDBCol>
                  <MDBCol lg="7">
                    {chatData ? (
                      <Chat
                        chatData={chatData}
                        setChatData={setChatData}
                      ></Chat>
                    ) : (
                      <div
                        className="rounded bg-light p-3 shadow-2"
                        style={{
                          height: "550px",
                          width: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        Open a chat
                      </div>
                    )}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      ) : (
        <div className="center">
          {" "}
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
    </Container>
  );
};

export default Message;
