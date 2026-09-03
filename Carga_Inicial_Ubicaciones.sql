-- En SQL Server Management Studio puede ejecutarse directamente.
-- Con sqlcmd usar: sqlcmd -f 65001 -i Carga_Inicial_Ubicaciones.sql

USE [GestionStockMDR];
GO

SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.Provincia', N'U') IS NULL
       OR OBJECT_ID(N'dbo.Ciudad', N'U') IS NULL
    BEGIN
        THROW 50001, 'Primero debe ejecutarse Migracion_Ubicaciones.sql.', 1;
    END;

    DECLARE @Provincias TABLE
    (
        Nombre NVARCHAR(100) NOT NULL
    );

    INSERT INTO @Provincias (Nombre)
    VALUES
        (N'Buenos Aires'),
        (N'Catamarca'),
        (N'Chaco'),
        (N'Chubut'),
        (N'Ciudad Autónoma de Buenos Aires'),
        (N'Córdoba'),
        (N'Corrientes'),
        (N'Entre Ríos'),
        (N'Formosa'),
        (N'Jujuy'),
        (N'La Pampa'),
        (N'La Rioja'),
        (N'Mendoza'),
        (N'Misiones'),
        (N'Neuquén'),
        (N'Río Negro'),
        (N'Salta'),
        (N'San Juan'),
        (N'San Luis'),
        (N'Santa Cruz'),
        (N'Santa Fe'),
        (N'Santiago del Estero'),
        (N'Tierra del Fuego'),
        (N'Tucumán');

    INSERT INTO dbo.Provincia (Nombre)
    SELECT origen.Nombre
    FROM @Provincias origen
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM dbo.Provincia destino
        WHERE destino.Nombre = origen.Nombre
    );

    DECLARE @Ciudades TABLE
    (
        Provincia NVARCHAR(100) NOT NULL,
        Ciudad NVARCHAR(100) NOT NULL
    );

    INSERT INTO @Ciudades (Provincia, Ciudad)
    VALUES
        (N'Buenos Aires', N'La Plata'),
        (N'Buenos Aires', N'Mar del Plata'),
        (N'Buenos Aires', N'Bahía Blanca'),
        (N'Buenos Aires', N'Tandil'),
        (N'Buenos Aires', N'Pergamino'),
        (N'Catamarca', N'San Fernando del Valle de Catamarca'),
        (N'Chaco', N'Resistencia'),
        (N'Chaco', N'Presidencia Roque Sáenz Peña'),
        (N'Chubut', N'Rawson'),
        (N'Chubut', N'Comodoro Rivadavia'),
        (N'Chubut', N'Puerto Madryn'),
        (N'Chubut', N'Trelew'),
        (N'Ciudad Autónoma de Buenos Aires', N'Ciudad Autónoma de Buenos Aires'),
        (N'Córdoba', N'Córdoba'),
        (N'Córdoba', N'Río Cuarto'),
        (N'Córdoba', N'Villa María'),
        (N'Córdoba', N'Villa Carlos Paz'),
        (N'Córdoba', N'San Francisco'),
        (N'Córdoba', N'Jesús María'),
        (N'Córdoba', N'Alta Gracia'),
        (N'Corrientes', N'Corrientes'),
        (N'Corrientes', N'Goya'),
        (N'Entre Ríos', N'Paraná'),
        (N'Entre Ríos', N'Concordia'),
        (N'Entre Ríos', N'Gualeguaychú'),
        (N'Formosa', N'Formosa'),
        (N'Formosa', N'Clorinda'),
        (N'Jujuy', N'San Salvador de Jujuy'),
        (N'Jujuy', N'Palpalá'),
        (N'La Pampa', N'Santa Rosa'),
        (N'La Pampa', N'General Pico'),
        (N'La Rioja', N'La Rioja'),
        (N'Mendoza', N'Mendoza'),
        (N'Mendoza', N'San Rafael'),
        (N'Mendoza', N'Godoy Cruz'),
        (N'Misiones', N'Posadas'),
        (N'Misiones', N'Oberá'),
        (N'Misiones', N'Puerto Iguazú'),
        (N'Neuquén', N'Neuquén'),
        (N'Neuquén', N'Cutral Có'),
        (N'Río Negro', N'Viedma'),
        (N'Río Negro', N'San Carlos de Bariloche'),
        (N'Río Negro', N'General Roca'),
        (N'Río Negro', N'Cipolletti'),
        (N'Salta', N'Salta'),
        (N'Salta', N'Tartagal'),
        (N'San Juan', N'San Juan'),
        (N'San Luis', N'San Luis'),
        (N'San Luis', N'Villa Mercedes'),
        (N'Santa Cruz', N'Río Gallegos'),
        (N'Santa Cruz', N'Caleta Olivia'),
        (N'Santa Cruz', N'El Calafate'),
        (N'Santa Fe', N'Santa Fe'),
        (N'Santa Fe', N'Rosario'),
        (N'Santa Fe', N'Rafaela'),
        (N'Santa Fe', N'Venado Tuerto'),
        (N'Santiago del Estero', N'Santiago del Estero'),
        (N'Santiago del Estero', N'La Banda'),
        (N'Tierra del Fuego', N'Ushuaia'),
        (N'Tierra del Fuego', N'Río Grande'),
        (N'Tucumán', N'San Miguel de Tucumán'),
        (N'Tucumán', N'Tafí Viejo');

    INSERT INTO dbo.Ciudad (Nombre, Id_Provincia)
    SELECT origen.Ciudad, provincia.Id
    FROM @Ciudades origen
    INNER JOIN dbo.Provincia provincia
        ON provincia.Nombre = origen.Provincia
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM dbo.Ciudad destino
        WHERE destino.Nombre = origen.Ciudad
          AND destino.Id_Provincia = provincia.Id
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO
