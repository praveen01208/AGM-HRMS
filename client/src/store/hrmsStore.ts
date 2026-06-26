import { create } from 'zustand';

export type LeaveStatus = 'pending_adjustment' | 'pending_hod' | 'pending_principal' | 'approved' | 'rejected';
export type LeaveType = 'casual' | 'sick' | 'academic' | 'duty';
export type AdjustmentStatus = 'pending' | 'accepted' | 'rejected';

export interface Leave {
  id: number;
  userId: number;
  userName: string;
  department: string;
  departmentId: number;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  hodRemarks?: string;
  principalRemarks?: string;
  appliedAt: string;
  hasAdjustment: boolean;
}

export interface Adjustment {
  id: number;
  leaveId: number;
  requesterId: number;
  requesterName: string;
  adjusterId: number;
  adjusterName: string;
  period: string;
  subject: string;
  date: string;
  status: AdjustmentStatus;
  respondedAt?: string;
}

export interface StaffMember {
  id: number;
  name: string;
  employeeId: string;
  email: string;
  role: string;
  department: string;
  departmentId: number;
  designation: string;
  phone: string;
  joinDate: string;
  casualBalance: number;
  sickBalance: number;
  academicBalance: number;
  dutyBalance: number;
}

export interface Holiday {
  id: number;
  date: string;
  description: string;
  type: 'holiday' | 'term_start' | 'term_end';
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  sub: string;
  isRead: boolean;
  type: 'pending' | 'approved' | 'rejected' | 'forwarded';
  createdAt: string;
}

interface HrmsState {
  leaves: Leave[];
  adjustments: Adjustment[];
  staff: StaffMember[];
  holidays: Holiday[];
  notifications: Notification[];

  // Leave actions
  applyLeave: (leave: Omit<Leave, 'id' | 'appliedAt'>) => number;
  updateLeaveStatus: (id: number, status: LeaveStatus, remarks?: string, by?: 'hod' | 'principal') => void;

  // Adjustment actions
  addAdjustment: (adj: Omit<Adjustment, 'id'>) => void;
  respondAdjustment: (id: number, status: AdjustmentStatus) => void;

  // Staff actions
  addStaff: (s: Omit<StaffMember, 'id'>) => void;
  editStaff: (id: number, updates: Partial<StaffMember>) => void;
  deleteStaff: (id: number) => void;
  resetPassword: (id: number) => void;

  // Holiday actions
  addHoliday: (h: Omit<Holiday, 'id'>) => void;
  deleteHoliday: (id: number) => void;

  // Notification actions
  markRead: (id: number) => void;
  markAllRead: (userId: number) => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
}

// ─── Mock Seed Data ────────────────────────────────────────────────────────────

const seedLeaves: Leave[] = [
  { id: 1,  userId: 5, userName: 'John Doe',     department: 'CSE',  departmentId: 1, leaveType: 'casual',   fromDate: '2025-06-10', toDate: '2025-06-12', days: 3, reason: 'Family function',        status: 'approved',           hodRemarks: 'Approved',       principalRemarks: 'Approved', appliedAt: '2025-06-05', hasAdjustment: true },
  { id: 2,  userId: 5, userName: 'John Doe',     department: 'CSE',  departmentId: 1, leaveType: 'sick',     fromDate: '2025-07-05', toDate: '2025-07-07', days: 3, reason: 'Fever and rest',          status: 'pending_hod',                                                                         appliedAt: '2025-07-01', hasAdjustment: true },
  { id: 3,  userId: 6, userName: 'Priya Sharma', department: 'CSE',  departmentId: 1, leaveType: 'academic', fromDate: '2025-06-20', toDate: '2025-06-21', days: 2, reason: 'Conference attendance',   status: 'pending_principal',  hodRemarks: 'Recommended',                                    appliedAt: '2025-06-15', hasAdjustment: false },
  { id: 4,  userId: 7, userName: 'Ravi Kumar',   department: 'ECE',  departmentId: 2, leaveType: 'casual',   fromDate: '2025-06-18', toDate: '2025-06-19', days: 2, reason: 'Personal work',           status: 'pending_hod',                                                                         appliedAt: '2025-06-12', hasAdjustment: true },
  { id: 5,  userId: 8, userName: 'Arun Menon',   department: 'CSE',  departmentId: 1, leaveType: 'duty',     fromDate: '2025-05-22', toDate: '2025-05-22', days: 1, reason: 'External exam duty',      status: 'rejected',           hodRemarks: 'Not sanctioned', principalRemarks: 'Rejected', appliedAt: '2025-05-18', hasAdjustment: false },
  { id: 6,  userId: 9, userName: 'Sunita Nair',  department: 'MECH', departmentId: 3, leaveType: 'sick',     fromDate: '2025-07-10', toDate: '2025-07-12', days: 3, reason: 'Medical procedure',       status: 'pending_principal',  hodRemarks: 'Approved',                                       appliedAt: '2025-07-08', hasAdjustment: false },
];

