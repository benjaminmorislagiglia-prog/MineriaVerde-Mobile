using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API_GESTIONSTOCKMDR.Models
{
    public class Repuesto
    {
        public int Id { get; set; }          
        public string Nombre { get; set; }   
        public decimal Precio { get; set; }    
        public int Cantidad { get; set; }    
        public string OEM { get; set; }
        public int Id_Proveedor { get; set; }
        public string Unidad_de_Medida { get; set; } 
    }
}