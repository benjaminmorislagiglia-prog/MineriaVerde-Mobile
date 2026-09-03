using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_GESTIONSTOCKMDR.Models
{
    public class Proveedor
    {
        public int Id { get; set; }
        public string Razon_Social { get; set; }
        public string Cuit { get; set; }
        public string Condicion_Iva { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
    }

}