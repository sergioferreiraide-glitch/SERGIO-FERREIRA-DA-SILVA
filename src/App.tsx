import React, { useState, useEffect, useRef } from 'react';
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
  Printer,
  FileText,
  Users,
  UserCog,
  Download,
  Filter,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  FileSpreadsheet,
  FileDown,
  Calendar,
  LogOut,
  LogIn,
  Mail,
  Copy,
  Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import { View, Extinguisher, Activity, Responsible } from './types';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

// Mock Data
const MAP_POSITIONS = [
  'EXT-01', 'EXT-02', 'EXT-03', 'EXT-04', 'EXT-05', 'EXT-06', 'EXT-07', 'EXT-08', // ADM/Guarita
  'EXT-09', 'EXT-10', 'EXT-11', 'EXT-12', 'EXT-13', 'EXT-14', 'EXT-15', 'EXT-16', 'EXT-17', 'EXT-18', // Direito
  'EXT-19', 'EXT-20', 'EXT-21', 'EXT-22', 'EXT-23', 'EXT-24', 'EXT-25', 'EXT-26', 'EXT-27', 'EXT-28', // Central Esq
  'EXT-29', 'EXT-30', 'EXT-31', // Apoios
  'EXT-32', 'EXT-33', 'EXT-34', 'EXT-35', 'EXT-36', 'EXT-37', 'EXT-38', 'EXT-39', 'EXT-40', 'EXT-41', 'EXT-42', 'EXT-43', 'EXT-44', // Central Dir
  'EXT-45', 'EXT-46', 'EXT-47', 'EXT-48', 'EXT-49', 'EXT-50', 'EXT-51', 'EXT-52', // Esquerdo
];

