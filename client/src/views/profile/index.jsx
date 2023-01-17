import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@contexts/main";
import SelectComp from "@components/Select";
import { isUserLoggedIn, getUserData, guidGenerator } from "@utils";
import TextInput from "@components/TextInput";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Dropdown from "@components/DropDown";
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
  MDBCardTitle,
} from "mdb-react-ui-kit";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
const Users = (props) => {
  const [activeSettingTab, setActiveSettingTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [startingData, setStartingData] = useState(null);
  const [data, setData] = useState(null);
  const {
    gameLoading,
    setGameLoading,
    userData,
    setUserData,
    userCache,
    getUserFromCache,
    windowSize,
  } = useContext(MainContext);
  const userdata = userData?.userData;
  const isUser = userdata?.id === data?.id;
  useEffect(() => {
    axios.get(`/api/user/${userdata.id}`).then((res) => {
      const resData = res.data;
      if (resData.success === false) {
        return navigate("/");
      }
      setData(resData.data);
      setStartingData(resData.data);
    });
  }, [location]);
  useEffect(() => {
    console.log(userCache);
  }, [data]);
  return (
    <>
      <Container>
        <h4>Profile</h4>
        {data && userCache ? (
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={data.googleData.picture}
                    referrerPolicy="no-referrer"
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ width: "75px" }}
                    fluid
                  />
                  <p className="text-dark mb-1">
                    {data.userName || data.googleData.displayName}
                    <span className="text-muted">#{data.tag}</span>
                  </p>
                  <p className="text-dark mb-4">User id: {data.id}</p>
                  <MDBBtn
                    className="m-1"
                    onClick={() => {
                      navigate(`/messages`);
                    }}
                  >
                    Messages
                  </MDBBtn>
                  <MDBBtn
                    className="m-1"
                    onClick={() => {
                      navigate(`/users/${data.id}`);
                    }}
                  >
                    View public profile
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0 p-2">
                <MDBCardBody className="p-0">
                  <div className="text-dark h5 p-2">Friends</div>
                  <MDBListGroup flush="true" className="rounded-3">
                    {data.friends[0] ? (
                      data.friends.map((user, key) => {
                        const elem = getUserFromCache(user.id);
                        return (
                          <MDBListGroupItem
                            className="d-flex justify-content-between align-items-center p-3"
                            key={key}
                          >
                            {elem ? (
                              <>
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
                                  className="text-primary"
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
                                <MDBDropdown dropright>
                                  <MDBDropdownToggle>Options</MDBDropdownToggle>
                                  <MDBDropdownMenu>
                                    <MDBDropdownItem
                                      link
                                      childTag="button"
                                      onClick={() => {
                                        navigate(`/users/${elem.id}`);
                                      }}
                                    >
                                      View profile
                                    </MDBDropdownItem>
                                    <MDBDropdownItem
                                      link
                                      childTag="button"
                                      onClick={() => {
                                        console.log(`Message ${elem.id}`);
                                      }}
                                    >
                                      Message
                                    </MDBDropdownItem>
                                    <MDBDropdownItem
                                      link
                                      childTag="button"
                                      onClick={() => {
                                        console.log("Friend remove");
                                      }}
                                    >
                                      Remove friend
                                    </MDBDropdownItem>
                                  </MDBDropdownMenu>
                                </MDBDropdown>
                              </>
                            ) : (
                              <>User not found</>
                            )}
                          </MDBListGroupItem>
                        );
                      })
                    ) : (
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                        <MDBCardText className="text-dark">
                          No friends
                        </MDBCardText>
                      </MDBListGroupItem>
                    )}
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBPagination className="mb-0">
                    <MDBPaginationItem
                      active={activeSettingTab === 0}
                      onClick={() => {
                        setActiveSettingTab(0);
                      }}
                    >
                      <MDBPaginationLink
                        className="text-primary"
                        style={{
                          textWeight: 400,
                          fontSize: "15px",
                          cursor: "pointer",
                        }}
                      >
                        General
                      </MDBPaginationLink>
                    </MDBPaginationItem>
                    <MDBPaginationItem
                      active={activeSettingTab === 1}
                      onClick={() => {
                        setActiveSettingTab(1);
                      }}
                    >
                      <MDBPaginationLink
                        className="text-primary"
                        style={{
                          textWeight: 400,
                          fontSize: "15px",
                          cursor: "pointer",
                        }}
                      >
                        Extra
                      </MDBPaginationLink>
                    </MDBPaginationItem>
                  </MDBPagination>
                </MDBCardBody>
              </MDBCard>
              <MDBCard className="mb-4">
                <MDBCardBody>
                  {activeSettingTab === 0 ? (
                    <MDBRow>
                      <MDBCol lg={6}>
                        <TextInput
                          label="Username"
                          value={data.userName || data.googleData.displayName}
                          onChange={(val) => {
                            setData((prev) => ({ ...prev, userName: val }));
                          }}
                        ></TextInput>
                        <TextInput
                          label="Tag"
                          value={data.tag}
                          onChange={(val) => {
                            setData((prev) => ({ ...prev, tag: val }));
                          }}
                        ></TextInput>
                        <SelectComp
                          value={
                            data.settings.showFriends === "everyone"
                              ? { value: "everyone", label: "Everyone" }
                              : data.settings.showFriends === "friends"
                              ? { value: "friends", label: "Friends" }
                              : { value: "nobody", label: "No-one" }
                          }
                          label={"Friends visibility"}
                          options={[
                            { value: "everyone", label: "Everyone" },
                            { value: "friends", label: "Friends" },
                            { value: "nobody", label: "No-one" },
                          ]}
                          onChange={(val) => {
                            setData((prev) => ({
                              ...prev,
                              settings: { ...prev.settings, showFriends: val },
                            }));
                          }}
                        ></SelectComp>
                        <SelectComp
                          value={
                            data.settings.showRecentMatches === "everyone"
                              ? { value: "everyone", label: "Everyone" }
                              : data.settings.showRecentMatches === "friends"
                              ? { value: "friends", label: "Friends" }
                              : { value: "nobody", label: "No-one" }
                          }
                          label={"Match visibility"}
                          options={[
                            { value: "everyone", label: "Everyone" },
                            { value: "friends", label: "Friends" },
                            { value: "nobody", label: "No-one" },
                          ]}
                          onChange={(val) => {
                            setData((prev) => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                showRecentMatches: val,
                              },
                            }));
                          }}
                        ></SelectComp>
                      </MDBCol>
                    </MDBRow>
                  ) : (
                    activeSettingTab === 1 && <>Extra</>
                  )}
                </MDBCardBody>
              </MDBCard>
              <MDBRow>
                <MDBCol sm={6}>
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <div
                        className="text-dark"
                        style={{ fontWeight: 500, fontSize: "16px" }}
                      >
                        Friend Requests
                      </div>
                      <div
                        className="text-dark"
                        style={{ fontWeight: 500, fontSize: "14px" }}
                      >
                        Outgoing
                      </div>
                      <MDBListGroup flush="true" className="rounded-3">
                        {data.Frequests.filter(
                          (elem) => elem.reqUser.id === userdata.id
                        )[0] ? (
                          data.Frequests.filter(
                            (elem) => elem.reqUser.id === data.id
                          ).map((user, key) => {
                            const elem = getUserFromCache(user.target.id);
                            return (
                              <MDBListGroupItem
                                className="d-flex justify-content-between align-items-center p-3"
                                key={key}
                              >
                                {elem ? (
                                  <>
                                    <MDBCardImage
                                      src={elem.googleData.picture}
                                      referrerPolicy="no-referrer"
                                      alt="Avatar"
                                      className="rounded-circle"
                                      style={{
                                        cursor: "pointer",
                                        width: "40px",
                                      }}
                                      onClick={() => {
                                        navigate(`/users/${elem.id}`);
                                      }}
                                      fluid
                                    />
                                    <div className="d-flex p-1">
                                      <div style={{ paddingTop: "5px" }}>
                                        <MDBCardText
                                          className="text-primary"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            navigate(`/users/${elem.id}`);
                                          }}
                                        >
                                          {elem.userName ||
                                            elem.googleData.displayName}
                                        </MDBCardText>
                                      </div>
                                      <MDBBtn
                                        className="mx-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          axios
                                            .put("/api/user/cancelreq", {
                                              targetId: elem.id,
                                              reqUserId: data.id,
                                            })
                                            .then((res) => {
                                              const resData = res.data;
                                              if (resData.success) {
                                                setUserData((prev) => ({
                                                  ...prev,
                                                  userData:
                                                    resData.newTargetData,
                                                }));
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
                                                      <button
                                                        className="btn"
                                                        onClick={() =>
                                                          toast.dismiss(t.id)
                                                        }
                                                      >
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
                                                      <button
                                                        className="btn"
                                                        onClick={() =>
                                                          toast.dismiss(t.id)
                                                        }
                                                      >
                                                        Dismiss
                                                      </button>
                                                    </div>
                                                  </div>
                                                ));
                                              }
                                            });
                                        }}
                                        color="danger"
                                        floating
                                      >
                                        <MDBIcon fas icon="x" />
                                      </MDBBtn>
                                    </div>
                                  </>
                                ) : (
                                  <>No user found</>
                                )}
                              </MDBListGroupItem>
                            );
                          })
                        ) : (
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3 rounded">
                            <MDBCardText className="text-dark">
                              No outgoing friend requests
                            </MDBCardText>
                          </MDBListGroupItem>
                        )}
                      </MDBListGroup>
                      <div
                        className="text-dark"
                        style={{ fontWeight: 500, fontSize: "14px" }}
                      >
                        Incoming
                      </div>
                      {data.Frequests.filter(
                        (elem) => elem.reqUser.id !== data.id
                      )[0] ? (
                        data.Frequests.filter(
                          (elem) => elem.reqUser.id !== data.id
                        ).map((user, key) => {
                          const elem = getUserFromCache(user.reqUser.id);
                          return (
                            <MDBListGroupItem
                              className="d-flex justify-content-between align-items-center p-3"
                              key={key}
                            >
                              {elem ? (
                                <>
                                  <MDBCardImage
                                    src={elem.googleData.picture}
                                    referrerPolicy="no-referrer"
                                    alt="Avatar"
                                    className="rounded-circle"
                                    style={{ cursor: "pointer", width: "40px" }}
                                    onClick={() => {
                                      navigate(`/users/${elem.id}`);
                                    }}
                                    fluid
                                  />
                                  <div className="d-flex p-1">
                                    <div style={{ paddingTop: "5px" }}>
                                      <MDBCardText
                                        className="text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          navigate(`/users/${elem.id}`);
                                        }}
                                      >
                                        {elem.userName ||
                                          elem.googleData.displayName}
                                      </MDBCardText>
                                    </div>
                                    <MDBBtn
                                      className="mx-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        axios
                                          .put("/api/user/cancelreq", {
                                            targetId: user.target.id,
                                            reqUserId: data.id,
                                          })
                                          .then((res) => {
                                            const resData = res.data;
                                            if (resData.success) {
                                              setUserData((prev) => ({
                                                ...prev,
                                                userData: resData.newTargetData,
                                              }));
                                              setData(resData.newTargetData);
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
                                                    <button
                                                      className="btn"
                                                      onClick={() =>
                                                        toast.dismiss(t.id)
                                                      }
                                                    >
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
                                                    <button
                                                      className="btn"
                                                      onClick={() =>
                                                        toast.dismiss(t.id)
                                                      }
                                                    >
                                                      Dismiss
                                                    </button>
                                                  </div>
                                                </div>
                                              ));
                                            }
                                          });
                                      }}
                                      color="danger"
                                      floating
                                    >
                                      <MDBIcon fas icon="x" />
                                    </MDBBtn>
                                    <MDBBtn
                                      className="mx-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        axios
                                          .put("/api/user/acceptreq", {
                                            targetId: user.target.id,
                                            reqUserId: user.reqUser.id,
                                          })
                                          .then((res) => {
                                            const resData = res.data;
                                            if (!resData.sucess) {
                                            }
                                            if (resData.success) {
                                              if (resData.newTargetData) {
                                                const newTargetData =
                                                  resData.newTargetData;
                                                setData(newTargetData);
                                              }
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
                                                    <button
                                                      className="btn"
                                                      onClick={() =>
                                                        toast.dismiss(t.id)
                                                      }
                                                    >
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
                                                    <button
                                                      className="btn"
                                                      onClick={() =>
                                                        toast.dismiss(t.id)
                                                      }
                                                    >
                                                      Dismiss
                                                    </button>
                                                  </div>
                                                </div>
                                              ));
                                            }
                                          });
                                      }}
                                      color="sucess"
                                      floating
                                    >
                                      <MDBIcon fas icon="check" />
                                    </MDBBtn>
                                  </div>
                                </>
                              ) : (
                                <>No user found</>
                              )}
                            </MDBListGroupItem>
                          );
                        })
                      ) : (
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3 rounded">
                          <MDBCardText className="text-dark">
                            No incoming friend requests
                          </MDBCardText>
                        </MDBListGroupItem>
                      )}
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
                <MDBCol sm={6}>
                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <div
                        className="text-dark"
                        style={{ fontWeight: 500, fontSize: "16px" }}
                      >
                        Notifications
                      </div>
                      <MDBListGroup flush="true" className="rounded-3">
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBCardImage
                            src={data.googleData.picture}
                            referrerPolicy="no-referrer"
                            alt="Avatar"
                            className="rounded-circle"
                            style={{ width: "40px" }}
                            fluid
                          />
                          <MDBCardText
                            className="text-muted"
                            onClick={() => {
                              navigate(`/users/friendId`);
                            }}
                          >
                            User sent a message
                          </MDBCardText>
                        </MDBListGroupItem>
                      </MDBListGroup>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        ) : (
          <div className="center">
            {" "}
            <Spinner animation="border" role="status"></Spinner>
          </div>
        )}
      </Container>
      {startingData !== data && (
        <MDBCard
          style={{
            position: "fixed",
            bottom: 15,
            right: windowSize.innerWidth / 4,
          }}
          className="d-flex justify-content-center m-2  "
        >
          <MDBCardBody style={{ maxHeight: "125px", width: "600px" }}>
            <h6 className="text-warn" style={{ fontSize: "17px" }}>
              Save your changes?
            </h6>
            <div
              style={{ width: "100%" }}
              className="d-flex justify-content-center mb-2 "
            >
              <MDBBtn className="m-1 bg-danger">Cancel</MDBBtn>
              <MDBBtn className="m-1 bg-primary">Confirm</MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      )}
    </>
  );
};

export default Users;
