import React from 'react';
import { ItemsMasterPage } from './ItemsMasterPage';

// Re-export unified Category & Items Master
export function CategoryMasterPage({ onNavigate }) {
  return <ItemsMasterPage onNavigate={onNavigate} />;
}