const MOCK_EXTINGUISHERS: Extinguisher[] = [
  // 1. TOPO / ÁREA ADMINISTRATIVA
  { id: '1', code: 'EXT-01', mapId: 'EXT-01', location: 'ADM', subLocation: 'Sala ADM', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [{ id: 'insp1', date: '16/04/2026', time: '08:00', inspector: 'Sergio Ferreira', checklist: { manometer: true, seal: true, damage: true, access: true, signage: true, inmetro: true, instructions: true, diffuser: true, hose: true } }] },
  { id: '2', code: 'EXT-02', mapId: 'EXT-02', location: 'ADM', subLocation: 'Sala ADM', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [{ id: 'insp2', date: '16/04/2026', time: '08:15', inspector: 'Sergio Ferreira', checklist: { manometer: true, seal: true, damage: true, access: true, signage: true, inmetro: true, instructions: true, diffuser: true, hose: true } }] },
  { id: '3', code: 'EXT-03', mapId: 'EXT-03', location: 'ADAPAR', subLocation: 'Recepção', type: 'CO2', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 FEV 2024', expiryDate: '15 FEV 2025', inspections: [{ id: 'insp3', date: '16/04/2026', time: '08:30', inspector: 'Sergio Ferreira', checklist: { manometer: true, seal: true, damage: true, access: true, signage: true, inmetro: true, instructions: true, diffuser: true, hose: true } }] },
  { id: '4', code: 'EXT-04', mapId: 'EXT-04', location: 'IDR', subLocation: 'Sala Técnica', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 MAR 2024', expiryDate: '20 MAR 2025', inspections: [{ id: 'insp4', date: '16/04/2026', time: '08:45', inspector: 'Sergio Ferreira', checklist: { manometer: true, seal: true, damage: true, access: true, signage: true, inmetro: true, instructions: true, diffuser: true, hose: true } }] },
  { id: '5', code: 'EXT-05', mapId: 'EXT-05', location: 'ADM EXTERNO', subLocation: 'Pavilhão ADM (Externo)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '6', code: 'EXT-06', mapId: 'EXT-06', location: 'CASA CIVIL', subLocation: 'Cozinha', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '7', code: 'EXT-07', mapId: 'EXT-07', location: 'POÇO', subLocation: 'Poço', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '8', code: 'EXT-08', mapId: 'EXT-08', location: 'GUARITA J.K', subLocation: 'Guarita JK', type: 'Pó Químico (ABC)', capacity: '4kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [] },

  // 2. PAVILHÃO DIREITO
  { id: '9', code: 'EXT-09', mapId: 'EXT-09', location: 'Direito', subLocation: 'NIEHUES', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '10', code: 'EXT-10', mapId: 'EXT-10', location: 'Direito', subLocation: 'JAAM', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '11', code: 'EXT-11', mapId: 'EXT-11', location: 'Direito', subLocation: 'BOX 49', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '12', code: 'EXT-12', mapId: 'EXT-12', location: 'Direito', subLocation: 'MELHORANÇA', type: 'CO2', capacity: '6kg', status: 'Manutenção', lastRechargeDate: '10 NOV 2023', expiryDate: '10 NOV 2024', inspections: [] },
  { id: '13', code: 'EXT-13', mapId: 'EXT-13', location: 'Direito', subLocation: 'SÃO MIGUEL', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '14', code: 'EXT-14', mapId: 'EXT-14', location: 'Direito', subLocation: '3 IRMÃOS', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '15', code: 'EXT-15', mapId: 'EXT-15', location: 'Direito', subLocation: 'OLIVEIRA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '16', code: 'EXT-16', mapId: 'EXT-16', location: 'Direito', subLocation: 'NACO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '17', code: 'EXT-17', mapId: 'EXT-17', location: 'Direito', subLocation: 'TABAJARA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },
  { id: '18', code: 'EXT-18', mapId: 'EXT-18', location: 'Direito', subLocation: 'WALKER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '15 DEZ 2023', expiryDate: '15 DEZ 2024', inspections: [] },

  // Apoios
  { id: '29', code: 'EXT-29', mapId: 'EXT-29', location: 'GUARITA DUQUE', subLocation: 'Guarita Duque (Interno)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '30', code: 'EXT-30', mapId: 'EXT-30', location: 'GUARITA DUQUE', subLocation: 'Guarita Duque (Externo)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [] },
  { id: '31', code: 'EXT-31', mapId: 'EXT-31', location: 'ACI-MAPA', subLocation: 'ACI (Mapa)', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '10 JAN 2024', expiryDate: '10 JAN 2025', inspections: [] },

  // 3. PAVILHÃO CENTRAL - LADO ESQUERDO
  { id: '19', code: 'EXT-19', mapId: 'EXT-19', location: 'Central Esquerdo', subLocation: 'COSER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '20', code: 'EXT-20', mapId: 'EXT-20', location: 'Central Esquerdo', subLocation: 'COSER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '21', code: 'EXT-21', mapId: 'EXT-21', location: 'Central Esquerdo', subLocation: 'COSER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '22', code: 'EXT-22', mapId: 'EXT-22', location: 'Central Esquerdo', subLocation: 'VDF', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '23', code: 'EXT-23', mapId: 'EXT-23', location: 'Central Esquerdo', subLocation: 'CONSTANTINO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '24', code: 'EXT-24', mapId: 'EXT-24', location: 'Central Esquerdo', subLocation: 'AQUARELA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '25', code: 'EXT-25', mapId: 'EXT-25', location: 'Central Esquerdo', subLocation: 'HUBNER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '26', code: 'EXT-26', mapId: 'EXT-26', location: 'Central Esquerdo', subLocation: 'KILANCHÃO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '27', code: 'EXT-27', mapId: 'EXT-27', location: 'Central Esquerdo', subLocation: 'OLICAMPO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '28', code: 'EXT-28', mapId: 'EXT-28', location: 'Central Esquerdo', subLocation: 'MENDES', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },

  // 4. PAVILHÃO CENTRAL - LADO DIREITO
  { id: '32', code: 'EXT-32', mapId: 'EXT-32', location: 'Central Direito', subLocation: 'COLORADO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '33', code: 'EXT-33', mapId: 'EXT-33', location: 'Central Direito', subLocation: 'ADRIANA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '34', code: 'EXT-34', mapId: 'EXT-34', location: 'Central Direito', subLocation: 'ESTRELA DO OESTE', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '35', code: 'EXT-35', mapId: 'EXT-35', location: 'Central Direito', subLocation: 'CONSTANTINO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '36', code: 'EXT-36', mapId: 'EXT-36', location: 'Central Direito', subLocation: 'CONSTANTINO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '37', code: 'EXT-37', mapId: 'EXT-37', location: 'Central Direito', subLocation: 'AQUARELA', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '38', code: 'EXT-38', mapId: 'EXT-38', location: 'Central Direito', subLocation: 'HUBNER', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '39', code: 'EXT-39', mapId: 'EXT-39', location: 'Central Direito', subLocation: 'KILANCHÃO', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '40', code: 'EXT-40', mapId: 'EXT-40', location: 'Central Direito', subLocation: 'BERGAMINI', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '41', code: 'EXT-41', mapId: 'EXT-41', location: 'Central Direito', subLocation: 'BERGAMINI', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '42', code: 'EXT-42', mapId: 'EXT-42', location: 'Central Direito', subLocation: 'BOX 42', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '43', code: 'EXT-43', mapId: 'EXT-43', location: 'Central Direito', subLocation: 'BOX 43', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },
  { id: '44', code: 'EXT-44', mapId: 'EXT-44', location: 'Central Direito', subLocation: 'BOX 44', type: 'Pó Químico (ABC)', capacity: '6kg', status: 'Seguro', lastRechargeDate: '20 JAN 2024', expiryDate: '20 JAN 2025', inspections: [] },

  // Pavilhão Esquerdo
  { id: '52', code: 'EXT-52', mapId: 'EXT-52', location: 'Esquerdo', subLocation: 'Corupá', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '51', code: 'EXT-51', mapId: 'EXT-51', location: 'Esquerdo', subLocation: 'Corupá', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '50', code: 'EXT-50', mapId: 'EXT-50', location: 'Esquerdo', subLocation: 'Corupá', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '49', code: 'EXT-49', mapId: 'EXT-49', location: 'Esquerdo', subLocation: 'Maravilha', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '48', code: 'EXT-48', mapId: 'EXT-48', location: 'Esquerdo', subLocation: 'Maravilha', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '47', code: 'EXT-47', mapId: 'EXT-47', location: 'Esquerdo', subLocation: 'Camila Lamb', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '46', code: 'EXT-46', mapId: 'EXT-46', location: 'Esquerdo', subLocation: 'Foz Mar', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
  { id: '45', code: 'EXT-45', mapId: 'EXT-45', location: 'Esquerdo', subLocation: 'Santa Helena', type: 'Água (H2O)', capacity: '10L', status: 'Seguro', lastRechargeDate: '01 OUT 2024', expiryDate: '01 OUT 2025', inspections: [] },
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', title: 'Inspeção realizada no Pavilhão Direito, Box Niehues', type: 'Concluído', time: 'há 12 minutos' },
  { id: '2', title: 'Substituição de Lacre: Pavilhão Central, Coluna 12', type: 'Manutenção', time: 'há 2 horas' },
  { id: '3', title: 'Vencimento Reportado: Pavilhão Norte, Box 45', type: 'Alerta', time: 'há 5 horas' },
  { id: '4', title: 'Novo Extintor Cadastrado: Pavilhão Sul, Adm', type: 'Novo Item', time: 'Ontem, 16:45' },
];

const CEASA_LOGO_URL = "https://images.weserv.nl/?url=www.ceasa.pr.gov.br/sites/ceasa/templates/ceasa/images/logo_ceasa.png";

// Helper to convert image URL to Base64 for jsPDF
const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  try {
    // Using a proxy to avoid CORS issues when fetching for Base64
    const proxyUrl = imageUrl.includes('weserv.nl') ? imageUrl : `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to convert blob to base64"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading logo for PDF:", error);
    return "";
  }
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingExtinguisher, setEditingExtinguisher] = useState<Extinguisher | null>(null);
  const [inspectingExtinguisher, setInspectingExtinguisher] = useState<Extinguisher | null>(null);
  const [deletingExtinguisherId, setDeletingExtinguisherId] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<Extinguisher | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Auth Listener
  useEffect(() => {
    if (!supabase) {
      setIsAuthReady(true);
      return;
    }

    // Check for errors in URL (like the one in user screenshot)
    const url = new URL(window.location.href);
    const errorCode = url.searchParams.get('error_code') || url.hash.match(/error_code=([^&]*)/)?.[1];
    
    if (errorCode === 'otp_expired') {
      setLoginError("O link de acesso expirou. Por favor, solicite um novo link.");
      // Limpa a URL para evitar loops
      window.history.replaceState(null, '', window.location.pathname);
    } else if (errorCode) {
      setLoginError(`Erro de autenticação: ${errorCode}. Tente novamente.`);
      window.history.replaceState(null, '', window.location.pathname);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Deeplink Handler
  useEffect(() => {
    if (!user && !isGuest) return;
    if (extinguishers.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      const ext = extinguishers.find(e => e.code === code);
      if (ext) {
        setInspectingExtinguisher(ext);
        setCurrentView('inspect');
        // Clear params to avoid loop but keep path
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [user, isGuest, extinguishers]);

  // Supabase Sync
  useEffect(() => {
    if (isGuest) {
      setExtinguishers(MOCK_EXTINGUISHERS);
      setActivities(MOCK_ACTIVITIES);
      setResponsibles([
        { name: 'Sergio Ferreira da Silva', role: 'Técnico de Segurança', email: 'sergio@ceasa.com', phone: '(45) 99999-0001' },
        { name: 'João Silva', role: 'Auxiliar Técnico', email: 'joao@ceasa.com', phone: '(45) 99999-0002' }
      ]);
      return;
    }

    if (!user || !supabase) return;

    const fetchData = async () => {
      const { data: exts } = await supabase.from('extinguishers').select('*').order('code');
      if (exts) setExtinguishers(exts);

      const { data: resps } = await supabase.from('responsibles').select('*').order('name');
      if (resps) setResponsibles(resps);

      const { data: acts } = await supabase.from('activities').select('*').order('time', { ascending: false });
      if (acts) setActivities(acts);
    };

    fetchData();

    // Set up real-time subscriptions
    const subExt = supabase.channel('exts_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'extinguishers' }, fetchData).subscribe();
    const subResp = supabase.channel('resps_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'responsibles' }, fetchData).subscribe();
    const subAct = supabase.channel('acts_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchData).subscribe();

    return () => {
      subExt.unsubscribe();
      subResp.unsubscribe();
      subAct.unsubscribe();
    };
  }, [user, isGuest]);

  useEffect(() => {
    const handleAfterPrint = () => {
      // Global print cleanup if needed
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const [loginEmail, setLoginEmail] = useState('');
  const [magicConfigUrl, setMagicConfigUrl] = useState('');

  // Handle Magic Config Link (Restore credentials from URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const config = params.get('config');
    if (config) {
      try {
        const decoded = JSON.parse(atob(config));
        if (decoded.u && decoded.a) {
          localStorage.setItem('magic_supabase_url', decoded.u);
          localStorage.setItem('magic_supabase_anon', decoded.a);
          if (decoded.g) localStorage.setItem('magic_gemini_key', decoded.g);
          
          setNotification({ message: "Configurações aplicadas via Link Mágico!", type: 'success' });
          
          // Use a clean redirect to avoid infinite reload loops
          setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname;
          }, 1500);
        }
      } catch (e) {
        console.error("Erro ao decodificar link mágico:", e);
        setNotification({ message: "Erro ao processar Link Mágico. Verifique se o link está completo.", type: 'error' });
      }
    }
  }, []);

  const generateMagicLink = () => {
    const url = (import.meta as any).env.VITE_SUPABASE_URL || localStorage.getItem('magic_supabase_url') || '';
    const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('magic_supabase_anon') || '';
    const gemini = (import.meta as any).env.GEMINI_API_KEY || localStorage.getItem('magic_gemini_key') || '';
    
    const config = { u: url, a: key, g: gemini };
    const encoded = btoa(JSON.stringify(config));
    const magicUrl = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
    setMagicConfigUrl(magicUrl);
    
    navigator.clipboard.writeText(magicUrl);
    setNotification({ message: "Link Mágico copiado para a área de transferência!", type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      if (!supabase) {
        throw new Error("As credenciais do Supabase não foram configuradas nos segredos da aplicação.");
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        if (error.message.includes("provider is not enabled")) {
          throw new Error("O login via Google não está habilitado no seu painel do Supabase. Vá em Auth > Providers e ative o Google.");
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Erro desconhecido ao entrar");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (supabase) {
      supabase.auth.signOut();
    }
    setIsGuest(false);
  };

  const handleStatusChange = async (id: string, newStatus: Extinguisher['status']) => {
    try {
      const { error } = await supabase.from('extinguishers').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteExtinguisher = (id: string) => {
    setDeletingExtinguisherId(id);
  };

  const confirmDelete = async () => {
    if (deletingExtinguisherId) {
      try {
        const { error } = await supabase.from('extinguishers').delete().eq('id', deletingExtinguisherId);
        if (error) throw error;
        setDeletingExtinguisherId(null);
      } catch (error) {
        console.error("Error deleting extinguisher:", error);
      }
    }
  };

  const handleUpdateExtinguisher = async (updatedExt: Extinguisher) => {
    const { id, ...data } = updatedExt;
    setIsUpdating(true);
    try {
      const { error } = await supabase.from('extinguishers').update(data).eq('id', id);
      if (error) throw error;
      setEditingExtinguisher(null);
      setNotification({ message: "Cadastro atualizado com sucesso!", type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating extinguisher:", error);
      setNotification({ message: "Erro ao atualizar cadastro. Verifique sua conexão.", type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddExtinguisher = async (newExt: Omit<Extinguisher, 'id' | 'inspections' | 'status'>) => {
    try {
      const { error: extError } = await supabase.from('extinguishers').insert([{
        ...newExt,
        status: 'Seguro',
        inspections: []
      }]);
      if (extError) throw extError;
      
      const { error: actError } = await supabase.from('activities').insert([{
        title: `Novo Extintor Cadastrado: ${newExt.code}`,
        type: 'Novo Item'
      }]);
      if (actError) throw actError;

      setCurrentView('inventory');
    } catch (error) {
      console.error("Error adding extinguisher:", error);
    }
  };

  const handleStartInspection = (ext: Extinguisher) => {
    setInspectingExtinguisher(ext);
    setCurrentView('inspect');
  };

  const handleSaveInspection = async (
    checklist: any, 
    notes: string, 
    lastRecharge?: string, 
    nextRecharge?: string, 
    inspectionDate?: string, 
    inspectionTime?: string, 
    inspectionMonth?: string,
    photos?: string[]
  ) => {
    if (!inspectingExtinguisher) return;

    const newInspection = {
      id: Math.random().toString(36).substr(2, 9),
      date: inspectionDate || new Date().toLocaleDateString('pt-BR'),
      time: inspectionTime || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      month: inspectionMonth,
      inspector: user?.displayName || responsibles[0]?.name || 'Sistema',
      checklist,
      notes,
      photos
    };

    const hasIssues = Object.values(checklist).some(val => val === false);
    const newStatus = hasIssues ? 'Manutenção' : 'Seguro';

    try {
      const { error: extError } = await supabase.from('extinguishers').update({
        status: newStatus,
        lastRechargeDate: lastRecharge || inspectingExtinguisher.lastRechargeDate,
        expiryDate: nextRecharge || inspectingExtinguisher.expiryDate,
        inspections: [newInspection, ...inspectingExtinguisher.inspections]
      }).eq('id', inspectingExtinguisher.id);
      if (extError) throw extError;

      const { error: actError } = await supabase.from('activities').insert([{
        title: `Inspeção realizada: ${inspectingExtinguisher.code}`,
        type: hasIssues ? 'Manutenção' : 'Concluído'
      }]);
      if (actError) throw actError;

      setInspectingExtinguisher(null);
      setCurrentView('inventory');
    } catch (error) {
      console.error("Error saving inspection:", error);
    }
  };

  const handleImportMockData = async () => {
    if (extinguishers.length > 0 && !showImportConfirm) {
      setShowImportConfirm(true);
      return;
    }

    setShowImportConfirm(false);
    try {
      for (const ext of MOCK_EXTINGUISHERS) {
        const { id, ...data } = ext;
        await supabase.from('extinguishers').insert([data]);
      }
      for (const act of MOCK_ACTIVITIES) {
        const { id, time, ...data } = act;
        await supabase.from('activities').insert([data]);
      }
      const initialResponsibles = [
        { name: 'Sergio Ferreira da Silva', role: 'Técnico de Segurança', email: 'sergio@ceasa.com', phone: '(45) 99999-0001' },
        { name: 'João Silva', role: 'Auxiliar Técnico', email: 'joao@ceasa.com', phone: '(45) 99999-0002' }
      ];
      for (const resp of initialResponsibles) {
        await supabase.from('responsibles').insert([resp]);
      }
      setNotification({ message: "Dados importados com sucesso!", type: 'success' });
    } catch (error) {
      console.error("Error importing data:", error);
      setNotification({ message: "Erro ao importar dados.", type: 'error' });
    }
    
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteInspection = async (extinguisherId: string, inspectionId: string) => {
    const ext = extinguishers.find(e => e.id === extinguisherId);
    if (!ext) return;

    const updatedInspections = ext.inspections.filter(insp => insp.id !== inspectionId);
    
    // Recalculate status if the latest inspection was deleted
    let newStatus = ext.status;
    if (updatedInspections.length > 0) {
      const latest = updatedInspections[0];
      const hasIssues = Object.values(latest.checklist).some(val => val === false);
      newStatus = hasIssues ? 'Manutenção' : 'Seguro';
    }

    try {
      const { error: extError } = await supabase.from('extinguishers').update({
        inspections: updatedInspections,
        status: newStatus
      }).eq('id', extinguisherId);
      if (extError) throw extError;
      
      const { error: actError } = await supabase.from('activities').insert([{
        title: `Inspeção excluída: ${ext.code}`,
        type: 'Alerta'
      }]);
      if (actError) throw actError;
      
      setNotification({ message: "Inspeção excluída com sucesso!", type: 'success' });
    } catch (error) {
      console.error("Error deleting inspection:", error);
      setNotification({ message: "Erro ao excluir inspeção.", type: 'error' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrintQRCode = async () => {
    if (!showQrModal) return;

    const element = document.getElementById('qr-to-print');
    if (!element) {
      console.error("Element qr-to-print not found");
      setNotification({ message: "Erro: Elemento de captura não encontrado.", type: 'error' });
      return;
    }

    try {
      // Small delay to ensure any animations are settled
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const canvas = await html2canvas(element, { 
        scale: 3, 
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: true,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // 1. Sanitize stylesheets for Tailwind 4 oklch colors (exactly like map export)
          const styleSheets = clonedDoc.styleSheets;
          for (let i = 0; i < styleSheets.length; i++) {
            try {
              const rules = styleSheets[i].cssRules;
              for (let j = 0; j < rules.length; j++) {
                const rule = rules[j] as CSSStyleRule;
                if (rule.style && rule.style.cssText.includes('okl')) {
                  rule.style.cssText = rule.style.cssText.replace(/oklch\([^)]+\)/g, '#ffffff');
                  rule.style.cssText = rule.style.cssText.replace(/oklab\([^)]+\)/g, '#ffffff');
                }
              }
            } catch (e) {
              // Skip cross-origin
            }
          }

          // 2. Comprehensive cleanup like map export
          const clonedEl = clonedDoc.getElementById('qr-to-print');
          if (clonedEl) {
            clonedEl.style.display = 'flex';
            clonedEl.style.flexDirection = 'column';
            clonedEl.style.alignItems = 'center';
            clonedEl.style.justifyContent = 'center';
            clonedEl.style.visibility = 'visible';
            clonedEl.style.opacity = '1';
            clonedEl.style.transform = 'none';
            clonedEl.style.width = '500px'; 
            clonedEl.style.background = 'white';
            clonedEl.style.padding = '40px';
            clonedEl.style.margin = '0';
            
            // Fix SVG sizing for react-qr-code
            const svg = clonedEl.querySelector('svg');
            if (svg) {
              svg.style.width = '300px';
              svg.style.height = '300px';
            }

            const all = clonedEl.querySelectorAll('*');
            all.forEach((el: any) => {
              const computedStyle = window.getComputedStyle(el);
              if (computedStyle.opacity === '0') el.style.opacity = '1';
              if (computedStyle.visibility === 'hidden') el.style.visibility = 'visible';
              
              const propertiesToFix = ['backgroundColor', 'color', 'borderColor', 'outlineColor', 'fill', 'stroke'];
              propertiesToFix.forEach(prop => {
                const value = computedStyle[prop as any];
                if (value && (value.includes('oklch') || value.includes('oklab'))) {
                  if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                  else if (prop === 'color') el.style.color = '#000000';
                  else if (prop === 'borderColor') el.style.borderColor = '#d1d5db';
                  else if (prop === 'fill') el.style.fill = '#000000';
                  else if (prop === 'stroke') el.style.stroke = '#000000';
                }
              });
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', [80, 80]);
      
      pdf.addImage(imgData, 'PNG', 0, 0, 80, 80);
      pdf.save(`ETIQUETA_${showQrModal.code}.pdf`);
      
      setNotification({ message: "Etiqueta PDF gerada com sucesso!", type: 'success' });
    } catch (error) {
      console.error("Error exporting QR code:", error);
      setNotification({ message: "Erro ao gerar PDF. Tente atualizar o navegador.", type: 'error' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const renderView = () => {
    if (!user && !isGuest && currentView !== 'settings') return (
      <LoginScreen 
        onLogin={handleLogin} 
        onGuest={() => setIsGuest(true)} 
        error={loginError} 
        isLoading={isLoggingIn} 
        onSettings={() => setCurrentView('settings')}
      />
    );

    switch (currentView) {
      case 'dashboard': return <DashboardView extinguishers={extinguishers} activities={activities} setCurrentView={setCurrentView} onImportMockData={handleImportMockData} />;
      case 'inventory': return (
        <InventoryView 
          extinguishers={extinguishers} 
          onStatusChange={handleStatusChange} 
          onDelete={handleDeleteExtinguisher}
          onEdit={(ext) => setEditingExtinguisher({ ...ext, mapId: ext.mapId || ext.code })}
          onInspect={handleStartInspection}
          onDeleteInspection={handleDeleteInspection}
          onShowQR={setShowQrModal}
        />
      );
      case 'inspect_list': return (
        <MonthlyInspectionView 
          extinguishers={extinguishers} 
          onInspect={handleStartInspection}
          onDeleteInspection={handleDeleteInspection}
          onShowQR={setShowQrModal}
        />
      );
      case 'inspect': return (
        <InspectView 
          extinguisher={inspectingExtinguisher || extinguishers[0]} 
          onCancel={() => setCurrentView('inventory')}
          onSave={handleSaveInspection}
          onShowQR={setShowQrModal}
        />
      );
      case 'new': return (
        <NewItemView 
          extinguishers={extinguishers}
          onDelete={handleDeleteExtinguisher}
          onEdit={(ext) => setEditingExtinguisher({ ...ext, mapId: ext.mapId || ext.code })}
          onStatusChange={handleStatusChange}
          onInspect={handleStartInspection}
          onAdd={handleAddExtinguisher}
          onDeleteInspection={handleDeleteInspection}
          onShowQR={setShowQrModal}
        />
      );
      case 'map': return <MapView extinguishers={extinguishers} onInspect={handleStartInspection} setNotification={setNotification} />;
      case 'reports': return <ReportsView extinguishers={extinguishers} responsibles={responsibles} />;
      case 'responsible': return <ResponsibleView responsibles={responsibles} />;
      case 'settings': return <SettingsView onMagicLink={generateMagicLink} onBack={(!user && !isGuest) ? () => setCurrentView('dashboard') : undefined} />;
      default: return <DashboardView extinguishers={extinguishers} activities={activities} setCurrentView={setCurrentView} onImportMockData={handleImportMockData} />;
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-secondary-light rounded-2xl flex items-center justify-center text-secondary mb-6 animate-pulse">
          <ShieldCheck size={32} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Iniciando Sentinel...</p>
        </div>
      </div>
    );
  }

  const isConfigured = !!supabase;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Configuration Warning Bar - Only if connection is broken */}
      {!isConfigured && (user || isGuest) && (
        <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between shadow-lg z-[100]">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="animate-pulse" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-wider">
              Atenção: Configuração Incompleta. Algumas funções podem não funcionar.
            </p>
          </div>
          <button 
            onClick={() => setCurrentView('settings')}
            className="bg-white text-amber-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase hover:bg-amber-50 transition-all"
          >
            Ajustar Agora
          </button>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-primary-border px-4 h-16 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-primary">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
              <img 
                src={CEASA_LOGO_URL} 
                alt="CEASA Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  console.warn("Logo failed to load in Top Bar, using fallback icon");
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-secondary-light');
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>';
                  icon.className = 'text-secondary';
                  e.currentTarget.parentElement?.appendChild(icon);
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-secondary uppercase tracking-wider">Guardião CEASA</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all flex items-center gap-2"
              title="Sair"
            >
              <span className="text-[10px] font-bold uppercase hidden md:block">{user.displayName}</span>
              <LogOut size={20} />
            </button>
          )}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Centrais de Abastecimento</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Paraná</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 pb-24">
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 ${
                notification.type === 'success' ? 'bg-secondary text-white' : 'bg-primary text-white'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="motion-container"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Import Confirmation Modal */}
      <AnimatePresence>
        {showImportConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Info size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">Confirmar Importação</h3>
              <p className="text-gray-500 font-medium mb-8">
                Isso irá adicionar os dados de exemplo ao seu banco de dados atual. Deseja continuar?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleImportMockData}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                >
                  Sim, Importar
                </button>
                <button 
                  onClick={() => setShowImportConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingExtinguisher && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                <h3 className="text-xl font-black uppercase tracking-tight">Editar Extintor {editingExtinguisher.code}</h3>
                <button onClick={() => setEditingExtinguisher(null)} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Código (Frota)</label>
                    <input 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      value={editingExtinguisher.code}
                      onChange={(e) => setEditingExtinguisher({...editingExtinguisher, code: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Posição no Mapa (Fixa)</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      value={editingExtinguisher.mapId || ''}
                      onChange={(e) => setEditingExtinguisher({...editingExtinguisher, mapId: e.target.value})}
                    >
                      <option value="">Nenhuma (Não aparece no mapa)</option>
                      {MAP_POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
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
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Capacidade (Peso)</label>
                    <div className="relative">
                      <input 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold pr-12"
                        value={editingExtinguisher.capacity.replace('kg', '')}
                        onChange={(e) => setEditingExtinguisher({...editingExtinguisher, capacity: `${e.target.value}kg`})}
                        placeholder="Ex: 6"
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">KG</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => handleUpdateExtinguisher(editingExtinguisher)}
                  disabled={isUpdating}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
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
              className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 border border-gray-100"
            >
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="text-primary" size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-center mb-2">Confirmar Exclusão?</h3>
              <p className="text-gray-500 text-center mb-8 leading-relaxed">
                Você está prestes a remover o extintor <span className="font-bold text-on-background">{extinguishers.find(e => e.id === deletingExtinguisherId)?.code}</span> do sistema. Esta ação é irreversível.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-container transition-all shadow-lg active:scale-95"
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

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-xs rounded-3xl shadow-2xl p-8 flex flex-col items-center no-print"
            >
              <div className="flex justify-between items-center w-full mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight text-primary">QR Code Ativo</h3>
                <button onClick={() => setShowQrModal(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div id="qr-to-print" className="flex flex-col items-center bg-white p-6 rounded-2xl">
                <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 mb-6 font-sans">
                  <QRCode 
                    value={`${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(showQrModal.code)}`}
                    size={200}
                    level="H"
                  />
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xl font-black">{showQrModal.code}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">{showQrModal.type}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{showQrModal.location} • {showQrModal.subLocation}</p>
                </div>
              </div>

              <button 
                onClick={handlePrintQRCode}
                className="w-full mt-8 bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Gerar Etiqueta PDF
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 px-2 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 no-print overflow-x-auto">
        <NavButton 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
          icon={<LayoutDashboard size={18} />} 
          label="Painel" 
        />
        <NavButton 
          active={currentView === 'inventory'} 
          onClick={() => setCurrentView('inventory')} 
          icon={<ClipboardList size={18} />} 
          label="Inventário" 
        />
        <NavButton 
          active={currentView === 'inspect_list'} 
          onClick={() => setCurrentView('inspect_list')} 
          icon={<ShieldCheck size={18} />} 
          label="Inspeção" 
        />
        <NavButton 
          active={currentView === 'map'} 
          onClick={() => setCurrentView('map')} 
          icon={<MapIcon size={18} />} 
          label="Mapa" 
        />
        <NavButton 
          active={currentView === 'reports'} 
          onClick={() => setCurrentView('reports')} 
          icon={<FileText size={18} />} 
          label="Relatórios" 
        />
        <NavButton 
          active={currentView === 'responsible'} 
          onClick={() => setCurrentView('responsible')} 
          icon={<Users size={18} />} 
          label="Responsáveis" 
        />
        <NavButton 
          active={currentView === 'settings'} 
          onClick={() => setCurrentView('settings')} 
          icon={<UserCog size={18} />} 
          label="Ajustes" 
        />
        <NavButton 
          active={currentView === 'new'} 
          onClick={() => setCurrentView('new')} 
          icon={<PlusCircle size={18} />} 
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
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${active ? 'text-secondary bg-secondary-light px-4 py-1 rounded-xl' : 'text-gray-500'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}

// --- Views ---

function MonthlyInspectionView({ extinguishers, onInspect, onDeleteInspection, onShowQR }: { 
  extinguishers: Extinguisher[], 
  onInspect: (ext: Extinguisher) => void, 
  onDeleteInspection: (extId: string, inspId: string) => void,
  onShowQR: (ext: Extinguisher) => void
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  
  const inspectedThisMonth = extinguishers.filter(ext => {
    if (ext.inspections.length === 0) return false;
    const lastInspDate = ext.inspections[0].date;
    let d, m, y;
    if (lastInspDate.includes('/')) {
      [d, m, y] = lastInspDate.split('/');
    } else if (lastInspDate.includes('-')) {
      [y, m, d] = lastInspDate.split('-');
    } else {
      return false;
    }
    const inspMonth = new Date(parseInt(y), parseInt(m) - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    return inspMonth === currentMonth;
  });

  const pendingThisMonth = extinguishers.filter(ext => !inspectedThisMonth.includes(ext));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-1 block">Controle Mensal</span>
          <h2 className="text-4xl font-extrabold tracking-tight leading-none">Inspeções de {currentMonth}</h2>
          <p className="text-gray-500 mt-2 font-medium">Acompanhamento do cronograma de vistorias preventivas.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl border-b-4 border-secondary shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Realizadas</p>
            <p className="text-2xl font-black text-secondary">{inspectedThisMonth.length}</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border-b-4 border-primary shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Pendentes</p>
            <p className="text-2xl font-black text-primary">{pendingThisMonth.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-primary rounded-full"></div>
          <h3 className="text-sm font-black uppercase tracking-widest">Lista de Verificação</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {extinguishers.sort((a, b) => {
            const numA = parseInt(a.code.split('-')[1]);
            const numB = parseInt(b.code.split('-')[1]);
            return numA - numB;
          }).map(ext => {
            const isDone = inspectedThisMonth.includes(ext);
            return (
              <div key={ext.id} className="space-y-2">
                <div className={`bg-white p-4 rounded-2xl border-l-4 shadow-sm flex items-center justify-between transition-all ${isDone ? 'border-secondary opacity-70' : 'border-primary'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${isDone ? 'bg-secondary-light text-secondary' : 'bg-primary-light text-primary'}`}>
                      {ext.code.split('-')[1]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{ext.code} - {ext.subLocation}</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{ext.location} • {ext.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowQR(ext);
                      }}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                      title="QR Code"
                    >
                      <QrCode size={18} />
                    </button>

                    {isDone && (
                      <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase mr-2">
                        <CheckCircle2 size={16} />
                        Concluído
                      </div>
                    )}
                    
                    {!isDone && (
                      <button 
                        onClick={() => onInspect(ext)}
                        className="bg-primary text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                      >
                        Inspecionar
                      </button>
                    )}

                    <button 
                      onClick={() => setExpandedId(expandedId === ext.id ? null : ext.id)}
                      className="bg-white text-secondary border-2 border-secondary px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-sm"
                    >
                      {expandedId === ext.id ? 'Fechar' : 'Histórico'}
                    </button>
                  </div>
                </div>

                {/* Expanded History Section */}
                <AnimatePresence>
                  {expandedId === ext.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Histórico de Inspeções</h4>
                          <History size={14} className="text-gray-300" />
                        </div>
                        
                        {ext.inspections.length > 0 ? (
                          <div className="space-y-3">
                            {ext.inspections.map((insp, idx) => (
                              <div key={insp.id || idx} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start">
                                  <div className="text-[10px] font-bold">
                                    {insp.date} • {insp.time}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteInspection(ext.id, insp.id);
                                      }}
                                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                    <span className="text-[8px] bg-secondary-light text-secondary px-1.5 py-0.5 rounded font-black uppercase">
                                      {insp.inspector}
                                    </span>
                                  </div>
                                </div>
                                {insp.notes && <p className="text-[10px] text-gray-500 italic mt-1">"{insp.notes}"</p>}
                                
                                {insp.photos && insp.photos.length > 0 && (
                                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                                    {insp.photos.map((url, pIdx) => (
                                      <a key={pIdx} href={url} target="_blank" rel="noreferrer" className="shrink-0">
                                        <img 
                                          src={url} 
                                          alt={`Foto ${pIdx + 1}`} 
                                          className="w-16 h-16 rounded-lg object-cover border border-gray-100 shadow-sm hover:scale-105 transition-transform" 
                                          referrerPolicy="no-referrer"
                                        />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 italic text-center py-2">Nenhuma inspeção anterior.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function DashboardView({ extinguishers, activities, setCurrentView, onImportMockData }: { extinguishers: Extinguisher[], activities: Activity[], setCurrentView: (view: View) => void, onImportMockData: () => void }) {
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-secondary uppercase tracking-tight">Painel de Controle</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Visão geral da segurança contra incêndio</p>
        </div>
        {extinguishers.length === 0 && (
          <button 
            onClick={onImportMockData}
            className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Download size={16} />
            Importar Dados Iniciais
          </button>
        )}
      </div>

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
          <div className="mt-6 p-4 bg-background rounded-xl border border-primary-border text-xs text-gray-600">
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
            <Bell className="text-primary" size={20} />
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>
            {activities.length > 0 ? activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                  activity.type === 'Concluído' ? 'bg-secondary-container text-secondary' :
                  activity.type === 'Manutenção' ? 'bg-tertiary-light text-tertiary' :
                  activity.type === 'Alerta' ? 'bg-error-container text-primary' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'Concluído' ? <CheckCircle2 size={14} /> : <Wrench size={14} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-100">{activity.type}</span>
                    <span className="text-[10px] text-gray-400">{activity.time.includes('T') ? new Date(activity.time).toLocaleDateString() : activity.time}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400 text-sm italic">Nenhuma atividade recente</div>
            )}
          </div>
          <button 
            onClick={() => setCurrentView('reports')}
            className="mt-6 w-full py-3 text-sm font-bold text-primary border border-primary-border rounded-xl hover:bg-primary-light transition-colors"
          >
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
        </div>
      </div>
    </div>
  );
}

function InventoryView({ extinguishers, onStatusChange, onDelete, onEdit, onInspect, onDeleteInspection, onShowQR }: { 
  extinguishers: Extinguisher[], 
  onStatusChange: (id: string, status: Extinguisher['status']) => void,
  onDelete: (id: string) => void,
  onEdit: (ext: Extinguisher) => void,
  onInspect: (ext: Extinguisher) => void,
  onDeleteInspection: (extId: string, inspId: string) => void,
  onShowQR: (ext: Extinguisher) => void
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
  }).sort((a, b) => {
    const numA = parseInt(a.code.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.code.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Inventário de Extintores</h2>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary-light text-sm" 
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
                      className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary-light rounded-lg transition-all"
                      title="Inspecionar"
                    >
                      <ScanSearch size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(ext)}
                      className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary-light rounded-lg transition-all"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(ext.id)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="relative group/status" onClick={(e) => e.stopPropagation()}>
                    <button className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 transition-all hover:brightness-95 ${
                      ext.status === 'Seguro' ? 'bg-secondary-container text-secondary' :
                      ext.status === 'Vencido' ? 'bg-error-container text-primary animate-pulse' :
                      'bg-tertiary-light text-tertiary'
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
                      <div className="flex items-center gap-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Histórico de Inspeções</h4>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowQR(ext);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase text-primary hover:bg-gray-50 transition-all shadow-sm"
                        >
                          <QrCode size={12} />
                          Gerar QR Code
                        </button>
                      </div>
                      <History size={16} className="text-gray-400" />
                    </div>
                    
                    {ext.inspections.length > 0 ? (
                      <div className="space-y-4">
                        {ext.inspections.map((insp) => (
                          <div key={insp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold">{insp.date}</p>
                                  {insp.month && (
                                    <span className="text-[9px] bg-primary-light text-primary px-1.5 py-0.5 rounded font-black uppercase">
                                      {insp.month}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Inspetor: {insp.inspector} • {insp.time}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteInspection(ext.id, insp.id);
                                  }}
                                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                  title="Excluir Inspeção"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <span className="text-[10px] bg-secondary-light text-secondary px-2 py-0.5 rounded font-bold uppercase">Validado</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                              <CheckBadge label="Manômetro" active={insp.checklist.manometer} />
                              <CheckBadge label="Lacre" active={insp.checklist.seal} />
                              <CheckBadge label="Danos" active={insp.checklist.damage} />
                              <CheckBadge label="Acesso" active={insp.checklist.access} />
                              <CheckBadge label="Sinaliz." active={insp.checklist.signage} />
                              <CheckBadge label="Inmetro" active={insp.checklist.inmetro} />
                              <CheckBadge label="Instr." active={insp.checklist.instructions} />
                              <CheckBadge label="Difusor" active={insp.checklist.diffuser} />
                              <CheckBadge label="Mangueira" active={insp.checklist.hose} />
                            </div>

                            {insp.notes && (
                              <div className="p-2 bg-background rounded-lg border border-primary-border text-[10px] text-gray-600 italic">
                                "{insp.notes}"
                              </div>
                            )}
                            {insp.photos && insp.photos.length > 0 && (
                              <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                                {insp.photos.map((url, pIdx) => (
                                  <a key={pIdx} href={url} target="_blank" rel="noreferrer" className="shrink-0">
                                    <img 
                                      src={url} 
                                      alt={`Foto ${pIdx + 1}`} 
                                      className="w-16 h-16 rounded-lg object-cover border border-gray-100 shadow-sm hover:scale-105 transition-transform" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </a>
                                ))}
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
      active ? 'bg-secondary-light border-secondary-border text-secondary' : 'bg-primary-light border-primary-border text-primary'
    }`}>
      {active ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
      {label}
    </div>
  );
}

function InspectView({ extinguisher, onCancel, onSave, onShowQR }: { 
  extinguisher: Extinguisher, 
  onCancel: () => void, 
  onSave: (checklist: any, notes: string, lastRecharge?: string, nextRecharge?: string, inspectionDate?: string, inspectionTime?: string, inspectionMonth?: string, photos?: string[]) => void, 
  onShowQR: (ext: Extinguisher) => void 
}) {
  const [checklist, setChecklist] = useState<Record<string, boolean | 'N/A'>>({
    manometer: extinguisher.type.includes('CO2') ? 'N/A' : true,
    seal: true,
    damage: true,
    access: true,
    signage: true,
    inmetro: true,
    instructions: true,
    diffuser: extinguisher.type.includes('CO2') ? true : 'N/A',
    hose: true
  });
  const [notes, setNotes] = useState('');
  const [lastRecharge, setLastRecharge] = useState(extinguisher.lastRechargeDate || '');
  const [nextRecharge, setNextRecharge] = useState(extinguisher.expiryDate || '');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const now = new Date();
  const [inspectionMonth, setInspectionMonth] = useState(now.toLocaleString('pt-BR', { month: 'long' }).toUpperCase());
  const [inspectionDate, setInspectionDate] = useState(now.toISOString().split('T')[0]);
  const [inspectionTime, setInspectionTime] = useState(now.toTimeString().slice(0, 5));

  const months = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];

  const updateCheck = (key: string, val: boolean | 'N/A') => {
    setChecklist(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-1 block">Protocolo Industrial</span>
          <h2 className="text-4xl font-extrabold tracking-tight leading-none">Inspeção Mensal</h2>
          <p className="text-gray-500 mt-2 font-medium">Relatório Técnico de Segurança Contra Incêndio</p>
        </div>
        <div className="bg-white px-4 py-3 rounded-xl border-l-4 border-primary shadow-sm flex items-center gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-primary mb-1">ID do Equipamento</p>
            <p className="text-xl font-black font-mono tracking-tighter">{extinguisher.code}</p>
          </div>
          <button 
            onClick={() => onShowQR(extinguisher)}
            className="p-3 bg-primary-light text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
            title="Ver QR Code"
          >
            <QrCode size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InfoBox icon={<LayoutDashboard className="text-primary" />} label="Pavilhão" value={extinguisher.location} />
        <InfoBox icon={<ClipboardList className="text-primary" />} label="Box" value={extinguisher.subLocation} />
        <InfoBox icon={<History className="text-primary" />} label="Vencimento Atual" value={extinguisher.expiryDate} highlight />
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mês de Referência</label>
          <select 
            className="w-full bg-background py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-sm appearance-none"
            value={inspectionMonth}
            onChange={(e) => setInspectionMonth(e.target.value)}
          >
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-primary rounded-full"></div>
          <h3 className="text-sm font-black uppercase tracking-widest">Checklist de Conformidade (CEASA/PR)</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ChecklistItem icon={<ScanSearch />} label="Aspecto Visual Adequado (pintura, corrosão ou dano)?" value={checklist.damage} onChange={(v) => updateCheck('damage', v)} />
          <ChecklistItem icon={<CheckCircle2 />} label="Sinalização (placa visível em boas condições)?" value={checklist.signage} onChange={(v) => updateCheck('signage', v)} />
          <ChecklistItem icon={<ShieldCheck />} label="Lacre Intacto?" value={checklist.seal} onChange={(v) => updateCheck('seal', v)} />
          <ChecklistItem icon={<ShieldCheck />} label="Selo de Certificação Inmetro (intacto)?" value={checklist.inmetro} onChange={(v) => updateCheck('inmetro', v)} />
          <ChecklistItem icon={<Info />} label="Quadro de Instruções Legível?" value={checklist.instructions} onChange={(v) => updateCheck('instructions', v)} />
          <ChecklistItem icon={<ScanSearch />} label="Difusor (para CO2) em boas condições?" value={checklist.diffuser} onChange={(v) => updateCheck('diffuser', v)} />
          <ChecklistItem icon={<ScanSearch />} label="Manômetro na Zona Verde?" value={checklist.manometer} onChange={(v) => updateCheck('manometer', v)} />
          <ChecklistItem icon={<ArrowRight />} label="Mangueira em Bom Estado?" value={checklist.hose} onChange={(v) => updateCheck('hose', v)} />
          <ChecklistItem icon={<ArrowRight />} label="Acesso (livre de obstrução)?" value={checklist.access} onChange={(v) => updateCheck('access', v)} />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Data e Hora da Inspeção</h3>
            <Calendar className="text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Data</label>
              <input 
                type="date"
                className="w-full bg-background py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-sm"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Hora</label>
              <input 
                type="time"
                className="w-full bg-background py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-sm"
                value={inspectionTime}
                onChange={(e) => setInspectionTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Controle de Recarga</h3>
            <Calendar className="text-secondary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Recarga Atual</label>
              <input 
                type="text"
                className="w-full bg-background py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-sm"
                value={lastRecharge}
                onChange={(e) => setLastRecharge(e.target.value)}
                placeholder="Ex: 01 OUT 2024"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Vencimento</label>
              <input 
                type="text"
                className="w-full bg-background py-3 px-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-sm"
                value={nextRecharge}
                onChange={(e) => setNextRecharge(e.target.value)}
                placeholder="Ex: 01 OUT 2025"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Fotos do Extintor</h3>
            <div className="flex items-center gap-2">
              {isUploading && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
              <Camera className="text-secondary" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {photos.map((url, idx) => (
              <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={url} alt={`Foto ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <PhotoUpload 
              onUpload={(url) => setPhotos(prev => [...prev, url])} 
              onLoading={setIsUploading} 
              path={`inspections/${extinguisher.code}_${Date.now()}`}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-medium italic">Toque acima para tirar foto ou anexar arquivo. Certifique-se de que a leitura do manômetro e o lacre estejam nítidos.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest">Notas Técnicas</h3>
            <History className="text-secondary" />
          </div>
          <textarea 
            className="w-full bg-background h-32 rounded-2xl border-none focus:ring-2 focus:ring-primary p-4 text-sm font-medium" 
            placeholder="Descreva qualquer irregularidade ou observação relevante..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="mt-4 flex items-center gap-2">
            <Info className="text-tertiary" size={16} />
            <p className="text-[10px] text-tertiary font-bold uppercase tracking-tight">Ocorrências serão enviadas à Manutenção.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={() => onSave(checklist, notes, lastRecharge, nextRecharge, inspectionDate, inspectionTime, inspectionMonth, photos)}
          disabled={isUploading}
          className={`w-full md:w-auto md:px-12 py-5 bg-gradient-to-r from-secondary to-green-700 text-white rounded-full font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Aguarde o upload...' : 'Finalizar Inspeção'}
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

function NewItemView({ extinguishers, onDelete, onEdit, onStatusChange, onInspect, onAdd, onDeleteInspection, onShowQR }: { 
  extinguishers: Extinguisher[], 
  onDelete: (id: string) => void,
  onEdit: (ext: Extinguisher) => void,
  onStatusChange: (id: string, status: Extinguisher['status']) => void,
  onInspect: (ext: Extinguisher) => void,
  onAdd: (ext: Omit<Extinguisher, 'id' | 'inspections' | 'status'>) => void,
  onDeleteInspection: (extId: string, inspId: string) => void,
  onShowQR: (ext: Extinguisher) => void
}) {
  const [code, setCode] = useState('');
  const [mapId, setMapId] = useState('');
  const [type, setType] = useState('Pó Químico (ABC)');
  const [capacity, setCapacity] = useState('6');
  const [selectedPavilion, setSelectedPavilion] = useState('Central Direito');
  const [subLocation, setSubLocation] = useState('');
  const [lastRecharge, setLastRecharge] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    onAdd({
      code,
      mapId: mapId || undefined,
      type,
      capacity: `${capacity}kg`,
      location: selectedPavilion,
      subLocation,
      lastRechargeDate: lastRecharge || 'N/A',
      expiryDate: expiry || 'N/A'
    });
  };

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Novo Extintor</h2>
          <p className="text-gray-500 font-medium">Cadastre um novo dispositivo de segurança no sistema operacional.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border-b-2 border-primary-border">
              <label className="block text-sm font-bold text-primary uppercase tracking-widest mb-4">Identificação do Ativo</label>
              <div className="flex items-center gap-4">
                <div className="flex-grow relative">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-primary-light font-semibold" 
                    placeholder="Digite o código ID do extintor" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400 italic flex items-center gap-1">
                <Info size={14} />
                Insira o código alfanumérico presente na etiqueta do ativo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-b-2 border-secondary-border">
              <label className="block text-sm font-bold text-secondary uppercase tracking-widest mb-4">Posição no Mapa</label>
              <select 
                className="w-full py-3 bg-background border-none rounded-xl focus:ring-2 focus:ring-secondary font-semibold appearance-none px-4"
                value={mapId}
                onChange={(e) => setMapId(e.target.value)}
              >
                <option value="">Nenhuma (Não aparece no mapa)</option>
                {MAP_POSITIONS.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-b-2 border-tertiary-border">
              <label className="block text-sm font-bold text-tertiary uppercase tracking-widest mb-4">Tipo de Ativo</label>
              <select 
                className="w-full py-2 bg-transparent border-b-2 border-gray-100 focus:border-tertiary outline-none font-bold text-lg"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Pó Químico (ABC)</option>
                <option>Pó Químico (BC)</option>
                <option>CO2 (Dióxido de Carbono)</option>
                <option>Água Pressurizada</option>
                <option>Espuma Mecânica</option>
              </select>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-b-2 border-tertiary-border">
              <label className="block text-sm font-bold text-tertiary uppercase tracking-widest mb-2">Capacidade</label>
              <div className="flex items-end gap-2">
                <input 
                  className="w-full py-2 bg-transparent border-b-2 border-gray-100 focus:border-tertiary outline-none font-bold text-2xl" 
                  type="number" 
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                <span className="text-tertiary font-bold mb-2">KG</span>
              </div>
            </div>
            <FormDate label="Fabricação" />
            <FormDate label="Última Carga" value={lastRecharge} onChange={setLastRecharge} />
            <FormDate label="Vencimento" value={expiry} onChange={setExpiry} />
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
                          className={`py-2 px-1 text-[9px] font-bold border rounded uppercase transition-all ${selectedPavilion === p ? 'bg-secondary text-white border-secondary shadow-md' : 'border-gray-200 hover:bg-secondary-light'}`}
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
                      value={subLocation}
                      onChange={(e) => setSubLocation(e.target.value)}
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
            <button 
              type="button" 
              onClick={() => setCode('')}
              className="md:w-1/4 bg-gray-100 text-gray-500 py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
            >
              LIMPAR
            </button>
          </div>
        </form>
      </div>

      <div className="pt-12 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
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
          onDeleteInspection={onDeleteInspection}
          onShowQR={onShowQR}
        />
      </div>
    </div>
  );
}

function MapView({ extinguishers, onInspect, setNotification }: { extinguishers: Extinguisher[], onInspect: (ext: Extinguisher) => void, setNotification: (n: { message: string, type: 'success' | 'error' } | null) => void }) {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isHistorical, setIsHistorical] = useState(false);

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsExporting(false);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const getHistoricalStatus = (ext: Extinguisher) => {
    if (!isHistorical) return ext.status;
    
    const targetMonthStr = (selectedMonth + 1).toString().padStart(2, '0');
    const targetYearStr = selectedYear.toString();
    
    const insp = ext.inspections.find(i => {
      if (!i.date) return false;
      let m, y;
      if (i.date.includes('/')) [, m, y] = i.date.split('/');
      else if (i.date.includes('-')) [y, m] = i.date.split('-');
      else return false;
      return m?.toString().padStart(2, '0') === targetMonthStr && y?.toString() === targetYearStr;
    });
    
    if (!insp) return 'Vazio';
    const hasIssue = Object.values(insp.checklist).some(v => v === false);
    return hasIssue ? 'Manutenção' : 'Seguro';
  };

  const getStatusColor = (mapId: string) => {
    const ext = extinguishers.find(e => (e.mapId || e.code) === mapId);
    if (!ext) return 'bg-gray-50 text-gray-400 border-gray-200';
    
    const status = getHistoricalStatus(ext);
    
    if (status === 'Seguro') return 'bg-secondary-light text-secondary border-secondary-border';
    if (status === 'Manutenção') return 'bg-tertiary-light text-tertiary border-tertiary-border';
    if (status === 'Vazio') return 'bg-gray-100 text-gray-400 border-gray-200 opacity-40';
    return 'bg-primary-light text-primary border-primary-border animate-pulse';
  };

  const exportMapToPDF = async () => {
    const element = document.getElementById('map-content-to-export');
    if (!element) {
      setNotification({ message: "Erro: Elemento do mapa não encontrado.", type: 'error' });
      return;
    }
    
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const styleSheets = clonedDoc.styleSheets;
          for (let i = 0; i < styleSheets.length; i++) {
            try {
              const rules = styleSheets[i].cssRules;
              for (let j = 0; j < rules.length; j++) {
                const rule = rules[j] as CSSStyleRule;
                if (rule.style && rule.style.cssText.includes('okl')) {
                  rule.style.cssText = rule.style.cssText.replace(/oklch\([^)]+\)/g, '#ffffff');
                  rule.style.cssText = rule.style.cssText.replace(/oklab\([^)]+\)/g, '#ffffff');
                }
              }
            } catch (e) {}
          }

          const clonedElement = clonedDoc.getElementById('map-content-to-export') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.opacity = '1';
            clonedElement.style.transform = 'none';
            clonedElement.style.width = '1100px';
            clonedElement.style.padding = '40px';
            clonedElement.style.margin = '0';
            
            const motionElements = clonedElement.querySelectorAll('.motion-container');
            motionElements.forEach((el: any) => {
              el.style.opacity = '1';
              el.style.transform = 'none';
              el.style.visibility = 'visible';
            });

            const all = clonedElement.querySelectorAll('*');
            all.forEach((el: any) => {
              const computedStyle = window.getComputedStyle(el);
              if (computedStyle.opacity === '0') el.style.opacity = '1';
              if (computedStyle.visibility === 'hidden') el.style.visibility = 'visible';
              
              const propertiesToFix = ['backgroundColor', 'color', 'borderColor', 'outlineColor', 'fill', 'stroke'];
              propertiesToFix.forEach(prop => {
                const value = computedStyle[prop as any];
                if (value && (value.includes('oklch') || value.includes('oklab'))) {
                  if (prop === 'backgroundColor') el.style.backgroundColor = '#ffffff';
                  else if (prop === 'color') el.style.color = '#000000';
                  else if (prop === 'borderColor') el.style.borderColor = '#d1d5db';
                  else if (prop === 'fill') el.style.fill = '#000000';
                  else if (prop === 'stroke') el.style.stroke = '#000000';
                }
              });
            });
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = imgProps.width / imgProps.height;
      const width = pdfWidth - 20;
      const height = width / ratio;
      
      pdf.addImage(imgData, 'PNG', 10, 10, width, height);
      pdf.save(`Mapa_Guardião_CEASA_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
      setNotification({ message: "PDF gerado com sucesso!", type: 'success' });
    } catch (error: any) {
      console.error("Error exporting map to PDF:", error);
      setNotification({ message: "Erro ao gerar PDF. Tentando imprimir...", type: 'error' });
      window.print();
    } finally {
      setIsExporting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const MapPoint = ({ mapId, position = 'top' }: { mapId: string, position?: 'top' | 'bottom' }) => {
    const ext = extinguishers.find(e => (e.mapId || e.code) === mapId);
    const isSelected = selectedPoint === mapId;
    const historicalStatus = ext ? getHistoricalStatus(ext) : 'N/A';
    
    return (
      <div className={`relative group ${isSelected ? 'z-[100]' : 'z-10'}`}>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPoint(isSelected ? null : mapId);
          }}
          className={`flex flex-col items-center justify-center px-1.5 py-1 border-2 rounded-lg text-[10px] font-black uppercase transition-all hover:scale-110 cursor-pointer shrink-0 ${getStatusColor(mapId)} ${isSelected ? 'ring-4 ring-primary scale-110' : ''}`}
        >
          <span className="leading-none whitespace-nowrap">{ext ? ext.code : mapId}</span>
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
                  historicalStatus === 'Seguro' ? 'bg-secondary-light text-secondary' : 
                  historicalStatus === 'Manutenção' ? 'bg-tertiary-light text-tertiary' : 
                  historicalStatus === 'Vazio' ? 'bg-gray-100 text-gray-400' : 'bg-primary-light text-primary'
                }`}>
                  {historicalStatus === 'Vazio' ? 'Sem Inspeção' : historicalStatus}
                </span>
                <button onClick={() => setSelectedPoint(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={12} />
                </button>
              </div>
              <h4 className="text-xs font-black text-gray-900 leading-none">{ext.code}</h4>
              {isHistorical && historicalStatus === 'Vazio' && (
                <p className="text-[10px] text-red-500 font-bold uppercase mt-1 italic">Vazio no período</p>
              )}
              <div className="mt-1 mb-2">
                <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">{ext.location}</p>
                <p className="text-[8px] text-gray-400 font-medium uppercase leading-tight">{ext.subLocation}</p>
              </div>
              
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[8px] border-b border-gray-50 pb-1">
                  <span className="text-gray-400 font-bold uppercase">Tipo:</span>
                  <span className="font-black text-gray-700 truncate ml-2">{ext.type}</span>
                </div>
                {!isHistorical && (
                  <div className="flex justify-between text-[8px]">
                    <span className="text-gray-400 font-bold uppercase">Venc.:</span>
                    <span className="font-black text-primary">{ext.expiryDate}</span>
                  </div>
                )}
              </div>

              {!isHistorical ? (
                <button 
                  onClick={() => onInspect(ext)}
                  className="w-full py-1.5 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <ScanSearch size={12} />
                  Inspecionar
                </button>
              ) : (
                <p className="text-[8px] text-gray-400 text-center italic">Visualização Histórica</p>
              )}
              
              <div className={`absolute ${position === 'top' ? 'top-full border-t-white' : 'bottom-full border-b-white'} left-1/2 -translate-x-1/2 border-8 border-transparent`}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12" onClick={() => setSelectedPoint(null)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 no-print">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Mapa de Localização</h2>
          <p className="text-gray-500 font-medium">Layout industrial dos dispositivos de segurança</p>
          
          <div className="flex items-center gap-4 mt-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
            <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-xl">
              <Calendar size={14} className="text-gray-400" />
              <div className="flex gap-1">
                <select 
                  className="text-xs font-bold bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value));
                    setIsHistorical(true);
                  }}
                >
                  {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select 
                  className="text-xs font-bold bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(parseInt(e.target.value));
                    setIsHistorical(true);
                  }}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {isHistorical && (
              <button 
                onClick={() => {
                  setIsHistorical(false);
                }}
                className="text-[10px] font-black uppercase text-primary hover:underline px-2"
              >
                Ver Tempo Real
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm no-print">
            <div className="flex items-center gap-2 text-[10px] font-black">
              <div className="w-3 h-3 bg-secondary rounded shadow-sm"></div>
              <span className="text-gray-500 uppercase">OK</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black">
              <div className="w-3 h-3 bg-tertiary rounded shadow-sm"></div>
              <span className="text-gray-500 uppercase">ATENÇÃO</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black">
              <div className="w-3 h-3 bg-primary rounded shadow-sm"></div>
              <span className="text-gray-500 uppercase">CRÍTICO</span>
            </div>
            {isHistorical && (
              <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
                <div className="w-3 h-3 bg-gray-200 border-2 border-gray-300 rounded shadow-sm opacity-40"></div>
                <span className="text-[10px] font-black uppercase text-gray-400 italic">VAZIO</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white border-2 border-secondary text-secondary px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-lg active:scale-95 no-print"
              >
                <Printer size={20} />
                Imprimir
              </button>
              <button 
                onClick={exportMapToPDF}
                disabled={isExporting}
                className={`flex items-center gap-2 bg-white border-2 border-primary text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95 ${isExporting ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isExporting ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileDown size={20} />
                )}
                {isExporting ? 'Gerando PDF...' : 'Exportar PDF'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase no-print">Dica: Use "Imprimir" para PDF rápido</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-10 rounded-3xl shadow-xl border border-gray-100 overflow-x-auto print-map-container relative min-h-[600px]">
        {/* Map Legend removed from here */}

        {/* Compass Indicator */}
        <div className="absolute bottom-6 left-6 flex flex-col items-center gap-1 opacity-20 no-print">
          <div className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center relative">
            <div className="w-0.5 h-6 bg-gray-400 absolute top-0 rotate-0"></div>
            <span className="absolute -top-4 text-[10px] font-black">N</span>
          </div>
          <span className="text-[8px] font-black uppercase">Orientação Industrial</span>
        </div>

        <div ref={mapRef} id="map-content-to-export" className="min-w-[800px] py-12 space-y-16 print-map-content print:min-w-0 print:space-y-8">
          {/* Print Header */}
          <div className="hidden print:flex justify-between items-center border-b-4 border-primary pb-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-primary">Mapa de Dispositivos de Segurança</h1>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">CEASA - Central de Abastecimento do Paraná</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Data de Emissão</p>
              <p className="text-xl font-black text-gray-900">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {/* Top Section - ADM, ADAPAR, IDR, CASA CIVIL */}
          <div className="flex justify-between items-start gap-8 print:gap-4">
            <div className="flex gap-6 items-stretch print:gap-4">
              {/* Bloco ADM e Casa Civil */}
              <div className="flex border-4 border-gray-300 rounded-3xl bg-gray-50 shadow-sm">
                <div className="w-48 h-40 border-r-4 border-gray-300 flex flex-col items-center justify-center relative p-4">
                  <span className="text-sm font-black text-gray-500 uppercase mb-6">ADM</span>
                  <div className="absolute top-3 left-3"><MapPoint mapId="EXT-01" position="bottom" /></div>
                  <div className="absolute bottom-3 left-3"><MapPoint mapId="EXT-02" /></div>
                </div>
                <div className="w-40 h-40 flex flex-col items-center justify-center relative p-4 bg-white">
                  <span className="text-xs font-black text-gray-500 uppercase text-center leading-tight">CASA CIVIL<br/>COZINHA</span>
                  <div className="absolute top-3 right-3"><MapPoint mapId="EXT-06" position="bottom" /></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex flex-col items-center">
                      <MapPoint mapId="EXT-05" />
                      <span className="text-[9px] font-black text-primary uppercase mt-1">EXTERNO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco ADAPAR e IDR */}
              <div className="flex flex-col border-4 border-gray-300 rounded-3xl bg-gray-50 w-56 h-40 shadow-sm">
                <div className="flex-1 border-b-4 border-gray-300 relative p-4 flex items-center justify-center">
                  <span className="text-sm font-black text-gray-500 uppercase">ADAPAR</span>
                  <div className="absolute top-3 right-3"><MapPoint mapId="EXT-03" position="bottom" /></div>
                </div>
                <div className="flex-1 relative p-4 flex items-center justify-center bg-white">
                  <span className="text-sm font-black text-gray-500 uppercase">IDR</span>
                  <div className="absolute bottom-3 right-3"><MapPoint mapId="EXT-04" /></div>
                </div>
              </div>
            </div>

            {/* Bloco Poço e Guarita */}
            <div className="flex gap-12 print:gap-6">
              <div className="w-40 h-40 border-4 border-primary-border bg-primary-light rounded-3xl flex flex-col items-center justify-center relative p-4 shadow-sm">
                <span className="text-sm font-black text-primary uppercase">POÇO</span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"><MapPoint mapId="EXT-07" position="bottom" /></div>
              </div>
              <div className="w-40 h-40 border-4 border-secondary-border bg-secondary-light rounded-3xl flex flex-col items-center justify-center relative p-4 shadow-sm">
                <span className="text-sm font-black text-secondary uppercase text-center leading-tight">GUARITA<br/>J.K</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"><MapPoint mapId="EXT-08" /></div>
              </div>
            </div>
          </div>

          {/* Main Pavilions */}
          <div className="grid grid-cols-3 gap-12 items-start print:grid-cols-1 print:gap-8">
            {/* Pavilhão Direito */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary border-2 border-primary-border">
                  <MapIcon size={20} />
                </div>
                <h3 className="text-center text-lg font-black uppercase tracking-widest text-primary">Pavilhão Direito</h3>
              </div>
              <div className="border-4 border-primary-border rounded-[40px] p-6 space-y-3 bg-primary-light shadow-inner">
                {['NIEHUES', 'JAAM', '49', 'MELHORANÇA', 'SÃO MIGUEL', '3 IRMÃOS', 'OLIVEIRA', 'NACO', 'TABAJARA', 'WALKER'].map((box, i) => (
                  <div key={box} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border-2 border-gray-200 shadow-sm w-full">
                    <MapPoint mapId={`EXT-${(i + 9).toString().padStart(2, '0')}`} />
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-tight whitespace-nowrap flex-1">{box}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pavilhão Central */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center text-secondary border-2 border-secondary-border">
                  <MapIcon size={20} />
                </div>
                <h3 className="text-center text-lg font-black uppercase tracking-widest text-secondary">Pavilhão Central</h3>
              </div>
              <div className="grid grid-cols-2 gap-6 border-4 border-secondary-border rounded-[40px] p-6 bg-secondary-light shadow-inner">
                <div className="space-y-3 pr-3 border-r-2 border-secondary-border">
                  <span className="text-[10px] font-black text-gray-500 uppercase block text-center mb-4 tracking-widest">Lado Esquerdo</span>
                  {['COSER', 'COSER', 'COSER', 'VDF', 'CONSTANTINO', 'AQUARELA', 'HUBNER', 'KILANCHÃO', 'OLICAMPO', 'MENDES'].map((box, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border-2 border-gray-200 shadow-sm w-full">
                      <MapPoint mapId={`EXT-${(i + 19).toString().padStart(2, '0')}`} />
                      <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight whitespace-nowrap flex-1">{box}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pl-3">
                  <span className="text-[10px] font-black text-gray-500 uppercase block text-center mb-4 tracking-widest">Lado Direito</span>
                  {['COLORADO', 'ADRIANA', 'ESTRELA', 'CONSTANTINO', 'CONSTANTINO', 'AQUARELA', 'HUBNER', 'KILANCHÃO', 'BERGAMINI', 'BERGAMINI'].map((box, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border-2 border-gray-200 shadow-sm w-full">
                      <MapPoint mapId={`EXT-${(i + 32).toString().padStart(2, '0')}`} />
                      <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight whitespace-nowrap flex-1">{box}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pavilhão Esquerdo */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-tertiary-light flex items-center justify-center text-tertiary border-2 border-tertiary-border">
                  <MapIcon size={20} />
                </div>
                <h3 className="text-center text-lg font-black uppercase tracking-widest text-tertiary">Pavilhão Esquerdo</h3>
              </div>
              <div className="border-4 border-tertiary-border rounded-[40px] p-6 space-y-3 bg-tertiary-light shadow-inner">
                {['CORUPÁ', 'CORUPÁ', 'CORUPÁ', 'MARAVILHA', 'MARAVILHA', 'CAMILA LAMB', 'FOZ MAR', 'SANTA HELENA', 'CERSUL', 'BANCO DE ALIMENTOS', 'BEIRA RIO'].map((box, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border-2 border-gray-200 shadow-sm w-full">
                    <MapPoint mapId={`EXT-${(52 - i).toString().padStart(2, '0')}`} />
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-tight whitespace-nowrap flex-1">{box}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - ACI e Guarita Duque */}
          <div className="flex justify-around items-end pt-12 print:pt-8">
            <div className="w-56 h-32 border-4 border-dashed border-gray-300 rounded-3xl flex items-center justify-center relative bg-gray-50 shadow-sm">
              <span className="text-sm font-black text-gray-500 uppercase leading-tight text-center">GUARITA<br/>DUQUE</span>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"><MapPoint mapId="EXT-30" /></div>
              <div className="absolute bottom-3 right-3"><MapPoint mapId="EXT-29" /></div>
            </div>
            <div className="w-56 h-24 border-4 border-dashed border-gray-300 rounded-3xl flex items-center justify-center relative bg-gray-50 shadow-sm">
              <span className="text-sm font-black text-gray-500 uppercase">ACI-MAPA</span>
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"><MapPoint mapId="EXT-31" /></div>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:flex justify-between items-end mt-16 pt-12 border-t-4 border-gray-100">
            <div className="space-y-6">
              <div className="w-80 border-b-2 border-gray-400"></div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-widest">Assinatura do Responsável Técnico</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Sentinel Safety System</p>
              <p className="text-[10px] text-gray-300 font-bold uppercase">Relatório Gerado Automaticamente em {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-light p-6 rounded-2xl border border-primary-border">
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
    primary: 'bg-primary-light border-primary text-primary',
    secondary: 'bg-secondary-light border-secondary text-secondary',
    tertiary: 'bg-tertiary-light border-tertiary text-tertiary',
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
    <div className="bg-white p-5 rounded-2xl shadow-sm border-b-2 border-primary-border">
      <div className="mb-2">{icon}</div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</h3>
      <p className={`text-lg font-semibold ${highlight ? 'text-primary' : ''}`}>{value}</p>
    </div>
  );
}

function ChecklistItem({ icon, label, value, onChange }: { icon: any, label: string, value: boolean | 'N/A', onChange: (val: boolean | 'N/A') => void }) {
  return (
    <div className="bg-gray-50 group flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all border-l-4 border-transparent hover:border-secondary">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm">
          {icon}
        </div>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onChange(true)}
          className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase transition-all ${value === true ? 'bg-secondary text-white border-secondary' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-100'}`}
        >
          Sim
        </button>
        <button 
          onClick={() => onChange(false)}
          className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase transition-all ${value === false ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-100'}`}
        >
          Não
        </button>
        <button 
          onClick={() => onChange('N/A')}
          className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase transition-all ${value === 'N/A' ? 'bg-gray-500 text-white border-gray-500' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-100'}`}
        >
          N/A
        </button>
      </div>
    </div>
  );
}

function PhotoUpload({ onUpload, onLoading, path }: { onUpload: (url: string) => void, onLoading: (loading: boolean) => void, path: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onLoading(true);
    try {
      const fileName = `${path}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('photos').upload(fileName, file);
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName);
      onUpload(publicUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Erro ao enviar foto. Verifique sua conexão.");
    } finally {
      onLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="aspect-square rounded-2xl bg-background flex flex-col items-center justify-center border-2 border-dashed border-gray-200 group cursor-pointer hover:border-primary transition-all"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      {/* Hidden camera input for mobile - though standard file input with accept="image/*" usually triggers camera */}
      <Camera className="text-gray-300 group-hover:text-primary mb-1" size={24} />
      <span className="text-[10px] font-bold text-gray-400 group-hover:text-primary uppercase">Adicionar Foto</span>
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

function FormDate({ label, value, onChange }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-b-2 border-gray-100">
      <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
      <input 
        className="w-full bg-transparent border-none p-0 focus:ring-0 font-semibold text-sm" 
        type="date" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ReportsView({ extinguishers, responsibles }: { extinguishers: Extinguisher[], responsibles: Responsible[] }) {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  
  // Find the latest month with data to set as default
  const getLatestDataDate = () => {
    const allInspections = extinguishers.flatMap(e => e.inspections);
    if (allInspections.length === 0) return { m: new Date().getMonth(), y: new Date().getFullYear() };
    
    const parseDate = (dateStr: string) => {
      if (!dateStr) return { d: 1, m: 1, y: 2024 };
      if (dateStr.includes('/')) {
        const [d, m, y] = dateStr.split('/').map(Number);
        return { d, m, y };
      } else if (dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return { d, m, y };
      }
      return { d: 1, m: 1, y: 2024 };
    };

    const sorted = [...allInspections].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return (dateB.y * 10000 + dateB.m * 100 + dateB.d) - (dateA.y * 10000 + dateA.m * 100 + dateA.d);
    });
    
    const latestDate = parseDate(sorted[0].date);
    return { m: (latestDate.m || 1) - 1, y: latestDate.y || new Date().getFullYear() };
  };

  const latest = getLatestDataDate();
  const [selectedMonth, setSelectedMonth] = useState(latest.m);
  const [selectedYear, setSelectedYear] = useState(latest.y);
  const hasSetInitialDate = useRef(false);

  useEffect(() => {
    if (extinguishers.length > 0 && !hasSetInitialDate.current) {
      const l = getLatestDataDate();
      setSelectedMonth(l.m);
      setSelectedYear(l.y);
      hasSetInitialDate.current = true;
    }
  }, [extinguishers]);
  const [selectedResponsible, setSelectedResponsible] = useState(responsibles[0]?.name || 'SERGIO FERREIRA DA SILVA');
  const [unit, setUnit] = useState('FOZ DO IGUAÇU');

  const months = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];
  
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const getReportTitle = (type: string) => {
    switch(type) {
      case 'inventory': return 'Relatório de Inventário Completo';
      case 'inspections': return 'Relatório de Inspeções Mensais';
      case 'maintenance_expiry': return 'Relatório de Manutenção e Vencimentos';
      default: return 'Relatório Técnico';
    }
  };

  const getFilteredData = (type: string) => {
    let data = [...extinguishers];
    
    switch(type) {
      case 'maintenance_expiry': 
        data = data.filter(e => 
          e.status !== 'Seguro' || 
          e.expiryDate.includes('2025')
        );
        break;
      case 'inspections': {
        const targetMonthStr = (selectedMonth + 1).toString().padStart(2, '0');
        const targetYearStr = selectedYear.toString();

        data = data.map(e => {
          const matchingInspections = e.inspections.filter(insp => {
            if (!insp.date) return false;
            let m, y;
            if (insp.date.includes('/')) {
              [, m, y] = insp.date.split('/');
            } else if (insp.date.includes('-')) {
              [y, m] = insp.date.split('-');
            } else {
              return false;
            }
            return m.toString().padStart(2, '0') === targetMonthStr && y.toString() === targetYearStr;
          });
          
          return { ...e, inspections: matchingInspections };
        });
        break;
      }
      default: 
        break;
    }

    // Ordenação numérica pelo código (ex: EXT-01, EXT-10)
    return data.sort((a, b) => {
      const numA = parseInt(a.code.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.code.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  };

  const exportToPDF = async (reportType: string) => {
    const isLandscape = reportType === 'inspections';
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const title = getReportTitle(reportType);
    const data = getFilteredData(reportType);
    const today = new Date().toLocaleDateString('pt-BR');

    // Load logo for PDF (Removed as requested)
    // const logoData = await getBase64ImageFromUrl(CEASA_LOGO_URL);

    if (isLandscape) {
      // Chunk data into pages of 9 rows for better legibility as requested
      const itemsPerPage = 9;
      const chunks = [];
      for (let i = 0; i < data.length; i += itemsPerPage) {
        chunks.push(data.slice(i, i + itemsPerPage));
      }

      chunks.forEach((chunk, pageIndex) => {
        if (pageIndex > 0) doc.addPage();

        // Header Estilo CEASA PDF (Conforme Imagem)
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 277, 25); // Caixa externa do cabeçalho
        
        // Parte Esquerda: CEASA PARANÁ
        doc.setFontSize(14);
        doc.setTextColor(27, 109, 36); // Verde CEASA
        doc.setFont('helvetica', 'bold');
        doc.text('CEASA PARANÁ', 15, 20);
        
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100); // Cinza
        doc.setFont('helvetica', 'normal');
        doc.text('CENTRAIS DE ABASTECIMENTO DO PARANÁ S/A', 15, 25);
        
        // Parte Central: Título do Relatório
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.text('INSPEÇÃO MENSAL DE EXTINTORES - CEASA/PR', 155, 22, { align: 'center' });
        
        // Parte Direita: Revisão e Formulário
        doc.setFontSize(8);
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold');
        doc.text('Rev.01', 282, 18, { align: 'right' });
        doc.text('FOR-CEASA-SGA-002', 282, 28, { align: 'right' });

        // Metadata Row
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`UNIDADE: ${unit.toUpperCase()}`, 10, 45);
        doc.text(`MÊS: ${months[selectedMonth]} / ${selectedYear}`, 110, 45);
        doc.text(`RESPONSÁVEL PELA INSPEÇÃO: ${selectedResponsible.toUpperCase()}`, 287, 45, { align: 'right' });

        const tableData = chunk.map(ext => {
          const lastInsp = ext.inspections[0];
          const formatCheck = (val: any) => {
            if (val === 'N/A') return 'N/A';
            return val ? 'Sim' : 'Não';
          };

          const formatDate = (dateStr: string) => {
            if (!dateStr) return '-';
            // Handle YYYY-MM-DD
            if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
              const [y, m, d] = dateStr.split('-');
              return `${d}-${m}-${y}`;
            }
            // Handle DD/MM/YYYY or DD-MM-YYYY
            return dateStr.replace(/\//g, '-');
          };
          
          return [
            ext.code,
            ext.location,
            `${ext.type} - ${ext.capacity}`,
            formatCheck(lastInsp?.checklist.damage),
            formatCheck(lastInsp?.checklist.signage),
            formatCheck(lastInsp?.checklist.seal),
            formatCheck(lastInsp?.checklist.inmetro),
            formatCheck(lastInsp?.checklist.instructions),
            formatCheck(lastInsp?.checklist.diffuser),
            formatCheck(lastInsp?.checklist.manometer),
            formatCheck(lastInsp?.checklist.hose),
            formatCheck(lastInsp?.checklist.access),
            `Última: ${ext.lastRechargeDate}\nPróxima: ${ext.expiryDate}`,
            lastInsp ? (
              `Data: ${formatDate(lastInsp.date)}\nHora: ${lastInsp.time}`
            ) : '-'
          ];
        });

        autoTable(doc, {
          startY: 50,
          head: [[
            'Cód.', 
            'Localização', 
            'Tipo/Capac.', 
            'Asp. Vis.\n(pintura, corrosão)', 
            'Sinaliz.\n(placa visível)', 
            'Lacre\nIntacto', 
            'Selo\nInmetro', 
            'Instr.\nLegível', 
            'Difusor\n(CO2)', 
            'Manôm.\n(Zona Verde)', 
            'Mang.\n(Bom Estado)', 
            'Acesso\n(Livre)', 
            'Recargas', 
            'Inspeção'
          ]],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontSize: 7, fontStyle: 'bold', halign: 'center', valign: 'middle' },
          styles: { fontSize: 8, cellPadding: 1.5, overflow: 'linebreak', fontStyle: 'bold' },
          columnStyles: {
            0: { cellWidth: 14 },
            1: { cellWidth: 20 },
            2: { cellWidth: 25 },
            12: { cellWidth: 32 },
            13: { cellWidth: 28 },
          }
        });
        // Observations (on every page bottom)
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVAÇÕES / COMENTÁRIOS:', 14, 180);
        doc.setLineWidth(0.2);
        doc.line(14, 182, 280, 182);
        doc.line(14, 188, 280, 188);
      });
    } else {
      // Portrait Mode (Inventory / Maintenance) - Removed logo as requested
      /*
      if (logoData) {
        doc.addImage(logoData, 'PNG', 14, 10, 15, 15);
      }
      */
      doc.setFontSize(18);
      doc.setTextColor(27, 109, 36); // CEASA Green
      doc.setFont('helvetica', 'bold');
      doc.text('CEASA PARANÁ - Unidade de Foz do Iguaçu', 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(title, 14, 30);
      
      doc.setFontSize(8);
      doc.text(`Gerado em: ${today}`, 14, 36);
      doc.text(`Mês de Referência: ${months[selectedMonth]} / ${selectedYear}`, 14, 40);

      const tableData = data.map(ext => [
        ext.code,
        `${ext.location} - ${ext.subLocation}`,
        ext.type,
        ext.capacity,
        ext.expiryDate,
        ext.status
      ]);

      autoTable(doc, {
        startY: 46,
        head: [['Cód.', 'Localização', 'Tipo', 'Capacidade', 'Vencimento', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [27, 109, 36], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8 },
        margin: { top: 46 }
      });
    }

    // Add footer to all pages
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      doc.text(`Página ${i} de ${pageCount}`, 14, pageHeight - 10);
      doc.text('Guardião CEASA - Sistema de Gestão de Extintores', pageWidth - 14, pageHeight - 10, { align: 'right' });
    }

    doc.save(`${title.replace(/\s+/g, '_')}_${today}.pdf`);
  };

  const exportToXLS = (reportType: string) => {
    const title = getReportTitle(reportType);
    const data = getFilteredData(reportType);
    const today = new Date().toLocaleDateString('pt-BR');

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel
    csvContent += "Codigo;Localizacao;Tipo;Capacidade;Vencimento;Status\n";

    data.forEach(ext => {
      const row = [
        ext.code,
        `"${ext.location} - ${ext.subLocation}"`,
        ext.type,
        ext.capacity,
        reportType === 'inspections' ? (ext.inspections.length > 0 ? ext.inspections[0].date : 'Sem registro') : ext.expiryDate,
        ext.status
      ].join(";");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      setActiveReport(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = (reportType: string) => {
    setActiveReport(reportType);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const reportData = getFilteredData(activeReport);
  const totalInspections = reportData.reduce((acc, current) => acc + current.inspections.length, 0);
  const isEmptyPeriod = activeReport === 'inspections' && totalInspections === 0;

  if (activeReport) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center no-print">
          <button 
            onClick={() => setActiveReport(null)}
            className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest hover:underline"
          >
            <ArrowRight className="rotate-180" size={18} />
            Voltar aos Relatórios
          </button>
          
          {!isEmptyPeriod && (
            <div className="flex gap-3">
              <button 
                onClick={() => exportToXLS(activeReport)}
                className="bg-secondary text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
              >
                <FileSpreadsheet size={18} />
                Excel (XLS)
              </button>
              <button 
                onClick={() => exportToPDF(activeReport)}
                className="bg-primary text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:brightness-110 transition-all"
              >
                <FileDown size={18} />
                PDF
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
          {isEmptyPeriod ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary">
                <AlertTriangle size={40} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase">Nenhum lançamento encontrado</h3>
                <p className="text-gray-500 max-w-xs mx-auto">Não existem inspeções registradas para o período de {months[selectedMonth]} de {selectedYear}.</p>
              </div>
              <button 
                onClick={() => setActiveReport(null)}
                className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full font-bold uppercase text-xs hover:bg-gray-200 transition-all"
              >
                Escolher outro período
              </button>
            </div>
          ) : (
            <ReportContent 
              type={activeReport} 
              extinguishers={reportData} 
              unit={unit}
              month={`${months[selectedMonth]} / ${selectedYear}`}
              responsible={selectedResponsible}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Relatórios Operacionais</h2>
          <p className="text-gray-500 font-medium">Gere e exporte documentos técnicos de conformidade.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="min-w-[150px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Unidade</label>
            <input 
              type="text" 
              className="w-full bg-background py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-xs"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <div className="min-w-[120px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mês</label>
            <select 
              className="w-full bg-background py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-xs"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[100px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Ano</label>
            <select 
              className="w-full bg-background py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-xs"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Responsável</label>
            <select 
              className="w-full bg-background py-2 px-3 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold text-xs"
              value={selectedResponsible}
              onChange={(e) => setSelectedResponsible(e.target.value)}
            >
              {responsibles.map(r => (
                <option key={r.id || r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          title="Inventário Completo" 
          description="Lista detalhada de todos os extintores cadastrados e seus status atuais."
          icon={<ClipboardList className="text-primary" />}
          onPDF={() => exportToPDF('inventory')}
          onXLS={() => exportToXLS('inventory')}
          onView={() => setActiveReport('inventory')}
        />
        <ReportCard 
          title="Inspeções Mensais" 
          description="Histórico de conformidade e últimas vistorias realizadas."
          icon={<History className="text-secondary" />}
          onPDF={() => exportToPDF('inspections')}
          onXLS={() => exportToXLS('inspections')}
          onView={() => setActiveReport('inspections')}
        />
        <ReportCard 
          title="Manutenção e Vencimentos" 
          description="Equipamentos com pendências técnicas ou carga próxima do vencimento."
          icon={<AlertTriangle className="text-red-500" />}
          onPDF={() => exportToPDF('maintenance_expiry')}
          onXLS={() => exportToXLS('maintenance_expiry')}
          onView={() => setActiveReport('maintenance_expiry')}
        />
      </div>
    </div>
  );
}

function ReportContent({ type, extinguishers, unit, month, responsible }: { type: string, extinguishers: Extinguisher[], unit: string, month: string, responsible: string }) {
  const today = new Date().toLocaleDateString('pt-BR');
  
  const getReportTitle = () => {
    switch(type) {
      case 'inventory': return 'Relatório de Inventário Completo';
      case 'inspections': return 'Relatório de Inspeções Mensais';
      case 'maintenance_expiry': return 'Relatório de Manutenção e Vencimentos';
      default: return 'Relatório Técnico';
    }
  };

  const filteredData = () => {
    let data = [...extinguishers];
    
    switch(type) {
      case 'maintenance_expiry': 
        data = data.filter(e => 
          e.status !== 'Seguro' || 
          e.expiryDate.includes('2025')
        );
        break;
      case 'inspections':
        // Filter extinguishers that have an inspection in the selected month/year
        // The 'month' prop is in format "MONTH / YEAR"
        const [mName, yStr] = month.split(' / ');
        const targetYear = parseInt(yStr);
        const monthsMap: {[key: string]: string} = {
          'JANEIRO': '01', 'FEVEREIRO': '02', 'MARÇO': '03', 'ABRIL': '04',
          'MAIO': '05', 'JUNHO': '06', 'JULHO': '07', 'AGOSTO': '08',
          'SETEMBRO': '09', 'OUTUBRO': '10', 'NOVEMBRO': '11', 'DEZEMBRO': '12'
        };
        const targetMonthStr = monthsMap[mName];

        data = data.map(e => {
          const matchingInspections = e.inspections.filter(insp => {
            if (!insp.date) return false;
            let d, m, y;
            if (insp.date.includes('/')) {
              [d, m, y] = insp.date.split('/');
            } else if (insp.date.includes('-')) {
              [y, m, d] = insp.date.split('-');
            } else {
              return false;
            }
            return m.toString().padStart(2, '0') === targetMonthStr && y.toString() === yStr;
          });
          
          // Fallback: if no inspection in selected month, but has history, show latest but mark it
          if (matchingInspections.length === 0 && e.inspections.length > 0) {
            return { ...e, inspections: [{ ...e.inspections[0], isFallback: true }] };
          }
          
          return { ...e, inspections: matchingInspections };
        });
        break;
      default: 
        break;
    }

    return data.sort((a, b) => {
      const numA = parseInt(a.code.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.code.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  };

  const data = filteredData();

  return (
    <div className="print-report">
      {/* Header do Relatório */}
      <div className="flex justify-between items-start border-b-4 border-secondary pb-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-6xl font-black text-secondary leading-none tracking-tighter">CEASA</h1>
            <p className="text-xs font-bold text-secondary uppercase tracking-[0.2em] -mt-1">Centrais de Abastecimento do Paraná</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-black text-gray-900 uppercase">{getReportTitle()}</h2>
          <div className="flex flex-col items-end mt-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">UNIDADE: {unit}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">MÊS: {month}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">RESPONSÁVEL: {responsible}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left text-[10px] font-black uppercase">Cód.</th>
              <th className="border border-gray-200 p-2 text-left text-[10px] font-black uppercase">Localização</th>
              <th className="border border-gray-200 p-2 text-left text-[10px] font-black uppercase">Tipo/Capac.</th>
              {type === 'inspections' ? (
                <>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Asp. Vis.<br/><span className="text-[6px] font-normal">(pintura, corrosão)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Sinaliz.<br/><span className="text-[6px] font-normal">(placa visível)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Lacre<br/><span className="text-[6px] font-normal">(intacto)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Selo<br/><span className="text-[6px] font-normal">(inmetro)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Instr.<br/><span className="text-[6px] font-normal">(legível)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Difusor<br/><span className="text-[6px] font-normal">(CO2)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Manôm.<br/><span className="text-[6px] font-normal">(zona verde)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Mang.<br/><span className="text-[6px] font-normal">(bom estado)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Acesso<br/><span className="text-[6px] font-normal">(livre)</span></th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Recargas</th>
                  <th className="border border-gray-200 p-1 text-[7px] font-black uppercase leading-tight">Inspeção</th>
                </>
              ) : (
                <>
                  <th className="border border-gray-200 p-2 text-left text-[10px] font-black uppercase">Capacidade</th>
                  <th className="border border-gray-200 p-2 text-left text-[10px] font-black uppercase">Vencimento</th>
                </>
              )}
              <th className="border border-gray-200 p-2 text-left text-[10px] font-black uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ext) => {
              const lastInsp = ext.inspections[0];
              return (
                <tr key={ext.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2 text-[10px] font-bold">{ext.code}</td>
                  <td className="border border-gray-200 p-2 text-[10px]">
                    <div className="font-bold uppercase">{ext.location}</div>
                    <div className="text-[8px] text-gray-400 uppercase">{ext.subLocation}</div>
                  </td>
                  <td className="border border-gray-200 p-2 text-[10px] font-medium">
                    {ext.type} {type === 'inspections' && `- ${ext.capacity}`}
                  </td>
                  {type === 'inspections' ? (
                    <>
                      {(() => {
                        const formatCheck = (val: any) => {
                          if (val === undefined) return '-';
                          if (val === 'N/A') return 'N/A';
                          return val ? 'Sim' : 'Não';
                        };
                        return (
                          <>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.damage)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.signage)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.seal)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.inmetro)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.instructions)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.diffuser)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.manometer)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.hose)}</td>
                            <td className="border border-gray-200 p-1 text-[8px] text-center font-bold">{formatCheck(lastInsp?.checklist.access)}</td>
                          </>
                        );
                      })()}
                      <td className="border border-gray-200 p-1 text-[6px] text-center leading-tight">
                        <div className="font-black text-primary uppercase">Última: {ext.lastRechargeDate}</div>
                        <div className="font-black text-red-500 uppercase">Próxima: {ext.expiryDate}</div>
                      </td>
                      <td className="border border-gray-200 p-1 text-[7px] text-center leading-tight">
                        {lastInsp ? (
                          <>
                            <div className="font-bold">Data: {lastInsp.date}</div>
                            <div className="font-bold">Hora: {lastInsp.time}</div>
                          </>
                        ) : '-'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-200 p-2 text-[10px] font-medium">{ext.capacity}</td>
                      <td className="border border-gray-200 p-2 text-[10px] font-black text-primary">{ext.expiryDate}</td>
                    </>
                  )}
                  <td className="border border-gray-200 p-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      ext.status === 'Seguro' ? 'bg-secondary-light text-secondary' : 
                      ext.status === 'Manutenção' ? 'bg-tertiary-light text-tertiary' : 'bg-primary-light text-primary'
                    }`}>
                      {ext.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer do Relatório */}
      <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 gap-12">
        <div className="text-center">
          <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
          <p className="text-[10px] font-black uppercase text-gray-500">Responsável Técnico</p>
          <p className="text-[8px] text-gray-400 uppercase">Assinatura e Carimbo</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
          <p className="text-[10px] font-black uppercase text-gray-500">Data da Emissão</p>
          <p className="text-[8px] text-gray-400 uppercase">CEASA - Unidade de Foz do Iguaçu</p>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, description, icon, onPDF, onXLS, onView }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
      <div>
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button 
          onClick={onView}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
        >
          <ScanSearch size={16} />
          Visualizar
        </button>
        <div className="flex gap-2">
          <button 
            onClick={onPDF}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            <FileDown size={16} />
            PDF
          </button>
          <button 
            onClick={onXLS}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            <FileSpreadsheet size={16} />
            XLS
          </button>
        </div>
      </div>
    </div>
  );
}

function ResponsibleView({ responsibles }: { responsibles: Responsible[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newResp, setNewResp] = useState<Partial<Responsible>>({ name: '', role: '', email: '', phone: '' });

  const handleAdd = async () => {
    if (newResp.name && newResp.role) {
      try {
        const { error } = await supabase.from('responsibles').insert([newResp]);
        if (error) throw error;
        setNewResp({ name: '', role: '', email: '', phone: '' });
        setIsAdding(false);
      } catch (error) {
        console.error("Error adding responsible:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('responsibles').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting responsible:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Responsáveis Técnicos</h2>
          <p className="text-gray-500 font-medium">Gestão de pessoal autorizado para inspeções e manutenção.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-secondary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
        >
          <PlusCircle size={20} />
          Novo Responsável
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {responsibles.map((resp) => (
          <div key={resp.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary-light flex items-center justify-center text-secondary shrink-0">
              <UserCog size={32} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold">{resp.name}</h3>
                <button 
                  onClick={() => handleDelete(resp.id)}
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">{resp.role}</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="font-bold text-[10px] uppercase text-gray-400 w-12">Email:</span>
                  {resp.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="font-bold text-[10px] uppercase text-gray-400 w-12">Fone:</span>
                  {resp.phone}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-secondary text-white flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-tight">Novo Responsável</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nome Completo</label>
                  <input 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    value={newResp.name}
                    onChange={(e) => setNewResp({...newResp, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cargo / Função</label>
                  <input 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    value={newResp.role}
                    onChange={(e) => setNewResp({...newResp, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">E-mail</label>
                  <input 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    value={newResp.email}
                    onChange={(e) => setNewResp({...newResp, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Telefone</label>
                  <input 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    value={newResp.phone}
                    onChange={(e) => setNewResp({...newResp, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={handleAdd}
                  className="flex-1 bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:brightness-110 transition-all"
                >
                  Cadastrar
                </button>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-8 bg-white text-gray-500 border border-gray-200 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoginScreen({ 
  onLogin, 
  onGuest, 
  error, 
  isLoading, 
  onSettings
}: { 
  onLogin: () => void, 
  onGuest: () => void, 
  error: string | null, 
  isLoading: boolean,
  onSettings: () => void
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 text-center max-w-lg w-full"
      >
        <div className="w-24 h-24 bg-secondary-light rounded-3xl flex items-center justify-center text-secondary mx-auto mb-8 shadow-inner">
          <ShieldCheck size={56} />
        </div>
        <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter mb-4">Acesso Restrito</h2>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed text-sm">
          Bem-vindo ao sistema Sentinel Ceasa. Por favor, identifique-se abaixo para acessar o inventário e relatórios.
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold leading-relaxed text-left flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0" />
            <div>
              <p className="font-black uppercase tracking-wider mb-1">Atenção:</p>
              {error}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <button 
            onClick={onLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-700 py-4 rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 border-2 border-gray-100 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm text-xs"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
            </svg>
            Entrar com Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-300 text-[10px] font-black uppercase tracking-widest leading-none">ou</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button 
            onClick={onGuest}
            className="w-full py-5 bg-amber-50 text-amber-700 border-2 border-amber-200 rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-amber-100 transition-all shadow-sm text-xs"
          >
            <ShieldCheck size={24} />
            Entrar como Convidado
          </button>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-4">
            <div className="flex items-start gap-4 text-left">
              <AlertCircle size={24} className="text-blue-600 mt-1 shrink-0" />
              <div>
                <p className="text-[12px] text-blue-800 font-black uppercase tracking-wider mb-1">Acesso Direto</p>
                <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                  Para abrir o Sentinel direto na sua área de trabalho sem erros de e-mail, configure o seu **Link Mágico** abaixo.
                </p>
              </div>
            </div>
            <button 
              onClick={onSettings}
              className="w-full py-4 bg-white text-secondary border-2 border-secondary/20 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-md hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1"
            >
              <UserCog size={16} />
              Gerar Link Mágico do Sistema
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Guardião CEASA Paraná • 2024</p>
        </div>
      </motion.div>
    </div>
  );
}

function SettingsView({ onMagicLink, onBack }: { onMagicLink: () => void, onBack?: () => void }) {
  const [magicCopied, setMagicCopied] = useState(false);

  const handleCopy = () => {
    onMagicLink();
    setMagicCopied(true);
    setTimeout(() => setMagicCopied(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Deseja realmente limpar as configurações locais? Isso irá resetar as chaves do Supabase e Gemini salvas neste navegador.")) {
      localStorage.removeItem('magic_supabase_url');
      localStorage.removeItem('magic_supabase_anon');
      localStorage.removeItem('magic_gemini_key');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-secondary transition-all"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-black text-secondary uppercase tracking-tight">Configurações</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Gestão de chaves e Link Mágico</p>
          </div>
        </div>
        <UserCog className="text-gray-200" size={32} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-secondary-light rounded-2xl flex items-center justify-center text-secondary mb-4">
            <Link size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Link Mágico de Configuração</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Gere um link que contém suas chaves de acesso (Supabase/Gemini) criptografadas. 
              Ao abrir este link em outro dispositivo, o sistema se configurará automaticamente.
            </p>
          </div>
          
          <button 
            onClick={handleCopy}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
              magicCopied ? 'bg-emerald-500 text-white' : 'bg-secondary text-white hover:brightness-110 shadow-lg'
            }`}
          >
            {magicCopied ? (
              <>
                <CheckCircle2 size={20} />
                Copiado!
              </>
            ) : (
              <>
                <Copy size={20} />
                Copiar Link Mágico
              </>
            )}
          </button>
          
          <p className="text-[10px] text-gray-400 font-medium text-center">
            ⚠️ <b>Atenção:</b> O link contém credenciais. Compartilhe apenas com pessoas autorizadas.
          </p>

          <div className="pt-4 border-t border-gray-50">
            <button 
              onClick={handleReset}
              className="w-full py-2 text-red-500 font-bold uppercase text-[10px] tracking-widest hover:bg-red-50 rounded-xl transition-all"
            >
              Limpar Configurações Locais
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mb-4">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Sobre o Sentinel</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sistema Guardião CEASA - Versão 3.5.0<br/>
              Monitoramento Inteligente de Proteção contra Incêndio.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-50 space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span>Database Status</span>
              <span className="text-secondary">Conectado (Supabase)</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span>AI Engine</span>
              <span className="text-secondary">Gemini 1.5 Pro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
