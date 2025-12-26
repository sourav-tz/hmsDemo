import * as React from "react";

export function Checkbox({ id, checked, onCheckedChange }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 accent-blue-600 rounded border-gray-300 focus:ring-blue-500"
    />
  );
}
