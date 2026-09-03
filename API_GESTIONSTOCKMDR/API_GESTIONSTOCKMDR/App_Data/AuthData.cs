using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Data
{
    public class AuthData
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        public AuthResponse Login(LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Contrasena))
            {
                return Error("Ingrese usuario y contrasena.");
            }

            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(
                    "SELECT NombreUsuario, Nombre, PasswordHash, PasswordSalt, Rol FROM Usuario WHERE NombreUsuario=@Usuario AND Activo=1",
                    cn);
                cmd.Parameters.AddWithValue("@Usuario", request.Usuario.Trim());

                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                if (!dr.Read())
                {
                    return Error("Usuario o contrasena incorrectos.");
                }

                string hashGuardado = dr["PasswordHash"].ToString();
                string salt = dr["PasswordSalt"].ToString();
                string hashIngresado = HashPassword(request.Contrasena, salt);

                if (!string.Equals(hashGuardado, hashIngresado, StringComparison.OrdinalIgnoreCase))
                {
                    return Error("Usuario o contrasena incorrectos.");
                }

                string usuario = dr["NombreUsuario"].ToString();
                string nombre = dr["Nombre"] == DBNull.Value ? usuario : dr["Nombre"].ToString();
                string rol = dr["Rol"].ToString();

                return new AuthResponse
                {
                    Exito = true,
                    Mensaje = "Login correcto.",
                    Usuario = usuario,
                    Nombre = string.IsNullOrWhiteSpace(nombre) ? usuario : nombre,
                    Rol = rol,
                    RolEtiqueta = ObtenerEtiquetaRol(rol)
                };
            }
        }

        public AuthResponse Registrar(RegistroRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Contrasena))
            {
                return Error("Ingrese usuario y contrasena.");
            }

            if (string.IsNullOrWhiteSpace(request.Nombre) || string.IsNullOrWhiteSpace(request.Email))
            {
                return Error("Ingrese nombre y email.");
            }

            string usuario = request.Usuario.Trim();
            string nombre = request.Nombre.Trim();
            string email = request.Email.Trim();
            string rol = "viewer";

            foreach (char caracter in nombre)
            {
                if (char.IsDigit(caracter))
                {
                    return Error("El nombre completo no debe contener numeros.");
                }
            }

            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();

                SqlCommand existeCmd = new SqlCommand(
                    "SELECT COUNT(*) FROM Usuario WHERE NombreUsuario=@Usuario OR Email=@Email",
                    cn);
                existeCmd.Parameters.AddWithValue("@Usuario", usuario);
                existeCmd.Parameters.AddWithValue("@Email", email);

                int existe = Convert.ToInt32(existeCmd.ExecuteScalar());
                if (existe > 0)
                {
                    return Error("Ese usuario o email ya existe.");
                }

                string salt = Guid.NewGuid().ToString("N");
                string hash = HashPassword(request.Contrasena, salt);

                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Usuario (NombreUsuario, Nombre, Email, PasswordHash, PasswordSalt, Rol, Activo) VALUES (@Usuario, @Nombre, @Email, @Hash, @Salt, @Rol, 1)",
                    cn);
                cmd.Parameters.AddWithValue("@Usuario", usuario);
                cmd.Parameters.AddWithValue("@Nombre", nombre);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Hash", hash);
                cmd.Parameters.AddWithValue("@Salt", salt);
                cmd.Parameters.AddWithValue("@Rol", rol);

                int filas = cmd.ExecuteNonQuery();
                if (filas <= 0)
                {
                    return Error("No se pudo registrar el usuario.");
                }

                return new AuthResponse
                {
                    Exito = true,
                    Mensaje = "Usuario registrado correctamente.",
                    Usuario = usuario,
                    Nombre = nombre,
                    Rol = rol,
                    RolEtiqueta = ObtenerEtiquetaRol(rol)
                };
            }
        }

        private static AuthResponse Error(string mensaje)
        {
            return new AuthResponse
            {
                Exito = false,
                Mensaje = mensaje
            };
        }

        private static string ObtenerEtiquetaRol(string rol)
        {
            return rol == "admin" ? "Administrador" : "Solo lectura";
        }

        private static string HashPassword(string password, string salt)
        {
            using (SHA256 sha = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(salt + password);
                byte[] hash = sha.ComputeHash(bytes);
                StringBuilder builder = new StringBuilder();

                foreach (byte item in hash)
                {
                    builder.Append(item.ToString("x2"));
                }

                return builder.ToString();
            }
        }
    }
}
