const STATIC_COLUMNS = ["sprint", "empresa", "time", "comprador", "produto"];

export default function TabelaAvaliacao({ data, tableKey, title, atualizarCaminho }) {
  const rows = data[tableKey] || [];
  const columns = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="table-scroll">
        <table>
          <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${tableKey}-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column}>
                    {STATIC_COLUMNS.includes(column) ? row[column] : (
                      <input value={row[column]} onChange={(event) => atualizarCaminho(`${tableKey}.${rowIndex}.${column}`, event.target.value)} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
