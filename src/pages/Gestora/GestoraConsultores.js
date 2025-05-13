// src/pages/Gestora/GestoraConsultores.js
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ConsultorItem from '../../components/ConsultorItem';
import './GestoraConsultores.css';

// =========================================================================
// Datos Mock para la lista de Consultores
// Mantenemos los datos mock aquí por simplicidad para la demostración del filtro.
// En una aplicación real, estos datos vendrían de una API y probablemente
// se manejarían en un estado o contexto superior.
// =========================================================================
const mockConsultores = [
    { id: 1, nombre: 'Andreína Ustate', especialidad: 'Finanzas corporativas', contacto: { email: 'austate@uniempresarial.edu.co', telefono: '3052512922' }, eventos: 12 },
    { id: 2, nombre: 'Julie Sáenz Castañeda', especialidad: 'Innovación y emprendimiento', contacto: { email: 'jsaenzc@uniempresarial.edu.co', telefono: '3118131235' }, eventos: 8 },
    { id: 3, nombre: 'Tatiana Prieto', especialidad: 'Marketing y ventas', contacto: { email: 'tprieto@uniempresarial.edu.co', telefono: '3012148031' }, eventos: 15 },
    { id: 4, nombre: 'Carlos Rojas', especialidad: 'Gestión de Proyectos', contacto: { email: 'crojas@uniempresarial.edu.co', telefono: '3201234567' }, eventos: 5 },
    { id: 5, nombre: 'Laura Gómez', especialidad: 'Recursos Humanos', contacto: { email: 'lgomez@example.com', telefono: '3109876543' }, eventos: 10 },
    { id: 6, nombre: 'Pedro Martínez', especialidad: 'Tecnología de la Información', contacto: { email: 'pmartinez@example.com', telefono: '3001112233' }, eventos: 7 },
];
// =========================================================================

function GestoraConsultores() {
    const navigate = useNavigate();

    // =========================================================================
    // Estados para manejar los filtros y la ordenación
    // =========================================================================
    const [searchTerm, setSearchTerm] = useState('');
    const [sortByEvents, setSortByEvents] = useState('none');
    // =========================================================================


    // =========================================================================
    // Lógica de Filtrado y Ordenación
    // =========================================================================
    const filteredAndSortedConsultores = useMemo(() => {
        let filteredList = mockConsultores;

        // 1. Aplicar Filtrado por Término de Búsqueda (Nombre o Especialidad)
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredList = filteredList.filter(consultor =>
                consultor.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
                consultor.especialidad.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        // 2. Aplicar Ordenación por Eventos
        if (sortByEvents !== 'none') {
            filteredList = [...filteredList].sort((a, b) => {
                if (sortByEvents === 'asc') {
                    return a.eventos - b.eventos; // Orden ascendente (menos eventos primero)
                } else {
                    return b.eventos - a.eventos; // Orden descendente (más eventos primero)
                }
            });
        }

        return filteredList;
    }, [searchTerm, sortByEvents]);
    // =========================================================================


    // =========================================================================
    // Funciones para manejar los cambios en los filtros y la ordenación
    // =========================================================================
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortByEvents(e.target.value);
    };
    // =========================================================================


    // =========================================================================
    // Funciones para manejar las acciones de la lista (Editar, Eliminar)
    // =========================================================================
    const handleEdit = (consultorId) => {
        console.log('Clic en Editar para consultor con ID:', consultorId);
        // Redirige a la página de edición de consultores, pasando el ID
        // Asegúrate de que tienes una ruta en App.js como /gestora/consultores/editar/:consultorId
        navigate(`/gestora/consultores/editar/${consultorId}`);
    };

    const handleDelete = (consultorId) => {
        console.log('Clic en Eliminar para consultor con ID:', consultorId);
        // Implementa aquí la lógica para eliminar el consultor (API call, actualizar estado, etc.)
        if (window.confirm(`¿Estás seguro de que quieres eliminar al consultor con ID ${consultorId}? Esta acción no se puede deshacer.`)) {
             alert(`Funcionalidad Eliminar consultor ${consultorId} no implementada.`);
             // En una aplicación real, después de la eliminación exitosa de la API:
             // 1. Actualizar el estado de la lista de consultores (si mockConsultores fuera un estado)
             // 2. Opcional: Mostrar un mensaje de éxito.
        }
    };
    // =========================================================================


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

                {/* Controles de Filtro y Ordenación */}
                <div className="filter-sort-controls">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o especialidad..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="filter-input"
                    />

                    <select
                        value={sortByEvents}
                        onChange={handleSortChange}
                        className="sort-select"
                    >
                        <option value="none">Ordenar por Eventos</option>
                        <option value="asc">Menos Eventos</option>
                        <option value="desc">Más Eventos</option>
                    </select>
                </div>

                {/* Encabezado de la lista (las etiquetas de columna) */}
                <div className="list-header">
                    <div className="header-cell name-col">NOMBRE</div>
                    <div className="header-cell specialty-col">ESPECIALIDAD</div>
                    <div className="header-cell contact-col">CONTACTO</div>
                    <div className="header-cell events-col">EVENTOS</div>
                    <div className="header-cell actions-col">ACCIONES</div>
                </div>

                {/* Contenedor para la lista de elementos de consultor */}
                <div className="consultores-list-container">
                    {/* Mapea sobre la lista FILTRADA Y ORDENADA */}
                    {filteredAndSortedConsultores.length > 0 ? (
                        filteredAndSortedConsultores.map(consultor => (
                            <ConsultorItem
                                key={consultor.id}
                                consultor={consultor}
                                onEdit={() => handleEdit(consultor.id)}
                                onDelete={() => handleDelete(consultor.id)}
                            />
                        ))
                    ) : (
                        <div className="no-consultores-message">
                            {searchTerm || sortByEvents !== 'none' ?
                             'No se encontraron consultores que coincidan con los criterios de búsqueda.' :
                             'No hay consultores para mostrar.'
                            }
                        </div>
                    )}
                </div>

            </div> {/* Cierra consultores-list-section */}

        </DashboardLayout>
    );
}

export default GestoraConsultores;
