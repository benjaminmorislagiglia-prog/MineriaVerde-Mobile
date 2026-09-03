using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Data
{
    public class RepuestoData
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

      
        public List<Repuesto> ObtenerRepuestos()
        {
            List<Repuesto> lista = new List<Repuesto>();

            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM Repuesto WHERE Activo = 1", cn);
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    lista.Add(new Repuesto
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Nombre = dr["Nombre"].ToString(),
                        Precio = Convert.ToDecimal(dr["Precio"]),
                        Unidad_de_Medida = dr["Unidad_de_Medida"].ToString(),
                        Cantidad = Convert.ToInt32(dr["Cantidad"]),
                        OEM = dr["OEM"].ToString(),
                        Id_Proveedor = Convert.ToInt32(dr["Id_Proveedor"])
                    });
                }
            }

            return lista;
        }

        public List<Repuesto> ObtenerRepuestosInactivos()
        {
            List<Repuesto> lista = new List<Repuesto>();

            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM Repuesto WHERE Activo = 0", cn);
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    lista.Add(new Repuesto
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Nombre = dr["Nombre"].ToString(),
                        Precio = Convert.ToDecimal(dr["Precio"]),
                        Unidad_de_Medida = dr["Unidad_de_Medida"].ToString(),
                        Cantidad = Convert.ToInt32(dr["Cantidad"]),
                        OEM = dr["OEM"].ToString(),
                        Id_Proveedor = Convert.ToInt32(dr["Id_Proveedor"])
                    });
                }
            }

            return lista;
        }

      
        public bool AgregarRepuesto(Repuesto repuesto)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Repuesto (Nombre, Precio, Unidad_de_Medida, Cantidad, OEM, Id_Proveedor) " +
                    "VALUES (@Nombre, @Precio, @Unidad_de_Medida, @Cantidad, @OEM, @Id_Proveedor)", cn);

                cmd.Parameters.AddWithValue("@Nombre", repuesto.Nombre);
                cmd.Parameters.AddWithValue("@Precio", repuesto.Precio);
                cmd.Parameters.AddWithValue("@Unidad_de_Medida", repuesto.Unidad_de_Medida);
                cmd.Parameters.AddWithValue("@Cantidad", repuesto.Cantidad);
                cmd.Parameters.AddWithValue("@OEM", repuesto.OEM);
                cmd.Parameters.AddWithValue("@Id_Proveedor", repuesto.Id_Proveedor);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }

        
        public bool ActualizarRepuesto(Repuesto repuesto)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(
                    "UPDATE Repuesto SET Nombre=@Nombre, Precio=@Precio, Unidad_de_Medida=@Unidad_de_Medida, " +
                    "Cantidad=@Cantidad, OEM=@OEM, Id_Proveedor=@Id_Proveedor WHERE Id=@Id", cn);

                cmd.Parameters.AddWithValue("@Id", repuesto.Id);
                cmd.Parameters.AddWithValue("@Nombre", repuesto.Nombre);
                cmd.Parameters.AddWithValue("@Precio", repuesto.Precio);
                cmd.Parameters.AddWithValue("@Unidad_de_Medida", repuesto.Unidad_de_Medida);
                cmd.Parameters.AddWithValue("@Cantidad", repuesto.Cantidad);
                cmd.Parameters.AddWithValue("@OEM", repuesto.OEM);
                cmd.Parameters.AddWithValue("@Id_Proveedor", repuesto.Id_Proveedor);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }

        public bool EliminarRepuesto(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("UPDATE Repuesto SET Activo = 0 WHERE Id=@Id AND Activo = 1", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }

        public bool ReactivarRepuesto(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("UPDATE Repuesto SET Activo = 1 WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }
    }
}
