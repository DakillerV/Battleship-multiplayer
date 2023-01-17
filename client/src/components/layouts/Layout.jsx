import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { MainContext } from "@contexts/main";
import ElapsedTime from "@components/ElapsedTime";
import { isUserLoggedIn, getUserData } from "@utils";
import loadingGif from "../../assets/imgs/loading.gif";
import styled, { keyframes, css } from "styled-components";
import axios from "axios";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";
import {
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
  useNavigate,
  useLoaderData,
} from "react-router-dom";
import { handleLogin, handleLogout } from "@store/authentication";
import { useDispatch } from "react-redux";
import MiniChat from "@components/MiniChat";
const moveHorizontally = (x) => keyframes`
from {
  transform: translateX(-200%);
}

to {
  transform: translateX(${x / 3}px);
}
`;

const StyledDiv = styled.div`
  display: inline-block;
  animation: ${(props) => moveHorizontally(props.x)} 3s linear infinite;
`;
const Layout = (props) => {
  const {
    gameLoading,
    setLookingForGame,
    windowSize,
    userData,
    setUserData,
    miniChatOpen,
    setMiniChatOpen,
  } = useContext(MainContext);
  const location = useLocation();
  const [showBasic, setShowBasic] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loaderData = useLoaderData();
  return (
    <div>
      {!gameLoading.loadingScreen ? (
        <>
          <MDBNavbar
            expand="lg"
            light
            style={{ backgroundColor: "#2B2D42", color: "#edf2f4" }}
          >
            <MDBContainer fluid>
              <MDBNavbarBrand
                style={{
                  color: "#EF233C",
                  fontWeight: 500,
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                Hangman
              </MDBNavbarBrand>

              <MDBNavbarToggler
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={() => setShowBasic(!showBasic)}
              >
                <MDBIcon icon="bars" fas />
              </MDBNavbarToggler>

              <MDBCollapse navbar show={showBasic}>
                <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
                  <MDBNavbarItem>
                    <MDBNavbarLink
                      onClick={() => {
                        navigate("/");
                      }}
                      style={
                        location.pathname === "/"
                          ? {
                              color: "#EF233C",
                              fontWeight: 500,
                              fontSize: "16px",
                              cursor: "pointer",
                            }
                          : {
                              color: "#8D99AE",
                              fontWeight: 500,
                              fontSize: "16px",
                              cursor: "pointer",
                            }
                      }
                    >
                      Home
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  {userData && (
                    <>
                      <MDBNavbarItem>
                        <MDBNavbarLink
                          onClick={() => {
                            navigate("/leaderboard");
                          }}
                          style={
                            location.pathname === "/leaderboard"
                              ? {
                                  color: "#EF233C",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }
                              : {
                                  color: "#8D99AE",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }
                          }
                        >
                          Leaderboard
                        </MDBNavbarLink>
                      </MDBNavbarItem>
                      <MDBNavbarItem>
                        <MDBNavbarLink
                          onClick={() => {
                            navigate("/users");
                          }}
                          style={
                            location.pathname.includes("/users")
                              ? {
                                  color: "#EF233C",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }
                              : {
                                  color: "#8D99AE",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }
                          }
                        >
                          Users
                        </MDBNavbarLink>
                      </MDBNavbarItem>
                      {userData?.userData?.id === "103038783562848863161" && (
                        <MDBNavbarItem>
                          <MDBNavbarLink
                            onClick={() => {
                              navigate("/admin");
                            }}
                            style={
                              location.pathname === "/admin"
                                ? {
                                    color: "#EF233C",
                                    fontWeight: 500,
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }
                                : {
                                    color: "#8D99AE",
                                    fontWeight: 500,
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }
                            }
                          >
                            Admin
                          </MDBNavbarLink>
                        </MDBNavbarItem>
                      )}
                      <MDBNavbarItem>
                        <MDBNavbarLink
                          onClick={() => {
                            navigate("/tos");
                          }}
                          style={
                            location.pathname === "/tos"
                              ? {
                                  color: "#EF233C",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }
                              : {
                                  color: "#8D99AE",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  cursor: "pointer",
                                }
                          }
                        >
                          Tos
                        </MDBNavbarLink>
                      </MDBNavbarItem>
                    </>
                  )}
                </MDBNavbarNav>

                {userData ? (
                  <>
                    <MDBDropdown>
                      <MDBDropdownToggle
                        tag="a"
                        className="nav-link"
                        role="button"
                        style={{
                          paddingRight: "30px",
                          color: "#8D99AE",
                          fontWeight: 500,
                          fontSize: "16px",
                        }}
                      >
                        Profile
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem
                          link
                          childTag="button"
                          onClick={() => {
                            navigate(`/profile`);
                          }}
                        >
                          Your profile
                        </MDBDropdownItem>
                        <MDBDropdownItem
                          link
                          childTag="button"
                          onClick={() => {
                            navigate(`/messages`);
                          }}
                        >
                          Messages
                        </MDBDropdownItem>
                        <MDBDropdownItem divider></MDBDropdownItem>
                        <MDBDropdownItem
                          link
                          childTag="button"
                          onClick={() => {
                            try {
                              axios({
                                method: "POST",
                                url: "/api/auth/logout/",
                              }).then((res) => {
                                const resData = res.data;
                                if (resData.success) {
                                  setUserData(null);
                                  dispatch(handleLogout());
                                  navigate("/");
                                } else {
                                  console.log("Failed logging out");
                                }
                              });
                            } catch (e) {
                              console.log(e);
                              console.log("Failed logging out");
                            }
                          }}
                        >
                          Log-out
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                    <form
                      className="d-flex input-group w-auto"
                      onSubmit={(e) => {
                        e.preventDefault();
                        navigate(
                          `/users?q=${encodeURIComponent(
                            e.target.search.value
                          )}`
                        );
                      }}
                    >
                      <input
                        type="search"
                        name="search"
                        className="form-control"
                        placeholder="Search user"
                        aria-label="Search"
                      />
                    </form>
                  </>
                ) : (
                  <MDBNavbarLink
                    onClick={() => {
                      window.location.href = "/api/auth/";
                    }}
                    style={{
                      color: "#8D99AE",
                      fontWeight: 500,
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </MDBNavbarLink>
                )}
              </MDBCollapse>
            </MDBContainer>
          </MDBNavbar>
          <div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 20 }}>
            <div style={{ width: "100%", height: "100%" }}>
              <MiniChat></MiniChat>
            </div>
          </div>
          <div className="main-content">
            <Outlet {...props} />
          </div>
        </>
      ) : (
        <div className="fallback-spinner app-loader">
          <StyledDiv x={windowSize.innerWidth}>
            <img
              src={loadingGif}
              alt={"loading-gif"}
              style={{ width: "200px" }}
            ></img>
          </StyledDiv>
          <div>{gameLoading.message}</div>
          <ElapsedTime startingTime={gameLoading.elapsedTime}></ElapsedTime>
          <div className="p-3">
            {" "}
            <Button
              variant="danger"
              onClick={() => {
                setLookingForGame(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <div className="loading">
            <div className="effect-1 effects"></div>
            <div className="effect-2 effects"></div>
            <div className="effect-3 effects"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
