namespace API_GESTIONSTOCKMDR.Models
{
    public class LoginRequest
    {
        public string Usuario { get; set; }
        public string Contrasena { get; set; }
    }

    public class RegistroRequest
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Usuario { get; set; }
        public string Contrasena { get; set; }
    }

    public class AuthResponse
    {
        public bool Exito { get; set; }
        public string Mensaje { get; set; }
        public string Usuario { get; set; }
        public string Nombre { get; set; }
        public string Rol { get; set; }
        public string RolEtiqueta { get; set; }
    }
}
