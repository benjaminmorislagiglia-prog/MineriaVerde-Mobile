using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Data
{
    public class DireccionData
    {
        private readonly string connectionString =
            ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        private const string SelectSql = @"
            SELECT d.Id, d.Calle, d.Numero, d.Id_Ciudad,
                   c.Nombre AS Ciudad, c.Id_Provincia, p.Nombre AS Provincia
            FROM Direccion d
            INNER JOIN Ciudad c ON c.Id = d.Id_Ciudad
            INNER JOIN Provincia p ON p.Id = c.Id_Provincia";

        public List<Direccion> ObtenerDirecciones()
        {
            var lista = new List<Direccion>();
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(SelectSql + " ORDER BY p.Nombre, c.Nombre, d.Calle, d.Numero", cn))
            {
                cn.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read()) lista.Add(Mapear(dr));
                }
            }
            return lista;
        }

        public Direccion ObtenerDireccion(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(SelectSql + " WHERE d.Id = @Id", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    return dr.Read() ? Mapear(dr) : null;
                }
            }
        }

        public int AgregarDireccion(Direccion direccion)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(@"
                INSERT INTO Direccion (Calle, Numero, Id_Ciudad)
                VALUES (@Calle, @Numero, @IdCiudad);
                SELECT CONVERT(INT, SCOPE_IDENTITY());", cn))
            {
                AgregarParametros(cmd, direccion);
                cn.Open();
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public bool ActualizarDireccion(Direccion direccion)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(@"
                UPDATE Direccion
                SET Calle = @Calle, Numero = @Numero, Id_Ciudad = @IdCiudad
                WHERE Id = @Id", cn))
            {
                AgregarParametros(cmd, direccion);
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = direccion.Id;
                cn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool EstaEnUso(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(
                "SELECT CASE WHEN EXISTS (SELECT 1 FROM Empleado WHERE Id_Direccion = @Id) THEN 1 ELSE 0 END", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

        public bool EliminarDireccion(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand("DELETE FROM Direccion WHERE Id = @Id", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        private static void AgregarParametros(SqlCommand cmd, Direccion direccion)
        {
            cmd.Parameters.Add("@Calle", SqlDbType.NVarChar, 100).Value = direccion.Calle.Trim();
            cmd.Parameters.Add("@Numero", SqlDbType.Int).Value = direccion.Numero;
            cmd.Parameters.Add("@IdCiudad", SqlDbType.Int).Value = direccion.Id_Ciudad;
        }

        private static Direccion Mapear(IDataRecord dr)
        {
            return new Direccion
            {
                Id = Convert.ToInt32(dr["Id"]),
                Calle = dr["Calle"].ToString(),
                Numero = Convert.ToInt32(dr["Numero"]),
                Id_Ciudad = Convert.ToInt32(dr["Id_Ciudad"]),
                Ciudad = dr["Ciudad"].ToString(),
                Id_Provincia = Convert.ToInt32(dr["Id_Provincia"]),
                Provincia = dr["Provincia"].ToString()
            };
        }
    }
}

