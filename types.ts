
export enum Subject {
  BIOLOGY = 'BIOLOGY',
  PHYSICS = 'PHYSICS',
  CHEMISTRY = 'CHEMISTRY'
}

export enum TestType {
  CHAPTER_WISE = 'CHAPTER_WISE',
  MIXED = 'MIXED',
  STATEMENT_BASED = 'STATEMENT_BASED',
  PYQ = 'PYQ'
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  ncertReference: string;
  year?: number; 
  type: TestType;
  chapter: string;
  subject: Subject;
}

export interface Chapter {
  id: string;
  name: string;
  class: 11 | 12;
  unit: string;
  subject: Subject;
}

export interface QuizState {
  id: string;
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  isComplete: boolean;
  startTime: number;
  endTime?: number;
  subject: Subject;
  type: TestType;
}

export interface TestResult {
  id: string;
  date: string;
  subject: Subject;
  type: TestType;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: string;
  quizState: QuizState;
}
