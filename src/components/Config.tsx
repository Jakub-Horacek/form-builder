import React, { useState } from "react";
import { FormConfig } from "../types/form";

interface ConfigProps {
  onApply: (config: FormConfig) => void;
}

interface ConfigError {
  message: string;
  line?: number;
}

const defaultConfig = {
  title: "Sample Form",
  items: [
    {
      label: "Count",
      type: "number",
    },
    {
      label: "Is Editable",
      type: "boolean",
    },
    {
      label: "Caption",
      type: "string",
    },
    {
      label: "Description",
      type: "multiline",
    },
  ],
  buttons: ["Cancel", "Save"],
};

export const Config: React.FC<ConfigProps> = ({ onApply }) => {
  const [configText, setConfigText] = useState(JSON.stringify(defaultConfig, null, 2));
  const [error, setError] = useState<ConfigError | null>(null);

  const getErrorLineNumber = (error: unknown): number | undefined => {
    if (error instanceof SyntaxError) {
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        return configText.substring(0, position).split("\n").length;
      }
    }
    return undefined;
  };

  const validateConfig = (config: any): config is FormConfig => {
    if (!config.title || typeof config.title !== "string") {
      throw new Error("Configuration must have a title");
    }

    if (!Array.isArray(config.items)) {
      throw new Error("Configuration must have an items array");
    }

    if (!Array.isArray(config.buttons)) {
      throw new Error("Configuration must have a buttons array");
    }

    config.items.forEach((item: any, index: number) => {
      if (!item.label || !item.type) {
        throw new Error(`Invalid field at index ${index}`);
      }

      if (item.type === "enum" && (!item.options || !Array.isArray(item.options))) {
        throw new Error(`Enum field "${item.label}" must have options array`);
      }
    });

    return true;
  };

  const handleApply = () => {
    try {
      const parsedConfig = JSON.parse(configText);
      if (validateConfig(parsedConfig)) {
        setError(null);
        onApply(parsedConfig);
      }
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Invalid configuration",
        line: getErrorLineNumber(err),
      });
    }
  };

  return (
    <div className="config-container">
      <textarea
        value={configText}
        onChange={(e) => {
          setConfigText(e.target.value);
          setError(null);
        }}
        style={{ width: "100%", marginBottom: "20px", minHeight: "300px", height: "100%" }}
        className={error ? "has-error" : ""}
      />
      {error && (
        <div className="error-message">
          {error.message}
          {error.line && ` (Line: ${error.line})`}
        </div>
      )}
      <button onClick={handleApply}>Apply</button>
    </div>
  );
};
