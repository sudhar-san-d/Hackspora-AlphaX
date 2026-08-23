import type { DepartmentCode } from '../types.js';

export const DEPARTMENT_NAMES: Record<DepartmentCode, string> = {
  roads: 'Roads Department',
  sanitation: 'Waste Management',
  water: 'Water Department',
  drainage: 'Drainage Department',
  electrical: 'Electrical Department',
  traffic: 'Traffic Department',
  public_safety: 'Public Safety Department',
};

export const ISSUE_DEPARTMENT: Record<string, DepartmentCode> = {
  pothole: 'roads',
  'broken footpath': 'roads',
  'damaged footpath': 'roads',
  'road damage': 'roads',
  'open drain': 'drainage',
  'open manhole': 'drainage',
  'sewage overflow': 'drainage',
  'water leakage': 'water',
  'garbage accumulation': 'sanitation',
  garbage: 'sanitation',
  'broken streetlight': 'electrical',
  'fallen tree': 'public_safety',
  'traffic signal': 'traffic',
  'damaged traffic sign': 'traffic',
};
