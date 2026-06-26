import { DashboardLayout } from '../../components/DashboardLayout';
import { LeaveWizard } from '../../components/forms/LeaveWizard';
import { useRequireAuth } from '../../hooks/useAuth';

export default function LeaveApply() {
  const { user } = useRequireAuth('staff');
  if (!user) return null;
  return (
    <DashboardLayout role="staff" user={{ name: user.name, role: user.designation ?? 'Staff', dept: user.department }} title="Apply for Leave">
      <div className="mb-6">
        <h2 className="text-[#F5EFE6] font-bold text-xl mb-1">New Leave Application</h2>
        <p className="text-[#7A6F65] text-sm">Complete all steps to submit your leave request.</p>
      </div>
      <LeaveWizard />
    </DashboardLayout>
  );
}
