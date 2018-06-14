export interface Assignment {
  id: number;
  name: string;
}

export interface AssignmentDetail extends Assignment {
  content?: string;
}
