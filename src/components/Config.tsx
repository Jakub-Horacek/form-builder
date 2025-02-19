import React, { useState, useEffect, useRef } from "react";
import { FormConfig } from "../types/form";
import "./Config.css";

interface ConfigProps {
  onApply: (config: FormConfig, text: string) => void;
  configText: string;
  setConfigText: (text: string) => void;
}

interface ConfigError {
  message: string;
  line?: number;
  details?: string;
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

export const Config: React.FC<ConfigProps> = ({ onApply, configText, setConfigText }) => {
  const [error, setError] = useState<ConfigError | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Only set default config on first render if configText is empty
    if (isFirstRender.current && !configText) {
      setConfigText(JSON.stringify(defaultConfig, null, 2));
      isFirstRender.current = false;
    }
  }, [configText, setConfigText]);

  const getErrorDetails = (error: unknown): ConfigError => {
    if (error instanceof SyntaxError) {
      const message = error.message;
      const match = message.match(/position (\d+)/);

      // Handle common JSON syntax errors
      if (message.includes("Unexpected token")) {
        const tokenMatch = message.match(/Unexpected token (.+?)(,|$)/);
        const token = tokenMatch ? tokenMatch[1] : "";

        if (token === "]") {
          return {
            message: "Error: You have an extra comma before the closing bracket ']'",
            line: match ? configText.substring(0, parseInt(match[1], 10)).split("\n").length : undefined,
            details: "Remove the trailing comma after the last item in your array",
          };
        }

        if (token === "}") {
          return {
            message: "Error: You have an extra comma before the closing brace '}'",
            line: match ? configText.substring(0, parseInt(match[1], 10)).split("\n").length : undefined,
            details: "Remove the trailing comma after the last property",
          };
        }

        // Generic unexpected token error
        return {
          message: `Error: Unexpected ${token} found in your JSON`,
          line: match ? configText.substring(0, parseInt(match[1], 10)).split("\n").length : undefined,
          details: "Check for missing or extra commas, quotes, or brackets",
        };
      }

      if (match) {
        const position = parseInt(match[1], 10);
        const line = configText.substring(0, position).split("\n").length;
        return {
          message: "JSON Syntax Error",
          line,
          details: "Check for proper JSON formatting: missing commas, quotes, or brackets",
        };
      }
    }

    return {
      message: error instanceof Error ? error.message : "Invalid configuration",
      details: "Please ensure your JSON is properly formatted",
    };
  };

  const validateConfig = (config: any): config is FormConfig => {
    if (config.title && typeof config.title !== "string") {
      throw new Error("Title must be a string when provided");
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
        onApply(parsedConfig, configText);
      }
    } catch (err) {
      setError(getErrorDetails(err));
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
          <strong>{error.message}</strong>
          {error.line && <div>Line: {error.line}</div>}
          {error.details && <div className="error-details">{error.details}</div>}
        </div>
      )}
      <button onClick={handleApply}>Apply</button>
    </div>
  );
};
