import React, { useState } from 'react';
import { Button, Modal, Space, Switch } from 'antd';

import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { fontSize } from '../App';
import { getDefSettings, setDefSettings } from '../helpers/OtherHelpers';
import AutoRefresh from './AutoRefresh';

export let showGroupsGlobal = getDefSettings().showGroups
export let showRound1Global = getDefSettings().showRound1

export default function ModalSettings({ refresh }: { refresh: Function }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showGroups, setShowGroups] = useState(getDefSettings().showGroups);
  const [showRound1, setShowRound1] = useState(getDefSettings().showRound1);

  const hendleOk = () => {
    setIsModalOpen(false)
    showGroupsGlobal = showGroups
    showRound1Global = showRound1
    refresh()
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button type="link" style={{ fontSize: fontSize, margin: "0px", padding: "0px" }} onClick={() => {
        setIsModalOpen(true)
      }}>
        Настройки
      </Button>
      <Modal title="Настройки" open={isModalOpen}
        onOk={hendleOk}
        onCancel={hendleOk}
        footer={[
          <Button style={{ borderRadius: "10px" }} type="primary" key="ok"
            onClick={hendleOk}>
            Ок
          </Button>]}
      >
        <AutoRefresh />
        <Space direction={"horizontal"}>
          <Space direction="vertical">
            <span>Показване на групова фаза:</span>
            <span>Показване на кръг 1:</span>
          </Space>
          <div style={{ paddingLeft: "80%", paddingTop: "30%" }} >
            <Space direction="vertical">
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
          </div>
        </Space>
      </Modal>
    </Space>
  );
}