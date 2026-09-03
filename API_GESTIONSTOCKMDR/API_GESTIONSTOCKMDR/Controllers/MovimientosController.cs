using System.Collections.Generic;
using System.Web.Http;
using API_GESTIONSTOCKMDR.Data;
using API_GESTIONSTOCKMDR.Models;
using System.Web.Http.Cors;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/movimientos")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MovimientosController : ApiController
    {
        private MovimientosData movimientosData = new MovimientosData();

        [HttpGet]
        [Route("")]
        public IEnumerable<Movimiento> Get()
        {
            return movimientosData.ObtenerMovimientos();
        }

        [HttpGet]
        [Route("inactivos")]
        public IEnumerable<Movimiento> GetInactivos()
        {
            return movimientosData.ObtenerMovimientosInactivos();
        }

       
        [HttpPost]
        [Route("")]
        public IHttpActionResult Post([FromBody] Movimiento mov)
        {
            if (mov == null) return BadRequest("Movimiento inválido");

            bool exito = movimientosData.AgregarMovimiento(mov);
            if (exito) return Ok("Movimiento agregado correctamente");
            return InternalServerError();
        }

     
        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Put(int id, [FromBody] Movimiento mov)
        {
            if (mov == null) return BadRequest("Movimiento inválido");

            mov.Id = id;
            bool exito = movimientosData.ActualizarMovimiento(mov);
            if (exito) return Ok("Movimiento actualizado correctamente");
            return InternalServerError();
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            bool exito = movimientosData.EliminarMovimiento(id);
            if (exito) return Ok("Movimiento desactivado correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}/reactivar")]
        public IHttpActionResult Reactivar(int id)
        {
            bool exito = movimientosData.ReactivarMovimiento(id);
            if (exito) return Ok("Movimiento reactivado correctamente");
            return InternalServerError();
        }
    }
}
