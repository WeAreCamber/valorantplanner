
export interface MapData {
  uuid: string;
  displayName: string;
  splash: string;
  displayIcon: string;
  listViewIcon: string;
  coordinates: string;
}

export interface AgentData {
  uuid: string;
  displayName: string;
  displayIcon: string;
  fullPortrait: string;
  role: {
    displayName: string;
    displayIcon: string;
  } | null;
  description: string;
}

export interface TacticPosition {
  x: number;
  y: number;
  label: string;
  description?: string;
}

export interface TacticPath {
  points: { x: number; y: number }[];
  label: string;
}

export interface TacticUtility {
  x: number;
  y: number;
  type: string;
  agent: string;
  description: string;
}

export interface MapTactics {
  summary: string;
  spawnPosition: TacticPosition;
  keyPositions: TacticPosition[];
  paths: TacticPath[];
  utility: TacticUtility[];
  tips: string[];
}

export interface MapTierList {
  tiers: {
    [key: string]: {
      agentName: string;
      reason: string;
    }[];
  };
  tactics: {
    Attack: MapTactics;
    Defence: MapTactics;
  };
}

export interface AppState {
  currentStep: number;
  selectedMap: MapData | null;
  selectedAgent: AgentData | null;
  selectedSide: 'Attack' | 'Defence' | null;
  setMap: (map: MapData) => void;
  setAgent: (agent: AgentData) => void;
  setSide: (side: 'Attack' | 'Defence') => void;
  reset: () => void;
  goToStep: (step: number) => void;
}
