export interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
  notes?: string;
  scenicScore: number;
  romanceScore: number;
  educationalScore: number;
  convenienceScore: number;
  imageVersion?: number; // added for image reload
}

export type ScoreField =
  | "scenicScore"
  | "romanceScore"
  | "educationalScore"
  | "convenienceScore";
