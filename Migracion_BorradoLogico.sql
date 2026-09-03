use GestionStockMDR
go

if col_length('Empleado', 'Activo') is null
begin
    alter table Empleado add Activo bit not null constraint DF_Empleado_Activo default 1
end
go

if col_length('Maquina', 'Activo') is null
begin
    alter table Maquina add Activo bit not null constraint DF_Maquina_Activo default 1
end
go

if col_length('Proveedor', 'Activo') is null
begin
    alter table Proveedor add Activo bit not null constraint DF_Proveedor_Activo default 1
end
go

if col_length('Repuesto', 'Activo') is null
begin
    alter table Repuesto add Activo bit not null constraint DF_Repuesto_Activo default 1
end
go

if col_length('Stock', 'Activo') is null
begin
    alter table Stock add Activo bit not null constraint DF_Stock_Activo default 1
end
go

if col_length('Movimientos', 'Activo') is null
begin
    alter table Movimientos add Activo bit not null constraint DF_Movimientos_Activo default 1
end
go

select Id, nombre, Activo
FROM Empleado