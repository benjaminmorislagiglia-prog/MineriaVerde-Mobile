using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_GESTIONSTOCKMDR.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public int Cantidad { get; set; }
        public int Id_Repuesto { get; set; }
        public int Id_Maquina { get; set; }
        public string Nombre { get; set; }
    }
}