import { useState } from 'react';
import type { BoardDefinition, BoardColumn } from '../types';

export interface BoardConfigState {
  availableBoards: BoardDefinition[];
  showBoardConfigDialog: boolean;
  boardConfigMode: 'import' | 'manual' | 'edit';
  newBoardDefinition: Partial<BoardDefinition>;
  importedBoardFile: string;
  boardSortColumn: string;
  boardSortDirection: 'asc' | 'desc';
  
  // Board Column Management State
  boardColumns: BoardColumn[];
  showColumnManager: boolean;
}

export interface BoardConfigActions {
  openBoardConfigDialog: (mode: 'import' | 'manual') => void;
  closeBoardConfigDialog: () => void;
  importBoardDefinition: () => Promise<void>;
  addCustomBoard: () => void;
  editCustomBoard: (selectedBoard: string) => void;
  getSortedBoards: () => BoardDefinition[];
  handleColumnSort: (column: string) => void;
  setSelectedBoard: (boardId: string) => void;
  
  // State setters
  setNewBoardDefinition: (def: Partial<BoardDefinition>) => void;
  setImportedBoardFile: (file: string) => void;
  setAvailableBoards: (boards: BoardDefinition[]) => void;
  setBoardColumns: (columns: BoardColumn[]) => void;
  setShowColumnManager: (show: boolean) => void;
  setBoardSortColumn: (column: string) => void;
  setBoardSortDirection: (dir: 'asc' | 'desc') => void;
}

export interface BoardConfigManagerHook extends BoardConfigState, BoardConfigActions {}

