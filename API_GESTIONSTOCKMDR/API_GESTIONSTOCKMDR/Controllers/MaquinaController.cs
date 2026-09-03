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
    [RoutePrefix("api/maquinas")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MaquinaController : ApiController
    {
        private MaquinaData maquinaData = new MaquinaData();

        [HttpGet]
        [Route("")]
        public IEnumerable<Maquina> Get()
        {
            return maquinaData.ObtenerMaquinas();
        }

        [HttpGet]
        [Route("inactivos")]
        public IEnumerable<Maquina> GetInactivos()
        {
            return maquinaData.ObtenerMaquinasInactivas();
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Post([FromBody] Maquina maq)
        {
            if (maq == null) return BadRequest("Máquina inválida");

            bool exito = maquinaData.AgregarMaquina(maq);
            if (exito) return Ok("Máquina agregada correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Put(int id, [FromBody] Maquina maq)
        {
            if (maq == null) return BadRequest("Máquina inválida");

            maq.Id = id;
            bool exito = maquinaData.ActualizarMaquina(maq);
            if (exito) return Ok("Máquina actualizada correctamente");
            return InternalServerError();
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            bool exito = maquinaData.EliminarMaquina(id);
            if (exito) return Ok("Máquina desactivada correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}/reactivar")]
        public IHttpActionResult Reactivar(int id)
        {
            bool exito = maquinaData.ReactivarMaquina(id);
            if (exito) return Ok("Máquina reactivada correctamente");
            return InternalServerError();
        }
    }
}
