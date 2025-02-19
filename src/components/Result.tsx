import React, { useState } from "react";
import { FormConfig, FormField, FormData } from "../types/form";

interface ResultProps {
  config: FormConfig | null;
  onSubmit?: (data: FormData) => void;
}

export const Result: React.FC<ResultProps> = ({ config, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: FormField, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field.label]: value,
    }));

    // Clear error when user types
    if (errors[field.label]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field.label];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    config?.items.forEach((field) => {
      if (field.required && !formData[field.label]) {
        newErrors[field.label] = "This field is required";
      }

      if (field.type === "number" && formData[field.label] && isNaN(Number(formData[field.label]))) {
        newErrors[field.label] = "Must be a valid number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      value: formData[field.label] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(field, e.target.value),
      required: field.required,
      "aria-label": field.label,
    };

    switch (field.type) {
      case "number":
        return <input type="number" {...commonProps} />;
      case "boolean":
        return <input type="checkbox" {...commonProps} />;
      case "string":
        return <input type="text" {...commonProps} />;
      case "multiline":
        return <textarea rows={4} {...commonProps} />;
      case "date":
        return <input type="date" {...commonProps} />;
      case "enum":
        return (
          <div className="radio-group">
            {field.options?.map((option, idx) => (
              <label key={idx}>
                <input
                  type="radio"
                  name={field.label}
                  checked={formData[field.label] === option}
                  onChange={(e) => handleInputChange(field, option)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  if (!config) {
    return <div>No form configuration available. Please configure the form in the Config tab.</div>;
  }

  return (
    <div className="form-container">
      <h2>{config.title}</h2>
      <form onSubmit={handleSubmit}>
        {config.items.map((field, index) => (
          <div key={index} className="form-row">
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
        <div className="button-container">
          {config.buttons.map((button, index) => (
            <button key={index} type="button">
              {button}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
