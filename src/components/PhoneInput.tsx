import { useState } from "react";

const countryCodes = [
  { code: "+966", name: "🇸🇦 SA", maxLength: 9 },
  { code: "+971", name: "🇦🇪 AE", maxLength: 9 },
  { code: "+20", name: "🇪🇬 EG", maxLength: 10 },
];

export default function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [selectedCode, setSelectedCode] = useState(countryCodes[0]);
  const [localNumber, setLocalNumber] = useState("");

  const handleNumberChange = (val: string) => {
    // تأكد أنه أرقام فقط
    const digitsOnly = val.replace(/\D/g, "");
    if (digitsOnly.length <= selectedCode.maxLength) {
      setLocalNumber(digitsOnly);
      onChange(`${selectedCode.code}${digitsOnly}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedCode.code}
        onChange={(e) => {
          const found = countryCodes.find(c => c.code === e.target.value);
          if (found) {
            setSelectedCode(found);
            setLocalNumber("");
            onChange(`${found.code}`);
          }
        }}
        className="border border-gray-300 p-2 rounded-md bg-white"
      >
        {countryCodes.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} {c.code}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={localNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder="Phone number"
        className="flex-1 p-2 border border-gray-300 rounded-md"
        inputMode="numeric"
      />
    </div>
  );
}
