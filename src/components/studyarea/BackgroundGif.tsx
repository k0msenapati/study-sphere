export default function BackgroundGif() {
  return (
    <div className="absolute inset-0 z-0">
      <img
        src="/studyGIF.gif"
        alt="Study background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
    </div>
  );
}
