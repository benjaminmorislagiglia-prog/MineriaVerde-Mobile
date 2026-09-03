using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Data
{
    public class ProvinciaData
    {
        private readonly string connectionString =
            ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        public List<Provincia> ObtenerProvincias()
        {
            var lista = new List<Provincia>();
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand("SELECT Id, Nombre FROM Provincia ORDER BY Nombre", cn))
            {
                cn.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        lista.Add(new Provincia
                        {
                            Id = Convert.ToInt32(dr["Id"]),
                            Nombre = dr["Nombre"].ToString()
                        });
                    }
                }
            }
            return lista;
        }

        public Provincia ObtenerProvincia(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand("SELECT Id, Nombre FROM Provincia WHERE Id = @Id", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    if (!dr.Read()) return null;
                    return new Provincia
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Nombre = dr["Nombre"].ToString()
                    };
                }
            }
        }

        public int AgregarProvincia(Provincia provincia)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(
                "INSERT INTO Provincia (Nombre) VALUES (@Nombre); SELECT CONVERT(INT, SCOPE_IDENTITY());", cn))
            {
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = provincia.Nombre.Trim();
                cn.Open();
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public bool ActualizarProvincia(Provincia provincia)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(
                "UPDATE Provincia SET Nombre = @Nombre WHERE Id = @Id", cn))
            {
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = provincia.Nombre.Trim();
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = provincia.Id;
                cn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool EstaEnUso(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(
                "SELECT CASE WHEN EXISTS (SELECT 1 FROM Ciudad WHERE Id_Provincia = @Id) THEN 1 ELSE 0 END", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                return Convert.ToBoolean(cmd.ExecuteScalar());
            }
        }

        public bool EliminarProvincia(int id)
        {
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand("DELETE FROM Provincia WHERE Id = @Id", cn))
            {
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}

