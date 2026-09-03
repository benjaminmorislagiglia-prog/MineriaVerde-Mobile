using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Configuration;
using API_GESTIONSTOCKMDR.Models;

using System.Data;

namespace API_GESTIONSTOCKMDR.Data
{
    public class MaquinaData
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        public List<Maquina> ObtenerMaquinas()
        {
            List<Maquina> lista = new List<Maquina>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM Maquina WHERE Activo = 1", cn);
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Maquina
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Nombre = dr["Nombre"].ToString(),
                        Dominio = dr["Dominio"].ToString(),
                        Anio = Convert.ToInt32(dr["Anio"]),
                        Modelo = dr["Modelo"].ToString()
                    });
                }
            }
            return lista;
        }

        public List<Maquina> ObtenerMaquinasInactivas()
        {
            List<Maquina> lista = new List<Maquina>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM Maquina WHERE Activo = 0", cn);
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Maquina
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Nombre = dr["Nombre"].ToString(),
                        Dominio = dr["Dominio"].ToString(),
                        Anio = Convert.ToInt32(dr["Anio"]),
                        Modelo = dr["Modelo"].ToString()
                    });
                }
            }
            return lista;
        }

        public bool AgregarMaquina(Maquina maq)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Maquina (Nombre, Dominio, Anio, Modelo) VALUES (@Nombre, @Dominio, @Anio, @Modelo)", cn);
                cmd.Parameters.AddWithValue("@Nombre", maq.Nombre);
                cmd.Parameters.AddWithValue("@Dominio", maq.Dominio);
                cmd.Parameters.AddWithValue("@Anio", maq.Anio);
                cmd.Parameters.AddWithValue("@Modelo", maq.Modelo);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool ActualizarMaquina(Maquina maq)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(
                    "UPDATE Maquina SET Nombre=@Nombre, Dominio=@Dominio, Anio=@Anio, Modelo=@Modelo WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Nombre", maq.Nombre);
                cmd.Parameters.AddWithValue("@Dominio", maq.Dominio);
                cmd.Parameters.AddWithValue("@Anio", maq.Anio);
                cmd.Parameters.AddWithValue("@Modelo", maq.Modelo);
                cmd.Parameters.AddWithValue("@Id", maq.Id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool EliminarMaquina(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("UPDATE Maquina SET Activo = 0 WHERE Id=@Id AND Activo = 1", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool ReactivarMaquina(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("UPDATE Maquina SET Activo = 1 WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
