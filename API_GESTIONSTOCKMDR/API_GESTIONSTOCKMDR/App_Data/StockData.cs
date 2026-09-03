using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Configuration;
using API_GESTIONSTOCKMDR.Models;
using System.Data;


namespace API_GESTIONSTOCKMDR.Data
{
    public class StockData
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        public List<Stock> ObtenerStock()
        {
            List<Stock> lista = new List<Stock>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM Stock WHERE Activo = 1", cn);
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Stock
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Cantidad = Convert.ToInt32(dr["Cantidad"]),
                        Nombre =  dr ["Nombre"].ToString(),
                        Id_Repuesto = Convert.ToInt32(dr["Id_Repuesto"]),
                        Id_Maquina = Convert.ToInt32(dr["Id_Maquina"])
                    });
                }
            }
            return lista;
        }

        public List<Stock> ObtenerStockInactivo()
        {
            List<Stock> lista = new List<Stock>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM Stock WHERE Activo = 0", cn);
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Stock
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Cantidad = Convert.ToInt32(dr["Cantidad"]),
                        Nombre = dr["Nombre"].ToString(),
                        Id_Repuesto = Convert.ToInt32(dr["Id_Repuesto"]),
                        Id_Maquina = Convert.ToInt32(dr["Id_Maquina"])
                    });
                }
            }
            return lista;
        }

        public bool AgregarStock(Stock st)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Stock (Cantidad,Nombre, Id_Repuesto, Id_Maquina) VALUES (@Cantidad,@Nombre, @Id_Repuesto, @Id_Maquina)", cn);
                cmd.Parameters.AddWithValue("@Cantidad", st.Cantidad);
                cmd.Parameters.AddWithValue("@Nombre", st.Nombre);
                cmd.Parameters.AddWithValue("@Id_Repuesto", st.Id_Repuesto);
                cmd.Parameters.AddWithValue("@Id_Maquina", st.Id_Maquina);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool ActualizarStock(Stock st)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(
                    "UPDATE Stock SET Cantidad=@Cantidad,Nombre=@Nombre, Id_Repuesto=@Id_Repuesto, Id_Maquina=@Id_Maquina WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Cantidad", st.Cantidad);
                cmd.Parameters.AddWithValue("@Nombre", st.Nombre);
                cmd.Parameters.AddWithValue("@Id_Repuesto", st.Id_Repuesto);
                cmd.Parameters.AddWithValue("@Id_Maquina", st.Id_Maquina);
                cmd.Parameters.AddWithValue("@Id", st.Id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool EliminarStock(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("UPDATE Stock SET Activo = 0 WHERE Id=@Id AND Activo = 1", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool ReactivarStock(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("UPDATE Stock SET Activo = 1 WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
