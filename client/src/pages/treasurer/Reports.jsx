import ChartPanel from '../../components/ChartPanel.jsx';
import DataTable from '../../components/DataTable.jsx';
import { Panel } from '../../components/Card.jsx';
import { useApi } from '../../hooks/useApi.js';
import { money } from '../../utils/format.js';

export default function TreasurerReports() {
  const { data } = useApi('/reports/analytics', { topSavers: [], defaulters: [], trend: [], income: {}, expenditure: {} });
  return (
    <div className="page-stack">
      <h1>Reports</h1>
      <ChartPanel title="Monthly collections" data={data.trend} />
      <Panel title="Top savers">
        <DataTable rows={data.topSavers} columns={[{ key: 'full_name', label: 'Member' }, { key: 'total', label: 'Savings', render: (row) => money(row.total) }]} />
      </Panel>
    </div>
  );
}
