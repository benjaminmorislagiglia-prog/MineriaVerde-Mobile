using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Data
{
    public class CiudadData
    {
        private readonly string connectionString =
            ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        public List<Ciudad> ObtenerCiudades(int? idProvincia = null)
        {
            var lista = new List<Ciudad>();
            const string sql = @"
                SELECT c.Id, c.Nombre, c.Id_Provincia, p.Nombre AS Provincia
                FROM Ciudad c
                INNER JOIN Provincia p ON p.Id = c.Id_Provincia
                WHERE @IdProvincia IS NULL OR c.Id_Provincia = @IdProvincia
                ORDER BY p.Nombre, c.Nombre";

            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(sql, cn))
            {
                cmd.Parameters.Add("@IdProvincia", SqlDbType.Int).Value =
                    idProvincia.HasValue ? (object)idProvincia.Value : DBNull.Value;
                cn.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read()) lista.Add(Mapear(dr));
                }
            }
            return lista;
        }

        public Ciudad ObtenerCiudad(int id)
        {
            const string sql = @"
                SELECT c.Id, c.Nombre, c.Id_Provincia, p.Nombre AS Provincia
                FROM Ciudad c
                INNER JOIN Provincia p ON p.Id = c.Id_Provincia
                WHERE c.Id = @Id";

            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(sql, cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    return dr.Read() ? Mapear(dr) : null;
                }
            }
        }

        public int AgregarCiudad(Ciudad ciudad)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(@"
                INSERT INTO Ciudad (Nombre, Id_Provincia)
                VALUES (@Nombre, @IdProvincia);
                SELECT CONVERT(INT, SCOPE_IDENTITY());", cn))
            {
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = ciudad.Nombre.Trim();
                cmd.Parameters.Add("@IdProvincia", SqlDbType.Int).Value = ciudad.Id_Provincia;
                cn.Open();
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public bool ActualizarCiudad(Ciudad ciudad)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(@"
                UPDATE Ciudad
                SET Nombre = @Nombre, Id_Provincia = @IdProvincia
                WHERE Id = @Id", cn))
            {
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = ciudad.Nombre.Trim();
                cmd.Parameters.Add("@IdProvincia", SqlDbType.Int).Value = ciudad.Id_Provincia;
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = ciudad.Id;
                cn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool EstaEnUso(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(
                "SELECT CASE WHEN EXISTS (SELECT 1 FROM Direccion WHERE Id_Ciudad = @Id) THEN 1 ELSE 0 END", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

        public bool EliminarCiudad(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand("DELETE FROM Ciudad WHERE Id = @Id", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        private static Ciudad Mapear(IDataRecord dr)
        {
            return new Ciudad
            {
                Id = Convert.ToInt32(dr["Id"]),
                Nombre = dr["Nombre"].ToString(),
                Id_Provincia = Convert.ToInt32(dr["Id_Provincia"]),
                Provincia = dr["Provincia"].ToString()
            };
        }
    }
}

