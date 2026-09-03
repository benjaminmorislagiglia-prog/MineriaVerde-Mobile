namespace API_GESTIONSTOCKMDR.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public int Legajo { get; set; }
        public string Puesto { get; set; }
        public int? Id_Direccion { get; set; }
        public string Calle { get; set; }
        public int? Numero { get; set; }
        public int? Id_Ciudad { get; set; }
        public string Ciudad { get; set; }
        public int? Id_Provincia { get; set; }
        public string Provincia { get; set; }
    }
}

