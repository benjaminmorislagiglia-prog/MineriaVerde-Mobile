using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_GESTIONSTOCKMDR.Models
{
    public class Movimiento
    {
        public int Id { get; set; }
        public string Tipo_de_Movimiento { get; set; }
        public DateTime Fecha { get; set; }
        public int Cantidad { get; set; }
        public string Prestamo { get; set; }
        public Decimal Ajuste { get; set; }
        public int IdRepuesto { get; set; }
        public int IdMaquina { get; set; }
        public int IdEmpleado { get; set; }
        public int IdStock { get; set; }

    }     
}