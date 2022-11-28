import React, { useEffect, useState } from 'react';
import { Space, Switch } from 'antd';

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { getDefSettings, setDefSettings } from '../helpers/OtherHelpers';
import AutoRefresh from './AutoRefresh';
import { translateTeamsName } from '../helpers/Translate';

export let showGroupsGlobal = getDefSettings().showGroups
export let showRound1Global = getDefSettings().showRound1
export let showRound2Global = getDefSettings().showRound2
export let showRound3Global = getDefSettings().showRound3

export let isEnglish = getDefSettings().isEnglish

export default function ModalSettings({ refresh }: { refresh: Function }) {
  const [showGroups, setShowGroups] = useState(getDefSettings().showGroups);
  const [showRound1, setShowRound1] = useState(getDefSettings().showRound1);
  const [showRound2, setShowRound2] = useState(getDefSettings().showRound2);
  const [showRound3, setShowRound3] = useState(getDefSettings().showRound3);

  const [isEnglishState, setIsEnglishState] = useState(getDefSettings().isEnglish);

  const hendleOk = () => {
    showGroupsGlobal = showGroups
    showRound1Global = showRound1
    showRound2Global = showRound2
    showRound3Global = showRound3
    isEnglish = isEnglishState
    refresh()
  }

  useEffect(() => {
    hendleOk()
    // eslint-disable-next-line 
  }, [showGroups, showRound1, showRound2, showRound3, isEnglishState])

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