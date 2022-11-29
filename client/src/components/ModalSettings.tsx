import React, { useEffect, useState } from 'react';
import { Select, Space, Switch } from 'antd';

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { getAllMatches, getDefSettings, MatchType, setDefSettings } from '../helpers/OtherHelpers';
import AutoRefresh from './AutoRefresh';
import { translateTeamsName } from '../helpers/Translate';

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

  const hendleOk = () => {
    showGroupsGlobal = showGroups
    showRound1Global = showRound1
    showRound2Global = showRound2
    showRound3Global = showRound3
    isEnglish = isEnglishState
    filterGroupGlobal = selctedGroupState
    refresh()
  }

  useEffect(() => {
    hendleOk()
    // eslint-disable-next-line 
  }, [showGroups, showRound1, showRound2, showRound3, isEnglishState, selctedGroupState])

  const hendleChangeGroup = (event: any) => {
    setSelectedGropState(event)
  }

  useEffect(() => {
    getAllMatches((matches: MatchType[]) => {
      let groupsNameOptions: { value: string, label: string }[] = []
      let groupNames: string[] = [""]

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
    })
    // eslint-disable-next-line 
  }, [isEnglish])

  return (
    <Space direction="horizontal" style={{ width: '100%' }}>
      <AutoRefresh />
      <Space direction="horizontal">
        <Space direction="horizontal">
          <span>{translateTeamsName("Show group phase:")}</span>
          <Switch
            onChange={(newValue: boolean) => {
              setShowGroups(newValue)
              setDefSettings("showGroups", (newValue || false).toString())
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
          />
        </Space>
        <Space direction="horizontal">
          <span>{translateTeamsName("English language:")}</span>
          <Switch
            onChange={(newValue: any) => {
              setDefSettings("isEnglish", (newValue || false).toString())
              return setIsEnglishState(newValue)
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={isEnglishState}
          />
        </Space>
      </Space>
      {/* </Modal> */}
    </Space >
  );
}