import React, { useEffect, useState } from 'react';
import { Select, Space, Switch } from 'antd';

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { getDefSettings, matchesNotState, setDefSettings } from '../helpers/OtherHelpers';
import AutoRefresh from './AutoRefresh';
import { translateTeamsName } from '../helpers/Translate';

export let showGroupsGlobal = getDefSettings().showGroups
export let showGroupOnlyGlobal = getDefSettings().showGroupOnly
export let showRound1Global = getDefSettings().showRound1
export let showRound2Global = getDefSettings().showRound2
export let showRound3Global = getDefSettings().showRound3
export let showLikeFinalScoreGlobal = getDefSettings().showLikeFinalScore

export let isEnglish = getDefSettings().isEnglish
export let filterGroupGlobal = getDefSettings().filterGroup

export default function ModalSettings({ refresh }: { refresh: Function }) {
  const [showGroups, setShowGroups] = useState(getDefSettings().showGroups);
  const [showGroupOnly, setShowGroupOnly] = useState(getDefSettings().showGroupOnly);
  const [showRound1, setShowRound1] = useState(getDefSettings().showRound1);
  const [showRound2, setShowRound2] = useState(getDefSettings().showRound2);
  const [showRound3, setShowRound3] = useState(getDefSettings().showRound3);
  const [showLikeFinalScore, setShowLikeFinalScore] = useState(getDefSettings().showLikeFinalScore);
  const [groupsName, setGroupsName] = useState<{ value: string, label: string }[]>([])
  const [selctedGroupState, setSelectedGropState] = useState(getDefSettings().filterGroup)
  const [isEnglishState, setIsEnglishState] = useState(getDefSettings().isEnglish);
  const [isInit, setIsInit] = useState(-1);

  const hendleOk = () => {
    checkChange()
    showGroupsGlobal = showGroups
    showGroupOnlyGlobal = showGroupOnly
    showRound1Global = showRound1
    showRound2Global = showRound2
    showRound3Global = showRound3
    showLikeFinalScoreGlobal = showLikeFinalScore
    isEnglish = isEnglishState
    filterGroupGlobal = selctedGroupState
  }

  const checkChange = () => {
    if (showGroupsGlobal !== showGroups) {
      setIsInit(isInit + 1)
    }

    if (showRound1Global !== showRound1) {
      setIsInit(isInit + 1)
    }

    if (showRound2Global !== showRound2) {
      setIsInit(isInit + 1)
    }

    if (showRound3Global !== showRound3) {
      setIsInit(isInit + 1)
    }
    
    if (showLikeFinalScoreGlobal !== showLikeFinalScore) {
      setIsInit(isInit + 1)
    }

    if (isEnglish !== isEnglishState) {
      setIsInit(isInit + 1)
    }

    if (filterGroupGlobal !== selctedGroupState) {
      setIsInit(isInit + 1)
    }
  }

  useEffect(() => {
    if (isInit > -1) {
      refresh()
    }
    // eslint-disable-next-line
  }, [isInit])

  useEffect(() => {
    hendleOk()
    // eslint-disable-next-line 
  }, [showGroups, showGroupOnly, showRound1, showRound2, showRound3, showLikeFinalScore, isEnglishState, selctedGroupState])

  const hendleChangeGroup = (event: any) => {
    setShowGroupOnly(event)
    setDefSettings("showGroupOnly", event)
    setSelectedGropState(event)
  }

  const fixDate = () => {
    const matches = matchesNotState;

    const groupNames = matches
      .map(m => m.group || "")
      .filter((g, index, self) => g.toLowerCase().includes("group") && self.indexOf(g) === index);

    const groupsNameOptions = [
      { value: "", label: translateTeamsName("Chose group") },
      ...groupNames.map(groupName => ({ value: groupName, label: translateTeamsName(groupName) }))
    ];

    setGroupsName(groupsNameOptions);
  };

  useEffect(() => {
    fixDate()
    // eslint-disable-next-line 
  }, [isEnglish, matchesNotState])

  if (matchesNotState.length === 0) {
    return <></>
  }

  return (
    <Space direction="horizontal" style={{ width: '100%' }} id="settings">
      <AutoRefresh refresh={refresh} />
      <Space direction="horizontal">
        <Space direction="horizontal">
          <span>{translateTeamsName("Show group phase")}</span>
          <Switch
            onChange={(newValue: boolean) => {
              setShowGroups(newValue)
              setDefSettings("showGroups", (newValue || false).toString())

              setShowRound1(newValue)
              setDefSettings("", (newValue || false).toString())
              setShowRound2(newValue)
              setDefSettings("showRound2", (newValue || false).toString())
              setShowRound3(newValue)
              setDefSettings("showRound3", (newValue || false).toString())

              return null
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showGroups}
          />
        </Space>
        <Select
          defaultValue={showGroupOnly}
          style={{ width: window.innerWidth * 0.085 }}
          options={groupsName}
          onChange={hendleChangeGroup}
          disabled={!showGroups}
        />
        <Space direction="horizontal">
          <span>{translateTeamsName("Show round 1:")}</span>
          <Switch
            onChange={(newValue: any) => {
              setDefSettings("showRound1", (newValue || false).toString())
              return setShowRound1(newValue)
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showRound1}
            disabled={!showGroups}
          />
        </Space>
        <Space direction="horizontal">
          <span>{translateTeamsName("Show round 2:")}</span>
          <Switch
            onChange={(newValue: any) => {
              setDefSettings("showRound2", (newValue || false).toString())
              return setShowRound2(newValue)
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showRound2}
            disabled={!showGroups}
          />
        </Space>
        <Space direction="horizontal">
          <span>{translateTeamsName("Show round 3:")}</span>
          <Switch
            onChange={(newValue: any) => {
              setDefSettings("showRound3", (newValue || false).toString())
              return setShowRound3(newValue)
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showRound3}
            disabled={!showGroups}
          />
        </Space>
        <Space direction="horizontal">
          <span>{translateTeamsName("Show like final score")}</span>
          <Switch
            onChange={(newValue: any) => {
              setDefSettings("showLikeFinalScore", (newValue || false).toString())
              return setShowLikeFinalScore(newValue)
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={showLikeFinalScore}
            disabled={!showGroups}
          />
        </Space>
        <Space direction="horizontal">
          <img onClick={() => {
            let newValue = true
            setDefSettings("isEnglish", (newValue || false).toString())
            return setIsEnglishState(newValue)
          }}
            style={{ width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer" }} alt="eng" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/1200px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?20220422075617">
          </img>
          <img onClick={() => {
            let newValue = false
            setDefSettings("isEnglish", (newValue || false).toString())
            return setIsEnglishState(newValue)
          }}
            style={{ width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer" }} alt="eng" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/1920px-Flag_of_Bulgaria.svg.png">
          </img>
        </Space>
      </Space>
    </Space >
  );
}