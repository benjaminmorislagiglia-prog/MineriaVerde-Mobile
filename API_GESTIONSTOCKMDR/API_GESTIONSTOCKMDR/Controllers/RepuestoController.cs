using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API_GESTIONSTOCKMDR.Data;
using API_GESTIONSTOCKMDR.Models;
using System.Web.Http.Cors;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/repuestos")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RepuestoController : ApiController
    {
        private RepuestoData repuestoData = new RepuestoData();

        
        [HttpGet]
        [Route("")]
        public IEnumerable<Repuesto> Get()
        {
            return repuestoData.ObtenerRepuestos();
        }

        [HttpGet]
        [Route("inactivos")]
        public IEnumerable<Repuesto> GetInactivos()
        {
            return repuestoData.ObtenerRepuestosInactivos();
        }

        
        [HttpPost]
        [Route("")]
        public IHttpActionResult Post([FromBody] Repuesto repuesto)
        {
            if (repuesto == null) return BadRequest("Repuesto inválido");

            bool exito = repuestoData.AgregarRepuesto(repuesto);
            if (exito) return Ok("Repuesto agregado correctamente");
            return InternalServerError();
        }

        
        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Put(int id, [FromBody] Repuesto repuesto)
        {
            if (repuesto == null) return BadRequest("Repuesto inválido");

            repuesto.Id = id;
            bool exito = repuestoData.ActualizarRepuesto(repuesto);
            if (exito) return Ok("Repuesto actualizado correctamente");
            return InternalServerError();
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            bool exito = repuestoData.EliminarRepuesto(id);
            if (exito) return Ok("Repuesto desactivado correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}/reactivar")]
        public IHttpActionResult Reactivar(int id)
        {
            bool exito = repuestoData.ReactivarRepuesto(id);
            if (exito) return Ok("Repuesto reactivado correctamente");
            return InternalServerError();
        }
    }
}
