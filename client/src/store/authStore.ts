import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type UserRole = 'staff' | 'hod' | 'principal' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  employeeId: string;
  email: string;
  role: UserRole;
  department?: string;
  departmentId?: number;
  designation?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (employeeId: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('agm_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('agm_user'),
  loading: false,

  login: async (employeeId, password, role) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('password', password)
        .eq('role', role)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid Employee ID, password, or role.' };
      }

      const authUser: AuthUser = {
        id: data.id,
        name: data.name,
        employeeId: data.employee_id,
        email: data.email,
        role: data.role as UserRole,
        department: data.department || undefined,
        departmentId: data.department_id || undefined,
        designation: data.designation || undefined,
      };

      localStorage.setItem('agm_user', JSON.stringify(authUser));
      set({ user: authUser, isAuthenticated: true });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during login.' };
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('agm_user');
    set({ user: null, isAuthenticated: false });
  },

  initialize: async () => {
    // If the local storage is present, we consider them authenticated.
    const stored = localStorage.getItem('agm_user');
    if (stored) {
      set({ user: JSON.parse(stored), isAuthenticated: true });
    }
  }
}));
