using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;
using System.Web.Http;
using System.Web.Http.Cors;
using API_GESTIONSTOCKMDR.Data;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/provincias")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProvinciaController : ApiController
    {
        private static readonly Regex NombreValido =
            new Regex(@"^[\p{L}]+(?: [\p{L}]+)*$", RegexOptions.CultureInvariant);

        private readonly ProvinciaData provinciaData = new ProvinciaData();

        [HttpGet, Route("")]
        public IEnumerable<Provincia> Get()
        {
            return provinciaData.ObtenerProvincias();
        }

        [HttpGet, Route("{id:int}")]
        public IHttpActionResult Get(int id)
        {
            var provincia = provinciaData.ObtenerProvincia(id);
            return provincia == null ? (IHttpActionResult)NotFound() : Ok(provincia);
        }

        [HttpPost, Route("")]
        public IHttpActionResult Post([FromBody] Provincia provincia)
        {
            string error = ValidarNombre(provincia);
            if (error != null) return BadRequest(error);

            provincia.Id = provinciaData.AgregarProvincia(provincia);
            return Content(HttpStatusCode.Created, provincia);
        }

        [HttpPut, Route("{id:int}")]
        public IHttpActionResult Put(int id, [FromBody] Provincia provincia)
        {
            string error = ValidarNombre(provincia);
            if (error != null) return BadRequest(error);

            provincia.Id = id;
            return provinciaData.ActualizarProvincia(provincia)
                ? Ok(provincia)
                : (IHttpActionResult)NotFound();
        }

        [HttpDelete, Route("{id:int}")]
        public IHttpActionResult Delete(int id)
        {
            if (provinciaData.EstaEnUso(id))
                return Content(HttpStatusCode.Conflict, "La provincia tiene ciudades asociadas.");

            return provinciaData.EliminarProvincia(id)
                ? Ok()
                : (IHttpActionResult)NotFound();
        }

        private static string ValidarNombre(Provincia provincia)
        {
            if (provincia == null || string.IsNullOrWhiteSpace(provincia.Nombre))
                return "El nombre de la provincia es obligatorio.";

            string nombre = provincia.Nombre.Trim();
            if (nombre.Length < 2 || nombre.Length > 100)
                return "El nombre de la provincia debe tener entre 2 y 100 caracteres.";

            if (!NombreValido.IsMatch(nombre))
                return "La provincia solo puede contener letras, espacios y tildes.";

            provincia.Nombre = nombre;
            return null;
        }
    }
}
