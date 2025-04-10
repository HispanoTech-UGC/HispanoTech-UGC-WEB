CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL
);

CREATE TABLE usuarios (
    num_placa VARCHAR(10) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    ultima_sesion TIMESTAMP,
    rol INT NOT NULL,
    FOREIGN KEY (rol) REFERENCES roles(id) ON DELETE RESTRICT
);

CREATE TABLE robots (
    robot_id SERIAL PRIMARY KEY,
    modelo VARCHAR(20) NOT NULL,
    url VARCHAR(30)
);

CREATE TABLE informes (
    informe_id SERIAL PRIMARY KEY,
    fecha_ini TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    num_placa VARCHAR(10) NOT NULL,
    robot_id INT NOT NULL,
    titulo_informe VARCHAR(30) NOT NULL,
    FOREIGN KEY (num_placa) REFERENCES usuarios(num_placa) ON DELETE CASCADE,
    FOREIGN KEY (robot_id) REFERENCES robots(robot_id) ON DELETE CASCADE
);

CREATE TABLE imagen (
    imagen_id SERIAL PRIMARY KEY,
    metadatos TEXT
);

CREATE TABLE informelimagen (
    informe_id INT NOT NULL,
    imagen_id INT NOT NULL,
    PRIMARY KEY (informe_id, imagen_id),
    FOREIGN KEY (informe_id) REFERENCES informes(informe_id) ON DELETE CASCADE,
    FOREIGN KEY (imagen_id) REFERENCES imagen(imagen_id) ON DELETE CASCADE
);

CREATE TABLE eventos (
    evento_id SERIAL PRIMARY KEY,
    robot_id INT NOT NULL,
    FOREIGN KEY (robot_id) REFERENCES robots(robot_id) ON DELETE CASCADE
);
