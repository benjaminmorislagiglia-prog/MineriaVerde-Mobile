USE [GestionStockMDR];
GO

SET XACT_ABORT ON;
GO

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.Provincia', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Provincia
        (
            Id INT IDENTITY(1,1) NOT NULL
                CONSTRAINT PK_Provincia PRIMARY KEY,
            Nombre NVARCHAR(100) NOT NULL
        );
    END;

    IF OBJECT_ID(N'dbo.Ciudad', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Ciudad
        (
            Id INT IDENTITY(1,1) NOT NULL
                CONSTRAINT PK_Ciudad PRIMARY KEY,
            Nombre NVARCHAR(100) NOT NULL,
            Id_Provincia INT NOT NULL
        );
    END;

    IF OBJECT_ID(N'dbo.Direccion', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.Direccion
        (
            Id INT IDENTITY(1,1) NOT NULL
                CONSTRAINT PK_Direccion PRIMARY KEY,
            Calle NVARCHAR(100) NOT NULL,
            Numero INT NOT NULL,
            Id_Ciudad INT NOT NULL
        );
    END;

    IF COL_LENGTH(N'dbo.Empleado', N'Id_Direccion') IS NULL
        ALTER TABLE dbo.Empleado ADD Id_Direccion INT NULL;

    DECLARE @IdProvinciaSinEspecificar INT;
    DECLARE @IdCiudadSinEspecificar INT;

    SELECT TOP (1) @IdProvinciaSinEspecificar = Id
    FROM dbo.Provincia
    WHERE Nombre = N'Sin especificar'
    ORDER BY Id;

    IF @IdProvinciaSinEspecificar IS NULL
    BEGIN
        INSERT INTO dbo.Provincia (Nombre) VALUES (N'Sin especificar');
        SET @IdProvinciaSinEspecificar = CONVERT(INT, SCOPE_IDENTITY());
    END;

    SELECT TOP (1) @IdCiudadSinEspecificar = Id
    FROM dbo.Ciudad
    WHERE Nombre = N'Sin especificar'
      AND Id_Provincia = @IdProvinciaSinEspecificar
    ORDER BY Id;

    IF @IdCiudadSinEspecificar IS NULL
    BEGIN
        INSERT INTO dbo.Ciudad (Nombre, Id_Provincia)
        VALUES (N'Sin especificar', @IdProvinciaSinEspecificar);
        SET @IdCiudadSinEspecificar = CONVERT(INT, SCOPE_IDENTITY());
    END;

    IF NOT EXISTS
    (
        SELECT 1
        FROM sys.foreign_keys
        WHERE parent_object_id = OBJECT_ID(N'dbo.Ciudad')
          AND referenced_object_id = OBJECT_ID(N'dbo.Provincia')
    )
    BEGIN
        ALTER TABLE dbo.Ciudad WITH CHECK
        ADD CONSTRAINT FK_Ciudad_Provincia
            FOREIGN KEY (Id_Provincia) REFERENCES dbo.Provincia(Id);
    END;

    IF NOT EXISTS
    (
        SELECT 1
        FROM sys.foreign_keys
        WHERE parent_object_id = OBJECT_ID(N'dbo.Direccion')
          AND referenced_object_id = OBJECT_ID(N'dbo.Ciudad')
    )
    BEGIN
        ALTER TABLE dbo.Direccion WITH CHECK
        ADD CONSTRAINT FK_Direccion_Ciudad
            FOREIGN KEY (Id_Ciudad) REFERENCES dbo.Ciudad(Id);
    END;

    IF NOT EXISTS
    (
        SELECT 1
        FROM sys.foreign_keys
        WHERE parent_object_id = OBJECT_ID(N'dbo.Empleado')
          AND referenced_object_id = OBJECT_ID(N'dbo.Direccion')
    )
    BEGIN
        EXEC(N'
            ALTER TABLE dbo.Empleado WITH CHECK
            ADD CONSTRAINT FK_Empleado_Direccion
                FOREIGN KEY (Id_Direccion) REFERENCES dbo.Direccion(Id);');
    END;

    DECLARE @IdEmpleado INT;
    DECLARE @Calle NVARCHAR(100);
    DECLARE @Numero INT;
    DECLARE @IdDireccion INT;

    CREATE TABLE #EmpleadosSinDireccion
    (
        Id INT NOT NULL,
        Calle NVARCHAR(100) NULL,
        Numero INT NULL
    );

    EXEC sp_executesql N'
        INSERT INTO #EmpleadosSinDireccion (Id, Calle, Numero)
        SELECT Id, NULLIF(LTRIM(RTRIM(Calle)), N''''), Numero
        FROM dbo.Empleado
        WHERE Id_Direccion IS NULL
          AND (NULLIF(LTRIM(RTRIM(Calle)), N'''') IS NOT NULL OR Numero IS NOT NULL);';

    DECLARE empleados_sin_direccion CURSOR LOCAL FAST_FORWARD FOR
        SELECT Id, Calle, Numero
        FROM #EmpleadosSinDireccion;

    OPEN empleados_sin_direccion;
    FETCH NEXT FROM empleados_sin_direccion INTO @IdEmpleado, @Calle, @Numero;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        INSERT INTO dbo.Direccion (Calle, Numero, Id_Ciudad)
        VALUES
        (
            COALESCE(@Calle, N'Sin especificar'),
            COALESCE(@Numero, 0),
            @IdCiudadSinEspecificar
        );

        SET @IdDireccion = CONVERT(INT, SCOPE_IDENTITY());

        EXEC sp_executesql
            N'UPDATE dbo.Empleado
              SET Id_Direccion = @IdDireccion
              WHERE Id = @IdEmpleado
                AND Id_Direccion IS NULL;',
            N'@IdDireccion INT, @IdEmpleado INT',
            @IdDireccion,
            @IdEmpleado;

        FETCH NEXT FROM empleados_sin_direccion INTO @IdEmpleado, @Calle, @Numero;
    END;

    CLOSE empleados_sin_direccion;
    DEALLOCATE empleados_sin_direccion;
    DROP TABLE #EmpleadosSinDireccion;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF CURSOR_STATUS('local', 'empleados_sin_direccion') >= -1
    BEGIN
        IF CURSOR_STATUS('local', 'empleados_sin_direccion') > -1
            CLOSE empleados_sin_direccion;
        DEALLOCATE empleados_sin_direccion;
    END;

    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO
