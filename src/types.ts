export type ExtinguisherStatus = 'Seguro' | 'Manutenção' | 'Vencido';

export interface Inspection {
  id: string;
  date: string;
  time: string;
  month?: string;
  inspector: string;
  checklist: {
    manometer: boolean;
    seal: boolean;
    damage: boolean;
    access: boolean;
    signage: boolean;
    inmetro: boolean;
    instructions: boolean;
    diffuser: boolean;
    hose: boolean;
  };
  notes?: string;
  photos?: string[];
}

export interface Extinguisher {
  id: string;
  code: string;
  mapId?: string; // Stable identifier for map positioning
  location: string;
  subLocation: string;
  type: string;
  capacity: string;
  status: ExtinguisherStatus;
  lastRechargeDate: string;
  expiryDate: string;
  inspections: Inspection[];
}

export interface Activity {
  id: string;
  title: string;
  type: 'Concluído' | 'Manutenção' | 'Alerta' | 'Novo Item';
  time: string;
}

export interface Responsible {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
}

export type View = 'dashboard' | 'inventory' | 'inspect' | 'new' | 'map' | 'reports' | 'responsible' | 'settings' | 'inspect_list';
