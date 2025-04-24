// src/componentsäui-components/ClassDropdown.tsx
import React, { useEffect, useState } from 'react';
import './ui-style.css';
import { useAuth } from '../../context/AuthContext';

interface ClassDropdownProps {
  onSelectClass: (cls: string) => void;
}

const ClassDropdown: React.FC<ClassDropdownProps> = ({
  onSelectClass
}) => {
    const { loggedUser } = useAuth();
    const classes = loggedUser?.classList ?? [];
    const [selectedClass, setSelectedClass] = useState<string>('');

    useEffect(() => {
        if (classes.length > 0 && !selectedClass) {
            setSelectedClass(classes[0]);
            onSelectClass(classes[0]);
        }
    }, [classes, selectedClass]);
    
  return (
    <>
      {classes.length > 1 ? (
        <select
          className="class-select me-3 mb-1"
          value={selectedClass}
          onChange={e => {onSelectClass(e.target.value); setSelectedClass(e.target.value)}}
        >
          {classes.map(c => (
            <option className="cursor-pointer" key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      ) : (
        <span className="me-3 mb-1">{classes[0] || '–'}</span>
      )}
    </>
  );
};

export default ClassDropdown;