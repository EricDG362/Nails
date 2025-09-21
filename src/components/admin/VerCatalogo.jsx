import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase/BaseFire";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function VerCatalogo() {
  const [productos, setProductos] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [cargandoNuevo, setCargandoNuevo] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(true); // spinner inicial
  const catalogoCollection = collection(db, "catalogo");

  const cargarProductos = async () => {
    setCargandoProductos(true);
    try {
      const snapshot = await getDocs(catalogoCollection);
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductos(lista);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
    setCargandoProductos(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarProducto = async () => {
    if (!nuevoTitulo || !nuevoPrecio || !nuevaImagen) {
      alert("Completá todos los campos");
      return;
    }
    setCargandoNuevo(true);
    try {
      const storageRef = ref(storage, `catalogo/${Date.now()}_${nuevaImagen.name}`);
      await uploadBytes(storageRef, nuevaImagen);
      const imagenURL = await getDownloadURL(storageRef);

      await addDoc(catalogoCollection, {
        titulo: nuevoTitulo,
        precio: nuevoPrecio,
        imagen: imagenURL,
      });

      setNuevoTitulo("");
      setNuevoPrecio("");
      setNuevaImagen(null);
      await cargarProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar producto");
    }
    setCargandoNuevo(false);
  };

  const eliminarProducto = async (id, setCargando) => {
    if (window.confirm("¿Seguro querés eliminar este producto?")) {
      setCargando(true);
      await deleteDoc(doc(db, "catalogo", id));
      await cargarProductos();
      setCargando(false);
    }
  };

  const actualizarProducto = async (id, titulo, precio, imagen, setCargando) => {
    setCargando(true);
    try {
      let imagenURL = imagen?.file ? await subirImagenTemporal(imagen.file) : imagen?.url;
      await updateDoc(doc(db, "catalogo", id), { titulo, precio, ...(imagenURL && { imagen: imagenURL }) });
      await cargarProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar producto");
    }
    setCargando(false);
  };

  const subirImagenTemporal = async (file) => {
    const storageRef = ref(storage, `catalogo/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  return (
    <div className="p-4 flex flex-col items-center w-full min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Administrar Catálogo</h2>

      {/* Formulario de nuevo producto */}
      <div className="flex flex-col w-full max-w-md bg-white rounded-lg p-4 mb-6 shadow">
        <input
          type="text"
          placeholder="Título"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          className="mb-2 p-2 rounded border border-gray-300 w-full"
        />
        <input
          type="text"
          placeholder="Precio"
          value={nuevoPrecio}
          onChange={(e) => setNuevoPrecio(e.target.value)}
          className="mb-2 p-2 rounded border border-gray-300 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNuevaImagen(e.target.files[0])}
          className="mb-2"
        />
        <button
          onClick={agregarProducto}
          disabled={cargandoNuevo}
          className="bg-pink-700 text-white font-semibold px-4 py-2 rounded hover:bg-pink-600 w-full flex justify-center items-center"
        >
          {cargandoNuevo ? (
            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Agregar Producto"
          )}
        </button>
      </div>

      {/* Spinner mientras carga productos */}
      {cargandoProductos ? (
        <div className="flex justify-center items-center h-64 w-full">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col space-y-4">
          {productos.map((item) => (
            <ProductoCard
              key={item.id}
              item={item}
              actualizarProducto={actualizarProducto}
              eliminarProducto={eliminarProducto}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente independiente para cada producto con edición inline
function ProductoCard({ item, actualizarProducto, eliminarProducto }) {
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(item.titulo);
  const [precio, setPrecio] = useState(item.precio);
  const [imagen, setImagen] = useState({ url: item.imagen, file: null });
  const [cargando, setCargando] = useState(false);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) setImagen({ url: URL.createObjectURL(file), file });
  };

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow relative">
      {editando ? (
        <>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded w-full"
          />
          <input
            type="text"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="mb-2 p-2 border border-gray-300 rounded w-full"
          />
          <input type="file" accept="image/*" onChange={handleImagen} className="mb-2" />
          {imagen.url && (
            <img src={imagen.url} alt={titulo} className="w-32 h-32 object-cover rounded mb-2" />
          )}
          <div className="flex space-x-2 w-full justify-center">
            <button
              onClick={() => actualizarProducto(item.id, titulo, precio, imagen, setCargando)}
              disabled={cargando}
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 flex-1 flex justify-center items-center"
            >
              {cargando ? <div className="w-4 h-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "Guardar"}
            </button>
            <button
              onClick={() => setEditando(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 flex-1"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          {item.imagen && (
            <img src={item.imagen} alt={item.titulo} className="w-32 h-32 object-cover rounded mb-2" />
          )}
          <p className="font-semibold text-lg text-center">{item.titulo}</p>
          <p className="text-pink-500 font-bold mb-2">$ {item.precio}</p>
          <div className="flex space-x-2 w-full justify-center">
            <button
              onClick={() => setEditando(true)}
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 flex-1"
            >
              Editar
            </button>
            <button
              onClick={() => eliminarProducto(item.id, setCargando)}
              disabled={cargando}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1 flex justify-center items-center"
            >
              {cargando ? <div className="w-4 h-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "Eliminar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
