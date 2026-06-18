import DataTable from '../../components/DataTable.jsx';
import { Panel } from '../../components/Card.jsx';
import { useApi } from '../../hooks/useApi.js';
import { money } from '../../utils/format.js';

export default function ChairmanReports() {
  const { data } = useApi('/reports/analytics', { topSavers: [], defaulters: [], income: {}, expenditure: {} });
  return (
    <div className="page-stack">
      <h1>Reports</h1>
      <Panel title="Annual report summary">
        <dl className="details">
          <dt>Income summary</dt>
          <dd>{money(Number(data.income.savings_collected || 0) + Number(data.income.loan_repayments || 0))}</dd>
          <dt>Expenditure summary</dt>
          <dd>{money(data.expenditure.withdrawals_paid)}</dd>
          <dt>Interest income</dt>
          <dd>{money(data.income.interest_income)}</dd>
        </dl>
      </Panel>
      <Panel title="Top savers">
        <DataTable rows={data.topSavers} columns={[{ key: 'full_name', label: 'Member' }, { key: 'total', label: 'Total savings', render: (row) => money(row.total) }]} />
      </Panel>
    </div>
  );
}
