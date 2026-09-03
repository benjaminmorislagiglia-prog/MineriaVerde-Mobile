use master
go
if db_id('GestionStockMDR') is null
    create database GestionStockMDR
go
use GestionStockMDR

create table Empleado (
Id int identity primary key,
Nombre nvarchar(25) not null,
Apellido nvarchar (25) not null,
Legajo int not null,
Puesto nvarchar(30),
Calle nvarchar(30),
Numero int,
Activo bit not null default 1
)
go

 create table Maquina(
Id int identity primary key,
Nombre nvarchar(20) not null,
Dominio nvarchar(10) not null,
Anio int,
Modelo nvarchar(20) not null,
Activo bit not null default 1
)
go

create table Proveedor(
Id int identity primary key,
Razon_Social nvarchar(30) not null,
Cuit nvarchar(15) not null, 
Condicion_Iva nvarchar(20),
Email nvarchar(20),
Telefono nvarchar(30),
Activo bit not null default 1

)
go

create table Repuesto(
Id int identity primary key,
Nombre nvarchar(30) not null,
Precio int, 
OEM nvarchar(20),
Unidad_de_Medida nvarchar(20),
Cantidad int,
Id_Proveedor int,
Activo bit not null default 1,
Foreign key (Id_Proveedor) references Proveedor (Id)
)
go

create table Stock (
Id int identity primary key,
Cantidad int,
Nombre nvarchar(20),
Id_Repuesto int,
Id_Maquina int,
Activo bit not null default 1,
Foreign key (Id_Repuesto) references Repuesto (Id),
Foreign key (Id_Maquina) references Maquina (Id)
)
go

create table Movimientos(
Id int identity primary key,
Tipo_de_Movimiento nvarchar (20),
Fecha datetime,
Cantidad int,
Prestamo nvarchar (5),
Ajuste decimal, 
Id_Repuesto int,
Id_Maquina int,
Id_Empleado int,
Id_Stock int,
Activo bit not null default 1,
Foreign key (Id_Repuesto) references Repuesto (Id),
Foreign key (Id_Maquina) references Maquina (Id),
Foreign key (Id_Empleado) references Empleado (Id),
Foreign key (Id_Stock) references Stock (Id),

)

go

insert into Empleado (Nombre, Apellido, Legajo, Puesto, Calle, Numero) values ('Gerardo', 'Lopez', 3,'Sereno', 'DuarteQuiros', 520)
insert into Empleado (Nombre, Apellido, Legajo, Puesto, Calle, Numero) values ('Andrea', 'Soria', 5,'Administrativo', 'Valparaiso', 2500)
insert into Empleado (Nombre, Apellido, Legajo, Puesto, Calle, Numero) values ('Lucas', 'Gutierrez', 25, 'Palero', 'Derqui', 790)

go

insert into Maquina (Nombre, Dominio, Anio, Modelo) values ('Retroexcavadora', 'ELI46', 2019, '950GC')
insert into Maquina (Nombre, Dominio, Anio, Modelo) values ('PalaMecanica', 'RIU92', 2010, '950H')
insert into Maquina (Nombre, Dominio, Anio, Modelo) values ('AUtoElevador', 'ESP340', 2015, 'Toyota')

go

insert into Proveedor (Razon_Social, Cuit, Condicion_Iva, Email, Telefono) values ('Finning S.A', '30436920562', 'ResponsableInscripto', 'admin@finnning.com', '351156745302')
insert into Proveedor (Razon_Social, Cuit, Condicion_Iva, Email, Telefono) values ('CeaglioMariaEugenia', '30239564713', 'ResponsableInscripto', 'filtrosmed@gmail.com', '351155762340')
insert into Proveedor (Razon_Social, Cuit, Condicion_Iva, Email, Telefono) values ('FORJAMEC', '30199871456', 'Monotributista', 'adm@forjamec.com', '351156349105')

go

insert into Repuesto (Nombre, Precio, OEM, Unidad_de_Medida, Cantidad, Id_Proveedor) values ('BaldeRetro', 300000, 'BDR2572', 'Unidad', 3,1)
insert into Repuesto (Nombre, Precio, OEM, Unidad_de_Medida, Cantidad, Id_Proveedor) values ('Manguera', 1000000, 'FYM1472', '10Unidades',2,2)
insert into Repuesto (Nombre, Precio, OEM, Unidad_de_Medida, Cantidad, Id_Proveedor) values ('Elevador', 400000, 'AET94567', 'Unidad', 1,3)
go

insert into Stock (Cantidad, Nombre, Id_Repuesto, Id_Maquina) values (4,'Manguera',2,3)
insert into Stock (Cantidad, Nombre, Id_Repuesto, Id_Maquina) values (1, 'Motor',1,1)
insert into Stock (Cantidad, Nombre, Id_Repuesto, Id_Maquina) values (1, 'Correa',3,2)
go



insert into Movimientos (Tipo_de_Movimiento, Fecha, Cantidad, Prestamo, Ajuste, Id_Repuesto, Id_Maquina, Id_Empleado, Id_Stock) values ('Reparacion', '2022-03-15',3,'No',0.0,3,3,1,2)
insert into Movimientos (Tipo_de_Movimiento, Fecha, Cantidad, Prestamo, Ajuste, Id_Repuesto, Id_Maquina, Id_Empleado, Id_Stock) values ('Compra', '2025-03-15',2,'No',0.0,2,2,3,3)
insert into Movimientos (Tipo_de_Movimiento, Fecha, Cantidad, Prestamo, Ajuste, Id_Repuesto, Id_Maquina, Id_Empleado, Id_Stock) values ('Reparacion', '2021-08-12',1,'No',0.0,1,1,2,1)
go

select * from Stock
