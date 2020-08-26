const KEY = "video-settings";
export const VideoSettings = {
  getCanShow: function () {
    const boolenString = localStorage.getItem(KEY);
    return boolenString === "true";
  },
  saveCanShow: function (canShow: boolean) {
    localStorage.setItem(KEY, canShow.toString());
  },
};
