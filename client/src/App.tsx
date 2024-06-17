import React, { useState } from "react";
import "./App.css";
import Groups from "./components/Groups";
import "antd/dist/antd.css";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from "react-router-dom";
import { Space } from "antd";
import Rules from "./components/Rules";
import AddNewBet from "./components/AddNewBet";
import Chat from "./components/chat/Chat";
import Scheme from "./components/scheme/Scheme";
import Ranking from "./components/ranking/Ranking";
import AllMatches from "./components/AllMatches";
import { translateTeamsName } from "./helpers/Translate";

export const fontSize = "20px";

export default function App() {
  const [reload, setReload] = useState(0);

  const refresh = () => {
    setReload(reload + 1);
  };

  return (
    <Router>
      <div
        id="header"
      >
        <Space
          direction={"horizontal"}
          size={"large"}
          style={{ whiteSpace: "nowrap", margin: "10px" }}
        >
          <Link
            style={{ fontSize: fontSize, display: "block" }}
            to="/allMatches"
          >
            <span>{translateTeamsName("All matches")}</span>
          </Link>
          <Link style={{ fontSize: fontSize }} to="/addbet">
            {translateTeamsName("Predictions")}
          </Link>
          <Link to="/groups/all" style={{ fontSize: fontSize }}>
            {translateTeamsName("Groups")}
          </Link>
          <Link to="/rules" style={{ fontSize: fontSize }}>
            {translateTeamsName("Rules")}
          </Link>
          <Link to="/chatroom" style={{ fontSize: fontSize }}>
            {translateTeamsName("Chat")}
          </Link>
          <Link to="/scheme" style={{ fontSize: fontSize }}>
            {translateTeamsName("Scheme")}
          </Link>
          <Link to="/ranking" style={{ fontSize: fontSize }}>
            {translateTeamsName("Ranking")}
          </Link>
        </Space>
      </div>
      <Switch>
        <Route path="/groups/:groupName" exact component={Groups}></Route>
        <Route path="/rules" exact component={Rules}></Route>
        <Route path="/addbet" exact component={AddNewBet}></Route>
        <Route path="/chatroom" exact component={Chat} />
        <Route path="/scheme" exact component={Scheme} />
        <Route path="/ranking" exact component={Ranking} />
        <Route path="/" exact>
          <AllMatches refresh={refresh} />
        </Route>
        <Route exact path="/allMatches">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}
