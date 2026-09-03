using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using API_GESTIONSTOCKMDR.Models;

namespace API_GESTIONSTOCKMDR.Data
{
    public class EmpleadoData
    {
        private readonly string connectionString =
            ConfigurationManager.ConnectionStrings["CnConnectionString"].ConnectionString;

        private const string SelectSql = @"
            SELECT e.Id, e.Nombre, e.Apellido, e.Legajo, e.Puesto, e.Id_Direccion,
                   COALESCE(d.Calle, e.Calle) AS Calle,
                   COALESCE(d.Numero, e.Numero) AS Numero,
                   d.Id_Ciudad, c.Nombre AS Ciudad,
                   c.Id_Provincia, p.Nombre AS Provincia
            FROM Empleado e
            LEFT JOIN Direccion d ON d.Id = e.Id_Direccion
            LEFT JOIN Ciudad c ON c.Id = d.Id_Ciudad
            LEFT JOIN Provincia p ON p.Id = c.Id_Provincia";

        public List<Empleado> ObtenerEmpleados()
        {
            return ObtenerPorEstado(true);
        }

        public List<Empleado> ObtenerEmpleadosInactivos()
        {
            return ObtenerPorEstado(false);
        }

        private List<Empleado> ObtenerPorEstado(bool activo)
        {
            var lista = new List<Empleado>();
            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(
                SelectSql + " WHERE e.Activo = @Activo ORDER BY e.Apellido, e.Nombre", cn))
            {
                cmd.Parameters.Add("@Activo", SqlDbType.Bit).Value = activo;
                cn.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    while (dr.Read()) lista.Add(Mapear(dr));
                }
            }
            return lista;
        }

        public bool AgregarEmpleado(Empleado empleado)
        {
            using (var cn = new SqlConnection(connectionString))
            {
                cn.Open();
                using (var transaction = cn.BeginTransaction())
                {
                    try
                    {
                        int idDireccion = InsertarDireccion(cn, transaction, empleado);

                        using (var cmd = new SqlCommand(@"
                            INSERT INTO Empleado
                                (Nombre, Apellido, Legajo, Puesto, Calle, Numero, Id_Direccion)
                            VALUES
                                (@Nombre, @Apellido, @Legajo, @Puesto, @Calle, @Numero, @IdDireccion)", cn, transaction))
                        {
                            AgregarParametrosEmpleado(cmd, empleado);
                            cmd.Parameters.Add("@IdDireccion", SqlDbType.Int).Value = idDireccion;
                            if (cmd.ExecuteNonQuery() <= 0)
                            {
                                transaction.Rollback();
                                return false;
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        public bool ActualizarEmpleado(Empleado empleado)
        {
            using (var cn = new SqlConnection(connectionString))
            {
                cn.Open();
                using (var transaction = cn.BeginTransaction())
                {
                    try
                    {
                        int? idDireccion = null;
                        using (var buscar = new SqlCommand(
                            "SELECT Id_Direccion FROM Empleado WITH (UPDLOCK, ROWLOCK) WHERE Id = @Id",
                            cn, transaction))
                        {
                            buscar.Parameters.Add("@Id", SqlDbType.Int).Value = empleado.Id;
                            object resultado = buscar.ExecuteScalar();
                            if (resultado == null)
                            {
                                transaction.Rollback();
                                return false;
                            }
                            if (resultado != DBNull.Value) idDireccion = Convert.ToInt32(resultado);
                        }

                        if (idDireccion.HasValue)
                        {
                            using (var actualizarDireccion = new SqlCommand(@"
                                UPDATE Direccion
                                SET Calle = @Calle, Numero = @Numero, Id_Ciudad = @IdCiudad
                                WHERE Id = @IdDireccion", cn, transaction))
                            {
                                AgregarParametrosDireccion(actualizarDireccion, empleado);
                                actualizarDireccion.Parameters.Add("@IdDireccion", SqlDbType.Int).Value =
                                    idDireccion.Value;
                                actualizarDireccion.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            idDireccion = InsertarDireccion(cn, transaction, empleado);
                        }

                        using (var cmd = new SqlCommand(@"
                            UPDATE Empleado
                            SET Nombre = @Nombre,
                                Apellido = @Apellido,
                                Legajo = @Legajo,
                                Puesto = @Puesto,
                                Calle = @Calle,
                                Numero = @Numero,
                                Id_Direccion = @IdDireccion
                            WHERE Id = @Id", cn, transaction))
                        {
                            AgregarParametrosEmpleado(cmd, empleado);
                            cmd.Parameters.Add("@IdDireccion", SqlDbType.Int).Value = idDireccion.Value;
                            cmd.Parameters.Add("@Id", SqlDbType.Int).Value = empleado.Id;
                            if (cmd.ExecuteNonQuery() <= 0)
                            {
                                transaction.Rollback();
                                return false;
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        public bool DesactivarEmpleado(int id)
        {
            return CambiarEstado(id, false, true);
        }

        public bool ReactivarEmpleado(int id)
        {
            return CambiarEstado(id, true, false);
        }

        private bool CambiarEstado(int id, bool nuevoEstado, bool exigirEstadoContrario)
        {
            string sql = "UPDATE Empleado SET Activo = @Activo WHERE Id = @Id";
            if (exigirEstadoContrario) sql += " AND Activo <> @Activo";

            using (var cn = new SqlConnection(connectionString))
            using (var cmd = new SqlCommand(sql, cn))
            {
                cmd.Parameters.Add("@Activo", SqlDbType.Bit).Value = nuevoEstado;
                cmd.Parameters.Add("@Id", SqlDbType.Int).Value = id;
                cn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
        }

        private static int InsertarDireccion(
            SqlConnection cn,
            SqlTransaction transaction,
            Empleado empleado)
        {
            using (var cmd = new SqlCommand(@"
                INSERT INTO Direccion (Calle, Numero, Id_Ciudad)
                VALUES (@Calle, @Numero, @IdCiudad);
                SELECT CONVERT(INT, SCOPE_IDENTITY());", cn, transaction))
            {
                AgregarParametrosDireccion(cmd, empleado);
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        private static void AgregarParametrosDireccion(SqlCommand cmd, Empleado empleado)
        {
            cmd.Parameters.Add("@Calle", SqlDbType.NVarChar, 100).Value = empleado.Calle.Trim();
            cmd.Parameters.Add("@Numero", SqlDbType.Int).Value = empleado.Numero.Value;
            cmd.Parameters.Add("@IdCiudad", SqlDbType.Int).Value = empleado.Id_Ciudad.Value;
        }

        private static void AgregarParametrosEmpleado(SqlCommand cmd, Empleado empleado)
        {
            cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 25).Value = empleado.Nombre.Trim();
            cmd.Parameters.Add("@Apellido", SqlDbType.NVarChar, 25).Value = empleado.Apellido.Trim();
            cmd.Parameters.Add("@Legajo", SqlDbType.Int).Value = empleado.Legajo;
            cmd.Parameters.Add("@Puesto", SqlDbType.NVarChar, 30).Value =
                string.IsNullOrWhiteSpace(empleado.Puesto)
                    ? (object)DBNull.Value
                    : empleado.Puesto.Trim();
            cmd.Parameters.Add("@Calle", SqlDbType.NVarChar, 30).Value = empleado.Calle.Trim();
            cmd.Parameters.Add("@Numero", SqlDbType.Int).Value = empleado.Numero.Value;
        }

        private static Empleado Mapear(IDataRecord dr)
        {
            return new Empleado
            {
                Id = Convert.ToInt32(dr["Id"]),
                Nombre = dr["Nombre"].ToString(),
                Apellido = dr["Apellido"].ToString(),
                Legajo = Convert.ToInt32(dr["Legajo"]),
                Puesto = dr["Puesto"].ToString(),
                Id_Direccion = NullableInt(dr["Id_Direccion"]),
                Calle = dr["Calle"].ToString(),
                Numero = NullableInt(dr["Numero"]),
                Id_Ciudad = NullableInt(dr["Id_Ciudad"]),
                Ciudad = dr["Ciudad"].ToString(),
                Id_Provincia = NullableInt(dr["Id_Provincia"]),
                Provincia = dr["Provincia"].ToString()
            };
        }

        private static int? NullableInt(object value)
        {
            return value == DBNull.Value ? (int?)null : Convert.ToInt32(value);
        }
    }
}

