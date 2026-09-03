using System.Collections.Generic;
using System.Net;
using System.Text.RegularExpressions;
using System.Web.Http;
using System.Web.Http.Cors;
using API_GESTIONSTOCKMDR.Data;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/ciudades")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CiudadController : ApiController
    {
        private static readonly Regex NombreValido =
            new Regex(@"^[\p{L}]+(?: [\p{L}]+)*$", RegexOptions.CultureInvariant);

        private readonly CiudadData ciudadData = new CiudadData();

        [HttpGet, Route("")]
        public IEnumerable<Ciudad> Get()
        {
            return ciudadData.ObtenerCiudades();
        }

        [HttpGet, Route("{id:int}")]
        public IHttpActionResult Get(int id)
        {
            var ciudad = ciudadData.ObtenerCiudad(id);
            return ciudad == null ? (IHttpActionResult)NotFound() : Ok(ciudad);
        }

        [HttpGet, Route("provincia/{idProvincia:int}")]
        public IEnumerable<Ciudad> GetPorProvincia(int idProvincia)
        {
            return ciudadData.ObtenerCiudades(idProvincia);
        }

        [HttpPost, Route("")]
        public IHttpActionResult Post([FromBody] Ciudad ciudad)
        {
            string error = Validar(ciudad);
            if (error != null) return BadRequest(error);

            ciudad.Id = ciudadData.AgregarCiudad(ciudad);
            return Content(HttpStatusCode.Created, ciudadData.ObtenerCiudad(ciudad.Id));
        }

        [HttpPut, Route("{id:int}")]
        public IHttpActionResult Put(int id, [FromBody] Ciudad ciudad)
        {
            string error = Validar(ciudad);
            if (error != null) return BadRequest(error);

            ciudad.Id = id;
            return ciudadData.ActualizarCiudad(ciudad)
                ? Ok(ciudadData.ObtenerCiudad(id))
                : (IHttpActionResult)NotFound();
        }

        [HttpDelete, Route("{id:int}")]
        public IHttpActionResult Delete(int id)
        {
            if (ciudadData.EstaEnUso(id))
                return Content(HttpStatusCode.Conflict, "La ciudad tiene direcciones asociadas.");

            return ciudadData.EliminarCiudad(id)
                ? Ok()
                : (IHttpActionResult)NotFound();
        }

        private static string Validar(Ciudad ciudad)
        {
            if (ciudad == null || string.IsNullOrWhiteSpace(ciudad.Nombre))
                return "El nombre de la ciudad es obligatorio.";

            string nombre = ciudad.Nombre.Trim();
            if (nombre.Length < 2 || nombre.Length > 100)
                return "El nombre de la ciudad debe tener entre 2 y 100 caracteres.";

            if (!NombreValido.IsMatch(nombre))
                return "La ciudad solo puede contener letras, espacios y tildes.";

            if (ciudad.Id_Provincia <= 0)
                return "Debe seleccionar una provincia valida.";

            ciudad.Nombre = nombre;
            return null;
        }
    }
}
