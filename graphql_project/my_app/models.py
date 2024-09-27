from django.db import models

# Create your models here.
class Alimentacion(models.Model):
    idalimentacion = models.AutoField(db_column='idAlimentacion', primary_key=True)  # Field name made lowercase.
    descripcion = models.CharField(db_column='Descripcion', max_length=1000)  # Field name made lowercase.
    dosis = models.FloatField()

    class Meta:
        managed = False
        db_table = 'alimentacion'

class Clientes(models.Model):
    cedula = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=120)
    apellidos = models.CharField(max_length=45)
    direccion = models.CharField(max_length=45)
    telefono = models.CharField(max_length=45)

    class Meta:
        managed = False
        db_table = 'clientes'


class Porcinos(models.Model):
    idporcinos = models.AutoField(db_column='idPorcinos', primary_key=True)  # Field name made lowercase.
    edad = models.IntegerField(db_column='Edad', blank=True, null=True)  # Field name made lowercase.
    peso = models.IntegerField(db_column='Peso', blank=True, null=True)  # Field name made lowercase.
    razas_idrazas = models.ForeignKey('Razas', models.DO_NOTHING, db_column='Razas_idRazas')  # Field name made lowercase.
    clientes_cedula = models.ForeignKey(Clientes, models.DO_NOTHING, db_column='Clientes_cedula')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'porcinos'


class PorcinosHasAlimentacion(models.Model):
    porcinos_idporcinos = models.OneToOneField(Porcinos, models.DO_NOTHING, db_column='Porcinos_idPorcinos', primary_key=True)  # Field name made lowercase. The composite primary key (Porcinos_idPorcinos, Alimentacion_idAlimentacion) found, that is not supported. The first column is selected.
    alimentacion_idalimentacion = models.ForeignKey(Alimentacion, models.DO_NOTHING, db_column='Alimentacion_idAlimentacion')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'porcinos_has_alimentacion'
        unique_together = (('porcinos_idporcinos', 'alimentacion_idalimentacion'),)


class Razas(models.Model):
    idrazas = models.IntegerField(db_column='idRazas', primary_key=True)  # Field name made lowercase.
    name = models.CharField(unique=True, max_length=45)

    class Meta:
        managed = False
        db_table = 'razas'
