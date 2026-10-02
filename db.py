import os
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, relationship, scoped_session, sessionmaker

DATABASE_URL = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2?charset=utf8mb4"

engine = create_engine(DATABASE_URL)
Session = scoped_session(sessionmaker(bind=engine))

Base = declarative_base()


class Region(Base):
    __tablename__ = "region"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)


class Comuna(Base):
    __tablename__ = "comuna"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable=False)
    region = relationship("Region")


class Voluntario(Base):
    __tablename__ = "voluntario"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable=False)
    comuna = relationship("Comuna")


class Ave(Base):
    __tablename__ = "ave"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(80), nullable=False)


class Avistamiento(Base):
    __tablename__ = "avistamiento"
    id = Column(Integer, primary_key=True)
    voluntario_id = Column(Integer, ForeignKey("voluntario.id"), nullable=False)
    ave_id = Column(Integer, ForeignKey("ave.id"), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)

    voluntario = relationship("Voluntario")
    ave = relationship("Ave")
    registros = relationship("Registro", back_populates="avistamiento", cascade="all, delete-orphan")


class Registro(Base):
    __tablename__ = "registro"
    id = Column(Integer, primary_key=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(Integer, ForeignKey("avistamiento.id"), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="registros")

    @property
    def es_video(self):
        return self.ruta_archivo.rsplit(".", 1)[-1].lower() in ("mp4", "webm")

    @property
    def mimetype(self):
        ext = self.ruta_archivo.rsplit(".", 1)[-1].lower()
        return {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
                "gif": "image/gif", "webp": "image/webp",
                "mp4": "video/mp4", "webm": "video/webm"}.get(ext, "application/octet-stream")