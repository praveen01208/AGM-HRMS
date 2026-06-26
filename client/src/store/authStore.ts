import { create } from 'zustand';

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
  login: (employeeId: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
}

// Mock user database
const MOCK_USERS: (AuthUser & { password: string })[] = [
  { id: 1,  name: 'Admin User',         employeeId: 'AGM-ADMIN-01', email: 'admin@agmcet.ac.in',      role: 'admin',     designation: 'System Administrator', password: 'admin123' },
  { id: 2,  name: 'Prof. S. Arumugam',  employeeId: 'AGM-PRIN-01',  email: 'principal@agmcet.ac.in',  role: 'principal', designation: 'Principal',             password: 'principal123' },
  { id: 3,  name: 'Dr. Meera Rajan',    employeeId: 'AGM-HOD-01',   email: 'hod.cse@agmcet.ac.in',   role: 'hod',       department: 'CSE', departmentId: 1,    designation: 'HOD - CSE', password: 'hod123' },
  { id: 4,  name: 'Dr. Rajesh Kumar',   employeeId: 'AGM-HOD-02',   email: 'hod.ece@agmcet.ac.in',   role: 'hod',       department: 'ECE', departmentId: 2,    designation: 'HOD - ECE', password: 'hod123' },
  { id: 5,  name: 'John Doe',           employeeId: 'AGM-CSE-001',  email: 'john@agmcet.ac.in',      role: 'staff',     department: 'CSE', departmentId: 1,    designation: 'Assistant Professor', password: 'staff123' },
  { id: 6,  name: 'Priya Sharma',       employeeId: 'AGM-CSE-002',  email: 'priya@agmcet.ac.in',     role: 'staff',     department: 'CSE', departmentId: 1,    designation: 'Assistant Professor', password: 'staff123' },
  { id: 7,  name: 'Ravi Kumar',         employeeId: 'AGM-ECE-001',  email: 'ravi@agmcet.ac.in',      role: 'staff',     department: 'ECE', departmentId: 2,    designation: 'Associate Professor', password: 'staff123' },
  { id: 8,  name: 'Arun Menon',         employeeId: 'AGM-CSE-003',  email: 'arun@agmcet.ac.in',      role: 'staff',     department: 'CSE', departmentId: 1,    designation: 'Assistant Professor', password: 'staff123' },
  { id: 9,  name: 'Sunita Nair',        employeeId: 'AGM-MECH-001', email: 'sunita@agmcet.ac.in',    role: 'staff',     department: 'MECH', departmentId: 3,   designation: 'Assistant Professor', password: 'staff123' },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (employeeId, password, role) => {
    const found = MOCK_USERS.find(
      u => u.employeeId.toLowerCase() === employeeId.toLowerCase()
        && u.password === password
        && u.role === role
    );
    if (!found) {
      return { success: false, error: 'Invalid Employee ID, password, or role.' };
    }
    const { password: _pw, ...user } = found;
    set({ user, isAuthenticated: true });
    return { success: true };
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));

export const MOCK_USERS_PUBLIC = MOCK_USERS.map(({ password: _pw, ...u }) => u);
