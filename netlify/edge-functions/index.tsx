// import { useState, useEffect } from "react";

// interface Video {
//   title: string;
//   video_url: string;
//   published_at: string;
// }

// export default function Home() {
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchVideos() {
//       try {
//         const response = await fetch("/api/latest-videos?max_results=10");
//         const data = await response.json();
//         setVideos(data.videos);
//       } catch (error) {
//         console.error("Erro ao carregar vídeos:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchVideos();
//   }, []);

//   return (
//     <div>
//       <h1>Últimos Vídeos dos Canais</h1>
//       {loading ? (
//         <p>Carregando...</p>
//       ) : (
//         <ul>
//           {videos.map((video) => (
//             <li key={video.video_url}>
//               <a href={video.video_url} target="_blank" rel="noopener noreferrer">
//                 {video.title}
//               </a>
//               <p>Publicado em: {new Date(video.published_at).toLocaleDateString()}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
