export default function VideoIframe({videoUrl, videoTitle, youtubeId}: {
  videoUrl?: string,
  videoTitle?: string,
  youtubeId?: string
}) {
  const renderYoutubeId = `https://www.youtube.com/embed/${videoUrl?.length === 11 ? videoUrl : youtubeId}`;
  return (
    <div className={`video-iframe`}>
      <iframe

        src={renderYoutubeId || videoUrl}
        title={videoTitle || ""}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}