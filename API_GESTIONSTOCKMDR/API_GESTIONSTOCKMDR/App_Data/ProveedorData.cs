using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Configuration;
using API_GESTIONSTOCKMDR.Models;
using System.Data;


namespace API_GESTIONSTOCKMDR.Data
{
    public class ProveedorData
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        public List<Proveedor> ObtenerProveedores()
        {
            List<Proveedor> lista = new List<Proveedor>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM Proveedor WHERE Activo = 1", cn);
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Proveedor
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Razon_Social = dr["Razon_Social"].ToString(),
                        Cuit = dr["Cuit"].ToString(),
                        Condicion_Iva = dr["Condicion_Iva"].ToString(),
                        Email = dr["Email"].ToString(),
                        Telefono = dr["Telefono"].ToString()
                    });
                }
            }
            return lista;
        }

        public List<Proveedor> ObtenerProveedoresInactivos()
        {
            List<Proveedor> lista = new List<Proveedor>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM Proveedor WHERE Activo = 0", cn);
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Proveedor
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Razon_Social = dr["Razon_Social"].ToString(),
                        Cuit = dr["Cuit"].ToString(),
                        Condicion_Iva = dr["Condicion_Iva"].ToString(),
                        Email = dr["Email"].ToString(),
                        Telefono = dr["Telefono"].ToString()
                    });
                }
            }
            return lista;
        }

        public bool AgregarProveedor(Proveedor prov)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Proveedor (Razon_Social, Cuit, Condicion_Iva, Email, Telefono) " +
                    "VALUES (@Razon_Social, @Cuit, @Condicion_Iva, @Email, @Telefono)", cn);
                cmd.Parameters.AddWithValue("@Razon_Social", prov.Razon_Social);
                cmd.Parameters.AddWithValue("@Cuit", prov.Cuit);
                cmd.Parameters.AddWithValue("@Condicion_Iva", prov.Condicion_Iva);
                cmd.Parameters.AddWithValue("@Email", prov.Email);
                cmd.Parameters.AddWithValue("@Telefono", prov.Telefono);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool ActualizarProveedor(Proveedor prov)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand(
                    "UPDATE Proveedor SET Razon_Social=@Razon_Social, Cuit=@Cuit, Condicion_Iva=@Condicion_Iva, Email=@Email, Telefono=@Telefono WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Razon_Social", prov.Razon_Social);
                cmd.Parameters.AddWithValue("@Cuit", prov.Cuit);
                cmd.Parameters.AddWithValue("@Condicion_Iva", prov.Condicion_Iva);
                cmd.Parameters.AddWithValue("@Email", prov.Email);
                cmd.Parameters.AddWithValue("@Telefono", prov.Telefono);
                cmd.Parameters.AddWithValue("@Id", prov.Id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool EliminarProveedor(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("UPDATE Proveedor SET Activo = 0 WHERE Id=@Id AND Activo = 1", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool ReactivarProveedor(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("UPDATE Proveedor SET Activo = 1 WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
