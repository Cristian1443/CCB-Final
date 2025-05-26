import React, {useState} from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './InformeCCB.css';

function InformeCCB() {
  const programas = [
    { nombre: 'Internacionalización'},
    { nombre: 'Crecimiento Empresarial'},
    { nombre: 'Emprendimiento' },
    {nombre: 'Consolidacion y Escalamiento Empresarial'}
  ];

  const [programaSeleccionado, setProgramaSeleccionado] = useState(programas[0]);
  return (
    <DashboardLayout>
       {/* Botones para elegir programa */}
        <div className="programa-botones">
          {programas.map((programa) => (
            <button
              key={programa.nombre}
              className={programaSeleccionado.nombre === programa.nombre ? 'boton-activo' : ''}
              onClick={() => setProgramaSeleccionado(programa)}
            >
              {programa.nombre}
            </button>
          ))}
        </div>
      <div className="informe-container">
        <h2>INFORME CONTRATO</h2>
        <p className="fecha">
  {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
</p>


        <p className="programa">PROGRAMA DE <span className="resaltado">{programaSeleccionado.nombre.toUpperCase()}</span></p>
        
        <p><strong>NIT:</strong> 830084876 - 6</p>
        <p>Prestó los servicios de asesoría individual y talleres en el programa de <span className="resaltado">{programaSeleccionado.nombre}</span>, como se relaciona a continuación:</p>

        <div className="info-ejecucion">
          <div className="info-box">
            <h4>INFORMACIÓN EJECUCIÓN CONTRATO</h4>
            <label>Valor total contrato: <input type="text" /></label>
            <label>Valor ejecutado en el mes: <input type="text" /></label>
            <label>Valor ejecutado acumulado: <input type="text" /></label>
            <label>Valor saldo del contrato: <input type="text" /></label>
            <label>Valor hora: <input type="text" /></label>
          </div>
          <div className="info-box">
            <h4>INFORMACIÓN EJECUCIÓN HORAS</h4>
            <label>No. total horas: <input type="text" /></label>
            <label>Horas ejecutadas en el mes: <input type="text" /></label>
            <label>Horas ejecutadas acumulado: <input type="text" /></label>
            <label>Horas saldo del contrato: <input type="text" /></label>
          </div>
        </div>

        <h4>SEGUIMIENTO POR MES (ejecución de horas)</h4>
        <div className="table-container">
          <table className="seguimiento-table">
            <thead>
              <tr>
                <th>Marzo</th><th>Abril</th><th>Mayo</th><th>Junio</th>
                <th>Julio</th><th>Agosto</th><th>Septiembre</th><th>Octubre</th><th>Noviembre</th><th>Diciembre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Marzo"><input type="text" /></td>
                <td data-label="Abril"><input type="text" /></td>
                <td data-label="Mayo"><input type="text" /></td>
                <td data-label="Junio"><input type="text" /></td>
                <td data-label="Julio"><input type="text" /></td>
                <td data-label="Agosto"><input type="text" /></td>
                <td data-label="Septiembre"><input type="text" /></td>
                <td data-label="Octubre"><input type="text" /></td>
                <td data-label="Noviembre"><input type="text" /></td>
                <td data-label="Diciembre"><input type="text" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Secciones adicionales como asesorías, talleres, firmas, etc. vendrán después */}
        {/* ASESORÍAS INDIVIDUALES */}
        <h4>ASESORÍAS INDIVIDUALES</h4>
        <p> Durante el mes, en total se prestaron <span className="resaltado">9 horas</span> de asesoría individual en el marco del desarrollo del programa de <span className="resaltado">{programaSeleccionado.nombre}</span> de la Cámara de Comercio de Bogotá, como se detalla a continuación:</p>
        <div className="table-container">
          <table className="detalle-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Codigo de agenda</th>
                <th>Hora de inicio</th>
                <th>Hora de finalización</th>
                <th>Empresa</th>
                <th>No. Identificación</th>
                <th>Total horas</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td data-label="Fecha"><input type="date" /></td>
                  <td data-label="Codigo de agenda"><input type="number" /></td>
                  <td data-label="Hora de inicio"><input type="time" /></td>
                  <td data-label="Hora de finalización"><input type="time" /></td>
                  <td data-label="Empresa"><input type="text" placeholder="Nombre del empresario" /></td>
                  <td data-label="No. Identificación"><input type="number" placeholder="Numero de identificación" /></td>
                  <td data-label="Total horas"><input type="number" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TALLERES */}
        <h4>TALLERES, ASESORÍAS GRUPALES O CÁPSULA</h4>
        <p>Durante el mes, en total se prestaron <span className="resaltado">28 horas</span> de <span className="resaltado">talleres</span> en el marco del desarrollo del programa de <span className="resaltado">{programaSeleccionado.nombre}</span> de la Cámara de Comercio de Bogotá, como se detalla a continuación:</p>
        <div className="table-container">
          <table className="detalle-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Codigo de agenda</th>
                <th>Hora de inicio</th>
                <th>Hora de finalización</th>
                <th>Nombre del servicio</th>
                <th>Sesión</th>
                <th>Total horas</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, index) => (
                <tr key={index}>
                  <td data-label="Fecha"><input type="date" /></td>
                  <td data-label="Codigo de agenda"><input type="number" /></td>
                  <td data-label="Hora de inicio"><input type="time" /></td>
                  <td data-label="Hora de finalización"><input type="time" /></td>
                  <td data-label="Nombre del servicio"><input type="text" placeholder="Tema del taller" /></td>
                  <td data-label="Sesión"><input type="number" /></td>
                  <td data-label="Total horas"><input type="number" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* DETALLE VISUAL DE ASESORÍAS INDIVIDUALES*/}
        <h4>DETALLE DE ASESORÍAS INDIVIDUALES</h4>
        <div className="detalle-visuales">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="detalle-card">
              <div className="detalle-col">
                <p><strong>No. asesoría:</strong> <input type="number" /></p>
                <p><strong>Fecha:</strong> <input type="date" /></p>
                <p><strong>Hora inicio:</strong> <input type="time" /></p>
                <p><strong>Hora fin:</strong> <input type="time" /></p>
              </div>
              <div className="detalle-col">
                <p><strong>Razón social:</strong> <input type="text" placeholder="Razón social de la empresa" /></p>
                <p><strong>Empresa:</strong> <input type="text" placeholder="Nombre de quien recibió asesoría" /></p>
                <p><strong>Identificación:</strong> <input type="number" placeholder="ID empresario" /></p>
                <p><strong>Tema de asesoria</strong> <input type="text" /></p>
                <p><strong>Link de ingreso</strong> <input type="url" /></p>
                <p><strong>Evidencia Fotográfica</strong> <input type="file" /></p>
                <p><strong>Evidencia cargue plataforma de Crecimiento Empresarial CCB</strong> <input type="file" /></p>
              </div>
            </div>
          ))}
        </div>

        {/* DETALLE DE TALLERES, ASESORÍAS GRUPALES O CÁPSULAS*/}
        <h4>DETALLE DE TALLERES, ASESORÍAS GRUPALES O CÁPSULAS:</h4>
        <div className="detalle-visuales">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="detalle-card">
              <div className="detalle-col">
                <p><strong>No. asesoría:</strong> <input type="number" /></p>
                <p><strong>Fecha:</strong> <input type="date" /></p>
                <p><strong>Hora inicio:</strong> <input type="time" /></p>
                <p><strong>Hora fin:</strong> <input type="time" /></p>
              </div>
              <div className="detalle-col">
                <p><strong>Nombre del servicio:</strong> <input type="text" /></p>
                <p><strong>Link de ingreso</strong> <input type="url" /></p>
                <p><strong>Evidencia Fotográfica</strong> <input type="file" /></p>
              </div>
            </div>
          ))}
        </div>


        {/* FIRMAS */}
        <h4>FIRMAS</h4>

        <div className="firma-section">
          <div>
            <p><strong>Firma del proveedor:</strong></p>
            <input type="file" style={{ width: '100%' }} />
            <p>Juan Alfredo Pinto Saavedra</p>
            <p>Rector</p>
            <p>Fundación Universitaria de la Cámara de Comercio de Bogotá – Uniempresarial</p>
            <p>NIT. 830084876 – 6</p>
            <p> <strong>Fecha de presentación del informe:</strong> <span className="resaltado">25</span> de <span className="resaltado">marzo</span> de 2025</p>  
          </div>
          <div>
            <p><strong>Recibido a conformidad CCB:</strong></p>
            <input type="file" style={{ width: '100%' }} />
            <p><span className="resaltado">Nombre líder de ruta</span></p>
            <p><strong>Fecha:</strong><span className="resaltado">25</span> de <span className="resaltado">marzo</span> de 2025</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default InformeCCB;
