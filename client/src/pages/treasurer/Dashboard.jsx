import { Panel, StatCard } from '../../components/Card.jsx';
import { useApi } from '../../hooks/useApi.js';
import LoadingSpinner, { ErrorState } from '../../components/LoadingSpinner.jsx';
import { money, shortDate } from '../../utils/format.js';

export default function TreasurerDashboard() {
  const { data, loading: statsLoading } = useApi('/reports/dashboard/treasurer', {});
  const { data: overdueList, loading: overdueLoading, error: overdueError, setData: setOverdue } = useApi('/reports/overdue-loans', []);

  return (
    <div className="page-stack">
      <h1>Treasurer Dashboard</h1>
      <div className="stat-grid">
        <StatCard label="Active members" value={data.active_members || 0} />
        <StatCard label="Today" value={money(data.daily_collections)} />
        <StatCard label="This week" value={money(data.weekly_collections)} />
        <StatCard label="This month" value={money(data.monthly_collections)} />
        <StatCard label="Active loans" value={data.active_loans || 0} />
        <StatCard label="Pending loan requests" value={data.pending_loan_requests || 0} tone="warn" />
      </div>

      <Panel title="Quick work">
        <div className="quick-grid">
          <a href="/treasurer/savings">Record savings</a>
          <a href="/treasurer/confirm-deposits">Confirm deposits</a>
          <a href="/treasurer/confirm-loans">Confirm loans</a>
          <a href="/treasurer/members">Register member</a>
          <a href="/treasurer/loans">Issue loan</a>
          <a href="/treasurer/withdrawals">Withdrawals</a>
        </div>
      </Panel>

      {/* ── Overdue loans sorted by days overdue (most overdue first) ── */}
      <Panel title={`Overdue loans${Array.isArray(overdueList) && overdueList.length ? ` (${overdueList.length})` : ''}`}>
        {overdueLoading && <LoadingSpinner text="Loading overdue loans..." />}
        {overdueError && (
          <ErrorState
            message="Failed to load overdue loans."
            onRetry={() => setOverdue([])}
          />
        )}
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
