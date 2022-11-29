import { isEnglish } from "../components/ModalSettings";
import { months as MontsInBg } from "../components/scheme/OneMatchInScheme";

let teams = require("./teams.json");

export const translateTeamsName = (team: string): string => {
  let teamsToShow: string = teams[team];

  if (isEnglish) {
    if (["Бен", "Лори", "Бочето", "Митко", "Ети", "Слави", "Татяна", ...MontsInBg].includes(team)) {
      return teamsToShow
    }
  } else {
    if (["Бен", "Лори", "Бочето", "Митко", "Ети", "Слави", "Татяна", ...MontsInBg].includes(team)) {
      return team
    }
  }

  if (team !== undefined) {
    if (team !== "") {
      if (teamsToShow === undefined) {
        if (team?.toLowerCase()?.indexOf("group") === -1) {
          if (team !== "Ще се реши") {
            debugger
          }
        }
      }
    }
  }

  if (team === "Chose group") {
    if (isEnglish) {
      return team
    }
    else {
      return teamsToShow
    }
  }

  if (team !== "Show group phase:") {
    if ((team || "").toLocaleLowerCase().indexOf("group") > -1) {
      let teamNameArr = team.split("_");
      if (teamNameArr.length === 1) {
        teamNameArr = team.split(" ");
        if (teamNameArr[0] === "Group") {
          teamNameArr[0] = "GROUP"
        }
      }
      teamsToShow = `${teams[teamNameArr[0]]} ${teamNameArr[1]}`;
    }
  }

  if (isEnglish) {
    let englishTeam = ""
    if (team !== undefined && teamsToShow !== null && teamsToShow !== undefined) {

      englishTeam = team.replace("_", " ")

      if (englishTeam.indexOf("Groups") > -1) {
        // debugger
      } else {
        if (englishTeam.indexOf("Group") > -1) {
          let groupEnglishTeamGroup = englishTeam.split(" ");
          if (groupEnglishTeamGroup.length > 1) {
            englishTeam = `${groupEnglishTeamGroup[0]} ${groupEnglishTeamGroup[1].toUpperCase()}`
          }
          else {
            englishTeam = groupEnglishTeamGroup[0]
          }
        }
      }
    }
    if (team === "Ще се реши") {
      englishTeam = "Will be decided"
    }

    return englishTeam
  }

  if (teamsToShow !== undefined) {
    teamsToShow = teamsToShow.replace(" undefined", "")
  }

  return teamsToShow ? teamsToShow : team;
};
