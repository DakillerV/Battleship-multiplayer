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
const CreateChat = (props) => {
  const { setHideCreate } = props;
  const context = useContext(MainContext);
  const getUserFromCache = context.getUserFromCache;
  const userData = context.userData.userData;
  const [data, setData] = useState({
    ownerId: userData.id,
    type: "direct",
    members: [{ id: userData.id }],
  });
  const [alert, setAlert] = useState({ open: false, message: "", color: "" });
  const nodeRef = useRef(null);
  const removeMember = (memberId) => {
    setData((prev) => ({
      ...prev,
      members: prev.members.filter((elem) => elem.id !== memberId),
    }));
  };
  useEffect(() => {
    // console.log(data);
  }, [data]);

  const handleSubmit = () => {
    axios
      .post(
        "/api/rooms/create",
        data.type === "direct" ? { ...data, ownerId: null } : { ...data }
      )
      .then((res) => {
        const resData = res.data;
        console.log(resData);
        if (resData.success) {
          toast.success((t) => (
            <div className="d-flex flex-row">
              <span className="p-1">
                <span
                  style={{
                    lineHeight: "40px",
                    fontSize: "15px",
                  }}
                >
                  {resData.message}
                </span>
              </span>
              <div className="p-1">
                <button className="btn" onClick={() => toast.dismiss(t.id)}>
                  Dismiss
                </button>
              </div>
            </div>
          ));
        } else {
          toast.error((t) => (
            <div className="d-flex flex-row">
              <span className="p-1">
                <span
                  style={{
                    lineHeight: "40px",
                    fontSize: "15px",
                  }}
                >
                  {resData.error}
                </span>
              </span>
              <div className="p-1">
                <button className="btn" onClick={() => toast.dismiss(t.id)}>
                  Dismiss
                </button>
              </div>
            </div>
          ));
        }
        setHideCreate(true);
      });
  };

  const HoverUser = (props) => {
    const [isHovering, setIsHovering] = useState(false);
    const { elem, key2, setIsEditing } = props;
    return (
      <MDBListGroupItem
        key={key2}
        className={`d-flex justify-content-between align-items-center p-3 ${
          isHovering && "bg-dark"
        }`}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        {elem ? (
          <>
            <div className="d-flex">
              <MDBCardImage
                src={elem.googleData.picture}
                referrerPolicy="no-referrer"
                alt="Avatar"
                className="rounded-circle"
                style={{ width: "40px", cursor: "pointer" }}
                onClick={() => {
                  navigate(`/users/${elem.id}`);
                }}
                fluid
              />
              <MDBCardText
                className="text-primary m-2"
                style={{
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: "20px",
                }}
                onClick={() => {
                  navigate(`/users/${elem.id}`);
                }}
              >
                {elem.userName || elem.googleData.displayName}
              </MDBCardText>
            </div>
            {isHovering && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                <MDBIcon icon="users" className="text-light" />
              </div>
            )}
          </>
        ) : (
          <>User not found</>
        )}
      </MDBListGroupItem>
    );
  };

  const DirectMessageCreate = (props) => {
    const [editing, setIsEditing] = useState(false);
    const { userData, data, setData } = props;
    return (
      <div className="py-2">
        <div>User</div>
        {editing ? (
          <>
            <SelectComp
              placeholder="User"
              value={
                data.members.filter((elem) => elem.id !== userData.id)[0]
                  ? {
                      value: data.members.filter(
                        (elem) => elem.id !== userData.id
                      )[0].id,
                      label:
                        getUserFromCache(
                          data.members.filter(
                            (elem) => elem.id !== userData.id
                          )[0].id
                        ).userName ||
                        getUserFromCache(
                          data.members.filter(
                            (elem) => elem.id !== userData.id
                          )[0].id
                        ).googleData.displayName,
                    }
                  : { value: "", label: "None" }
              }
              options={userData.friends.map((elem) => ({
                value: elem.id,
                label:
                  getUserFromCache(elem.id).userName ||
                  getUserFromCache(elem.id).googleData.displayName,
              }))}
              onChange={(val) => {
                if (val === "") {
                  return setData((prev) => ({
                    ...prev,
                    members: [{ id: userData.id }],
                  }));
                }
                setData((prev) => ({
                  ...prev,
                  members: [{ id: userData.id }, { id: val }],
                }));
                setIsEditing(false);
              }}
            ></SelectComp>
          </>
        ) : (
          <MDBListGroup flush="true" className="rounded-3">
            {userData.friends[0] ? (
              <>
                {data.members.filter((elem) => elem.id !== userData.id)[0] ? (
                  data.members
                    .filter((elem) => elem.id !== userData.id)
                    .map((user, key) => {
                      const elem = getUserFromCache(user.id);
                      return (
                        <HoverUser
                          elem={elem}
                          key={key}
                          key2={key}
                          setIsEditing={setIsEditing}
                        ></HoverUser>
                      );
                    })
                ) : (
                  <MDBListGroupItem
                    className={`d-flex justify-content-between align-items-center p-3 `}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    <div>
                      No User Selected{" "}
                      <span className="text-primary">
                        {"(Click to select)"}
                      </span>
                    </div>
                  </MDBListGroupItem>
                )}
              </>
            ) : (
              <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                <MDBCardText className="text-dark">No friends</MDBCardText>
              </MDBListGroupItem>
            )}
          </MDBListGroup>
        )}
      </div>
    );
  };
  const GroupMessageCreate = (props) => {
    const [isPicking, setIsPicking] = useState(false);
    const { userData, data, removeMember } = props;
    return (
      <div className="py-2">
        <div>Members</div>
        <MDBListGroup flush="true" className="rounded-3">
          {userData.friends[0] ? (
            <>
              {data.members.map((user, key) => {
                const elem = getUserFromCache(user.id);
                return (
                  <MDBListGroupItem
                    key={key}
                    className={`d-flex justify-content-between align-items-center p-3`}
                  >
                    {elem ? (
                      <>
                        <div className="d-flex">
                          <MDBCardImage
                            src={elem.googleData.picture}
                            referrerPolicy="no-referrer"
                            alt="Avatar"
                            className="rounded-circle"
                            style={{ width: "40px", cursor: "pointer" }}
                            onClick={() => {
                              navigate(`/users/${elem.id}`);
                            }}
                            fluid
                          />
                          <MDBCardText
                            className="text-primary m-2"
                            style={{
                              cursor: "pointer",
                              fontSize: "16px",
                              lineHeight: "20px",
                            }}
                            onClick={() => {
                              navigate(`/users/${elem.id}`);
                            }}
                          >
                            {elem.userName || elem.googleData.displayName}
                          </MDBCardText>
                        </div>
                        {elem.id !== userData.id && (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              removeMember(elem.id);
                            }}
                          >
                            <MDBIcon icon="xmark" className="text-dark" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>User not found</>
                    )}
                  </MDBListGroupItem>
                );
              })}
            </>
          ) : (
            <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
              <MDBCardText className="text-dark">No friends</MDBCardText>
            </MDBListGroupItem>
          )}
        </MDBListGroup>
        <SelectComp
          placeholder="User"
          value={{ label: "", value: "" }}
          options={
            userData.friends.filter((elem) => {
              let isMember = false;
              data.members.map((elem2) => {
                if (elem2.id === elem.id) {
                  isMember = true;
                }
              });
              if (!isMember) {
                return true;
              } else return false;
            })[0]
              ? userData.friends.filter((elem) => {
                  let isMember = false;
                  data.members.map((elem2) => {
                    if (elem2.id === elem.id) {
                      isMember = true;
                    }
                  });
                  if (!isMember) {
                    return true;
                  } else return false
                }).map(elem => ({
                  value: elem.id,
                  label:
                    getUserFromCache(elem.id).userName ||
                    getUserFromCache(elem.id).googleData.displayName,
                }))
              : []
          }
          onChange={(val) => {
            if (val !== "") {
              setData((prev) => ({
                ...prev,
                members: [...prev.members, { id: val }],
              }));
            }
          }}
        ></SelectComp>
      </div>
    );
  };
  return (
    <div className="m-1">
      <div style={{ minHeight: "220px" }}>
        <CSSTransition
          in={alert.open}
          nodeRef={nodeRef}
          timeout={300}
          classNames="alert"
          unmountOnExit
          onEnter={() => {
            console.log("pp");
          }}
          onExited={() => {
            console.log("pp");
          }}
        >
          <div
            ref={nodeRef}
            className={`alert ${
              alert.color === "primar"
                ? "alert-primary"
                : alert.color === "secondary"
                ? "alert-secondary"
                : alert.color === "success"
                ? "alert-success"
                : alert.color === "danger"
                ? "alert-danger"
                : alert.color === "warning"
                ? "alert-warning"
                : alert.color === "info"
                ? "alert-info"
                : alert.color === "light"
                ? "alert-light"
                : "alert-dark"
            }`}
            role="alert"
          >
            {alert.message}
            <span
              style={{ float: "right", cursor: "pointer" }}
              onClick={() => {
                setAlert((prev) => ({ ...prev, open: !prev.open }));
              }}
            >
              <MDBIcon icon="xmark" />
            </span>
          </div>
        </CSSTransition>
        <div className="d-flex">
          <MDBBtn
            type="button"
            className="rounded bg-dark p-2 mr-1 my-1 btn"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setData((prev) => ({
                ...prev,
                type: "direct",
                members: data.members.filter(
                  (elem) => elem.id !== userData.id
                )[0]
                  ? [
                      { id: userData.id },
                      {
                        ...data.members.filter(
                          (elem) => elem.id !== userData.id
                        )[0],
                      },
                    ]
                  : [{ id: userData.id }],
              }));
            }}
          >
            <span
              className={data.type === "direct" ? "text-primary" : "text-light"}
            >
              Direct
            </span>
          </MDBBtn>
          <MDBBtn
            type="button"
            className="rounded bg-dark p-2 m-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setData((prev) => ({ ...prev, type: "group" }));
            }}
          >
            <span
              className={data.type === "group" ? "text-primary" : "text-light"}
            >
              Group
            </span>
          </MDBBtn>
        </div>
        {data.type === "direct" ? (
          <DirectMessageCreate
            userData={userData}
            setData={setData}
            data={data}
          ></DirectMessageCreate>
        ) : (
          <GroupMessageCreate
            removeMember={removeMember}
            userData={userData}
            setData={setData}
            data={data}
          ></GroupMessageCreate>
        )}
        <MDBBtn
          type="button"
          color="secondary"
          onClick={() => {
            setData((prev) => ({
              ...prev,
              members: [{ id: userData.id }],
              type: "direct",
            }));
            setAlert({ open: true, message: "Data Cleared", color: "success" });
          }}
        >
          Clear
        </MDBBtn>
        {userData.friends[0] &&
        data.members.filter((elem) => elem.id !== userData.id)[0] ? (
          <MDBBtn type="button" className="float-end" onClick={handleSubmit}>
            Create
          </MDBBtn>
        ) : (
          <MDBBtn type="button" className="float-end" disabled>
            Create
          </MDBBtn>
        )}
      </div>
    </div>
  );
};

export default CreateChat;
