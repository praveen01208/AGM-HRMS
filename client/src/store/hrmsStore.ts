import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
  loading: boolean;

  fetchInitialData: () => Promise<void>;

  // Leave actions
  applyLeave: (leave: Omit<Leave, 'id' | 'appliedAt'>) => Promise<number>;
  updateLeaveStatus: (id: number, status: LeaveStatus, remarks?: string, by?: 'hod' | 'principal') => Promise<void>;

  // Adjustment actions
  addAdjustment: (adj: Omit<Adjustment, 'id'>) => Promise<void>;
  respondAdjustment: (id: number, status: AdjustmentStatus) => Promise<void>;

  // Staff actions
  addStaff: (s: Omit<StaffMember, 'id'>) => Promise<void>;
  editStaff: (id: number, updates: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: number) => Promise<void>;
  resetPassword: (id: number) => Promise<void>;

  // Holiday actions
  addHoliday: (h: Omit<Holiday, 'id'>) => Promise<void>;
  deleteHoliday: (id: number) => Promise<void>;

  // Notification actions
  markRead: (id: number) => Promise<void>;
  markAllRead: (userId: number) => Promise<void>;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
}

// ─── Helpers to map snake_case to camelCase ────────────────────────────────────
const mapStaff = (row: any): StaffMember => ({
  id: row.id,
  name: row.name,
  employeeId: row.employee_id,
  email: row.email,
  role: row.role,
  department: row.department || '',
  departmentId: row.department_id || 0,
  designation: row.designation,
  phone: row.phone || '',
  joinDate: row.join_date,
  casualBalance: row.casual_balance,
  sickBalance: row.sick_balance,
  academicBalance: row.academic_balance,
  dutyBalance: row.duty_balance,
});

const mapLeave = (row: any): Leave => ({
  id: row.id,
  userId: row.user_id,
  userName: row.user_name || '',
  department: row.department || '',
  departmentId: row.department_id || 0,
  leaveType: row.leave_type as LeaveType,
  fromDate: row.from_date,
  toDate: row.to_date,
  days: row.days,
  reason: row.reason,
  status: row.status as LeaveStatus,
  hodRemarks: row.hod_remarks || undefined,
  principalRemarks: row.principal_remarks || undefined,
  appliedAt: row.applied_at,
  hasAdjustment: row.has_adjustment,
});

const mapAdjustment = (row: any): Adjustment => ({
  id: row.id,
  leaveId: row.leave_id,
  requesterId: row.requester_id,
  requesterName: row.requester_name || '',
  adjusterId: row.adjuster_id,
  adjusterName: row.adjuster_name || '',
  period: row.period,
  subject: row.subject,
  date: row.date,
  status: row.status as AdjustmentStatus,
  respondedAt: row.responded_at || undefined,
});

const mapHoliday = (row: any): Holiday => ({
  id: row.id,
  date: row.date,
  description: row.description,
  type: row.type as Holiday['type'],
});

const mapNotification = (row: any): Notification => ({
  id: row.id,
  userId: row.user_id,
  message: row.message,
  sub: row.sub || '',
  isRead: row.is_read,
  type: row.type as Notification['type'],
  createdAt: row.created_at,
});

