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
    [RoutePrefix("api/stock")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class StockController : ApiController
    {
        private StockData stockData = new StockData();

        [HttpGet]
        [Route("")]
        public IEnumerable<Stock> Get()
        {
            return stockData.ObtenerStock();
        }

        [HttpGet]
        [Route("inactivos")]
        public IEnumerable<Stock> GetInactivos()
        {
            return stockData.ObtenerStockInactivo();
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult Post([FromBody] Stock stk)
        {
            if (stk == null) return BadRequest("Stock inválido");

            bool exito = stockData.AgregarStock(stk);
            if (exito) return Ok("Stock agregado correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult Put(int id, [FromBody] Stock stk)
        {
            if (stk == null) return BadRequest("Stock inválido");

            stk.Id = id;
            bool exito = stockData.ActualizarStock(stk);
            if (exito) return Ok("Stock actualizado correctamente");
            return InternalServerError();
        }

        [HttpDelete]
        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            bool exito = stockData.EliminarStock(id);
            if (exito) return Ok("Stock desactivado correctamente");
            return InternalServerError();
        }

        [HttpPut]
        [Route("{id}/reactivar")]
        public IHttpActionResult Reactivar(int id)
        {
            bool exito = stockData.ReactivarStock(id);
            if (exito) return Ok("Stock reactivado correctamente");
            return InternalServerError();
        }
    }
}
