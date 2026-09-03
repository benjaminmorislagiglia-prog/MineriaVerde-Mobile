using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;
using API_GESTIONSTOCKMDR.Data;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/direcciones")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DireccionController : ApiController
    {
        private readonly DireccionData direccionData = new DireccionData();

        [HttpGet, Route("")]
        public IEnumerable<Direccion> Get()
        {
            return direccionData.ObtenerDirecciones();
        }

        [HttpGet, Route("{id:int}")]
        public IHttpActionResult Get(int id)
        {
            var direccion = direccionData.ObtenerDireccion(id);
            return direccion == null ? (IHttpActionResult)NotFound() : Ok(direccion);
        }

        [HttpPost, Route("")]
        public IHttpActionResult Post([FromBody] Direccion direccion)
        {
            if (!EsValida(direccion)) return BadRequest("Calle, numero y ciudad son obligatorios.");
            direccion.Id = direccionData.AgregarDireccion(direccion);
            return Content(HttpStatusCode.Created, direccionData.ObtenerDireccion(direccion.Id));
        }

        [HttpPut, Route("{id:int}")]
        public IHttpActionResult Put(int id, [FromBody] Direccion direccion)
        {
            if (!EsValida(direccion)) return BadRequest("Calle, numero y ciudad son obligatorios.");
            direccion.Id = id;
            return direccionData.ActualizarDireccion(direccion)
                ? Ok(direccionData.ObtenerDireccion(id))
                : (IHttpActionResult)NotFound();
        }

        [HttpDelete, Route("{id:int}")]
        public IHttpActionResult Delete(int id)
        {
            if (direccionData.EstaEnUso(id))
                return Content(HttpStatusCode.Conflict, "La direccion esta asociada a un empleado.");

            return direccionData.EliminarDireccion(id)
                ? Ok()
                : (IHttpActionResult)NotFound();
        }

        private static bool EsValida(Direccion direccion)
        {
            return direccion != null
                && !string.IsNullOrWhiteSpace(direccion.Calle)
                && direccion.Numero >= 0
                && direccion.Id_Ciudad > 0;
        }
    }
}

