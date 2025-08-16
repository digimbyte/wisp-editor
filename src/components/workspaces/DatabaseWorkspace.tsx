import React from 'react';
import type { DatabaseTable } from '../../types';

interface DatabaseWorkspaceProps {
  databases: DatabaseTable[];
  selectedDatabase: string;
  onDatabaseSelect: (id: string) => void;
  buttonStyle: React.CSSProperties;
}

export function DatabaseWorkspace({
  databases,
  selectedDatabase,
  onDatabaseSelect,
  buttonStyle
}: DatabaseWorkspaceProps) {
  const selectedDb = databases.find(db => db.id === selectedDatabase);
  
  return (
    <div style={{ height: "100%", display: "flex" }}>
      {/* Database List */}
      <div style={{ width: "250px", borderRight: "1px solid #2a2d36", padding: "16px" }}>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>Tables</h3>
          <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>+ Add</button>
        </div>
        {databases.map(db => (
          <div 
            key={db.id} 
            style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: selectedDatabase === db.id ? "#2b6cff" : "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}
            onClick={() => onDatabaseSelect(db.id)}
          >
            <div style={{ fontWeight: "600", marginBottom: "4px" }}>
              {db.type === 'sqlite' && '🗃️'}
              {db.type === 'json' && '📄'}
              {db.type === 'csv' && '📊'}
              {db.type === 'binary' && '💾'}
              {' '}{db.name}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>
              {db.columns.length} columns • {db.data.length} rows
            </div>
          </div>
        ))}
      </div>
      
      {/* Database Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!selectedDb ? (
          <div style={{ padding: "16px" }}>Select a table</div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{ 
              height: "40px", 
              borderBottom: "1px solid #2a2d36", 
              display: "flex", 
              alignItems: "center", 
              padding: "0 16px", 
              justifyContent: "space-between" 
            }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>{selectedDb.name}</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>+ Row</button>
                <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>+ Column</button>
                <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>📥 Import CSV</button>
                <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>📤 Export</button>
              </div>
            </div>
            
            {/* Table Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#252832" }}>
                    {selectedDb.columns.map(col => (
                      <th key={col.name} style={{ 
                        padding: "8px 12px", 
                        textAlign: "left", 
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "1px solid #2a2d36"
                      }}>
                        {col.name}
                        <div style={{ fontSize: "10px", color: "#888", fontWeight: "normal" }}>
                          {col.type}{col.nullable ? '?' : ''}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedDb.data.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#1a1d23" : "#1e2128" }}>
                      {selectedDb.columns.map(col => (
                        <td key={col.name} style={{ 
                          padding: "8px 12px", 
                          fontSize: "12px",
                          border: "1px solid #2a2d36"
                        }}>
                          {String(row[col.name] ?? 'NULL')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
