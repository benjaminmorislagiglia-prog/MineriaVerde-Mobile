namespace API_GESTIONSTOCKMDR.Models
{
    public class Direccion
    {
        public int Id { get; set; }
        public string Calle { get; set; }
        public int Numero { get; set; }
        public int Id_Ciudad { get; set; }
        public string Ciudad { get; set; }
        public int Id_Provincia { get; set; }
        public string Provincia { get; set; }
    }
}

