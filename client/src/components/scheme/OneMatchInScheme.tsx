import React from "react";
import { translateTeamsName } from "../../helpers/Translate";
import { MatchType } from "../../helpers/OtherHelpers";

export let months = [
  "Януари",
  "Февруари",
  "Март",
  "Април",
  "Май",
  "Юни",
  "Юли",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
];

export default function OneMatchInScheme({ match, teams = [] }: { match: MatchType, teams: { name: string, flag: string, crest: string }[] }) {
  if (match === undefined || teams.length === 0) {
    return <div></div>
  }

  const getFlag = (name: string = "") => {
    if (name === null) {
      return <></>
    }
    let team = teams.find((element) => element.name === name)

    const flagSrc = team?.flag || team?.crest || "";

    return (
      <img
        style={{ width: 15, height: 15, margin: 3 }}
        src={flagSrc}
        alt={name}
      />
    );
  };

  let header = (
    <div style={{ color: "blue" }}>
      {`${new Date(match.utcDate).getDate()} ${translateTeamsName(months[new Date(match.utcDate).getMonth() - 0])}
       - ${new Date(match.utcDate).getHours()}:${new Date(match.utcDate).getMinutes() <= 10 ? "0" : ""}${new Date(match.utcDate).getMinutes()}`}
    </div>
  );

  const getScore = (team: "home" | "away") => {
    let res: number | string | undefined = 0;

    if (team === "home" && res !== undefined) {
      res = `${match.homeTeamScore}`;

      if (match.score?.duration !== "REGULAR") {
        res += ` (${match.score?.fullTime.home})`;
      }
    }
    if (team === "away" && res !== undefined) {
      res = `${match.awayTeamScore}`;

      if (match.score?.duration !== "REGULAR") {
        res += ` (${match.score?.fullTime.away})`;
      }
    }

    if (res === "undefined") {
      res = ""
    }

    return res;
  };

  const getColor = (team: "home" | "away") => {
    let res: string = "";
    let score1 = getScore("home");
    let score2 = getScore("away");
    let color1 = "#eeeeee";
    let color2 = "#eeeeee";
    if (score1 !== "" && score2 !== "") {
      if (score1 > score2) {
        color1 = "#CDFFCC";
        color2 = "#FFBFBF";
      }
      if (score1 < score2) {
        color1 = "#FFBFBF";
        color2 = "#CDFFCC";
      }
    }
    if (team === "home") res = color1;
    if (team === "away") res = color2;

    return res;
  };

  let team = (match: MatchType, position: "first" | "second") => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
        }}
      >
        <div
          style={{
            paddingLeft: 5,
            width: `${100 - 25}%`,
            borderTopLeftRadius: position === "first" ? 10 : 0,
            borderBottomLeftRadius: position === "first" ? 0 : 10,
            border: "1px solid black",
            backgroundColor: "#eeeeee",
          }}
        >
          {position === "first"
            ? translateTeamsName(match.homeTeam.name || "Will be decided")
            : translateTeamsName(match.awayTeam.name || "Will be decided")}
          {getFlag(
            position === "first" ? match.homeTeam.name : match.awayTeam.name
          )}
        </div>
        <div
          style={{
            paddingLeft: 5,
            width: "25%",
            borderTopRightRadius: position === "first" ? 10 : 0,
            borderBottomRightRadius: position === "first" ? 0 : 10,
            border: "1px solid black",
            backgroundColor: getColor(position === "first" ? "home" : "away"),
            display: "flex",
            justifyContent: "center",
            height: "27px",
          }}
        >
          {getScore(position === "first" ? "home" : "away")}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "220px",
        height: "12.0%",
        fontSize: 16,
      }}
    >
      {header}
      {team(match, "first")}
      {team(match, "second")}
    </div>
  );
}
