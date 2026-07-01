import { StatCard, Panel } from '../../components/Card.jsx';
import { useApi } from '../../hooks/useApi.js';
import LoadingSpinner, { ErrorState } from '../../components/LoadingSpinner.jsx';
import { money, shortDate } from '../../utils/format.js';

export default function ChairmanDashboard() {
  const { data } = useApi('/reports/dashboard/chairman', {});
  const { data: overdueList, loading: overdueLoading, error: overdueError } = useApi('/reports/overdue-loans', []);

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

      {/* ── Overdue loans sorted by days overdue (most overdue first) ── */}
      <Panel title={`Overdue loans${Array.isArray(overdueList) && overdueList.length ? ` (${overdueList.length})` : ''}`}>
        {overdueLoading && <LoadingSpinner text="Loading overdue loans..." />}
        {overdueError && <ErrorState message="Failed to load overdue loans." />}
        {!overdueLoading && !overdueError && (
          Array.isArray(overdueList) && overdueList.length ? (
            <div className="overdue-list">
              {overdueList.map((loan, i) => (
                <div key={i} className="overdue-item">
                  <div className="overdue-item-info">
                    <strong>{loan.full_name}</strong>
                    <span>Member No: {loan.member_number} · Due: {shortDate(loan.due_date)}</span>
                  </div>
                  <div className="overdue-item-amount">
                    <strong>{money(loan.amount_overdue)}</strong>
                    <span>{loan.days_overdue} day{loan.days_overdue !== 1 ? 's' : ''} overdue</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>
              ✅ No overdue loans at this time.
            </p>
          )
        )}
      </Panel>
    </div>
  );
}
