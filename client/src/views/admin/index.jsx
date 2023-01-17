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
import Dropdown from "@components/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextFieldComp from "@cc/TextInput";
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
import { toast } from "react-hot-toast";
const AdminView = () => {
  const [users, setUsers] = useState();

  const {
    windowSize,
    game,
    setGame,
    socket,
    savedGame,
    setSavedGame,
    userData,
    getUserFromCache,
  } = useContext(MainContext);
  useEffect(() => {
    if (userData?.userData?.id === "103038783562848863161") {
      socket.emit("getConnectedUsers", (users) => {
        setUsers(users);
      });
    }
    socket.on("allUsersUpdate", (newUsers) => {
      setUsers(newUsers);
    });
  }, []);

  console.log(users);
  return (
    users && (
      <>
        <h4>Admin View</h4>
        <MDBCard className="mb-4 mb-lg-0 p-2">
          <MDBCardBody className="p-0">
            <div className="text-dark h5 p-2">Active Users</div>
            <MDBListGroup flush="true" className="rounded-3 p-2">
              {users.map((elem, key) => {
                const user = getUserFromCache(elem.userId);
                console.log(user);
                return (
                  <MDBListGroupItem className="p-3" key={key}>
                    <div className="d-flex justify-content-between align-items-center">
                      {user ? (
                        <>
                          <MDBCardText
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              fontSize: "16px",
                              lineHeight: "20px",
                              width: "300px",
                            }}
                            onClick={() => {
                              navigate(`/users/${user.id}`);
                            }}
                          >
                            {user.userName || user.googleData.displayName}
                          </MDBCardText>
                          <MDBCardText
                            className="text-dark"
                            style={{
                              fontSize: "16px",
                              lineHeight: "20px",
                              width: "300px",
                            }}
                          >
                            Socket Id: {elem.id}
                          </MDBCardText>
                          <MDBCardText
                            className="text-dark"
                            style={{
                              fontSize: "16px",
                              lineHeight: "20px",
                              width: "300px",
                            }}
                          >
                            User Id: {elem.userId}
                          </MDBCardText>
                        </>
                      ) : (
                        <>
                          <MDBCardText
                            className="text-dark"
                            style={{
                              fontSize: "16px",
                              width: "300px",
                              lineHeight: "20px",
                            }}
                          >
                            Guest
                          </MDBCardText>
                          <MDBCardText
                            className="text-dark"
                            style={{
                              fontSize: "16px",
                              width: "300px",
                              lineHeight: "20px",
                            }}
                          >
                            Socket Id: {elem.id}
                          </MDBCardText>
                          <MDBCardText
                            className="text-dark"
                            style={{
                              fontSize: "16px",
                              width: "300px",
                              lineHeight: "20px",
                            }}
                          >
                            Temp User Id: {elem.userId}
                          </MDBCardText>
                        </>
                      )}
                    </div>
                    <Dropdown>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const message = e.target.socketMessage.value;
                          socket.emit("adminMessage", elem.userId, message, (res) => {
                            toast.success(res)
                          });
                        }}
                        style={{ width: "100%" }}
                      >
                        <input
                          type="text"
                          name="socketMessage"
                          className="form-control form-control-lg"
                          placeholder="Socket Message"
                        ></input>
                      </form>
                    </Dropdown>
                  </MDBListGroupItem>
                );
              })}
            </MDBListGroup>
          </MDBCardBody>
        </MDBCard>
      </>
    )
  );
};

export default AdminView;
