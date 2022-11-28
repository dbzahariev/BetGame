import React, { useState } from "react";
import { Button, Checkbox, InputNumber, Modal, Space } from "antd";

export let AutoRefreshInterval: number | "disable" = "disable";

export default function AutoRefresh() {
  const [newInterval, setNewInterval] = useState<number | "disable">(AutoRefreshInterval);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChangeAllowRefresh = (event: any) => {
    let newValue = event.target.checked;
    let newInterval2: number | "disable";
    if (newValue) {
      newInterval2 = 30;
    } else {
      newInterval2 = "disable";
    }
    setNewInterval(newInterval2);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>
        Автоматично презареждане
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
        footer={[
          <Button style={{ borderRadius: "10px" }} type="primary" key="ok"
            onClick={handleOk}>
            Ок
          </Button>]}>
        <Space direction={"horizontal"}>
          <Space direction={"horizontal"}>
            <Checkbox
              onChange={onChangeAllowRefresh}
              defaultChecked={newInterval !== "disable"}
            >
              Автоматично презареждане
            </Checkbox>
            <InputNumber
              disabled={newInterval === "disable"}
              min={3}
              step={5}
              max={5 * 60}
              defaultValue={30}
              value={newInterval === "disable" ? 30 : newInterval}
              onChange={(value: number | null) => {
                if (value) setNewInterval(value);
              }}
              bordered={false}
            />
          </Space>
        </Space>
      </Modal>
    </>

  );
}
