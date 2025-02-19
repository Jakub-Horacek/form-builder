import React from "react";
import "./Tabs.css";

interface TabProps {
  label: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className="tab-content">{children}</div>;
};

export const Tabs: React.FC<TabsProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {children.map((child, index) => (
          <button key={index} className={`tab-button ${activeTab === index ? "active" : ""}`} onClick={() => onTabChange(index)}>
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">{children[activeTab]}</div>
    </div>
  );
};
