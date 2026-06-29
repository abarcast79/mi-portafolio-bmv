import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './App.css';

export default function PortafolioDashboard() {
  const [positions, setPositions] = useState([
    { id: 'TSLA.MX', ticker: 'TSLA.MX', cantidad: 2, precioCosto: 245, precioActual: 268, estado: 'fuerte' },
    { id: 'NVDA.MX', ticker: 'NVDA.MX', cantidad: 3, precioCosto: 118, precioActual: 135, estado: 'fuerte' },
    { id: 'INTC.MX', ticker: 'INTC.MX', cantidad: 1, precioCosto: 52, precioActual: 48, estado: 'débil' },
    { id: 'AMZN.MX', ticker: 'AMZN.MX', cantidad: 1, precioCosto: 185, precioActual: 192, estado: 'fuerte' },
    { id: 'SPCX', ticker: 'SPCX', cantidad: 0, precioCosto: 0, precioActual: 165, estado: 'análisis' },
    { id: 'Equate', ticker: 'Equate', cantidad: 1, precioCosto: 6556, precioActual: 6367.59, estado: 'fuerte' },
    { id: 'FI', ticker: 'FI', cantidad: 1, precioCosto: 102668.5, precioActual: 102684.71, estado: 'fuerte' },
  ]);

  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Cargar datos desde localStorage
  useEffect(() => {
  const loadData = async () => {
    try {
      // Traer datos frescos de Notion al cargar
      const response = await fetch('https://mi-portafolio-bmv.vercel.app/api/notion');
      if (response.ok) {
        const data = await response.json();
        setPositions(data.positions);
      } else {
        // Si falla Notion, usar localStorage
        const saved = localStorage.getItem('portafolio_bmv_vite');
        if (saved) {
          setPositions(JSON.parse(saved));
        }
      }
    } catch (error) {
      // Fallback a localStorage
      const saved = localStorage.getItem('portafolio_bmv_vite');
      if (saved) {
        setPositions(JSON.parse(saved));
      }
    }
    updateTimestamp();
  };
  
  loadData();
}, []);

  // Guardar datos en localStorage siempre que cambien
  useEffect(() => {
    localStorage.setItem('portafolio_bmv_vite', JSON.stringify(positions));
    updateTimestamp();
  }, [positions]);

  const updateTimestamp = () => {
    const now = new Date().toLocaleString('es-MX');
    setTimestamp(now);
    localStorage.setItem('portafolio_bmv_timestamp', now);
  };

  // Guardar cambios a Notion
  const saveToNotion = async (positionsToSave = positions) => {
    try {
      const response = await fetch('https://mi-portafolio-bmv.vercel.app/api/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          positions: positionsToSave.map(pos => ({
            id: pos.id,
            ticker: pos.ticker,
            precioActual: pos.precioActual,
            precioPromedio: pos.precioCosto,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error guardando en Notion: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Guardado en Notion:', data);
      setSyncMessage('✅ Guardado en Notion');
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (error) {
      console.error('Error en saveToNotion:', error);
      setSyncMessage('❌ Error al guardar en Notion');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  // Sincronizar desde Notion
  const syncFromNotion = async () => {
    setLoading(true);
    setSyncMessage('Sincronizando...');
    try {
      const response = await fetch('https://mi-portafolio-bmv.vercel.app/api/notion');
      if (!response.ok) {
        throw new Error('Error al conectar con Notion');
      }

      const data = await response.json();
      const notionPositions = data.positions;

      const updatedPositions = positions.map(pos => {
        const notionPos = notionPositions.find(n => n.ticker === pos.ticker);
        if (notionPos) {
          return {
            ...pos,
            id: notionPos.id,
            precioActual: notionPos.precioActual,
            precioCosto: notionPos.precioPromedio,
          };
        }
        return pos;
      });

      setPositions(updatedPositions);
      setSyncMessage('✅ Sincronizado desde Notion');
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (error) {
      console.error('Error sincronizando:', error);
      setSyncMessage('❌ Error al sincronizar');
      setTimeout(() => setSyncMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePrecioChange = (id, field, value) => {
    const updatedPositions = positions.map(pos =>
      pos.id === id ? { ...pos, [field]: parseFloat(value) || 0 } : pos
    );
    setPositions(updatedPositions);

    // Guardar a Notion automático con pequeño delay
    setTimeout(() => {
      saveToNotion(updatedPositions);
    }, 500);
  };

  const stats = useMemo(() => {
    let totalInvertido = 0;
    let totalActual = 0;
    const chartData = [];

    positions.forEach(pos => {
      if (pos.cantidad > 0) {
        const invertido = pos.cantidad * pos.precioCosto;
        const actual = pos.cantidad * pos.precioActual;
        totalInvertido += invertido;
        totalActual += actual;
        chartData.push({
          name: pos.ticker,
          value: actual,
          invertido
        });
      }
    });

    const ganancia = totalActual - totalInvertido;
    const gananciaPercent = totalInvertido > 0 ? ((ganancia / totalInvertido) * 100).toFixed(2) : 0;

    return { totalInvertido, totalActual, ganancia, gananciaPercent, chartData };
  }, [positions]);

  const colors = ['#0f6e56', '#185fa5', '#ba7517', '#993c1d', '#5f5e5a'];

  const exportarDatos = () => {
    const json = JSON.stringify(positions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portafolio_bmv_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const resetearDatos = () => {
    if (confirm('¿Estás seguro? Se borrarán todos los datos guardados.')) {
      localStorage.removeItem('portafolio_bmv_vite');
      localStorage.removeItem('portafolio_bmv_timestamp');
      setPositions([
        { id: 'TSLA.MX', ticker: 'TSLA.MX', cantidad: 2, precioCosto: 245, precioActual: 268, estado: 'fuerte' },
        { id: 'NVDA.MX', ticker: 'NVDA.MX', cantidad: 2, precioCosto: 118, precioActual: 135, estado: 'fuerte' },
        { id: 'INTC.MX', ticker: 'INTC.MX', cantidad: 1, precioCosto: 52, precioActual: 48, estado: 'débil' },
        { id: 'AMZN.MX', ticker: 'AMZN.MX', cantidad: 1, precioCosto: 185, precioActual: 192, estado: 'fuerte' },
        { id: 'SPCX', ticker: 'SPCX', cantidad: 0, precioCosto: 0, precioActual: 165, estado: 'análisis' },
      ]);
    }
  };

  return (
    <div className="container">
      <h1>💰 Mi Portafolio BMV</h1>
      <p className="subtitle">Sincronizado con Notion + Vite + React</p>

      <div className="stats-grid" id="statsGrid">
        <div className="stat-card">
          <p className="stat-label">Invertido</p>
          <p className="stat-value">${Math.round(stats.totalInvertido).toLocaleString('es-MX')}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Valor Actual</p>
          <p className="stat-value">${Math.round(stats.totalActual).toLocaleString('es-MX')}</p>
        </div>
        <div className={`stat-card ${stats.ganancia >= 0 ? 'gain' : 'loss'}`}>
          <p className="stat-label">P&L Total</p>
          <p className="stat-value">
            {stats.ganancia >= 0 ? '+' : ''}${Math.round(stats.ganancia).toLocaleString('es-MX')} ({stats.gananciaPercent}%)
          </p>
        </div>
      </div>

      <h2>Posiciones</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th style={{ textAlign: 'center' }}>Cantidad</th>
              <th style={{ textAlign: 'right' }}>Precio Costo</th>
              <th style={{ textAlign: 'right' }}>Precio Actual</th>
              <th style={{ textAlign: 'right' }}>P&L</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(pos => {
              const invertido = pos.cantidad * pos.precioCosto;
              const actual = pos.cantidad * pos.precioActual;
              const ganancia = actual - invertido;
              const gananciaPercent = invertido > 0 ? ((ganancia / invertido) * 100).toFixed(1) : 0;
              const isPositive = ganancia >= 0;

              return (
                <tr key={pos.id}>
                  <td className="ticker">{pos.ticker}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="number"
                      value={pos.cantidad}
                      onChange={(e) => handlePrecioChange(pos.id, 'cantidad', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      value={pos.precioCosto}
                      onChange={(e) => handlePrecioChange(pos.id, 'precioCosto', e.target.value)}
                      step="0.01"
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <input
                      type="number"
                      value={pos.precioActual}
                      onChange={(e) => handlePrecioChange(pos.id, 'precioActual', e.target.value)}
                      step="0.01"
                    />
                  </td>
                  <td style={{ textAlign: 'right' }} className={isPositive ? 'gain-text' : 'loss-text'}>
                    ${Math.round(ganancia).toLocaleString('es-MX')} ({gananciaPercent}%)
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`status-badge status-${pos.estado}`}>
                      {pos.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>Distribución de Portafolio</h2>
      <div className="chart-section">
        {stats.chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Math.round(value).toLocaleString('es-MX')}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            Añade posiciones con cantidad &gt; 0 para ver el gráfico
          </p>
        )}
      </div>

      <div className="info-box">
        <strong>💡 Cómo funciona:</strong><br />
        • Edita precios aquí → se guardan automático en Notion (bidireccional)<br />
        • Presiona 🔄 para traer cambios desde Notion<br />
        • Datos guardados automáticamente en localStorage<br />
        • Listo para Sesión 3: Alertas en WhatsApp
      </div>

      <div className="button-group">
        <button className="primary" onClick={syncFromNotion} disabled={loading}>
          {loading ? '⏳ Sincronizando...' : '🔄 Sincronizar desde Notion'}
        </button>
        <button onClick={exportarDatos}>📥 Descargar datos</button>
        <button onClick={resetearDatos}>↻ Limpiar datos</button>
      </div>

      {syncMessage && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '6px', fontSize: '13px', color: '#1e40af' }}>
          {syncMessage}
        </div>
      )}

      <div className="timestamp">
        Último guardado: {timestamp}
      </div>
    </div>
  );
}
