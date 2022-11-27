import React, { useState } from "react";
import { Checkbox, InputNumber, Space } from "antd";

export let AutoRefreshInterval: number | "disable" = "disable";

export default function AutoRefresh() {
  const [newInterval, setNewInterval] = useState<number | "disable">(AutoRefreshInterval);

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

  return (
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
  );
}