const seedAdjustments: Adjustment[] = [
  { id: 1, leaveId: 1, requesterId: 5, requesterName: 'John Doe',  adjusterId: 6, adjusterName: 'Priya Sharma', period: '3rd Period', subject: 'Data Structures', date: '2025-06-10', status: 'accepted', respondedAt: '2025-06-06' },
  { id: 2, leaveId: 2, requesterId: 5, requesterName: 'John Doe',  adjusterId: 8, adjusterName: 'Arun Menon',   period: '2nd Period', subject: 'Algorithms',       date: '2025-07-05', status: 'pending' },
  { id: 3, leaveId: 4, requesterId: 7, requesterName: 'Ravi Kumar', adjusterId: 9, adjusterName: 'Sunita Nair', period: '1st Period', subject: 'Networks',         date: '2025-06-18', status: 'accepted', respondedAt: '2025-06-13' },
];

const seedStaff: StaffMember[] = [
  { id: 5,  name: 'John Doe',       employeeId: 'AGM-CSE-001',  email: 'john@agmcet.ac.in',    role: 'staff', department: 'CSE',  departmentId: 1, designation: 'Assistant Professor', phone: '9876543210', joinDate: '2020-06-01', casualBalance: 12, sickBalance: 10, academicBalance: 5, dutyBalance: 3 },
  { id: 6,  name: 'Priya Sharma',   employeeId: 'AGM-CSE-002',  email: 'priya@agmcet.ac.in',   role: 'staff', department: 'CSE',  departmentId: 1, designation: 'Assistant Professor', phone: '9876543211', joinDate: '2019-07-01', casualBalance: 15, sickBalance: 10, academicBalance: 5, dutyBalance: 3 },
  { id: 7,  name: 'Ravi Kumar',     employeeId: 'AGM-ECE-001',  email: 'ravi@agmcet.ac.in',    role: 'staff', department: 'ECE',  departmentId: 2, designation: 'Associate Professor', phone: '9876543212', joinDate: '2018-06-01', casualBalance: 8,  sickBalance: 10, academicBalance: 5, dutyBalance: 3 },
  { id: 8,  name: 'Arun Menon',     employeeId: 'AGM-CSE-003',  email: 'arun@agmcet.ac.in',    role: 'staff', department: 'CSE',  departmentId: 1, designation: 'Assistant Professor', phone: '9876543213', joinDate: '2021-01-01', casualBalance: 6,  sickBalance: 10, academicBalance: 5, dutyBalance: 3 },
  { id: 9,  name: 'Sunita Nair',    employeeId: 'AGM-MECH-001', email: 'sunita@agmcet.ac.in',  role: 'staff', department: 'MECH', departmentId: 3, designation: 'Assistant Professor', phone: '9876543214', joinDate: '2022-08-01', casualBalance: 14, sickBalance: 10, academicBalance: 5, dutyBalance: 3 },
  { id: 3,  name: 'Dr. Meera Rajan',employeeId: 'AGM-HOD-01',   email: 'hod.cse@agmcet.ac.in', role: 'hod',   department: 'CSE',  departmentId: 1, designation: 'HOD - CSE',          phone: '9876543215', joinDate: '2015-06-01', casualBalance: 15, sickBalance: 10, academicBalance: 5, dutyBalance: 3 },
  { id: 4,  name: 'Dr. Rajesh Kumar',employeeId: 'AGM-HOD-02',  email: 'hod.ece@agmcet.ac.in', role: 'hod',   department: 'ECE',  departmentId: 2, designation: 'HOD - ECE',          phone: '9876543216', joinDate: '2016-01-01', casualBalance: 15, sickBalance: 10, academicBalance: 5, dutyBalance: 3 },
];

const seedHolidays: Holiday[] = [
  { id: 1, date: '2025-01-26', description: 'Republic Day',    type: 'holiday' },
  { id: 2, date: '2025-04-14', description: 'Tamil New Year',  type: 'holiday' },
  { id: 3, date: '2025-06-01', description: 'Term I Begins',   type: 'term_start' },
  { id: 4, date: '2025-10-31', description: 'Term I Ends',     type: 'term_end' },
  { id: 5, date: '2025-08-15', description: 'Independence Day',type: 'holiday' },
  { id: 6, date: '2025-10-02', description: "Gandhi Jayanti",  type: 'holiday' },
];

