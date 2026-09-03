using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Data
{
    public class MovimientosData
    {
        private string connectionString = ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        public List<Movimiento> ObtenerMovimientos()
        {
            List<Movimiento> lista = new List<Movimiento>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM Movimientos WHERE Activo = 1", cn);
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Movimiento
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Tipo_de_Movimiento = dr["Tipo_de_Movimiento"].ToString(),
                        Fecha = Convert.ToDateTime(dr["Fecha"]),
                        Cantidad = Convert.ToInt32(dr["Cantidad"]),
                        Prestamo = dr["Prestamo"].ToString(),
                        Ajuste = Convert.ToDecimal(dr["Ajuste"]),
                        IdRepuesto = Convert.ToInt32(dr["Id_Repuesto"]),
                        IdMaquina = Convert.ToInt32(dr["Id_Maquina"]),
                        IdEmpleado = Convert.ToInt32(dr["Id_Empleado"]),
                        IdStock = Convert.ToInt32(dr["Id_Stock"])
                    });
                }
            }
            return lista;
        }

        public List<Movimiento> ObtenerMovimientosInactivos()
        {
            List<Movimiento> lista = new List<Movimiento>();
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM Movimientos WHERE Activo = 0", cn);
                cn.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    lista.Add(new Movimiento
                    {
                        Id = Convert.ToInt32(dr["Id"]),
                        Tipo_de_Movimiento = dr["Tipo_de_Movimiento"].ToString(),
                        Fecha = Convert.ToDateTime(dr["Fecha"]),
                        Cantidad = Convert.ToInt32(dr["Cantidad"]),
                        Prestamo = dr["Prestamo"].ToString(),
                        Ajuste = Convert.ToDecimal(dr["Ajuste"]),
                        IdRepuesto = Convert.ToInt32(dr["Id_Repuesto"]),
                        IdMaquina = Convert.ToInt32(dr["Id_Maquina"]),
                        IdEmpleado = Convert.ToInt32(dr["Id_Empleado"]),
                        IdStock = Convert.ToInt32(dr["Id_Stock"])
                    });
                }
            }
            return lista;
        }

        public bool AgregarMovimiento(Movimiento mov)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Movimientos (Tipo_de_Movimiento, Fecha, Cantidad, Prestamo, Ajuste, Id_Repuesto, Id_Maquina, Id_Empleado, Id_Stock) " +
                    "VALUES (@TipoMovimiento, @Fecha, @Cantidad, @Prestamo, @Ajuste, @IdRepuesto, @IdMaquina, @IdEmpleado, @IdStock)", cn);

                cmd.Parameters.AddWithValue("@TipoMovimiento", mov.Tipo_de_Movimiento);
                cmd.Parameters.AddWithValue("@Fecha", mov.Fecha);
                cmd.Parameters.AddWithValue("@Cantidad", mov.Cantidad);
                cmd.Parameters.AddWithValue("@Prestamo", mov.Prestamo);
                cmd.Parameters.AddWithValue("@Ajuste", mov.Ajuste);
                cmd.Parameters.AddWithValue("@IdRepuesto", mov.IdRepuesto);
                cmd.Parameters.AddWithValue("@IdMaquina", mov.IdMaquina);
                cmd.Parameters.AddWithValue("@IdEmpleado", mov.IdEmpleado);
                cmd.Parameters.AddWithValue("@IdStock", mov.IdStock);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }

        public bool ActualizarMovimiento(Movimiento mov)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(
                    "UPDATE Movimientos SET Tipo_de_Movimiento=@TipoMovimiento, Fecha=@Fecha, Cantidad=@Cantidad, " +
                    "Prestamo=@Prestamo, Ajuste=@Ajuste, Id_Repuesto=@IdRepuesto, Id_Maquina=@IdMaquina, Id_Empleado=@IdEmpleado, Id_Stock=@IdStock " +
                    "WHERE Id=@Id", cn);

                cmd.Parameters.AddWithValue("@Id", mov.Id);
                cmd.Parameters.AddWithValue("@TipoMovimiento", mov.Tipo_de_Movimiento);
                cmd.Parameters.AddWithValue("@Fecha", mov.Fecha);
                cmd.Parameters.AddWithValue("@Cantidad", mov.Cantidad);
                cmd.Parameters.AddWithValue("@Prestamo", mov.Prestamo);
                cmd.Parameters.AddWithValue("@Ajuste", mov.Ajuste);
                cmd.Parameters.AddWithValue("@IdRepuesto", mov.IdRepuesto);
                cmd.Parameters.AddWithValue("@IdMaquina", mov.IdMaquina);
                cmd.Parameters.AddWithValue("@IdEmpleado", mov.IdEmpleado);
                cmd.Parameters.AddWithValue("@IdStock", mov.IdStock);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }

        public bool EliminarMovimiento(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("UPDATE Movimientos SET Activo = 0 WHERE Id=@Id AND Activo = 1", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }

        public bool ReactivarMovimiento(int id)
        {
            using (SqlConnection cn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("UPDATE Movimientos SET Activo = 1 WHERE Id=@Id", cn);
                cmd.Parameters.AddWithValue("@Id", id);

                cn.Open();
                int filas = cmd.ExecuteNonQuery();
                return filas > 0;
            }
        }
    }
}