export const useHrmsStore = create<HrmsState>((set, get) => ({
  leaves: [],
  adjustments: [],
  staff: [],
  holidays: [],
  notifications: [],
  loading: false,

  fetchInitialData: async () => {
    set({ loading: true });
    try {
      const [
        { data: sData },
        { data: lData },
        { data: aData },
        { data: hData },
        { data: nData }
      ] = await Promise.all([
        supabase.from('staff').select('*').order('name'),
        supabase.from('leaves').select('*').order('applied_at', { ascending: false }),
        supabase.from('adjustments').select('*').order('date', { ascending: false }),
        supabase.from('holidays').select('*').order('date'),
        supabase.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      set({
        staff: (sData || []).map(mapStaff),
        leaves: (lData || []).map(mapLeave),
        adjustments: (aData || []).map(mapAdjustment),
        holidays: (hData || []).map(mapHoliday),
        notifications: (nData || []).map(mapNotification),
      });
    } catch (err) {
      console.error('Error fetching initial HRMS data:', err);
    } finally {
      set({ loading: false });
    }
  },

  applyLeave: async (leave) => {
    const { data, error } = await supabase
      .from('leaves')
      .insert([{
        user_id: leave.userId,
        user_name: leave.userName,
        department: leave.department,
        department_id: leave.departmentId,
        leave_type: leave.leaveType,
        from_date: leave.fromDate,
        to_date: leave.toDate,
        days: leave.days,
        reason: leave.reason,
        status: leave.status,
        has_adjustment: leave.hasAdjustment
      }])
      .select()
      .single();

    if (error) throw error;
    const newLeave = mapLeave(data);
    set(s => ({ leaves: [newLeave, ...s.leaves] }));
    return newLeave.id;
  },

  updateLeaveStatus: async (id, status, remarks, by) => {
    const updates: any = { status };
    if (by === 'hod') updates.hod_remarks = remarks;
    if (by === 'principal') updates.principal_remarks = remarks;

    const { data, error } = await supabase
      .from('leaves')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    set(s => ({
      leaves: s.leaves.map(l => l.id === id ? mapLeave(data) : l)
    }));
  },

  addAdjustment: async (adj) => {
    const { data, error } = await supabase
      .from('adjustments')
      .insert([{
        leave_id: adj.leaveId,
        requester_id: adj.requesterId,
        requester_name: adj.requesterName,
        adjuster_id: adj.adjusterId,
        adjuster_name: adj.adjusterName,
        period: adj.period,
        subject: adj.subject,
        date: adj.date,
        status: adj.status
      }])
      .select()
      .single();

    if (error) throw error;
    set(s => ({ adjustments: [mapAdjustment(data), ...s.adjustments] }));
  },

  respondAdjustment: async (id, status) => {
    const { data, error } = await supabase
      .from('adjustments')
      .update({
        status,
        responded_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    set(s => ({
      adjustments: s.adjustments.map(a => a.id === id ? mapAdjustment(data) : a)
    }));

    // If accepted, move leave to pending_hod
    if (status === 'accepted') {
      const adj = get().adjustments.find(a => a.id === id);
      if (adj) {
        await get().updateLeaveStatus(adj.leaveId, 'pending_hod');
      }
    }
  },

  addStaff: async (s) => {
    const { data, error } = await supabase
      .from('staff')
      .insert([{
        name: s.name,
        employee_id: s.employeeId,
        email: s.email,
        role: s.role,
        department: s.department,
        department_id: s.departmentId,
        designation: s.designation,
        phone: s.phone,
        join_date: s.joinDate,
        casual_balance: s.casualBalance,
        sick_balance: s.sickBalance,
        academic_balance: s.academicBalance,
        duty_balance: s.dutyBalance
      }])
      .select()
      .single();

    if (error) throw error;
    set(state => ({ staff: [mapStaff(data), ...state.staff] }));
  },

  editStaff: async (id, updates) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.employeeId !== undefined) dbUpdates.employee_id = updates.employeeId;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.departmentId !== undefined) dbUpdates.department_id = updates.departmentId;
    if (updates.designation !== undefined) dbUpdates.designation = updates.designation;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.joinDate !== undefined) dbUpdates.join_date = updates.joinDate;
    if (updates.casualBalance !== undefined) dbUpdates.casual_balance = updates.casualBalance;
    if (updates.sickBalance !== undefined) dbUpdates.sick_balance = updates.sickBalance;
    if (updates.academicBalance !== undefined) dbUpdates.academic_balance = updates.academicBalance;
    if (updates.dutyBalance !== undefined) dbUpdates.duty_balance = updates.dutyBalance;

    const { data, error } = await supabase
      .from('staff')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    set(s => ({ staff: s.staff.map(m => m.id === id ? mapStaff(data) : m) }));
  },

  deleteStaff: async (id) => {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set(s => ({ staff: s.staff.filter(m => m.id !== id) }));
  },

  resetPassword: async (id) => {
    const member = get().staff.find(m => m.id === id);
    if (!member) return;
    const { error } = await supabase
      .from('staff')
      .update({ password: member.employeeId })
      .eq('id', id);

    if (error) throw error;
  },

  addHoliday: async (h) => {
    const { data, error } = await supabase
      .from('holidays')
      .insert([{
        date: h.date,
        description: h.description,
        type: h.type
      }])
      .select()
      .single();

    if (error) throw error;
    set(s => ({ holidays: [...s.holidays, mapHoliday(data)].sort((a, b) => a.date.localeCompare(b.date)) }));
  },

  deleteHoliday: async (id) => {
    const { error } = await supabase
      .from('holidays')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set(s => ({ holidays: s.holidays.filter(h => h.id !== id) }));
  },

  markRead: async (id) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    set(s => ({ notifications: s.notifications.map(n => n.id === id ? mapNotification(data) : n) }));
  },

  markAllRead: async (userId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) throw error;
    set(s => ({ notifications: s.notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n) }));
  },

  addNotification: async (n) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: n.userId,
        message: n.message,
        sub: n.sub,
        is_read: n.isRead,
        type: n.type
      }])
      .select()
      .single();

    if (error) throw error;
    set(s => ({ notifications: [mapNotification(data), ...s.notifications] }));
  },
}));