export function useBoardConfigManager(
  setSelectedBoard: (boardId: string) => void
): BoardConfigManagerHook {
  
  // Board Definitions - Sample data with separated SRAM types
  const [availableBoards, setAvailableBoards] = useState<BoardDefinition[]>([
    {
      id: 'esp32-c6-lcd-1.47',
      name: 'ESP32-C6 LCD 1.47"',
      architecture: 'RISC-V',
      mcu: 'ESP32-C6FH4',
      frequency: '160MHz',
      flash: '4MB',
      sram: '512KB',
      lpram: '16KB',
      display: {
        width: 172,
        height: 320,
        colorDepth: 16,
        type: 'LCD RGB565'
      },
      connectivity: ['WiFi 6', 'Bluetooth 5.0 LE'],
      wifi: 'WiFi 6',
      bluetooth: {
        classic: false,
        le: true,
        version: '5.0'
      },
      configFile: 'esp32-c6_config.h',
      description: 'ESP32-C6 with 1.47" LCD display, dual RISC-V cores, WiFi 6 and Bluetooth LE',
      verified: true
    },
    {
      id: 'esp32-s3-devkit',
      name: 'ESP32-S3 DevKit',
      architecture: 'Xtensa',
      mcu: 'ESP32-S3',
      frequency: '240MHz',
      flash: '8MB',
      sram: '512KB',
      psram: '8MB',
      connectivity: ['WiFi', 'Bluetooth Classic + LE'],
      wifi: 'WiFi 4',
      bluetooth: {
        classic: true,
        le: true,
        version: '4.2'
      },
      configFile: 'esp32-s3_config.h',
      description: 'High-performance ESP32-S3 with dual-core Xtensa processor and PSRAM',
      verified: true
    },
    {
      id: 'esp32-pico-d4',
      name: 'ESP32 PICO-D4',
      architecture: 'Xtensa',
      mcu: 'ESP32 PICO-D4',
      frequency: '240MHz',
      flash: '4MB',
      sram: '320KB',
      connectivity: ['WiFi', 'Bluetooth Classic + LE'],
      wifi: 'WiFi 4',
      bluetooth: {
        classic: true,
        le: true,
        version: '4.2'
      },
      configFile: 'esp32-pico_config.h',
      description: 'Compact ESP32 module with integrated flash memory',
      verified: true
    },
    {
      id: 'custom-board',
      name: 'Custom Board Definition',
      architecture: 'Custom',
      mcu: 'User Defined',
      frequency: 'Variable',
      flash: 'Variable',
      sram: 'Variable',
      connectivity: ['User Defined'],
      wifi: 'Variable',
      bluetooth: {
        classic: false,
        le: false,
        version: 'Unknown'
      },
      configFile: 'custom_config.h',
      description: 'Import or create a custom board configuration',
      verified: false
    }
  ]);

  const [showBoardConfigDialog, setShowBoardConfigDialog] = useState(false);
  const [boardConfigMode, setBoardConfigMode] = useState<'import' | 'manual' | 'edit'>('import');
  const [newBoardDefinition, setNewBoardDefinition] = useState<Partial<BoardDefinition>>({});
  const [importedBoardFile, setImportedBoardFile] = useState<string>('');
  const [boardSortColumn, setBoardSortColumn] = useState<string>('name');
  const [boardSortDirection, setBoardSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Board Column Management State
  const [boardColumns, setBoardColumns] = useState<BoardColumn[]>([
    { key: 'name', label: 'Board Name', visible: true, width: '16%', sortable: true },
    { key: 'brand', label: 'Brand', visible: true, width: '8%', sortable: true },
    { key: 'architecture', label: 'Arch', visible: true, width: '8%', sortable: true },
    { key: 'flash', label: 'Flash', visible: true, width: '7%', sortable: true },
    { key: 'sram', label: 'SRAM', visible: true, width: '8%', sortable: true },
    { key: 'psram', label: 'PSRAM', visible: false, width: '8%', sortable: true },
    { key: 'lpram', label: 'LPRAM', visible: false, width: '7%', sortable: true },
    { key: 'wifi', label: 'WiFi', visible: true, width: '7%', sortable: true },
    { key: 'btc', label: 'BT Classic', visible: false, width: '8%', sortable: true },
    { key: 'ble', label: 'BT LE', visible: true, width: '7%', sortable: true },
    { key: 'pixels', label: 'Display', visible: true, width: '10%', sortable: true },
    { key: 'status', label: 'Status', visible: true, width: '10%', sortable: false }
  ]);
  const [showColumnManager, setShowColumnManager] = useState(false);

  const openBoardConfigDialog = (mode: 'import' | 'manual') => {
    setBoardConfigMode(mode);
    setNewBoardDefinition({});
    setImportedBoardFile('');
    setShowBoardConfigDialog(true);
  };

  const closeBoardConfigDialog = () => {
    setShowBoardConfigDialog(false);
    setNewBoardDefinition({});
    setImportedBoardFile('');
  };

  const importBoardDefinition = async () => {
    try {
      const { dialogService } = await import('../services/dialog');
      const selectedFile = await dialogService.selectFile([
        { name: 'Header Files', extensions: ['h', 'hpp'] },
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]);
      if (selectedFile) {
        setImportedBoardFile(selectedFile);
        // Parse the file and populate newBoardDefinition
        // This is a placeholder - in real implementation, parse the actual file
        const filename = selectedFile.split(/[\\\/]/).pop() || 'imported-board';
        setNewBoardDefinition({
          id: filename.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          name: filename.replace(/\.[^/.]+$/, ''),
          architecture: 'Imported',
          mcu: 'Unknown',
          frequency: 'Unknown',
          flash: 'Unknown',
          sram: 'Unknown',
          connectivity: ['Unknown'],
          configFile: filename,
          description: `Imported from ${filename}`,
          verified: false
        });
      }
    } catch (error) {
      console.error('Failed to import board definition:', error);
      alert('Failed to import board definition: ' + String(error));
    }
  };

  const addCustomBoard = () => {
    if (!newBoardDefinition.name || !newBoardDefinition.id) {
      alert('Please provide at least a board name and ID');
      return;
    }

    const customBoard: BoardDefinition = {
      id: newBoardDefinition.id || '',
      name: newBoardDefinition.name || '',
      architecture: newBoardDefinition.architecture || 'Custom',
      mcu: newBoardDefinition.mcu || 'Custom MCU',
      frequency: newBoardDefinition.frequency || 'Unknown',
      flash: newBoardDefinition.flash || 'Unknown',
      sram: newBoardDefinition.sram || 'Unknown',
      psram: newBoardDefinition.psram,
      lpram: newBoardDefinition.lpram,
      display: newBoardDefinition.display,
      connectivity: newBoardDefinition.connectivity || ['Custom'],
      wifi: newBoardDefinition.wifi || 'Unknown',
      bluetooth: newBoardDefinition.bluetooth || {
        classic: false,
        le: false,
        version: 'Unknown'
      },
      configFile: newBoardDefinition.configFile || 'custom_config.h',
      description: newBoardDefinition.description || 'Custom board definition',
      verified: false
    };
    
    if (boardConfigMode === 'edit') {
      // Update existing board
      setAvailableBoards(availableBoards.map(board => 
        board.id === customBoard.id ? customBoard : board
      ));
    } else {
      // Add new board
      setAvailableBoards([...availableBoards, customBoard]);
    }
    
    setSelectedBoard(customBoard.id);
    closeBoardConfigDialog();
  };

  const editCustomBoard = (selectedBoard: string) => {
    const selectedBoardData = availableBoards.find(b => b.id === selectedBoard);
    if (selectedBoardData && !selectedBoardData.verified) {
      setBoardConfigMode('edit');
      setNewBoardDefinition(selectedBoardData);
      setShowBoardConfigDialog(true);
    }
  };

  // Sort boards based on current column and direction
  const getSortedBoards = (): BoardDefinition[] => {
    const sorted = [...availableBoards].sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (boardSortColumn) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'brand':
          // Extract brand from MCU name (e.g., "ESP32-C6" -> "ESP32")
          aVal = a.mcu.split('-')[0] || a.mcu;
          bVal = b.mcu.split('-')[0] || b.mcu;
          break;
        case 'flash':
          // Convert to numeric for sorting (e.g., "4MB" -> 4)
          aVal = parseInt(a.flash) || 0;
          bVal = parseInt(b.flash) || 0;
          break;
        case 'sram':
        case 'psram':
        case 'lpram':
          // Extract numeric value for memory sorting
          aVal = parseInt((a as any)[boardSortColumn]) || 0;
          bVal = parseInt((b as any)[boardSortColumn]) || 0;
          break;
        case 'wifi':
          // Sort by WiFi standard (WiFi 4, WiFi 5, WiFi 6, etc.)
          const wifiOrder = { 'WiFi 6': 6, 'WiFi 5': 5, 'WiFi 4': 4, 'WiFi 3': 3, 'None': 0, 'Variable': -1 };
          aVal = wifiOrder[a.wifi as keyof typeof wifiOrder] || 0;
          bVal = wifiOrder[b.wifi as keyof typeof wifiOrder] || 0;
          break;
        case 'btc':
          // Sort by Bluetooth Classic support (yes/no)
          aVal = a.bluetooth?.classic ? 1 : 0;
          bVal = b.bluetooth?.classic ? 1 : 0;
          break;
        case 'ble':
          // Sort by Bluetooth LE support (yes/no)
          aVal = a.bluetooth?.le ? 1 : 0;
          bVal = b.bluetooth?.le ? 1 : 0;
          break;
        case 'pixels':
          // Calculate total pixels (width × height)
          aVal = a.display ? (a.display.width * a.display.height) : 0;
          bVal = b.display ? (b.display.width * b.display.height) : 0;
          break;
        case 'architecture':
          aVal = a.architecture.toLowerCase();
          bVal = b.architecture.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (typeof aVal === 'string') {
        return boardSortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return boardSortDirection === 'asc' 
          ? aVal - bVal
          : bVal - aVal;
      }
    });
    
    return sorted;
  };

  const handleColumnSort = (column: string) => {
    if (boardSortColumn === column) {
      setBoardSortDirection(boardSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setBoardSortColumn(column);
      setBoardSortDirection('asc');
    }
  };

  return {
    // State
    availableBoards,
    showBoardConfigDialog,
    boardConfigMode,
    newBoardDefinition,
    importedBoardFile,
    boardSortColumn,
    boardSortDirection,
    boardColumns,
    showColumnManager,
    
    // Actions
    openBoardConfigDialog,
    closeBoardConfigDialog,
    importBoardDefinition,
    addCustomBoard,
    editCustomBoard,
    getSortedBoards,
    handleColumnSort,
    setSelectedBoard,
    setNewBoardDefinition,
    setImportedBoardFile,
    setAvailableBoards,
    setBoardColumns,
    setShowColumnManager,
    setBoardSortColumn,
    setBoardSortDirection
  };
}
