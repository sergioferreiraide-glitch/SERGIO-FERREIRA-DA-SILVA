import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ScanSearch, 
  PlusCircle, 
  Menu, 
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  History,
  Map as MapIcon,
  ChevronRight,
  Camera,
  Send,
  Info,
  QrCode,
  ArrowRight,
  Pencil,
  Trash2,
  X,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, Extinguisher, Activity } from './types';

// Mock Data
const MOCK_EXTINGUISHERS: Extinguisher[] = [
  // 1. TOPO / ÁREA ADMINISTRATIVA
  { id: '1', code: 'EXT-01', location: 'ADM', subLocation: 'Sala ADM', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '2', code: 'EXT-02', location: 'ADM', subLocation: 'Sala ADM', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '3', code: 'EXT-03', location: 'ADAPAR', subLocation: 'Recepção', type: 'CO2', capacity: '6kg', status: 'Seguro', expiryDate: '15 FEV 2025', inspections: [] },
  { id: '4', code: 'EXT-04', location: 'IDR', subLocation: 'Sala Técnica', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 MAR 2025', inspections: [] },
  { id: '5', code: 'EXT-05', location: 'ADM EXTERNO', subLocation: 'Pavilhão ADM (Externo)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '6', code: 'EXT-06', location: 'CASA CIVIL', subLocation: 'Cozinha', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '7', code: 'EXT-07', location: 'POÇO', subLocation: 'Poço', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '8', code: 'EXT-08', location: 'GUARITA J.K', subLocation: 'Guarita JK', type: 'Pó Químico (ABC)', capacity: '4kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },

  // 2. PAVILHÃO DIREITO
  { id: '9', code: 'EXT-09', location: 'Direito', subLocation: 'NIEHUES', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '10', code: 'EXT-10', location: 'Direito', subLocation: 'JAAM', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '11', code: 'EXT-11', location: 'Direito', subLocation: 'BOX 49', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '12', code: 'EXT-12', location: 'Direito', subLocation: 'MELHORANÇA', type: 'CO2', capacity: '6kg', status: 'Manutenção', expiryDate: '10 NOV 2024', inspections: [] },
  { id: '13', code: 'EXT-13', location: 'Direito', subLocation: 'SÃO MIGUEL', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '14', code: 'EXT-14', location: 'Direito', subLocation: '3 IRMÃOS', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '15', code: 'EXT-15', location: 'Direito', subLocation: 'OLIVEIRA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '16', code: 'EXT-16', location: 'Direito', subLocation: 'NACO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '17', code: 'EXT-17', location: 'Direito', subLocation: 'TABAJARA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '18', code: 'EXT-18', location: 'Direito', subLocation: 'WALKER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '15 DEZ 2024', inspections: [] },

  // Apoios
  { id: '29', code: 'EXT-29', location: 'GUARITA DUQUE', subLocation: 'Guarita Duque (Interno)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '30', code: 'EXT-30', location: 'GUARITA DUQUE', subLocation: 'Guarita Duque (Externo)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '31', code: 'EXT-31', location: 'ACI-MAPA', subLocation: 'ACI (Mapa)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '10 JAN 2025', inspections: [] },

  // 3. PAVILHÃO CENTRAL - LADO ESQUERDO
  { id: '19', code: 'EXT-19', location: 'Central Esquerdo', subLocation: 'COSER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '20', code: 'EXT-20', location: 'Central Esquerdo', subLocation: 'COSER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '21', code: 'EXT-21', location: 'Central Esquerdo', subLocation: 'COSER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '22', code: 'EXT-22', location: 'Central Esquerdo', subLocation: 'VDF', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '23', code: 'EXT-23', location: 'Central Esquerdo', subLocation: 'CONSTANTINO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '24', code: 'EXT-24', location: 'Central Esquerdo', subLocation: 'AQUARELA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '25', code: 'EXT-25', location: 'Central Esquerdo', subLocation: 'HUBNER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '26', code: 'EXT-26', location: 'Central Esquerdo', subLocation: 'KILANCHÃO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '27', code: 'EXT-27', location: 'Central Esquerdo', subLocation: 'OLICAMPO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '28', code: 'EXT-28', location: 'Central Esquerdo', subLocation: 'MENDES', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },

  // 4. PAVILHÃO CENTRAL - LADO DIREITO
  { id: '32', code: 'EXT-32', location: 'Central Direito', subLocation: 'COLORADO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '33', code: 'EXT-33', location: 'Central Direito', subLocation: 'ADRIANA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '34', code: 'EXT-34', location: 'Central Direito', subLocation: 'ESTRELA DO OESTE', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '35', code: 'EXT-35', location: 'Central Direito', subLocation: 'CONSTANTINO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '36', code: 'EXT-36', location: 'Central Direito', subLocation: 'CONSTANTINO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '37', code: 'EXT-37', location: 'Central Direito', subLocation: 'AQUARELA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '38', code: 'EXT-38', location: 'Central Direito', subLocation: 'HUBNER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '39', code: 'EXT-39', location: 'Central Direito', subLocation: 'KILANCHÃO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '40', code: 'EXT-40', location: 'Central Direito', subLocation: 'BERGAMINI', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '41', code: 'EXT-41', location: 'Central Direito', subLocation: 'BERGAMINI', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', expiryDate: '20 JAN 2025', inspections: [] },

  // Pavilhão Esquerdo
  { id: '52', code: 'EXT-52', location: 'Esquerdo', subLocation: 'Corupá', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '51', code: 'EXT-51', location: 'Esquerdo', subLocation: 'Corupá', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '50', code: 'EXT-50', location: 'Esquerdo', subLocation: 'Corupá', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '49', code: 'EXT-49', location: 'Esquerdo', subLocation: 'Maravilha', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '48', code: 'EXT-48', location: 'Esquerdo', subLocation: 'Maravilha', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '47', code: 'EXT-47', location: 'Esquerdo', subLocation: 'Camila Lamb', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '46', code: 'EXT-46', location: 'Esquerdo', subLocation: 'Foz Mar', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '45', code: 'EXT-45', location: 'Esquerdo', subLocation: 'Santa Helena', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '44', code: 'EXT-44', location: 'Esquerdo', subLocation: 'Cersul', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '43', code: 'EXT-43', location: 'Esquerdo', subLocation: 'Banco de Alimentos', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '42', code: 'EXT-42', location: 'Esquerdo', subLocation: 'Beira Rio', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', expiryDate: '01 OUT 2025', inspections: [] },
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Inspeção realizada no Pavilhão Direito, Box Niehues', type: 'Concluído', time: 'há 12 minutos' },
  { id: '2', title: 'Substituição de Lacre: Pavilhão Central, Coluna 12', type: 'Manutenção', time: 'há 2 horas' },
  { id: '3', title: 'Vencimento Reportado: Pavilhão Norte, Box 45', type: 'Alerta', time: 'há 5 horas' },
  { id: '4', title: 'Novo Extintor Cadastrado: Pavilhão Sul, Adm', type: 'Novo Item', time: 'Ontem, 16:45' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>(MOCK_EXTINGUISHERS);
  const [editingExtinguisher, setEditingExtinguisher] = useState<Extinguisher | null>(null);
  const [inspectingExtinguisher, setInspectingExtinguisher] = useState<Extinguisher | null>(null);
  const [deletingExtinguisherId, setDeletingExtinguisherId] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: Extinguisher['status']) => {
    setExtinguishers(prev => prev.map(ext => ext.id === id ? { ...ext, status: newStatus } : ext));
  };

  const handleDeleteExtinguisher = (id: string) => {
    setDeletingExtinguisherId(id);
  };

  const confirmDelete = () => {
    if (deletingExtinguisherId) {
      setExtinguishers(prev => prev.filter(ext => ext.id !== deletingExtinguisherId));
      setDeletingExtinguisherId(null);
    }
  };

  const handleUpdateExtinguisher = (updatedExt: Extinguisher) => {
    setExtinguishers(prev => prev.map(ext => ext.id === updatedExt.id ? updatedExt : ext));
    setEditingExtinguisher(null);
  };

  const handleStartInspection = (ext: Extinguisher) => {
    setInspectingExtinguisher(ext);
    setCurrentView('inspect');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView extinguishers={extinguishers} />;
      case 'inventory': return (
        <InventoryView 
          extinguishers={extinguishers} 
          onStatusChange={handleStatusChange} 
          onDelete={handleDeleteExtinguisher}
          onEdit={(ext) => setEditingExtinguisher(ext)}
          onInspect={handleStartInspection}
        />
      );
      case 'inspect': return (
        <InspectView 
          extinguisher={inspectingExtinguisher || extinguishers[0]} 
          onCancel={() => setCurrentView('inventory')}
        />
      );
      case 'new': return (
        <NewItemView 
          extinguishers={extinguishers}
          onDelete={handleDeleteExtinguisher}
          onEdit={(ext) => setEditingExtinguisher(ext)}
          onStatusChange={handleStatusChange}
          onInspect={handleStartInspection}
        />
      );
      case 'map': return <MapView extinguishers={extinguishers} onInspect={handleStartInspection} />;
      default: return <DashboardView extinguishers={extinguishers} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 h-16 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-primary uppercase tracking-wider">Guardião CEASA</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <img 
              src="https://picsum.photos/seed/inspector/100/100" 
              alt="Profile" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingExtinguisher && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                <h3 className="text-xl font-black uppercase tracking-tight">Editar Extintor {editingExtinguisher.code}</h3>
                <button onClick={() => setEditingExtinguisher(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Código</label>
                    <input 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      value={editingExtinguisher.code}
                      onChange={(e) => setEditingExtinguisher({...editingExtinguisher, code: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      value={editingExtinguisher.type}
                      onChange={(e) => setEditingExtinguisher({...editingExtinguisher, type: e.target.value})}
                    >
                      <option>Pó Químico (ABC)</option>
                      <option>Pó Químico (BC)</option>
                      <option>CO2 (Dióxido de Carbono)</option>
                      <option>Água Pressurizada</option>
                      <option>Espuma Mecânica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Localização</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      value={editingExtinguisher.location}
                      onChange={(e) => setEditingExtinguisher({...editingExtinguisher, location: e.target.value})}
                    >
                      <option>Esquerdo</option>
                      <option>Central Esquerdo</option>
                      <option>Central Direito</option>
                      <option>Direito</option>
                      <option>ADM</option>
                      <option>ADAPAR</option>
                      <option>CASA CIVIL</option>
                      <option>POÇO</option>
                      <option>GUARITA J.K</option>
                      <option>GUARITA DUQUE</option>
                      <option>ACI-MAPA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Box / Sub-localização</label>
                    <input 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      value={editingExtinguisher.subLocation}
                      onChange={(e) => setEditingExtinguisher({...editingExtinguisher, subLocation: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => handleUpdateExtinguisher(editingExtinguisher)}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                >
                  Salvar Alterações
                </button>
                <button 
                  onClick={() => setEditingExtinguisher(null)}
                  className="px-8 bg-white text-gray-500 border border-gray-200 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingExtinguisherId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingExtinguisherId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="text-primary" size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-center mb-2">Confirmar Exclusão?</h3>
              <p className="text-gray-500 text-center mb-8 leading-relaxed">
                Você está prestes a remover o extintor <span className="font-bold text-on-background">{extinguishers.find(e => e.id === deletingExtinguisherId)?.code}</span> do sistema. Esta ação é irreversível.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                >
                  Confirmar Exclusão
                </button>
                <button 
                  onClick={() => setDeletingExtinguisherId(null)}
                  className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 px-2 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 no-print">
        <NavButton 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
          icon={<LayoutDashboard size={20} />} 
          label="Painel" 
        />
        <NavButton 
          active={currentView === 'inventory'} 
          onClick={() => setCurrentView('inventory')} 
          icon={<ClipboardList size={20} />} 
          label="Inventário" 
        />
        <NavButton 
          active={currentView === 'map'} 
          onClick={() => setCurrentView('map')} 
          icon={<MapIcon size={20} />} 
          label="Mapa" 
        />
        <NavButton 
          active={currentView === 'inspect'} 
          onClick={() => setCurrentView('inspect')} 
          icon={<ScanSearch size={20} />} 
          label="Inspecionar" 
        />
        <NavButton 
          active={currentView === 'new'} 
          onClick={() => setCurrentView('new')} 
          icon={<PlusCircle size={20} />} 
          label="Novo" 
        />
      </nav>

      {/* Floating Action Button for Scan */}
      {currentView === 'dashboard' && (
        <button className="fixed right-6 bottom-24 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40">
          <QrCode size={28} />
        </button>
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${active ? 'text-secondary bg-secondary/10 px-4 py-1 rounded-xl' : 'text-gray-500'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}

// --- Views ---

function DashboardView({ extinguishers }: { extinguishers: Extinguisher[] }) {
  const stats = {
    total: extinguishers.length,
    safe: extinguishers.filter(e => e.status === 'Seguro').length,
    maintenance: extinguishers.filter(e => e.status === 'Manutenção').length,
    expired: extinguishers.filter(e => e.status === 'Vencido').length,
  };

  const safePercentage = stats.total > 0 ? Math.round((stats.safe / stats.total) * 100) : 0;

  // Group by type
  const types = extinguishers.reduce((acc: any, ext) => {
    acc[ext.type] = (acc[ext.type] || 0) + 1;
    return acc;
  }, {});

  // Group by pavilion for heatmap
  const pavilionStats = extinguishers.reduce((acc: any, ext) => {
    const loc = ext.location;
    if (!acc[loc]) acc[loc] = { total: 0, safe: 0 };
    acc[loc].total++;
    if (ext.status === 'Seguro') acc[loc].safe++;
    return acc;
  }, {});

  const getPavilionColor = (safe: number, total: number) => {
    const pct = (safe / total) * 100;
    if (pct >= 95) return 'secondary';
    if (pct >= 80) return 'tertiary';
    return 'primary';
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard 
          title="Estado Geral" 
          value={stats.safe.toString().padStart(2, '0')} 
          subtitle="Extintores em Conformidade" 
          footer={`${safePercentage}% do Total`} 
          color="secondary" 
          icon={<CheckCircle2 className="opacity-10 absolute -right-4 -bottom-4 w-32 h-32" />}
        />
        <StatusCard 
          title="Atenção Necessária" 
          value={stats.maintenance.toString().padStart(2, '0')} 
          subtitle="Em Manutenção / Alerta" 
          footer={`Total: ${stats.total} unidades`} 
          color="tertiary" 
          icon={<History className="opacity-10 absolute -right-4 -bottom-4 w-32 h-32" />}
        />
        <StatusCard 
          title="Crítico" 
          value={stats.expired.toString().padStart(2, '0')} 
          subtitle="Vencidos ou Irregulares" 
          footer="Ação Requerida Imediata" 
          color="primary" 
          icon={<AlertTriangle className="opacity-10 absolute -right-4 -bottom-4 w-32 h-32" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold">Distribuição por Tipo</h2>
              <p className="text-xs text-gray-500">Composição da frota de segurança</p>
            </div>
            <LayoutDashboard className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {Object.entries(types).map(([type, count]: [string, any]) => (
              <ProgressBar 
                key={type}
                label={type} 
                value={Math.round((count / stats.total) * 100)} 
                count={`${count} UNID.`} 
                color={type.includes('CO2') ? 'bg-secondary' : type.includes('Água') ? 'bg-tertiary' : 'bg-primary'} 
              />
            ))}
          </div>
          <div className="mt-6 p-4 bg-background rounded-xl border border-primary/10 text-xs text-gray-600">
            <span className="font-bold text-primary block mb-1">Nota do Sentinel:</span>
            O sistema detectou {stats.expired} equipamentos com validade expirada. Recomenda-se a troca imediata para manter a conformidade.
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-primary">Atividades Recentes</h2>
              <p className="text-xs text-gray-500">Histórico de campo em tempo real</p>
            </div>
            <History className="text-primary" size={20} />
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                  activity.type === 'Concluído' ? 'bg-secondary-container text-secondary' :
                  activity.type === 'Manutenção' ? 'bg-tertiary/20 text-tertiary' :
                  activity.type === 'Alerta' ? 'bg-error-container text-primary' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'Concluído' ? <CheckCircle2 size={14} /> : <Wrench size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100">{activity.type}</span>
                    <span className="text-[10px] text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
            Ver Relatório Completo
          </button>
        </div>

        {/* Map Heatmap */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold">Status por Localização</h2>
              <p className="text-xs text-gray-500">Conformidade em tempo real por setor</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(pavilionStats).sort((a: any, b: any) => b[1].total - a[1].total).map(([loc, data]: [string, any]) => (
                <PavilionZone 
                  key={loc}
                  label={loc} 
                  value={`${Math.round((data.safe / data.total) * 100)}%`} 
                  color={getPavilionColor(data.safe, data.total)} 
                />
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Equipe em Campo:</span>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/50?u=${i}`} alt="Avatar" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-6 h-6 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[8px] text-white font-bold">+2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryView({ extinguishers, onStatusChange, onDelete, onEdit, onInspect }: { 
  extinguishers: Extinguisher[], 
  onStatusChange: (id: string, status: Extinguisher['status']) => void,
  onDelete: (id: string) => void,
  onEdit: (ext: Extinguisher) => void,
  onInspect: (ext: Extinguisher) => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['Todos', 'Esquerdo', 'Central Esquerdo', 'Central Direito', 'Direito', 'ADM', 'ADAPAR', 'CASA CIVIL', 'POÇO', 'GUARITA J.K', 'GUARITA DUQUE', 'ACI-MAPA'];

  const filteredExtinguishers = extinguishers.filter(ext => {
    const matchesFilter = selectedFilter === 'Todos' || ext.location === selectedFilter;
    const matchesSearch = ext.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ext.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ext.subLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Inventário de Extintores</h2>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm" 
              placeholder="Buscar por ID (EXT-00) ou Localização..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button 
              key={filter} 
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${selectedFilter === filter ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredExtinguishers.map((ext) => (
          <div key={ext.id} className="bg-white rounded-2xl border-b-2 border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div 
              className="p-5 flex flex-col md:flex-row items-start md:items-center gap-6 cursor-pointer group"
              onClick={() => setExpandedId(expandedId === ext.id ? null : ext.id)}
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`text-3xl font-black opacity-20 group-hover:opacity-40 transition-colors ${
                  ext.status === 'Seguro' ? 'text-secondary' : ext.status === 'Vencido' ? 'text-primary' : 'text-tertiary'
                }`}>
                  {ext.code.split('-')[1]}
                </div>
                <div className={`h-12 w-1 rounded-full ${
                  ext.status === 'Seguro' ? 'bg-secondary' : ext.status === 'Vencido' ? 'bg-primary' : 'bg-tertiary'
                }`}></div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Código</span>
                  <h3 className="text-lg font-bold leading-tight">{ext.code}</h3>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Localização</span>
                  <p className="text-sm font-semibold">{ext.location}</p>
                  <p className="text-xs text-gray-400">{ext.subLocation}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tipo</span>
                  <p className="text-sm font-semibold">{ext.type}</p>
                  <p className="text-xs text-gray-400">{ext.capacity}</p>
                </div>
                <div className="col-span-2 md:col-span-1 flex items-center md:justify-end gap-3">
                  <div className="flex items-center gap-2 mr-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onInspect(ext)}
                      className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                      title="Inspecionar"
                    >
                      <ScanSearch size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(ext)}
                      className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(ext.id)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="relative group/status" onClick={(e) => e.stopPropagation()}>
                    <button className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 transition-all hover:brightness-95 ${
                      ext.status === 'Seguro' ? 'bg-secondary-container text-secondary' :
                      ext.status === 'Vencido' ? 'bg-error-container text-primary animate-pulse' :
                      'bg-tertiary/10 text-tertiary'
                    }`}>
                      {ext.status === 'Seguro' ? <CheckCircle2 size={12} /> : ext.status === 'Vencido' ? <AlertTriangle size={12} /> : <Wrench size={12} />}
                      {ext.status}
                    </button>
                    
                    <div className="absolute right-0 top-full mt-1 bg-white shadow-xl rounded-xl border border-gray-100 py-2 hidden group-hover/status:block z-20 min-w-[120px]">
                      {(['Seguro', 'Manutenção', 'Vencido'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => onStatusChange(ext.id, status)}
                          className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors ${ext.status === status ? 'text-primary' : 'text-gray-500'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ChevronRight size={20} className={`text-gray-300 transition-transform ${expandedId === ext.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </div>

            {/* Expanded History Section */}
            <AnimatePresence>
              {expandedId === ext.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gray-50 border-t border-gray-100"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Histórico de Inspeções</h4>
                      <History size={16} className="text-gray-400" />
                    </div>
                    
                    {ext.inspections.length > 0 ? (
                      <div className="space-y-4">
                        {ext.inspections.map((insp) => (
                          <div key={insp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold">{insp.date}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Inspetor: {insp.inspector}</p>
                              </div>
                              <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded font-bold uppercase">Validado</span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                              <CheckBadge label="Manômetro" active={insp.checklist.manometer} />
                              <CheckBadge label="Lacre" active={insp.checklist.seal} />
                              <CheckBadge label="Danos" active={insp.checklist.damage} />
                              <CheckBadge label="Acesso" active={insp.checklist.access} />
                              <CheckBadge label="Sinaliz." active={insp.checklist.signage} />
                            </div>

                            {insp.notes && (
                              <div className="p-2 bg-background rounded-lg border border-primary/5 text-[10px] text-gray-600 italic">
                                "{insp.notes}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Info size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-xs font-medium">Nenhuma inspeção registrada para este ativo.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckBadge({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-bold uppercase ${
      active ? 'bg-secondary/5 border-secondary/20 text-secondary' : 'bg-primary/5 border-primary/20 text-primary'
    }`}>
      {active ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
      {label}
    </div>
  );
}

function InspectView({ extinguisher, onCancel }: { extinguisher: Extinguisher, onCancel: () => void }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-1 block">Protocolo Industrial</span>
          <h2 className="text-4xl font-extrabold tracking-tight leading-none">Inspeção Mensal</h2>
          <p className="text-gray-500 mt-2 font-medium">Relatório Técnico de Segurança Contra Incêndio</p>
        </div>
        <div className="bg-white px-4 py-3 rounded-xl border-l-4 border-primary shadow-sm">
          <p className="text-[10px] uppercase font-bold text-primary mb-1">ID do Equipamento</p>
          <p className="text-xl font-black font-mono tracking-tighter">{extinguisher.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoBox icon={<LayoutDashboard className="text-primary" />} label="Pavilhão" value={extinguisher.location} />
        <InfoBox icon={<ClipboardList className="text-primary" />} label="Box" value={extinguisher.subLocation} />
        <InfoBox icon={<History className="text-primary" />} label="Vencimento" value={extinguisher.expiryDate} highlight />
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-primary rounded-full"></div>
          <h3 className="text-sm font-black uppercase tracking-widest">Checklist de Conformidade</h3>
        </div>
        <div className="space-y-3">
          <ChecklistItem icon={<ScanSearch />} label="Manômetro na zona verde?" name="mano" />
          <ChecklistItem icon={<CheckCircle2 />} label="Lacre intacto?" name="lacre" />
          <ChecklistItem icon={<Info />} label="Sem danos físicos?" name="danos" />
          <ChecklistItem icon={<ArrowRight />} label="Acesso desobstruído?" name="acesso" />
          <ChecklistItem icon={<ScanSearch />} label="Sinalização visível?" name="sinal" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Fotos do Extintor</h3>
            <Camera className="text-secondary" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <PhotoPlaceholder label="Frente" />
            <PhotoPlaceholder label="Etiqueta" />
          </div>
          <p className="text-[10px] text-gray-500 font-medium italic">Certifique-se de que a leitura do manômetro e o lacre estejam nítidos nas fotos.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Notas Técnicas</h3>
            <History className="text-secondary" />
          </div>
          <textarea 
            className="w-full bg-background h-32 rounded-2xl border-none focus:ring-2 focus:ring-primary p-4 text-sm font-medium" 
            placeholder="Descreva qualquer irregularidade ou observação relevante..."
          />
          <div className="mt-4 flex items-center gap-2">
            <Info className="text-tertiary" size={16} />
            <p className="text-[10px] text-tertiary font-bold uppercase tracking-tight">Ocorrências serão enviadas à Manutenção.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button className="w-full md:w-auto md:px-12 py-5 bg-gradient-to-r from-secondary to-green-700 text-white rounded-full font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
          Finalizar Inspeção
          <Send size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={onCancel}
          className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
        >
          Cancelar Protocolo
        </button>
      </div>
    </div>
  );
}

function NewItemView({ extinguishers, onDelete, onEdit, onStatusChange, onInspect }: { 
  extinguishers: Extinguisher[], 
  onDelete: (id: string) => void,
  onEdit: (ext: Extinguisher) => void,
  onStatusChange: (id: string, status: Extinguisher['status']) => void,
  onInspect: (ext: Extinguisher) => void
}) {
  const [selectedPavilion, setSelectedPavilion] = useState('Central Direito');

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Novo Extintor</h2>
          <p className="text-gray-500 font-medium">Cadastre um novo dispositivo de segurança no sistema operacional.</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border-b-2 border-primary/20">
              <label className="block text-sm font-bold text-primary uppercase tracking-widest mb-4">Identificação do Ativo</label>
              <div className="flex items-center gap-4">
                <div className="flex-grow relative">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-semibold" 
                    placeholder="Digite o código ID do extintor" 
                  />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400 italic flex items-center gap-1">
                <Info size={14} />
                Insira o código alfanumérico presente na etiqueta do ativo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-b-2 border-secondary/20">
              <label className="block text-sm font-bold text-secondary uppercase tracking-widest mb-4">Tipo de Extintor</label>
              <select className="w-full py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-secondary font-semibold appearance-none px-4">
                <option>Pó Químico (ABC)</option>
                <option>Pó Químico (BC)</option>
                <option>CO2 (Dióxido de Carbono)</option>
                <option>Água Pressurizada</option>
                <option>Espuma Mecânica</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-b-2 border-tertiary/20">
              <label className="block text-sm font-bold text-tertiary uppercase tracking-widest mb-2">Capacidade</label>
              <div className="flex items-end gap-2">
                <input className="w-full py-2 bg-transparent border-b-2 border-gray-100 focus:border-tertiary outline-none font-bold text-2xl" type="number" defaultValue="6" />
                <span className="text-tertiary font-bold mb-2">KG</span>
              </div>
            </div>
            <FormDate label="Fabricação" />
            <FormDate label="Última Carga" />
            <FormDate label="Vencimento" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <label className="block text-sm font-bold uppercase tracking-widest mb-4">Localização CEASA</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Pavilhão (Seleção)</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                      {['Direito', 'Central Esquerdo', 'Central Direito', 'Esquerdo', 'ADM', 'ADAPAR', 'CASA CIVIL', 'POÇO', 'GUARITA J.K', 'GUARITA DUQUE', 'ACI-MAPA'].map(p => (
                        <button 
                          key={p} 
                          type="button" 
                          onClick={() => setSelectedPavilion(p)}
                          className={`py-2 px-1 text-[9px] font-bold border rounded uppercase transition-all ${selectedPavilion === p ? 'bg-secondary text-white border-secondary shadow-md' : 'border-gray-200 hover:bg-secondary/10'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Box / Sub-localização (Digitável)</span>
                    <input 
                      className="w-full mt-1 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary font-semibold px-4"
                      placeholder="Ex: BOX 01, Pavilhão Central, Coluna A"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button type="submit" className="flex-grow bg-primary text-white py-5 rounded-2xl font-extrabold text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <PlusCircle size={24} />
              SALVAR DISPOSITIVO
            </button>
            <button type="button" className="md:w-1/4 bg-gray-100 text-gray-500 py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-sm">
              CANCELAR
            </button>
          </div>
        </form>
      </div>

      <div className="pt-12 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Extintores Cadastrados</h3>
            <p className="text-xs text-gray-400 font-bold uppercase">Gerencie os ativos existentes</p>
          </div>
        </div>
        <InventoryView 
          extinguishers={extinguishers} 
          onStatusChange={onStatusChange} 
          onDelete={onDelete} 
          onEdit={onEdit}
          onInspect={onInspect}
        />
      </div>
    </div>
  );
}

function MapView({ extinguishers, onInspect }: { extinguishers: Extinguisher[], onInspect: (ext: Extinguisher) => void }) {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const getStatusColor = (code: string) => {
    const ext = extinguishers.find(e => e.code === code);
    if (!ext) return 'bg-gray-50 text-gray-400 border-gray-200';
    if (ext.status === 'Seguro') return 'bg-white text-secondary border-secondary/40';
    if (ext.status === 'Manutenção') return 'bg-white text-tertiary border-tertiary/40';
    return 'bg-white text-primary border-primary/40 animate-pulse';
  };

  const MapPoint = ({ code, label, position = 'top' }: { code: string, label: string, position?: 'top' | 'bottom' }) => {
    const ext = extinguishers.find(e => e.code === code);
    const isSelected = selectedPoint === code;
    return (
      <div className={`relative group ${isSelected ? 'z-[100]' : 'z-10'}`}>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPoint(isSelected ? null : code);
          }}
          className={`flex flex-col items-center justify-center p-1 border rounded-md text-[8px] font-black uppercase transition-all hover:scale-110 cursor-pointer shadow-sm ${getStatusColor(code)} ${isSelected ? 'ring-2 ring-primary/30 scale-110' : ''}`}
        >
          <span className="leading-none">{label}</span>
          <span className="text-[7px] opacity-70 font-bold leading-none">{code}</span>
        </button>

        <AnimatePresence>
          {isSelected && ext && (
            <motion.div 
              initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.9 }}
              className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 cursor-default`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase ${
                  ext.status === 'Seguro' ? 'bg-secondary/10 text-secondary' : 
                  ext.status === 'Manutenção' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                }`}>
                  {ext.status}
                </span>
                <button onClick={() => setSelectedPoint(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={12} />
                </button>
              </div>
              <h4 className="text-xs font-black text-gray-900 leading-none">{ext.code}</h4>
              <div className="mt-1 mb-2">
                <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">{ext.location}</p>
                <p className="text-[8px] text-gray-400 font-medium uppercase leading-tight">{ext.subLocation}</p>
              </div>
              
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[8px] border-b border-gray-50 pb-1">
                  <span className="text-gray-400 font-bold uppercase">Tipo:</span>
                  <span className="font-black text-gray-700 truncate ml-2">{ext.type}</span>
                </div>
                <div className="flex justify-between text-[8px]">
                  <span className="text-gray-400 font-bold uppercase">Venc.:</span>
                  <span className="font-black text-primary">{ext.expiryDate}</span>
                </div>
              </div>

              <button 
                onClick={() => onInspect(ext)}
                className="w-full py-1.5 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
              >
                <ScanSearch size={12} />
                Inspecionar
              </button>
              
              <div className={`absolute ${position === 'top' ? 'top-full border-t-white' : 'bottom-full border-b-white'} left-1/2 -translate-x-1/2 border-8 border-transparent`}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12" onClick={() => setSelectedPoint(null)}>
      <div className="flex justify-between items-end no-print">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Mapa de Localização</h2>
          <p className="text-gray-500 font-medium">Layout industrial dos dispositivos de segurança</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Legend moved to header */}
          <div className="hidden md:flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm no-print">
            <div className="flex items-center gap-2 text-[10px] font-black">
              <div className="w-3 h-3 bg-secondary rounded shadow-sm"></div>
              <span className="text-gray-500">CONFORME</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black">
              <div className="w-3 h-3 bg-tertiary rounded shadow-sm"></div>
              <span className="text-gray-500">MANUTENÇÃO</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black">
              <div className="w-3 h-3 bg-primary rounded shadow-sm"></div>
              <span className="text-gray-500">VENCIDO</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={() => {
                try {
                  window.print();
                } catch (e) {
                  alert("Para imprimir, por favor abra o aplicativo em uma nova aba ou use Ctrl+P no seu navegador.");
                }
              }}
              className="flex items-center gap-2 bg-white border-2 border-primary text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
            >
              <Printer size={20} />
              Imprimir A4
            </button>
            <p className="text-[10px] text-gray-400 font-bold uppercase no-print">Dica: Se não abrir, use Ctrl+P</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-3xl shadow-xl border border-gray-100 overflow-x-auto print-map-container relative">
        {/* Map Legend removed from here */}

        {/* Compass Indicator */}
        <div className="absolute bottom-6 left-6 flex flex-col items-center gap-1 opacity-20 no-print">
          <div className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center relative">
            <div className="w-0.5 h-6 bg-gray-400 absolute top-0 rotate-0"></div>
            <span className="absolute -top-4 text-[10px] font-black">N</span>
          </div>
          <span className="text-[8px] font-black uppercase">Orientação Industrial</span>
        </div>

        <div className="min-w-[800px] py-12 space-y-16 print-map-content">
          {/* Print Header */}
          <div className="hidden print:flex justify-between items-center border-b-2 border-gray-100 pb-4 mb-8">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-primary">Mapa de Dispositivos de Segurança</h1>
              <p className="text-xs font-bold text-gray-400 uppercase">CEASA - Central de Abastecimento do Paraná</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase">Data de Emissão</p>
              <p className="text-sm font-bold">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {/* Top Section - ADM, ADAPAR, IDR, CASA CIVIL */}
          <div className="flex justify-between items-start gap-8">
            <div className="flex gap-6 items-stretch">
              {/* Bloco ADM e Casa Civil */}
              <div className="flex border-2 border-gray-200 rounded-2xl bg-gray-50/30">
                <div className="w-40 h-32 border-r-2 border-gray-200 flex flex-col items-center justify-center relative p-2">
                  <span className="text-xs font-black text-gray-400 uppercase mb-4">ADM</span>
                  <div className="absolute top-2 left-2"><MapPoint code="EXT-01" label="EXT 1" position="bottom" /></div>
                  <div className="absolute bottom-2 left-2"><MapPoint code="EXT-02" label="EXT 2" /></div>
                </div>
                <div className="w-32 h-32 flex flex-col items-center justify-center relative p-2 bg-white/50">
                  <span className="text-[10px] font-black text-gray-400 uppercase text-center leading-tight">CASA CIVIL<br/>COZINHA</span>
                  <div className="absolute top-2 right-2"><MapPoint code="EXT-06" label="EXT 6" position="bottom" /></div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex flex-col items-center">
                      <MapPoint code="EXT-05" label="EXT 5" />
                      <span className="text-[8px] font-black text-primary uppercase mt-1">EXTERNO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco ADAPAR e IDR */}
              <div className="flex flex-col border-2 border-gray-200 rounded-2xl bg-gray-50/30 w-48 h-32">
                <div className="flex-1 border-b-2 border-gray-200 relative p-2 flex items-center justify-center">
                  <span className="text-xs font-black text-gray-400 uppercase">ADAPAR</span>
                  <div className="absolute top-2 right-2"><MapPoint code="EXT-03" label="EXT 3" position="bottom" /></div>
                </div>
                <div className="flex-1 relative p-2 flex items-center justify-center bg-white/50">
                  <span className="text-xs font-black text-gray-400 uppercase">IDR</span>
                  <div className="absolute bottom-2 right-2"><MapPoint code="EXT-04" label="EXT 4" /></div>
                </div>
              </div>
            </div>

            {/* Bloco Poço e Guarita */}
            <div className="flex gap-12">
              <div className="w-32 h-32 border-2 border-primary/20 bg-primary/5 rounded-2xl flex flex-col items-center justify-center relative p-2">
                <span className="text-xs font-black text-primary uppercase">POÇO</span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"><MapPoint code="EXT-07" label="EXT 7" position="bottom" /></div>
              </div>
              <div className="w-32 h-32 border-2 border-secondary/20 bg-secondary/5 rounded-2xl flex flex-col items-center justify-center relative p-2">
                <span className="text-xs font-black text-secondary uppercase text-center leading-tight">GUARITA<br/>J.K</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"><MapPoint code="EXT-08" label="EXT 8" /></div>
              </div>
            </div>
          </div>

          {/* Main Pavilions */}
          <div className="grid grid-cols-3 gap-12 items-start">
            {/* Pavilhão Direito */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MapIcon size={16} />
                </div>
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-primary">Pavilhão Direito</h3>
              </div>
              <div className="border-2 border-primary/20 rounded-3xl p-4 space-y-2 bg-primary/5 shadow-inner">
                {['NIEHUES', 'JAAM', '49', 'MELHORANÇA', 'SÃO MIGUEL', '3 IRMÃOS', 'OLIVEIRA', 'NACO', 'TABAJARA', 'WALKER'].map((box, i) => (
                  <div key={box} className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500">{box}</span>
                    <MapPoint code={`EXT-${(i + 9).toString().padStart(2, '0')}`} label={`EXT ${i + 9}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pavilhão Central */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <MapIcon size={16} />
                </div>
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-secondary">Pavilhão Central</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 border-2 border-secondary/20 rounded-3xl p-4 bg-secondary/5 shadow-inner">
                <div className="space-y-2 pr-2 border-r border-secondary/10">
                  <span className="text-[8px] font-black text-gray-400 uppercase block text-center mb-2">Lado Esquerdo</span>
                  {['COSER', 'COSER', 'COSER', 'VDF', 'CONSTANTINO', 'AQUARELA', 'HUBNER', 'KILANCHÃO', 'OLICAMPO', 'MENDES'].map((box, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-1.5 rounded-lg border border-gray-100 shadow-sm">
                      <span className="text-[8px] font-bold text-gray-400">{box}</span>
                      <MapPoint code={`EXT-${(i + 19).toString().padStart(2, '0')}`} label={`EXT ${i + 19}`} />
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pl-2">
                  <span className="text-[8px] font-black text-gray-400 uppercase block text-center mb-2">Lado Direito</span>
                  {['COLORADO', 'ADRIANA', 'ESTRELA', 'CONST.', 'CONSTANTINO', 'AQUARELA', 'HUBNER', 'KILANCHÃO', 'BERGAMINI', 'BERGAMINI'].map((box, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-1.5 rounded-lg border border-gray-100 shadow-sm">
                      <MapPoint code={`EXT-${(i + 32).toString().padStart(2, '0')}`} label={`EXT ${i + 32}`} />
                      <span className="text-[8px] font-bold text-gray-400">{box}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pavilhão Esquerdo */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <MapIcon size={16} />
                </div>
                <h3 className="text-center text-xs font-black uppercase tracking-widest text-tertiary">Pavilhão Esquerdo</h3>
              </div>
              <div className="border-2 border-tertiary/20 rounded-3xl p-4 space-y-2 bg-tertiary/5 shadow-inner">
                {['CORUPÁ', 'CORUPÁ', 'CORUPÁ', 'MARAVILHA', 'MARAVILHA', 'CAMILA LAMB', 'FOZ MAR', 'SANTA HELENA', 'CERSUL', 'BANCO DE ALIMENTOS', 'BEIRA RIO'].map((box, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <MapPoint code={`EXT-${(52 - i).toString().padStart(2, '0')}`} label={`EXT ${52 - i}`} />
                    <span className="text-[10px] font-bold text-gray-500">{box}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - ACI e Guarita Duque */}
          <div className="flex justify-around items-end pt-8">
            <div className="w-40 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative bg-gray-50/50">
              <span className="text-xs font-black text-gray-400 uppercase leading-tight text-center">GUARITA<br/>DUQUE</span>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"><MapPoint code="EXT-30" label="EXT 30" /></div>
              <div className="absolute bottom-2 right-2"><MapPoint code="EXT-29" label="EXT 29" /></div>
            </div>
            <div className="w-40 h-20 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative bg-gray-50/50">
              <span className="text-xs font-black text-gray-400 uppercase">ACI-MAPA</span>
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"><MapPoint code="EXT-31" label="EXT 31" /></div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:flex justify-between items-end mt-12 pt-8 border-t-2 border-gray-100">
            <div className="space-y-4">
              <div className="w-64 border-b border-gray-400"></div>
              <p className="text-[10px] font-black uppercase text-gray-400">Assinatura do Responsável Técnico</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase">Sentinel Safety System</p>
              <p className="text-[8px] text-gray-300 uppercase">Relatório Gerado Automaticamente</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <div className="flex items-center gap-3 mb-2">
          <Info className="text-primary" size={20} />
          <h4 className="text-sm font-black uppercase tracking-widest text-primary">Legenda Técnica</h4>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          O mapa acima reflete a disposição física dos extintores conforme o rascunho operacional. 
          Os pontos coloridos indicam o status em tempo real. Toque em um ponto para ver detalhes do ativo no inventário.
        </p>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatusCard({ title, value, subtitle, footer, color, icon }: any) {
  const colorClasses = {
    primary: 'border-primary text-primary',
    secondary: 'border-secondary text-secondary',
    tertiary: 'border-tertiary text-tertiary',
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 flex flex-col justify-between relative overflow-hidden group ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="relative z-10">
        <span className="font-bold text-xs uppercase tracking-widest mb-1 block opacity-70">{title}</span>
        <h3 className="text-4xl font-extrabold text-on-background tracking-tighter">{value}</h3>
        <p className="text-gray-500 font-medium mt-1">{subtitle}</p>
      </div>
      <div className="mt-4 flex items-center text-sm font-bold">
        <Info size={14} className="mr-1" />
        {footer}
      </div>
      {icon}
    </div>
  );
}

function ProgressBar({ label, value, count, color }: any) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function PavilionZone({ label, value, color }: any) {
  const bgColors = {
    primary: 'bg-primary/10 border-primary text-primary',
    secondary: 'bg-secondary/10 border-secondary text-secondary',
    tertiary: 'bg-tertiary/10 border-tertiary text-tertiary',
  };

  return (
    <div className={`border flex items-center justify-center flex-col p-2 backdrop-blur-sm rounded ${bgColors[color as keyof typeof bgColors]}`}>
      <span className="text-[10px] font-extrabold uppercase">{label}</span>
      <span className="text-xl font-black">{value}</span>
    </div>
  );
}

function InfoBox({ icon, label, value, highlight }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border-b-2 border-primary/10">
      <div className="mb-2">{icon}</div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</h3>
      <p className={`text-lg font-semibold ${highlight ? 'text-primary' : ''}`}>{value}</p>
    </div>
  );
}

function ChecklistItem({ icon, label, name }: any) {
  return (
    <div className="bg-gray-50 group flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all border-l-4 border-transparent hover:border-secondary">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm">
          {icon}
        </div>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <div className="flex gap-2">
        {['Sim', 'Não'].map(opt => (
          <label key={opt} className="cursor-pointer">
            <input type="radio" name={name} className="hidden peer" />
            <span className={`px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold uppercase transition-all peer-checked:bg-secondary peer-checked:text-white peer-checked:border-secondary hover:bg-gray-100`}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PhotoPlaceholder({ label }: any) {
  return (
    <div className="aspect-square rounded-2xl bg-background flex flex-col items-center justify-center border-2 border-dashed border-gray-200 group cursor-pointer hover:border-primary transition-all">
      <Camera className="text-gray-300 group-hover:text-primary mb-1" size={24} />
      <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary uppercase">{label}</span>
    </div>
  );
}

function FormDate({ label }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-b-2 border-gray-100">
      <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
      <input className="w-full bg-transparent border-none p-0 focus:ring-0 font-semibold text-sm" type="date" />
    </div>
  );
}
