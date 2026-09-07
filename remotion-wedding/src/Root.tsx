import {Composition} from 'remotion';
import {WeddingTrack} from './compositions/WeddingTrack';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Immersive 3D wall track — 10 walls × 3 = 30 photos, driven by scroll-like timeline */}
      <Composition
        id="WeddingTrack"
        component={WeddingTrack}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* Hero stinger — Rosanne & Andrew + huge date */}
      <Composition
        id="WeddingHero"
        component={WeddingTrack}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{heroOnly: true} as any}
      />
    </>
  );
};
