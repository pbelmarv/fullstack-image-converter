import { useState } from "react";
import "./App.css";
import axios from "axios";
import "tailwindcss/tailwind.css";

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [convertedImage, setCOnvertedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [format, setFormat] = useState("avif");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setCOnvertedImage(null);
    };

    const handleFormatChange = (event) => {
        setFormat(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("format", format);

        try {
            const response = await axios.post(
                "http://localhost:3000/convert",
                formData,
                {
                    Headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    responseType: "blob",
                }
            );

            const url = URL.createObjectURL(new Blob([response.data]));
            setCOnvertedImage(url);
            setLoading(false);
        } catch (error) {
            console.error("Error al subir el archivo", error);
            setLoading(false);
        }
    };

    return (
        <div className="nim-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Convertir Imagen</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="mb-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="format"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Formato de salida
                    </label>
                    <select
                        id="format"
                        value={format}
                        onChange={handleFormatChange}
                        className="block w-full mt-1 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                    >
                        <option value="avif">AVIF</option>
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                    </select>
                </div>
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Convertir
                    </button>
                </div>
            </form>

            {loading && (
                <div className="mt-4">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-500"></div>
                    <p className="text-blue-500 mt-2">Convirtiendo Imagen...</p>
                </div>
            )}

            {convertedImage && (
                <div className="mt-4 text-center">
                    <h2 className="text-2xl font-semibold mb-2">
                        Imagen Convertida
                    </h2>
                    <img
                        src={convertedImage}
                        alt="Convertido"
                        className="mx-auto mb-4"
                    />
                    <a
                        href={convertedImage}
                        download={`converted-image.${format}`}
                    >
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Descargar Imagen
                        </button>
                    </a>
                </div>
            )}
        </div>
    );
}

export default App;
