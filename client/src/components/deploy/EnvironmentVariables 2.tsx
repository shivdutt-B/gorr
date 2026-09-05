import React, { useState, useEffect } from "react";

interface EnvVariable {
  key: string;
  value: string;
}

interface EnvironmentVariablesProps {
  envVariables: EnvVariable[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddVariable: () => void;
  onRemoveVariable: (index: number) => void;
  onUpdateVariable: (index: number, key: string, value: string) => void;
}

const EnvironmentVariables: React.FC<EnvironmentVariablesProps> = ({
  envVariables,
  isExpanded,
  onToggleExpand,
  onAddVariable,
  onRemoveVariable,
  onUpdateVariable,
}) => {
  const [duplicateKeys, setDuplicateKeys] = useState<{
    [key: string]: number[];
  }>({});

  // Check for duplicate keys whenever envVariables changes
  useEffect(() => {
    const keyMap: { [key: string]: number[] } = {};

    // Skip empty keys
    envVariables.forEach((variable, index) => {
      if (variable.key.trim() !== "") {
        if (!keyMap[variable.key]) {
          keyMap[variable.key] = [index];
        } else {
          keyMap[variable.key].push(index);
        }
      }
    });

    // Filter to only keep keys that appear more than once
    const duplicates: { [key: string]: number[] } = {};
    Object.entries(keyMap).forEach(([key, indices]) => {
      if (indices.length > 1) {
        duplicates[key] = indices;
      }
    });

    setDuplicateKeys(duplicates);
  }, [envVariables]);

  // Helper to determine if a key is a duplicate
  const isDuplicateKey = (key: string, index: number) => {
    return duplicateKeys[key]?.includes(index);
  };

  return (
    <>
      <div className="mb-6 border border-[#282828] p-3 rounded-md">
        <div
          className="flex items-center text-[#929292] font-semibold rounded cursor-pointer"
          onClick={onToggleExpand}
        >
          <div
            className={`transform transition-transform duration-300 ease-in-out ${isExpanded ? "rotate-90" : "rotate-0"
              }`}
          >
            ▶
          </div>
          <span className="ml-2">Environment Variables</span>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded
              ? "max-h-[1000px] opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
            }`}
        >
          <div className="space-y-4">
            {Object.keys(duplicateKeys).length > 0 && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-md text-red-400 text-sm mb-4">
                Warning: Duplicate environment variable keys detected. Each key
                should be unique.
              </div>
            )}

            {envVariables.map((variable, index) => (
              <div key={index} className="flex gap-2 min-w-0">
                <input
                  type="text"
                  placeholder="Key"
                  value={variable.key}
                  onChange={(e) =>
                    onUpdateVariable(index, e.target.value, variable.value)
                  }
                  className={`w-full min-w-[30px] bg-[#0a0a0a] px-3 py-2 rounded text-white border transition-all duration-200 
                    ${isDuplicateKey(variable.key, index)
                      ? "border-red-600 focus:border-red-500"
                      : "border-[#282828] focus:border-gray-400"
                    } outline-none`}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={variable.value}
                  onChange={(e) =>
                    onUpdateVariable(index, variable.key, e.target.value)
                  }
                  className="w-full min-w-[30px] bg-[#0a0a0a] px-3 py-2 rounded text-white border border-[#282828] focus:border-gray-400 outline-none transition-all duration-200"
                />
                <button
                  onClick={() => onRemoveVariable(index)}
                  className="text-gray-400 hover:text-white px-2"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={onAddVariable}
              className="flex items-center text-sm text-gray-400 hover:text-white border border-[#282828] rounded px-3 py-2"
            >
              <span className="mr-2">+</span> Add More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnvironmentVariables;
