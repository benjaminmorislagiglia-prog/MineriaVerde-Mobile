use GestionStockMDR
go

if object_id('Usuario', 'U') is null
begin
    create table Usuario (
        Id int identity primary key,
        NombreUsuario nvarchar(50) not null unique,
        Nombre nvarchar(100) null,
        Email nvarchar(120) null,
        PasswordHash nvarchar(64) not null,
        PasswordSalt nvarchar(80) not null,
        Rol nvarchar(20) not null,
        Activo bit not null constraint DF_Usuario_Activo default 1,
        FechaCreacion datetime not null constraint DF_Usuario_FechaCreacion default getdate()
    )
end
go

if col_length('Usuario', 'Nombre') is null
begin
    alter table Usuario add Nombre nvarchar(100) null
end
go

if col_length('Usuario', 'Email') is null
begin
    alter table Usuario add Email nvarchar(120) null
end
go

if not exists (select 1 from Usuario where NombreUsuario = 'benjamin')
begin
    insert into Usuario (NombreUsuario, Nombre, Email, PasswordHash, PasswordSalt, Rol)
    values ('benjamin', 'Benjamin Pereago', 'benjamin@mineriaverde.local', '3f148c57d10671e5aa619aa13d42b1e67ceb9cfebd71d965f1b025b762400ad3', 'admin-salt', 'admin')
end
go

if not exists (select 1 from Usuario where NombreUsuario = 'usuario')
begin
    insert into Usuario (NombreUsuario, Nombre, Email, PasswordHash, PasswordSalt, Rol)
    values ('usuario', 'Usuario de consulta', 'consulta@mineriaverde.local', 'dc11595473a989b3217f311f7a7519169f74f27cc1db5c5df2afaf1c674e6817', 'viewer-salt', 'viewer')
end
go

update Usuario
set Nombre = isnull(Nombre, 'Benjamin Pereago'),
    Email = isnull(Email, 'benjamin@mineriaverde.local')
where NombreUsuario = 'benjamin'
go

update Usuario
set Nombre = isnull(Nombre, 'Usuario de consulta'),
    Email = isnull(Email, 'consulta@mineriaverde.local')
where NombreUsuario = 'usuario'
go
