import Hangman from "../../assets/imgs/hangman.png";
import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "@contexts/main";
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
import axios from "axios";
import { useNavigate } from "react-router";
const Leaderboard = (props) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const { gameLoading, setGameLoading } = useContext(MainContext);

  useEffect(() => {
    axios.get("/api/user/getallusers").then((res) => {
      const resData = res.data;
      setUsers(resData.data);
    });
  }, []);
  useEffect(() => {
    // console.log(users);
  }, [users]);
  return (
    <Container>
      <h4>Users</h4>
      {users ? (
        <Row>
          {users.map((user, key) => {
            console.log(user);
            return (
              <Col xl={12} className={"p-1"} key={key}>
                <Card style={{ width: "100%" }}>
                  <Card.Body style={{ width: "100%" }}>
                    <Card.Title>{user?.username || user?.googleData?.displayName}</Card.Title>
                    <Card.Text>
                      Win rate:{" "}
                      {user.matches.filter((elem) => elem.winnerId === user.id)
                        .length / user.matches.length || 0}
                      %
                    </Card.Text>
                    <div
                      className="d-flex justify-content-end"
                      style={{ marginBottom: "10px" }}
                    >
                      <Button
                        variant="primary"
                        onClick={() => {
                          navigate(`/users/${user.id}`);
                        }}
                      >
                        View profile
                      </Button>
                    </div>
                    <div className="d-flex justify-content-end">
                      Games Won:{" "}
                      {
                        user.matches.filter((elem) => elem.winnerId === user.id)
                          .length
                      }
                    </div>
                    <div className="d-flex justify-content-end">
                      UserId: {user.id}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="center">
          {" "}
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
    </Container>
  );
};

export default Leaderboard;
