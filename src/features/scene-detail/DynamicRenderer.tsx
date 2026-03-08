/**
 * Dynamic renderer for scene detail configuration.
 */
import { Card, DatePicker, Form, Input, Select, Space } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { EChartsOption } from 'echarts';
import { useMemo, useState } from 'react';
import { BaseChart } from '@/components/charts/BaseChart';
import type { SceneDetailConfig } from '@/types';

type RowData = Record<string, unknown>;

export interface DynamicRendererProps {
  config: SceneDetailConfig;
}

function createMockRows(count: number): RowData[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: `row_${index + 1}`,
    requestId: `req_${String(index + 1000)}`,
    userId: `user_${(index % 9) + 1}`,
    orderId: `order_${20000 + index}`,
    params: { sku: `sku_${index % 3}`, qty: (index % 4) + 1 },
    response: { code: 0, message: 'ok' },
    latency: 20 + (index % 10) * 17,
    time: `2026-03-05 ${String(index % 24).padStart(2, '0')}:00`,
    count: 50 + index * 3,
  }));
}

function toSafeText(input: unknown): string {
  if (input === null || input === undefined) {
    return '';
  }
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return String(input);
  }
  return JSON.stringify(input);
}

export function DynamicRenderer(props: DynamicRendererProps): JSX.Element {
  const { config } = props;
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const rows = useMemo(() => createMockRows(30), []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return true;
        }

        if (Array.isArray(value)) {
          return true;
        }

        const rowValue = row[key];
        return toSafeText(rowValue).toLowerCase().includes(toSafeText(value).toLowerCase());
      });
    });
  }, [filters, rows]);

  const columns: ProColumns<RowData>[] = useMemo(
    () =>
      config.table.columns.map((column) => ({
        title: column.label,
        dataIndex: column.field,
        width: column.width,
        sorter: column.sorter,
        render: (_, record) => {
          const value = record[column.field];
          if (column.render === 'json') {
            return <pre className="json-preview">{JSON.stringify(value, null, 2)}</pre>;
          }

          return <span>{toSafeText(value) || '-'}</span>;
        },
      })),
    [config.table.columns],
  );

  const chartOptions: EChartsOption[] = useMemo(
    () =>
      config.charts.map((chart) => {
        if (chart.type === 'pie') {
          return {
            legend: { top: 8 },
            series: [
              {
                type: 'pie',
                radius: ['40%', '65%'],
                data: [
                  { name: '成功', value: 78 },
                  { name: '失败', value: 12 },
                  { name: '超时', value: 6 },
                ],
              },
            ],
          };
        }

        return {
          xAxis: {
            type: 'category',
            data: rows.slice(0, 12).map((item) => String(item[chart.x])),
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } },
          },
          series: [
            {
              name: chart.title,
              type: 'line',
              smooth: true,
              areaStyle: {},
              data: rows.slice(0, 12).map((item) => Number(item[chart.y] ?? 0)),
            },
          ],
        };
      }),
    [config.charts, rows],
  );

  return (
    <div className="space-y-4">
      <Card className="enterprise-panel rounded-[24px] border-0" styles={{ body: { padding: 18 } }}>
        <Form
          className="filter-form-shell"
          layout="inline"
          onValuesChange={(changed, allValues) => {
            const changedValues = changed as Record<string, unknown>;
            const allFormValues = allValues as Record<string, unknown>;
            setFilters((prev) => ({ ...prev, ...changedValues, ...allFormValues }));
          }}
        >
          {config.filters.map((filter) => (
            <Form.Item key={filter.field} name={filter.field} label={filter.label}>
              {filter.type === 'input' ? <Input placeholder={filter.placeholder || `请输入${filter.label}`} /> : null}
              {filter.type === 'daterange' ? <DatePicker.RangePicker /> : null}
              {filter.type === 'select' ? (
                <Select
                  className="min-w-40"
                  options={filter.options?.map((option) => ({ label: option.label, value: option.value })) ?? []}
                  allowClear
                />
              ) : null}
            </Form.Item>
          ))}
        </Form>
      </Card>

      <div className="enterprise-table">
        <ProTable<RowData>
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          search={false}
          options={false}
          pagination={{ pageSize: config.table.pageSize || 10 }}
        />
      </div>

      {chartOptions.length > 0 ? (
        <Space direction="vertical" className="w-full" size={16}>
          {chartOptions.map((option, index) => (
            <Card key={`chart-${index}`} className="enterprise-panel rounded-[24px] border-0" bodyStyle={{ padding: 14 }}>
              <h4 className="panel-title">{config.charts[index]?.title ?? `图表 ${index + 1}`}</h4>
              <BaseChart option={option} height={280} />
            </Card>
          ))}
        </Space>
      ) : null}
    </div>
  );
}
