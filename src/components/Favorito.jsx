import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import axios from "axios";
import Corazon from '../img/corazon.svg';

export const Favorito = ({ ids }) => {
  const [pelicula, setPelicula] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const obtenerPelicula = async () => {
      const peliculaPromesas = ids.map(async (numero) => {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${numero}?api_key=9ad816b5e30fc1892635fae8cf7940f2&language=es-MX`);
        const jsonpelicula = await respuesta.json();
        return jsonpelicula;
      });

      const peliculas = await Promise.all(peliculaPromesas);
      setPelicula(peliculas);
    };

    obtenerPelicula();
  }, []);
  //eliminar la pelicula de los favoritos
  const handleEliminarPelicula = (id) => {
    const peliculasActualizadas = pelicula.filter((pelicula) => pelicula.id !== id);
    setPelicula(peliculasActualizadas);
    //funcionalidad back para eliminar de favoritos del usuario
  };
  // Buscar descarga el poster
  const handleDescargarPoster = (peliculaId) => {
    const imagenPoster = document.getElementById(`poster-${peliculaId}`);
    const url = imagenPoster.src;
    const link = document.createElement('a');
    link.href = url;
    link.download = `poster-${peliculaId}.jpg`;
    link.click();
  };

  //Obtener pelicula actual

  function getDetailMovie(idmovie) {
    let movie = [];

    let urlMovieTrailers = `https://api.themoviedb.org/3/movie/${idmovie}/videos?api_key=9ad816b5e30fc1892635fae8cf7940f2`;
    
    axios.get(urlMovieTrailers).then((response) => {

        axios.get(urlMovieTrailers).then((response) => {

            if (response.data.results.length > 0) {
                console.log('encotro trailer');
                const isOfficialTrailer = (element) => element.name.includes('Official') && element.name.includes('Trailer');
                const index = response.data.results.findIndex(isOfficialTrailer);  
                movie.keyTrailer = response.data.results[index].key;
              
                //setMovie(movie);
                setVideoUrl(`https://www.youtube.com/embed/${movie.keyTrailer}?autoplay=1`);
                setModalIsOpen(true);
            } else {
                setVideoUrl("https://www.youtube.com/embed/Iqr3XIhSnUQ?autoplay=1");
                setModalIsOpen(true);
                console.log('NO encotro trailer');
            }

        }).catch((error) => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
    });
}

 
  
  

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <h2>FAVORITOS</h2>
      {pelicula.map((pelicula) => (
        <div className="card mb-3 cardFavorito rounded" key={pelicula.id}>
          <div className="row g-0">
            <div className="col-md-2">
              <img id={`poster-${pelicula.id}`} src={`https://image.tmdb.org/t/p/w200${pelicula.poster_path}`} className="img-fluid rounded-start m-1" alt="..." />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{pelicula.title}</h5>
                <p className="card-text">{pelicula.overview}</p>
                <img src={Corazon} alt="Corazon de Favoritos" onClick={() => handleEliminarPelicula(pelicula.id)} />
              </div>
            </div>
            <div className='col-md-2'>
              <button className='btn btn-primary mt-3 m-2' onClick={() => getDetailMovie(pelicula.id)}>Ver Trailer</button>
              <button className='btn btn-primary mt-3 m-2' onClick={() => handleDescargarPoster(pelicula.id)}>Descargar Poster</button>
            </div>
          </div>
        </div>
      ))}

<ReactModal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Trailer Modal"
  style={{
    content: {
      width: '80%', // Ajusta el ancho según tus necesidades (porcentaje)
      height: '80%', // Ajusta la altura según tus necesidades (porcentaje)
      margin: 'auto', // Centra el modal en la pantalla
      position: 'relative', // Permite posicionar elementos hijos de manera absoluta
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro alrededor del modal
    },
  }}
>
  <button className="cerrar-btn" onClick={closeModal}>X</button>
  <iframe
    title="Trailer"
    width="100%"
    height="100%"
    src={videoUrl}
    frameBorder="0"
    allowFullScreen
  ></iframe>
</ReactModal>
    </div>
  );
};
