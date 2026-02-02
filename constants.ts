
import { Chapter, Subject } from './types';

export const NCERT_CHAPTERS: Chapter[] = [
  // Biology Class 11
  { id: 'b11-1', name: 'The Living World', class: 11, unit: 'Diversity', subject: Subject.BIOLOGY },
  { id: 'b11-2', name: 'Biological Classification', class: 11, unit: 'Diversity', subject: Subject.BIOLOGY },
  { id: 'b11-8', name: 'Cell: Unit of Life', class: 11, unit: 'Cell', subject: Subject.BIOLOGY },
  { id: 'b11-10', name: 'Cell Cycle & Division', class: 11, unit: 'Cell', subject: Subject.BIOLOGY },
  { id: 'b11-18', name: 'Body Fluids & Circulation', class: 11, unit: 'Physiology', subject: Subject.BIOLOGY },
  // Biology Class 12
  { id: 'b12-5', name: 'Genetics & Variation', class: 12, unit: 'Genetics', subject: Subject.BIOLOGY },
  { id: 'b12-6', name: 'Molecular Inheritance', class: 12, unit: 'Genetics', subject: Subject.BIOLOGY },
  { id: 'b12-11', name: 'Biotech Principles', class: 12, unit: 'Biotech', subject: Subject.BIOLOGY },

  // Physics Class 11
  { id: 'p11-1', name: 'Units & Measurements', class: 11, unit: 'General', subject: Subject.PHYSICS },
  { id: 'p11-3', name: 'Motion in Straight Line', class: 11, unit: 'Mechanics', subject: Subject.PHYSICS },
  { id: 'p11-5', name: 'Laws of Motion', class: 11, unit: 'Mechanics', subject: Subject.PHYSICS },
  { id: 'p11-13', name: 'Kinetic Theory', class: 11, unit: 'Thermodynamics', subject: Subject.PHYSICS },
  // Physics Class 12
  { id: 'p12-1', name: 'Electric Charges & Fields', class: 12, unit: 'Electrostatics', subject: Subject.PHYSICS },
  { id: 'p12-3', name: 'Current Electricity', class: 12, unit: 'Electricity', subject: Subject.PHYSICS },
  { id: 'p12-9', name: 'Ray Optics', class: 12, unit: 'Optics', subject: Subject.PHYSICS },

  // Chemistry Class 11
  { id: 'c11-1', name: 'Some Basic Concepts', class: 11, unit: 'Physical', subject: Subject.CHEMISTRY },
  { id: 'c11-2', name: 'Structure of Atom', class: 11, unit: 'Physical', subject: Subject.CHEMISTRY },
  { id: 'c11-12', name: 'Organic Chem Basics', class: 11, unit: 'Organic', subject: Subject.CHEMISTRY },
  // Chemistry Class 12
  { id: 'c12-3', name: 'Electrochemistry', class: 12, unit: 'Physical', subject: Subject.CHEMISTRY },
  { id: 'c12-10', name: 'Haloalkanes', class: 12, unit: 'Organic', subject: Subject.CHEMISTRY },
  { id: 'c12-7', name: 'p-Block Elements', class: 12, unit: 'Inorganic', subject: Subject.CHEMISTRY },
];
