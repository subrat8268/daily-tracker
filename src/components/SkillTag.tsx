import React from 'react';

interface SkillTagProps {
  label: string;
}

export const SkillTag: React.FC<SkillTagProps> = ({ label }) => (
  <span className="skill-tag">{label}</span>
);
