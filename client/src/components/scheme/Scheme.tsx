import React from "react"
import { useEffect, useState } from "react";
import { useGlobalState } from "../../GlobalStateProvider";
import { getAllTeams } from "../../helpers/OtherHelpers";
import { translateTeamsName } from "../../helpers/Translate";
import OneMatchInScheme from "./OneMatchInScheme";
import Separator from "./separator.svg";

let kk = 23.5

export default function Scheme() {
  const [teams, setTeams] = useState<{
    name: string;
    flag: string;
  }[]>([])
  const { state } = useGlobalState()
  const matches = state.matches || []

  useEffect(() => {
    getAllTeams((teams: any[]) => {
      setTeams(teams)
    })
  }, []);

  const capitalizeText = (text: String) => {
    let res = text
    res = res.slice(0, 1).toUpperCase() + res.slice(1).toLocaleLowerCase();
    res = res.replace("_", " ")
    return res
  }

  const renderLast16 = () => {
    let matchesIn16 = matches.filter((match) => match.group === "LAST_16");

    return (
      <div>
        <p style={{ textAlign: "center", fontSize: "25px" }}>{translateTeamsName("LAST_16", true)}</p>
        <OneMatchInScheme teams={teams} match={matchesIn16[0]} /> {/* 1 */}
        <OneMatchInScheme teams={teams} match={matchesIn16[1]} /> {/* 2 */}
        <OneMatchInScheme teams={teams} match={matchesIn16[4]} /> {/* 3 */}
        <OneMatchInScheme teams={teams} match={matchesIn16[5]} /> {/* 4 */}
        <OneMatchInScheme teams={teams} match={matchesIn16[2]} /> {/* 5 */}
        <OneMatchInScheme teams={teams} match={matchesIn16[3]} /> {/* 6 */}
        <OneMatchInScheme teams={teams} match={matchesIn16[6]} /> {/* 7 */}
        <OneMatchInScheme teams={teams} match={matchesIn16[7]} /> {/* 8 */}
      </div>
    );
  };

  const renderLast8 = () => {
    let matchesIn8 = matches.filter((match) => (match.group === "QUARTER_FINAL") || (match.group === "QUARTER_FINALS"));

    return (
      <div>
        <p style={{ textAlign: "center", fontSize: "25px" }}>{capitalizeText(translateTeamsName("QUARTER_FINAL", true))}</p>
        <div style={{ marginTop: `${kk + 6.6}%` }}>
          <OneMatchInScheme teams={teams} match={matchesIn8[1]} /> {/* 1 */}
        </div>
        <div style={{ marginTop: "38%" }}>
          <OneMatchInScheme teams={teams} match={matchesIn8[0]} /> {/* 2 */}
        </div>
        <div style={{ marginTop: "38%" }}>
          <OneMatchInScheme teams={teams} match={matchesIn8[3]} /> {/* 3 */}
        </div>
        <div style={{ marginTop: "38%" }}>
          <OneMatchInScheme teams={teams} match={matchesIn8[2]} /> {/* 4 */}
        </div>
      </div>
    );
  };

  const renderLast4 = () => {
    let matchesIn8 = matches.filter((match) => (match.group === "SEMI_FINAL") || (match.group === "SEMI_FINALS"));

    return (
      <div>
        <p style={{ textAlign: "center", fontSize: "25px" }}>{capitalizeText(translateTeamsName("SEMI_FINAL", true))}</p>
        <div style={{ marginTop: `${kk + 44}%` }}>
          <OneMatchInScheme teams={teams} match={matchesIn8[0]} /> {/* 1 */}
        </div>
        <div style={{ marginTop: "112.5%" }}>
          <OneMatchInScheme teams={teams} match={matchesIn8[1]} /> {/* 2 */}
        </div>
      </div>
    );
  };

  const renderLast2 = () => {
    let matchesFin = matches.filter((match) => match.group === "FINAL");
    let matchesTP = matches.filter((match) => match.group === "THIRD_PLACE");

    return (
      <div>
        <p style={{ textAlign: "center", fontSize: "25px", whiteSpace: "nowrap" }}>{translateTeamsName(matchesTP.length > 0 ? "Third place and final" : "FINAL")}</p>
        <div style={{ marginTop: `${kk + 35}%` }}>
          <div style={{ height: "80px" }}>
            {matchesTP.length > 0 ? <OneMatchInScheme teams={teams} match={matchesTP[0]} /> : <></>}
          </div>
          <div style={{ marginTop: "38%" }}>
            <OneMatchInScheme teams={teams} match={matchesFin[0]} />
          </div>
        </div>
      </div>
    );
  };

  const returnSeparator16 = () => {
    let width = "63.3px";
    let height = "193px";
    return (
      <div
        style={{
          marginTop: `${kk}%`,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: height, width: width, objectFit: "fill" }}
        />
        <img
          style={{
            marginTop: `${kk + 103}%`,
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
        <img
          style={{
            marginTop: "80px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
        <img
          style={{
            marginTop: "80px",
            height: height,
            width: width,
            objectFit: "fill",
          }}
          src={Separator}
          alt="Separator"
        />
      </div>
    );
  };

  const returnSeparator8 = () => {
    return (
      <div
        style={{
          marginTop: `${kk + 8}%`,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: "166.5px", width: "120px", objectFit: "cover" }}
        />
        <img
          src={Separator}
          alt="Separator"
          style={{
            marginTop: "162px",
            height: "166.5px",
            width: "120px",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const returnSeparator4 = () => {
    return (
      <div
        style={{
          marginTop: `${kk + 24.3}%`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={Separator}
          alt="Separator"
          style={{ height: "331px", objectFit: "unset" }}
        />
      </div>
    );
  };

  if (matches.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        margin: 10,
        width: "500px",
        display: "flex",
        height: "680px"
      }}
    >
      {renderLast16()}
      {returnSeparator16()}
      {renderLast8()}
      {returnSeparator8()}
      {renderLast4()}
      {returnSeparator4()}
      {renderLast2()}
    </div>
  );
}
