import React, { useState } from "react";
import "./styles/App.css";
import { Tabs, Tab } from "./components/Tabs";
import { Config } from "./components/Config";
import { Result } from "./components/Result";

function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [formConfig, setFormConfig] = useState(null);
  const [configText, setConfigText] = useState("");

  const handleApply = (config: any, text: string) => {
    setFormConfig(config);
    setConfigText(text);
    setActiveTabIndex(1); // Switch to Result tab
  };

  return (
    <div className="App">
      <Tabs activeTab={activeTabIndex} onTabChange={setActiveTabIndex}>
        <Tab label="Config">
          <Config onApply={handleApply} configText={configText} setConfigText={setConfigText} />
        </Tab>
        <Tab label="Result">
          <Result config={formConfig} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
