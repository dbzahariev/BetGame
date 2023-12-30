import React, { useEffect, useState } from 'react';
import { Select, Space, Switch } from 'antd';

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { getDefSettings, setDefSettings } from '../helpers/OtherHelpers';
import AutoRefresh from './AutoRefresh';
import { translateTeamsName } from '../helpers/Translate';
import { useGlobalState } from '../GlobalStateProvider';

export let showGroupsGlobal = getDefSettings().showGroups
export let showRound1Global = getDefSettings().showRound1
export let showRound2Global = getDefSettings().showRound2
export let showRound3Global = getDefSettings().showRound3

export let isEnglish = getDefSettings().isEnglish
export let filterGroupGlobal = getDefSettings().filterGroup

export default function ModalSettings({ refresh }: { refresh: Function }) {
  const [showGroups, setShowGroups] = useState(getDefSettings().showGroups);
  const [showRound1, setShowRound1] = useState(getDefSettings().showRound1);
  const [showRound2, setShowRound2] = useState(getDefSettings().showRound2);
  const [showRound3, setShowRound3] = useState(getDefSettings().showRound3);
  const [groupsName, setGroupsName] = useState<{ value: string, label: string }[]>([])
  const [selctedGroupState, setSelectedGropState] = useState(getDefSettings().filterGroup)
  const [isEnglishState, setIsEnglishState] = useState(getDefSettings().isEnglish);
  const [isInit, setIsInit] = useState(-1);
  const { state } = useGlobalState();

  const hendleOk = () => {
    checkChange()
    showGroupsGlobal = showGroups
    showRound1Global = showRound1
    showRound2Global = showRound2
    showRound3Global = showRound3
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
    // checkChange()
    hendleOk()
    // eslint-disable-next-line 
  }, [showGroups, showRound1, showRound2, showRound3, isEnglishState, selctedGroupState])

  const hendleChangeGroup = (event: any) => {
    setSelectedGropState(event)
  }

  const fixDate = () => {
    let groupsNameOptions: { value: string, label: string }[] = []
    let groupNames: string[] = [""]

    const matches = state.matches || []

    for (let index = 0; index < matches.length; index++) {
      let elToAll = matches[index].group || ""
      if (!groupNames.includes(elToAll) && elToAll.toLowerCase().indexOf("group") !== -1) {
        groupNames.push(elToAll)
      }
    }
    for (let index = 0; index < groupNames.length; index++) {
      const groupName = groupNames[index];
      let elToAdd: {
        value: string;
        label: string;
      } = { value: "", label: "" }
      if (groupName === "") {
        elToAdd = { value: "", label: translateTeamsName("Chose group") }
      } else {
        elToAdd = { value: groupName, label: translateTeamsName(groupName) }
      }
      groupsNameOptions.push(elToAdd)
    }
    setGroupsName(groupsNameOptions)
  }

  useEffect(() => {
    fixDate()
    // eslint-disable-next-line 
  }, [isEnglish])

  return (
    <Space direction="horizontal" style={{ width: '100%' }}>
      <AutoRefresh refresh={refresh} />
      <Space direction="horizontal">
        <Space direction="horizontal">
          <span>{translateTeamsName("Show group phase")}</span>
          <Switch
            onChange={(newValue: boolean) => {
              setShowGroups(newValue)
              setDefSettings("showGroups", (newValue || false).toString())

              setShowRound1(newValue)
              setDefSettings("showRound1", (newValue || false).toString())
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
          defaultValue={""}
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
            style={{ width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer" }} alt="eng" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Bulgaria_Flag.svg/768px-Bulgaria_Flag.svg.png?20161026151841">
          </img>
        </Space>
      </Space>
    </Space >
  );
}