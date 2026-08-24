"use client";

import { ReportTest, ResultParameter } from "@/types/lab";

interface ReportFormProps {
  tests: ReportTest[];
  onChange: (tests: ReportTest[]) => void;
}

const emptyParameter = (): ResultParameter => ({ parameter: "", result: "", unit: "", referenceRange: "", flag: "Normal" });

export default function ReportForm({ tests, onChange }: ReportFormProps) {
  const updateTest = (testIndex: number, parameters: ResultParameter[]) => {
    const next = tests.map((t, i) => (i === testIndex ? { ...t, parameters } : t));
    onChange(next);
  };

  const updateParameter = (testIndex: number, paramIndex: number, patch: Partial<ResultParameter>) => {
    const test = tests[testIndex];
    const parameters = test.parameters.map((p, i) => (i === paramIndex ? { ...p, ...patch } : p));
    updateTest(testIndex, parameters);
  };

  const addParameter = (testIndex: number) => {
    updateTest(testIndex, [...tests[testIndex].parameters, emptyParameter()]);
  };

  const removeParameter = (testIndex: number, paramIndex: number) => {
    updateTest(
      testIndex,
      tests[testIndex].parameters.filter((_, i) => i !== paramIndex)
    );
  };

  return (
    <div className="space-y-6">
      {tests.map((test, testIndex) => (
        <div key={testIndex} className="border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">{test.testName}</h3>
            <button
              type="button"
              onClick={() => addParameter(testIndex)}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              + Add parameter
            </button>
          </div>

          {test.parameters.length === 0 ? (
            <p className="text-xs text-gray-400">No parameters added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-left text-gray-400 text-xs">
                    <th className="pb-2 pr-2 font-medium">Parameter</th>
                    <th className="pb-2 pr-2 font-medium">Result</th>
                    <th className="pb-2 pr-2 font-medium">Unit</th>
                    <th className="pb-2 pr-2 font-medium">Reference Range</th>
                    <th className="pb-2 pr-2 font-medium">Flag</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {test.parameters.map((p, paramIndex) => (
                    <tr key={paramIndex}>
                      <td className="pr-2 pb-2">
                        <input
                          value={p.parameter}
                          onChange={(e) => updateParameter(testIndex, paramIndex, { parameter: e.target.value })}
                          placeholder="e.g. Hemoglobin"
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                        />
                      </td>
                      <td className="pr-2 pb-2">
                        <input
                          value={p.result}
                          onChange={(e) => updateParameter(testIndex, paramIndex, { result: e.target.value })}
                          placeholder="13.2"
                          className="w-24 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                        />
                      </td>
                      <td className="pr-2 pb-2">
                        <input
                          value={p.unit}
                          onChange={(e) => updateParameter(testIndex, paramIndex, { unit: e.target.value })}
                          placeholder="g/dL"
                          className="w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                        />
                      </td>
                      <td className="pr-2 pb-2">
                        <input
                          value={p.referenceRange}
                          onChange={(e) => updateParameter(testIndex, paramIndex, { referenceRange: e.target.value })}
                          placeholder="13-17"
                          className="w-24 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                        />
                      </td>
                      <td className="pr-2 pb-2">
                        <select
                          value={p.flag}
                          onChange={(e) => updateParameter(testIndex, paramIndex, { flag: e.target.value as ResultParameter["flag"] })}
                          className="px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Low">Low</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </td>
                      <td className="pb-2">
                        <button
                          type="button"
                          onClick={() => removeParameter(testIndex, paramIndex)}
                          className="text-red-500 hover:text-red-700 text-lg px-1"
                          aria-label="Remove parameter"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
