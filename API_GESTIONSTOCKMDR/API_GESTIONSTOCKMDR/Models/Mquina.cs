using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_GESTIONSTOCKMDR.Models
{
    public class Maquina
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Dominio { get; set; }
        public int Anio { get; set; }
        public string Modelo { get; set; }
    }

}