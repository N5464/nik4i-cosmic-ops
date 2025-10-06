export interface MissionItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  buildType: string;
  status: 'completed' | 'in-progress' | 'classified';
}

export const missionData: MissionItem[] = [
  // Ready for your first real mission item
];