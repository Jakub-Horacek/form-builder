import React, { useState } from "react";
import "./styles/App.css";
import { Tabs, Tab } from "./components/Tabs";
import { Config } from "./components/Config";
import { Result } from "./components/Result";

function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [formConfig, setFormConfig] = useState(null);

  const handleApply = (config: any) => {
    setFormConfig(config);
    setActiveTabIndex(1); // Switch to Result tab
  };

  return (
    <div className="App">
      <Tabs activeTab={activeTabIndex} onTabChange={setActiveTabIndex}>
        <Tab label="Config">
          <Config onApply={handleApply} />
        </Tab>
        <Tab label="Result">
          <Result config={formConfig} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
