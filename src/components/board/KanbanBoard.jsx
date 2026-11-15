import { useCreator, COLUMNS } from "../../context/CreatorContext";
import VideoCard from "./VideoCard";

export default function KanbanBoard() {
  const { state, dispatch, searchQuery, t } = useCreator();

  const filteredVideos = state.videos.filter((video) => {
    const matchesChannel =
      state.activeChannelId === "all" ||
      video.channelId === state.activeChannelId;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.hookText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const videoId = e.dataTransfer.getData("text/plain");
    if (videoId) {
      dispatch({
        type: "MOVE_STATUS",
        payload: { id: videoId, status: targetStatus },
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 h-full">
      {COLUMNS.map((col) => {
        const colVideos = filteredVideos.filter((v) => v.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="bg-[#161920] border border-slate-800/80 rounded-2xl p-4 flex flex-col h-full min-h-[520px]"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${col.badgeBg}`}
              >
                {t(col.titleKey)}
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                {colVideos.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {colVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}

              {colVideos.length === 0 && (
                <div className="h-36 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
                  {t("dragHere")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
