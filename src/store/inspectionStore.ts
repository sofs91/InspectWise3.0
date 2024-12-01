import { create } from 'zustand';
import type { Inspection } from '../types';

interface InspectionStore {
  inspections: Inspection[];
  addInspection: (inspection: Inspection) => void;
  updateInspection: (id: string, inspection: Inspection) => void;
  deleteInspection: (id: string) => void;
}

export const useInspectionStore = create<InspectionStore>((set) => ({
  inspections: [],
  addInspection: (inspection) =>
    set((state) => ({ inspections: [...state.inspections, inspection] })),
  updateInspection: (id, updatedInspection) =>
    set((state) => ({
      inspections: state.inspections.map((inspection) =>
        inspection.id === id ? updatedInspection : inspection
      ),
    })),
  deleteInspection: (id) =>
    set((state) => ({
      inspections: state.inspections.filter((inspection) => inspection.id !== id),
    })),
}));