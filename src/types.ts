export type ExtinguisherStatus = 'Seguro' | 'Manutenção' | 'Vencido';

export interface Inspection {
  id: string;
  date: string;
  inspector: string;
  checklist: {
    manometer: boolean;
    seal: boolean;
    damage: boolean;
    access: boolean;
    signage: boolean;
  };
  notes?: string;
}

export interface Extinguisher {
  id: string;
  code: string;
  location: string;
  subLocation: string;
  type: string;
  capacity: string;
  status: ExtinguisherStatus;
  expiryDate: string;
  inspections: Inspection[];
}

export interface Activity {
  id: string;
  title: string;
  type: 'Concluído' | 'Manutenção' | 'Alerta' | 'Novo Item';
  time: string;
}

export type View = 'dashboard' | 'inventory' | 'inspect' | 'new' | 'map';
