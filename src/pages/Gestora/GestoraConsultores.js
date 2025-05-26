// src/pages/Gestora/GestoraConsultores.js
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ConsultorItem from '../../components/ConsultorItem';
import './GestoraConsultores.css';
import { getConsultores, saveConsultores } from '../../data/dataConsultores';

function GestoraConsultores() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortByEvents, setSortByEvents] = useState('none');

  // =============================================
  // AGRUPAR EVENTOS POR CONSULTOR
  // =============================================
  const consultoresConEventos = useMemo(() => {
  const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  // Contar eventos por nombre del instructor
  const conteoEventos = {};
  eventos.forEach(evento => {
    const nombre = evento.instructor;
    conteoEventos[nombre] = (conteoEventos[nombre] || 0) + 1;
  });

  // Crear lista completa con todos los consultores
  let lista = getConsultores().map(consultor => ({
  cedula: consultor.cedula,
  nombre: consultor.nombre,
  especialidad: consultor.especialidad,
  contacto: {
    email: consultor.email,
    telefono: consultor.celular,
  },
  consecutivoOAMP: consultor.consecutivoOAMP,
  fechaFirmaOAMP: consultor.fechaFirmaOAMP,
  eventos: conteoEventos[consultor.nombre] || 0
}));


  // Filtrado
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    lista = lista.filter(c =>
      c.nombre.toLowerCase().includes(lower) ||
      c.especialidad.toLowerCase().includes(lower)
    );
  }

  // Ordenamiento
  if (sortByEvents === 'asc') {
    lista.sort((a, b) => a.eventos - b.eventos);
  } else if (sortByEvents === 'desc') {
    lista.sort((a, b) => b.eventos - a.eventos);
  }

  return lista;
}, [searchTerm, sortByEvents]);


  const handleEdit = (cedula) => navigate(`/gestora/consultores/editar/${cedula}`);
  const handleDelete = (cedula) => {
  const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este consultor?");
  if (!confirmacion) return;

  const consultores = getConsultores();
  const nuevosConsultores = consultores.filter(consultor => consultor.cedula !== cedula);
  saveConsultores(nuevosConsultores);

  // Forzar recálculo de consultoresConEventos
  // Lo hacemos cambiando el estado (puedes usar un contador o similar)
  setSearchTerm(prev => prev + ' '); // truco rápido para forzar re-render
};


  return (
    <DashboardLayout>
      <h1>Consultores</h1>

      <div className="consultores-list-section">
        <div className="section-header">
          <h3>Lista de Consultores</h3>
          <Link to="/gestora/consultores/nuevo" className="new-consultor-button">
            + Nuevo Consultor
          </Link>
        </div>

        <div className="filter-sort-controls">
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="filter-input"
          />
          <select
            value={sortByEvents}
            onChange={e => setSortByEvents(e.target.value)}
            className="sort-select"
          >
            <option value="none">Ordenar por Eventos</option>
            <option value="asc">Menos Eventos</option>
            <option value="desc">Más Eventos</option>
          </select>
        </div>

        <div className="list-header">
          <div className="header-cell name-col">NOMBRE</div>
          <div className="header-cell specialty-col">ESPECIALIDAD</div>
          <div className="header-cell contact-col">CONTACTO</div>
          <div className="header-cell events-col">EVENTOS</div>
          <div className="header-cell actions-col">ACCIONES</div>
        </div>

        <div className="consultores-list-container">
          {consultoresConEventos.length > 0 ? (
            consultoresConEventos.map(consultor => (
              <ConsultorItem
    key={consultor.cedula}
    consultor={consultor}
    onEdit={() => handleEdit(consultor.cedula)}
    onDelete={() => handleDelete(consultor.cedula)}
  />
            ))
          ) : (
            <div className="no-consultores-message">
              {searchTerm || sortByEvents !== 'none'
                ? 'No se encontraron consultores que coincidan con los criterios de búsqueda.'
                : 'No hay consultores con eventos asignados.'}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default GestoraConsultores;
