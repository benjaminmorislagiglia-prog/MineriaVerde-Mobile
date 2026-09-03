using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using API_GESTIONSTOCKMDR.Data;


using API_GESTIONSTOCKMDR.Models;
using System.Web.Http.Cors;

namespace API_GESTIONSTOCKMDR.Controllers
{
    [RoutePrefix("api/proveedores")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProveedorController : ApiController
    {
        private ProveedorData proveedorData = new ProveedorData();

        [HttpGet]
        [Route("")]
        public IEnumerable<Proveedor> Get()
        {
            return proveedorData.ObtenerProveedores();
        }

        [HttpGet]
        [Route("inactivos")]
        public IEnumerable<Proveedor> GetInactivos()
        {
            return proveedorData.ObtenerProveedoresInactivos();
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Post([FromBody] Proveedor prov)
        {
            if (prov == null) return BadRequest("Proveedor inválido");

            bool exito = proveedorData.AgregarProveedor(prov);
            if (exito) return Ok("Proveedor agregado correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Put(int id, [FromBody] Proveedor prov)
        {
            if (prov == null) return BadRequest("Proveedor inválido");

            prov.Id = id;
            bool exito = proveedorData.ActualizarProveedor(prov);
            if (exito) return Ok("Proveedor actualizado correctamente");
            return InternalServerError();
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            bool exito = proveedorData.EliminarProveedor(id);
            if (exito) return Ok("Proveedor desactivado correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}/reactivar")]
        public IHttpActionResult Reactivar(int id)
        {
            bool exito = proveedorData.ReactivarProveedor(id);
            if (exito) return Ok("Proveedor reactivado correctamente");
            return InternalServerError();
        }
    }
}
