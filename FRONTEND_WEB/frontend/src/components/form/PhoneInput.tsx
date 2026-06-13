import PhoneInputWithCountry from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneInput.css";

interface PhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Entrez le numéro",
  required = false,
  disabled = false,
  defaultCountry = "TG", // Togo par défaut
}: PhoneInputProps) {
  return (
    <PhoneInputWithCountry
      international
      defaultCountry={defaultCountry as any}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="phone-input-custom"
      numberInputProps={{
        required: required,
        className:
          "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all",
      }}
    />
  );
}