const seedNotifications: Notification[] = [
  { id: 1, userId: 3, message: 'John Doe applied for Sick Leave',    sub: 'Jul 5–7 · 3 days',            isRead: false, type: 'pending',   createdAt: '2025-07-01T09:00:00Z' },
  { id: 2, userId: 3, message: 'Ravi Kumar applied for Casual Leave',sub: 'Jun 18–19 · 2 days',           isRead: false, type: 'pending',   createdAt: '2025-06-12T10:00:00Z' },
  { id: 3, userId: 5, message: 'Your leave was approved',             sub: 'Medical Leave Jun 10–12',      isRead: true,  type: 'approved',  createdAt: '2025-06-08T14:00:00Z' },
  { id: 4, userId: 2, message: 'Priya Sharma leave forwarded by HOD',sub: 'Academic Leave Jun 20–21',      isRead: false, type: 'forwarded', createdAt: '2025-06-17T11:00:00Z' },
  { id: 5, userId: 2, message: 'Sunita Nair leave forwarded by HOD', sub: 'Sick Leave Jul 10–12',          isRead: false, type: 'forwarded', createdAt: '2025-07-09T08:00:00Z' },
  { id: 6, userId: 5, message: 'Adjustment request sent to Arun Menon',sub: 'Algorithms · 2nd Period',    isRead: false, type: 'pending',   createdAt: '2025-07-01T09:05:00Z' },
  { id: 7, userId: 8, message: 'John Doe requests class adjustment', sub: 'Algorithms · Jul 5 · 2nd Pd',  isRead: false, type: 'pending',   createdAt: '2025-07-01T09:05:00Z' },
];

let nextId = { leave: 10, adj: 10, staff: 20, holiday: 10, notif: 10 };

export const useHrmsStore = create<HrmsState>((set, get) => ({
  leaves: seedLeaves,
  adjustments: seedAdjustments,
  staff: seedStaff,
  holidays: seedHolidays,
  notifications: seedNotifications,

  applyLeave: (leave) => {
    const id = nextId.leave++;
    set(s => ({ leaves: [{ ...leave, id, appliedAt: new Date().toISOString() }, ...s.leaves] }));
    return id;
  },

  updateLeaveStatus: (id, status, remarks, by) => {
    set(s => ({
      leaves: s.leaves.map(l => l.id === id ? {
        ...l,
        status,
        ...(by === 'hod' ? { hodRemarks: remarks } : {}),
        ...(by === 'principal' ? { principalRemarks: remarks } : {}),
      } : l)
    }));
  },

  addAdjustment: (adj) => {
    const id = nextId.adj++;
    set(s => ({ adjustments: [{ ...adj, id }, ...s.adjustments] }));
  },

  respondAdjustment: (id, status) => {
    set(s => ({
      adjustments: s.adjustments.map(a => a.id === id
        ? { ...a, status, respondedAt: new Date().toISOString() } : a)
    }));
    // If accepted, move leave to pending_hod
    const adj = get().adjustments.find(a => a.id === id);
    if (adj && status === 'accepted') {
      get().updateLeaveStatus(adj.leaveId, 'pending_hod');
    }
  },

  addStaff: (s) => {
    const id = nextId.staff++;
    set(state => ({ staff: [{ ...s, id }, ...state.staff] }));
  },

  editStaff: (id, updates) => {
    set(s => ({ staff: s.staff.map(m => m.id === id ? { ...m, ...updates } : m) }));
  },

  deleteStaff: (id) => {
    set(s => ({ staff: s.staff.filter(m => m.id !== id) }));
  },

  resetPassword: (_id) => { /* In real system: call API */ },

  addHoliday: (h) => {
    const id = nextId.holiday++;
    set(s => ({ holidays: [...s.holidays, { ...h, id }].sort((a, b) => a.date.localeCompare(b.date)) }));
  },

  deleteHoliday: (id) => {
    set(s => ({ holidays: s.holidays.filter(h => h.id !== id) }));
  },

  markRead: (id) => {
    set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n) }));
  },

  markAllRead: (userId) => {
    set(s => ({ notifications: s.notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n) }));
  },

  addNotification: (n) => {
    const id = nextId.notif++;
    set(s => ({ notifications: [{ ...n, id, createdAt: new Date().toISOString() }, ...s.notifications] }));
  },
}));
