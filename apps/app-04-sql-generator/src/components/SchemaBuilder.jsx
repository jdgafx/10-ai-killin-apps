import React from 'react'
import { Table, Plus, Trash2 } from 'lucide-react'

function SchemaBuilder({ schema, setSchema }) {
  const addTable = () => {
    setSchema({
      ...schema,
      tables: [
        ...schema.tables,
        {
          name: 'new_table',
          columns: [
            { name: 'id', type: 'INTEGER', primaryKey: true }
          ]
        }
      ]
    })
  }

  const removeTable = (index) => {
    setSchema({
      ...schema,
      tables: schema.tables.filter((_, i) => i !== index)
    })
  }

  const updateTable = (index, field, value) => {
    const newTables = [...schema.tables]
    newTables[index] = { ...newTables[index], [field]: value }
    setSchema({ ...schema, tables: newTables })
  }

  const addColumn = (tableIndex) => {
    const newTables = [...schema.tables]
    newTables[tableIndex].columns.push({
      name: 'new_column',
      type: 'VARCHAR(255)',
      primaryKey: false
    })
    setSchema({ ...schema, tables: newTables })
  }

  const removeColumn = (tableIndex, columnIndex) => {
    const newTables = [...schema.tables]
    newTables[tableIndex].columns = newTables[tableIndex].columns.filter(
      (_, i) => i !== columnIndex
    )
    setSchema({ ...schema, tables: newTables })
  }

  const updateColumn = (tableIndex, columnIndex, field, value) => {
    const newTables = [...schema.tables]
    newTables[tableIndex].columns[columnIndex] = {
      ...newTables[tableIndex].columns[columnIndex],
      [field]: value
    }
    setSchema({ ...schema, tables: newTables })
  }

  return (
    <div style={{
      padding: '1.5rem',
      background: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Table size={20} />
          Database Schema
        </h2>
        <button
          onClick={addTable}
          style={{
            padding: '0.5rem 1rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={16} />
          Add Table
        </button>
      </div>

      {schema.tables.map((table, tableIndex) => (
        <div
          key={tableIndex}
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={table.name}
              onChange={(e) => updateTable(tableIndex, 'name', e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            />
            <button
              onClick={() => removeTable(tableIndex)}
              style={{
                padding: '0.5rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div style={{ marginLeft: '1rem' }}>
            {table.columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr auto',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) =>
                    updateColumn(tableIndex, columnIndex, 'name', e.target.value)
                  }
                  placeholder="Column name"
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
                <input
                  type="text"
                  value={column.type}
                  onChange={(e) =>
                    updateColumn(tableIndex, columnIndex, 'type', e.target.value)
                  }
                  placeholder="Data type"
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem'
                }}>
                  <input
                    type="checkbox"
                    checked={column.primaryKey || false}
                    onChange={(e) =>
                      updateColumn(tableIndex, columnIndex, 'primaryKey', e.target.checked)
                    }
                  />
                  PK
                </label>
                <button
                  onClick={() => removeColumn(tableIndex, columnIndex)}
                  style={{
                    padding: '0.25rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addColumn(tableIndex)}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus size={14} />
              Add Column
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SchemaBuilder
