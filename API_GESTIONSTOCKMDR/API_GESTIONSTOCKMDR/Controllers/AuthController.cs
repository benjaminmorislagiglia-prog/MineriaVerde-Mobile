using System.Web.Http;
using System.Web.Http.Cors;
using API_GESTIONSTOCKMDR.Data;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/auth")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AuthController : ApiController
    {
        private AuthData authData = new AuthData();

        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login([FromBody] LoginRequest request)
        {
            AuthResponse response = authData.Login(request);
            if (response.Exito) return Ok(response);
            return BadRequest(response.Mensaje);
        }

        [HttpPost]
        [Route("register")]
        public IHttpActionResult Register([FromBody] RegistroRequest request)
        {
            AuthResponse response = authData.Registrar(request);
            if (response.Exito) return Ok(response);
            return BadRequest(response.Mensaje);
        }
    }
}
