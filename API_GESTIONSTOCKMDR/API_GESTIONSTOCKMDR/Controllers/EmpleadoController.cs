using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Configuration;
using System.Web.Http;
using API_GESTIONSTOCKMDR.Data;
using API_GESTIONSTOCKMDR.Models;
using System.Web.Http.Cors;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/empleados")]
    [EnableCors(origins: "*", headers: "*", methods: "*")] 
    public class EmpleadoController : ApiController
    {
        private EmpleadoData empleadoData = new EmpleadoData();

      
        [HttpGet]
        [Route("")]
        public IEnumerable<Empleado> Get()
        {
            return empleadoData.ObtenerEmpleados();
        }

        [HttpGet]
        [Route("inactivos")]
        public IEnumerable<Empleado> GetInactivos()
        {
            return empleadoData.ObtenerEmpleadosInactivos();
        }

        
        [HttpPost]
        [Route("")]
        public IHttpActionResult Post([FromBody] Empleado emp)
        {
            if (!EsValido(emp)) return BadRequest("Completa los datos del empleado y su direccion.");

            bool exito = empleadoData.AgregarEmpleado(emp);
            if (exito) return Ok("Empleado agregado correctamente");
            return InternalServerError();
        }

       
        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Put(int id, [FromBody] Empleado emp)
        {
            if (!EsValido(emp)) return BadRequest("Completa los datos del empleado y su direccion.");

            emp.Id = id;
            bool exito = empleadoData.ActualizarEmpleado(emp);
            if (exito) return Ok("Empleado actualizado correctamente");
            return InternalServerError();
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            bool exito = empleadoData.DesactivarEmpleado(id);
            if (exito) return Ok("Empleado desactivado correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}/reactivar")]
        public IHttpActionResult Reactivar(int id)
        {
            bool exito = empleadoData.ReactivarEmpleado(id);
            if (exito) return Ok("Empleado reactivado correctamente");
            return InternalServerError();
        }

        private static bool EsValido(Empleado emp)
        {
            return emp != null
                && !string.IsNullOrWhiteSpace(emp.Nombre)
                && !string.IsNullOrWhiteSpace(emp.Apellido)
                && emp.Legajo > 0
                && !string.IsNullOrWhiteSpace(emp.Calle)
                && emp.Numero.HasValue
                && emp.Numero.Value >= 0
                && emp.Id_Ciudad.HasValue
                && emp.Id_Ciudad.Value > 0;
        }
    }

}
