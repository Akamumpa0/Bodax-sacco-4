import { StatCard } from '../../components/Card.jsx';
import { useApi } from '../../hooks/useApi.js';
import { money } from '../../utils/format.js';

export default function ChairmanDashboard() {
  const { data } = useApi('/reports/dashboard/chairman', {});
  return (
    <div className="page-stack">
      <h1>Chairman Dashboard</h1>
      <div className="stat-grid">
        <StatCard label="Members" value={data.members || 0} />
        <StatCard label="Total savings" value={money(data.total_savings)} />
        <StatCard label="Active loans" value={data.active_loans || 0} />
        <StatCard label="Outstanding loans" value={money(data.outstanding_loan_balance)} tone="warn" />
        <StatCard label="Loan arrears" value={money(data.loan_arrears)} tone="danger" />
        <StatCard label="Weekly collections" value={money(data.weekly_collections)} />
        <StatCard label="Monthly collections" value={money(data.monthly_collections)} />
      </div>
    </div>
  );
}
