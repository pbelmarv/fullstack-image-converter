const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// Configuramos el almacenamiento con Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para manejar la conversión
app.post("/convert", upload.single("image"), async (req, res) => {
    const format = req.body.format || "avif";
    if (!req.file) {
        return res.status(400).send("No se adjunto ninguna imágen");
    }

    const outputPath = path.join(__dirname, "output", `${Date.now()}.avif`);

    // Verificamos que el directorio de salida existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        await sharp(req.file.buffer).toFormat(format).toFile(outputPath);

        res.status(200).sendFile(outputPath);
    } catch (error) {
        console.error('Error al convertir la imágen', error);
        res.status(500).send('Error al convertir la imágen');
    }
});

// Iniciamos el servidor
app.listen(PORT, () => {console.log(`Servidor iniciado en http://localhost:${PORT}`)});