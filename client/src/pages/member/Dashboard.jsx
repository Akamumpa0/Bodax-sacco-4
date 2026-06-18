import DataTable from '../../components/DataTable.jsx';
import { Panel, StatCard } from '../../components/Card.jsx';
import { useApi } from '../../hooks/useApi.js';
import { money, shortDate } from '../../utils/format.js';

export default function MemberDashboard() {
  const { data } = useApi('/reports/dashboard/member', {});
  const { data: statement } = useApi(
    `/savings/statement?from=${new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)}&to=${new Date().toISOString().slice(0, 10)}`,
    [],
  );

  return (
    <div className="page-stack">
      <h1>Member Dashboard</h1>
      <div className="stat-grid">
        <StatCard label="Total savings" value={money(data.total_savings)} />
        <StatCard label="This week" value={money(data.week_savings)} />
        <StatCard label="This month" value={money(data.month_savings)} />
        <StatCard label="Active loan balance" value={money(data.active_loan_balance)} tone="warn" />
        <StatCard label="Paid this week" value={money(data.paid_this_week)} />
      </div>
      <Panel title="Recent transactions">
        <DataTable
          rows={statement.slice(0, 8)}
          columns={[
            { key: 'type', label: 'Type' },
            { key: 'date', label: 'Date', render: (row) => shortDate(row.date) },
            { key: 'amount', label: 'Amount', render: (row) => money(row.amount) },
          ]}
        />
      </Panel>
    </div>
  );
}
