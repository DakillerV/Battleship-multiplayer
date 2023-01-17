import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@contexts/main";
import { isUserLoggedIn, getUserData, guidGenerator } from "@utils";
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
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
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
} from "mdb-react-ui-kit";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
const Users = (props) => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const {
    gameLoading,
    setGameLoading,
    userData,
    setUserData,
    getUserFromCache,
  } = useContext(MainContext);

  const userdata = userData?.userData;
  const isUser = userdata?.id === data?.id;
  useEffect(() => {
    axios.get(`/api/user/${userId}`).then((res) => {
      const resData = res.data;
      if (resData.success === false) {
        return navigate("/");
      }
      setData(resData.data);
    });
  }, [location]);
  useEffect(() => {
    // console.log(data);
  }, [data]);
  return (
    <Container>
      <h4>User</h4>
      {data ? (
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
                  {data.username || data.googleData.displayName}
                  <span className="text-muted">#{data.tag}</span>
                </p>
                <p className="text-dark mb-4">User id: {data.id}</p>
                {!isUser ? (
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn
                      onClick={() => {
                        if (
                          !userdata.Frequests.filter(
                            (elem) => elem.reqUser.id === userdata.id
                          )[0]
                        ) {
                          if (
                            userdata.friends.filter(
                              (elem) => elem.id === data.id
                            )[0]
                          ) {
                            console.log("Remove friend");
                          } else {
                            axios
                              .put("/api/user/addfriend", { targetId: data.id })
                              .then((res) => {
                                const resData = res.data;
                                if (resData.success) {
                                  setUserData((prev) => ({
                                    ...prev,
                                    userData: resData.newUserData,
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
                                          onClick={() => toast.dismiss(t.id)}
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
                                          onClick={() => toast.dismiss(t.id)}
                                        >
                                          Dismiss
                                        </button>
                                      </div>
                                    </div>
                                  ));
                                }
                              });
                          }
                        } else {
                          axios
                            .put("/api/user/cancelreq", {
                              targetId: data.id,
                              reqUserId: userdata.id,
                            })
                            .then((res) => {
                              const resData = res.data;
                              if (resData.success) {
                                setUserData((prev) => ({
                                  ...prev,
                                  userData: resData.newReqData,
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
                                        onClick={() => toast.dismiss(t.id)}
                                      >
                                        Dismiss
                                      </button>
                                    </div>
                                  </div>
                                ));
                              } else {
                                toast.error((t) => (
                                  <span>
                                    {resData.error}
                                    <button onClick={() => toast.dismiss(t.id)}>
                                      Dismiss
                                    </button>
                                  </span>
                                ));
                              }
                            });
                        }
                      }}
                    >
                      {userdata.Frequests.filter(
                        (elem) => elem.reqUser.id === userdata.id
                      )[0]
                        ? "Reqest pending"
                        : userdata.friends.filter(
                            (elem) => elem.id === data.id
                          )[0]
                        ? "Unfriend"
                        : "Friend"}
                      {}
                    </MDBBtn>
                    <MDBBtn outline className="ms-1">
                      Message
                    </MDBBtn>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn
                      onClick={() => {
                        navigate("/profile");
                      }}
                    >
                      Edit profile
                    </MDBBtn>
                  </div>
                )}
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
                <span className="text-dark h5">Recent Matches</span>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Game won</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="5">
                    <MDBCardText className="text-muted">
                      User v User
                    </MDBCardText>
                  </MDBCol>
                  <MDBCol sm="4">
                    <MDBCardText
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate(`/game/summary/gameId`);
                      }}
                    >
                      Game Id: 3453845388543
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Statistics</MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: "1rem" }}>
                      Games Played: 4
                    </MDBCardText>
                    <div style={{ width: "100%" }}>
                      <div style={{ width: "100%", height: "25px" }}>
                        <MDBCardText
                          className="mb-1 float-start"
                          style={{ fontSize: "1rem" }}
                        >
                          Won: 2
                        </MDBCardText>
                        <MDBCardText
                          className="mb-1 float-end"
                          style={{ fontSize: "1rem" }}
                        >
                          Lost: 2
                        </MDBCardText>
                      </div>
                      <MDBProgress className="rounded" style={{ width: "100%" }}>
                        <MDBProgressBar
                          width={50}
                          valuemin={0}
                          valuemax={100}
                        />
                      </MDBProgress>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Rivals</MDBCardText>
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
                          className="text-dark"
                          onClick={() => {
                            navigate(`/users/friendId`);
                          }}
                        >
                          Games lost: 500
                          <span
                            className="text-primary"
                            style={{ paddingLeft: "20px", cursor: "pointer" }}
                          >
                            Rival name
                          </span>
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
  );
};

export default Users;
