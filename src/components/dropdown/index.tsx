import React from 'react';

type DropdownOptionsType = {
    value: string,
    label: string
};

const Dropdown = ({
    label,
    value,
    options,
    onChange
}: {
    label: string,
    value?: string,
    options: DropdownOptionsType[],
    onChange: (arg0: any) => void 
}) => {
    return (
      <label style={{ display: 'flex', gap: 8 }}>
        {label}
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={`option: ${option.label}`} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
};

export default Dropdown;