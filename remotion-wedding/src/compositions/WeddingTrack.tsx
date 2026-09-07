import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Elegant photo-density thicket → oasis
// Jungle = density of 30 layered prints, not literal leaves

const COLORS = {
  paper: '#FFFBF5',
  paper2: '#F7EFE6',
  ink: '#1A1C1B',
  line: '#E9E0D3',
  gold: '#C9A46A',
  sage: '#8FA89A',
};

const WALLS = 10;
const PHOTOS_PER_WALL = 3;
const TOTAL = WALLS * PHOTOS_PER_WALL;
const WALL_DEPTH = 560;

const CAPTIONS = [
  'First hello','Quiet laughs','Late night talks','The look','Holding on',
  'Long distance','Coming home','Learning together','Hard seasons','Choosing us',
  'COVID & courage','A leap of faith','Building together','Side by side','Growing roots',
  'Laughter returns','Adventure again','Family dinners','Sunday light','The question',
  'Yes, forever','Hands held','Planning the day','Dress & suit','Letters written',
  'Blessings','Almost here','One sleep','Tomorrow','Forever starts',
];
const SEEDS = ["wedding-jungle-01","belize-light-02","tropic-vows-03","palm-shadow-04","rain-leaves-05","river-mist-06","canopy-gold-07","linen-sun-08","holding-hands-09","ring-box-10","letter-press-11","dress-hanger-12","suit-crease-13","table-wood-14","flower-arch-15","laugh-terrace-16","sunset-dock-17","church-bell-18","gully-grill-19","first-dance-20","confetti-21","toast-glass-22","night-lantern-23","morning-porch-24","veil-wind-25","hands-aged-26","jungle-path-27","oasis-pool-28","vows-close-29","forever-30"];
// Real wedding photos — updated 2026-09-06 to match photos/*.JPG cull (12 selects), synced to remotion-wedding/public/photos/
const REAL_PHOTOS = ["IMG_7759.jpg","IMG_7765.jpg","IMG_7768.jpg","IMG_7787.jpg","IMG_7795.jpg","IMG_7800.jpg","IMG_7808.jpg","IMG_7814.jpg","IMG_7826.jpg","IMG_7833.jpg","IMG_7836.jpg","IMG_7854.jpg"];

export const WeddingTrack: React.FC<{heroOnly?: boolean}> = ({heroOnly}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  if (heroOnly) return <HeroSequence frame={frame} fps={fps} />;
  const trackEnd = 720;
  const trackFrame = Math.min(frame, trackEnd);
  const heroFrame = Math.max(0, frame - trackEnd);
  const isHero = frame >= trackEnd;
  const maxZ = WALLS * WALL_DEPTH;
  const cameraZ = interpolate(trackFrame, [0, trackEnd], [0, maxZ], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const oasisVeil = interpolate(trackFrame, [trackEnd-96, trackEnd], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const leakP = interpolate(trackFrame, [trackEnd*0.62, trackEnd], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});

  return (
    <AbsoluteFill style={{background: COLORS.paper, fontFamily:'Instrument Sans, system-ui, sans-serif'}}>
      <AbsoluteFill
        style={{
          perspective:'1200px',
          perspectiveOrigin:'50% 52%',
          background:`radial-gradient(1100px 700px at 50% 108%, rgba(201,164,106,.08), transparent 68%), radial-gradient(900px 600px at 18% 8%, rgba(143,168,154,.07), transparent 60%), linear-gradient(to bottom, #FFFBF5 0%, #F7EFE6 100%)`,
          opacity: interpolate(frame, [trackEnd-30, trackEnd], [1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}),
          overflow:'hidden',
        }}
      >
        <div style={{position:'absolute',inset:0,opacity:0.035,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`}}/>
        <div style={{position:'absolute',left:'50%',top:'8%',bottom:'12%',width:1,transform:'translateX(-50%)',background:`linear-gradient(to bottom, transparent, ${COLORS.line} 18%, ${COLORS.line} 82%, transparent)`,opacity:0.28}}/>
        <div style={{position:'absolute',left:'50%',bottom:'8%',width:'66%',height:1,transform:'translateX(-50%)',background:`linear-gradient(to right, transparent, ${COLORS.line}, transparent)`,opacity:0.45}}/>
        <div style={{position:'absolute',inset:0,opacity:leakP*0.62,background:`radial-gradient(700px 420px at 50% -6%, rgba(201,164,106,.28), transparent 72%)`,mixBlendMode:'soft-light' as any, transform:`scale(${1+leakP*0.05})`}}/>
        <div style={{position:'absolute',inset:0,opacity:oasisVeil,background:`radial-gradient(900px 700px at 50% 52%, rgba(255,251,245,1) 0%, rgba(255,251,245,.94) 42%, rgba(255,251,245,0) 74%)`}}/>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(900px 600px at 50% 50%, transparent 58%, rgba(255,251,245,.68) 88%), linear-gradient(to bottom, #FFFBF5 0%, transparent 18%, transparent 84%, #FFFBF5 100%)',pointerEvents:'none'}}/>

        <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:`translateZ(${cameraZ}px)`}}>
          {Array.from({length:TOTAL}).map((_,i)=>{
            const wall=Math.floor(i/3); const col=i%3;
            const cardZ=-wall*WALL_DEPTH; const dist=cardZ+cameraZ;
            const entrance=interpolate(dist,[-700,-120],[0,1],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            let opacity=1;
            if(dist<-680) opacity=0;
            else if(dist<-120) opacity=entrance;
            else if(dist>420) opacity=interpolate(dist,[420,900],[1,0],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            const depthScale=interpolate(dist,[-300,900],[1,0.82],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            const xOff=(col-1)*380;
            const passProgress=interpolate(dist,[80,480],[0,1],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            const approachFlip=interpolate(dist,[-520,40],[1,0],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            const baseY=col===0?8:col===2?-8:0;
            const rotY=baseY*(1-passProgress*0.6)+approachFlip*(col===0?5:col===2?-5:0)*0.16;
            const rotX=approachFlip*1-passProgress*1.8;
            const zPush=passProgress*(col===0?-50:col===2?50:0);
            const driftX=Math.sin(i*1.7)*10;
            const isClosest=Math.abs(dist)<80;
            const springSettle=isClosest? spring({frame: Math.max(0, 30-Math.abs(dist)/6), fps, config:{damping:16, stiffness:190}}):1;
            const blur=interpolate(passProgress,[0,1],[0,5],{extrapolateLeft:'clamp', extrapolateRight:'clamp'}) + interpolate(Math.abs(dist),[620,1200],[0,1.2],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            const bright=interpolate(passProgress,[0,1],[1,0.94],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            const sat=isClosest?1:interpolate(Math.abs(dist),[0,420],[1,0.84],{extrapolateLeft:'clamp', extrapolateRight:'clamp'});
            const seed=SEEDS[i];
            const realSrc = REAL_PHOTOS[i % REAL_PHOTOS.length];
            return (
              <div key={i} style={{position:'absolute',left:'50%',top:'50%',width:360,height:460,marginLeft:-180,marginTop:-218,transform:`translate3d(${xOff+zPush+driftX*0.15}px,0,${cardZ}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${depthScale*(0.98+springSettle*0.02)})`,opacity,filter:`saturate(${sat}) brightness(${bright}) blur(${blur}px)`,background:COLORS.paper,border:`1px solid ${isClosest?'rgba(201,164,106,.38)':'rgba(233,224,211,.95)'}`,borderRadius:18,overflow:'hidden',boxShadow:isClosest?'0 32px 80px rgba(26,28,27,.14)':'0 16px 44px rgba(26,28,27,.08)',display:'flex',flexDirection:'column'}}>
                <div style={{flex:1,position:'relative',background:'#EDE6DA',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                  <Img src={staticFile(`photos/${realSrc}`)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',filter:`saturate(${sat})`}} />
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, transparent 46%, rgba(26,28,27,.08) 72%, rgba(26,28,27,.32) 100%)'}}/>
                  <div style={{position:'absolute',inset:12,border:'1px solid rgba(255,255,255,.5)',borderRadius:12,pointerEvents:'none'}}/>
                  <div style={{position:'absolute',top:14,left:14,background:'rgba(255,251,245,.92)',border:'1px solid rgba(233,224,211,.9)',borderRadius:999,padding:'6px 10px',fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,display:'flex',gap:7,alignItems:'center'}}><span style={{width:7,height:7,borderRadius:'50%',background:COLORS.sage,display:'inline-block'}}/>{String(i+1).padStart(2,'0')}</div>
                  <div style={{position:'absolute',top:14,right:14,background:'rgba(255,251,245,.86)',border:'1px solid rgba(233,224,211,.9)',borderRadius:999,padding:'6px 10px',fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600}}>{['2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'][Math.min(15,Math.floor(i/2))]}</div>
                </div>
                <div style={{background:COLORS.paper,padding:'14px 16px 15px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:`1px solid ${COLORS.line}`}}>
                  <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:13,fontWeight:500,letterSpacing:'.02em',textTransform:'uppercase'}}>{CAPTIONS[i]}<i style={{fontWeight:400,opacity:.42,letterSpacing:'.12em',fontSize:11,marginLeft:6}}>{String(i+1).padStart(2,'0')}</i></div>
                  <div style={{width:28,height:28,borderRadius:'50%',border:`1px solid ${COLORS.line}`,display:'grid',placeItems:'center',background:isClosest?COLORS.ink:COLORS.paper2,color:isClosest?COLORS.paper:COLORS.sage,fontSize:12}}>↗</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{position:'absolute',top:28,right:32,textAlign:'right',fontVariantNumeric:'tabular-nums'}}>
          <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:42,fontWeight:200,lineHeight:1}}>{String(Math.min(TOTAL, Math.max(1, Math.round(interpolate(cameraZ,[0,maxZ],[1,TOTAL],{extrapolateLeft:'clamp', extrapolateRight:'clamp'}))))).padStart(2,'0')}</div>
          <div style={{fontSize:10,letterSpacing:'.18em',textTransform:'uppercase',opacity:.42,marginTop:2}}>/ 30 — wall {String(Math.floor(Math.min(TOTAL-1, Math.max(0, Math.round(interpolate(cameraZ,[0,maxZ],[0,TOTAL-1],{extrapolateLeft:'clamp', extrapolateRight:'clamp'}))))/3)+1).padStart(2,'0')} · 10</div>
        </div>
        <div style={{position:'absolute',top:28,left:32}}>
          <div style={{fontFamily:'Cormorant Garamond, serif',fontSize:11,letterSpacing:'.22em',textTransform:'uppercase',color:COLORS.sage,fontWeight:600,display:'flex',gap:10,alignItems:'center'}}><span style={{width:22,height:1,background:COLORS.gold,opacity:.8,display:'inline-block'}}/>Act I — Thirty frames</div>
        </div>
        <div style={{position:'absolute',left:'50%',top:'16%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <span style={{fontSize:10,letterSpacing:'.28em',textTransform:'uppercase',color:'rgba(26,28,27,.55)',fontWeight:600,background:'rgba(255,251,245,.78)',border:`1px solid ${COLORS.line}`,padding:'6px 12px',borderRadius:999,backdropFilter:'blur(8px)',whiteSpace:'nowrap'}}>{trackFrame < trackEnd*0.34 ? 'A dense thicket — 30 moments, layered' : trackFrame < trackEnd*0.7 ? 'Walls of years — brush past them' : 'Light ahead — the archive opens'}</span>
          <i style={{width:1,height:18,background:'linear-gradient(to bottom, #C9A46A, transparent)',display:'block',opacity:.5}}/>
        </div>
        <div style={{position:'absolute',bottom:18,left:'50%',transform:'translateX(-50%)',background:'rgba(26,28,27,.86)',color:COLORS.paper,borderRadius:999,padding:'7px 12px 7px 10px',display:'flex',gap:8,fontSize:11,letterSpacing:'.06em',fontWeight:500,alignItems:'center'}}><span style={{width:22,height:22,borderRadius:'50%',background:COLORS.gold,display:'grid',placeItems:'center',color:COLORS.ink}}>↕</span>10 walls × 3 — hold to ride</div>
      </AbsoluteFill>

      {isHero && (
        <AbsoluteFill style={{background:COLORS.ink,color:COLORS.paper,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',opacity: interpolate(heroFrame,[0,18],[0,1],{extrapolateRight:'clamp'})}}>
          <div style={{position:'absolute',inset:0,opacity:0.20,background:'radial-gradient(700px 500px at 20% 20%, rgba(201,164,106,.5), transparent 60%), radial-gradient(600px 400px at 85% 80%, rgba(143,168,154,.45), transparent 60%)'}}/>
          <div style={{fontSize:11,letterSpacing:'.22em',textTransform:'uppercase',color:COLORS.gold,fontWeight:600,opacity: interpolate(heroFrame,[6,18],[0,1],{extrapolateRight:'clamp'}), transform:`translateY(${interpolate(heroFrame,[6,18],[10,0],{extrapolateRight:'clamp'})}px)`}}>You’ve reached the clearing</div>
          <HeroNames frame={heroFrame} fps={fps}/>
          <HugeDate frame={heroFrame} fps={fps}/>
          <div style={{marginTop:18,maxWidth:600,fontFamily:'Cormorant Garamond, serif',fontStyle:'italic',fontSize:18,lineHeight:1.6,color:'rgba(255,251,245,.74)',opacity: interpolate(heroFrame,[20,34],[0,1],{extrapolateRight:'clamp'})}}>After the tangle — light. Water. Two chairs in shade.<br/>Come sit. The story continues here.</div>
          <div style={{marginTop:36,display:'flex',gap:12,opacity: interpolate(heroFrame,[60,82],[0,0.5],{extrapolateRight:'clamp'}) as any}}><i style={{width:42,height:1,background:`linear-gradient(to right, transparent, ${COLORS.gold})`,display:'block'}}/><b style={{width:6,height:6,borderRadius:'50%',border:`1px solid ${COLORS.gold}`,transform:'rotate(45deg)',display:'block'}}/><i style={{width:42,height:1,background:`linear-gradient(to left, transparent, ${COLORS.gold})`,display:'block'}}/></div>
        </AbsoluteFill>
      )}
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'rgba(26,28,27,.06)'}}>
        <div style={{height:'100%',width:`${interpolate(frame,[0,durationInFrames],[0,100],{extrapolateLeft:'clamp', extrapolateRight:'clamp'})}%`,background:COLORS.gold}}/>
      </div>
    </AbsoluteFill>
  );
};

const HeroNames: React.FC<{frame:number;fps:number}> = ({frame,fps})=>{
  const text='Rosanne & Andrew'; const reveal=spring({frame:frame-14,fps,config:{damping:200}});
  return <div style={{marginTop:10,fontFamily:'Great Vibes, cursive',fontSize:96,lineHeight:1.22,opacity:reveal,transform:`translateY(${interpolate(reveal,[0,1],[18,0],{extrapolateRight:'clamp'})}px)`,display:'flex',gap:0,justifyContent:'center',flexWrap:'wrap'}}>
    {Array.from(text).map((ch,i)=>{
      if(ch===' ') return <span key={i} style={{width:22}}/>;
      const p=spring({frame:frame-14-i*1.1,fps,config:{damping:16, stiffness:190}});
      const y=interpolate(p,[0,1],[110,0],{extrapolateRight:'clamp'}); const o=interpolate(p,[0,1],[0,1],{extrapolateRight:'clamp'});
      return <span key={i} style={{display:'inline-block',overflow:'hidden',padding:'0.14em 0.04em',margin:'-0.14em -0.04em'}}><span style={{display:'inline-block',transform:`translateY(${y}%)`,opacity:o,color: ch==='&'?COLORS.gold:COLORS.paper}}>{ch}</span></span>
    })}
  </div>
};
const HugeDate: React.FC<{frame:number;fps:number}> = ({frame,fps})=>{
  const reveal=spring({frame:frame-22,fps,config:{damping:200}}); const date='04.07.2026';
  return <div style={{marginTop:10,fontFamily:'Cormorant Garamond, serif',fontWeight:300,letterSpacing:'-.05em',lineHeight:0.85,fontSize:132,color:COLORS.paper,display:'flex',flexDirection:'column',alignItems:'center',opacity:reveal,transform:`translateY(${interpolate(reveal,[0,1],[18,0],{extrapolateRight:'clamp'})}px) scale(${interpolate(reveal,[0,1],[0.97,1],{extrapolateRight:'clamp'})})`}}>
    <div style={{display:'flex',gap:'.10em',alignItems:'baseline'}}>{Array.from(date).map((ch,i)=> ch==='.'? <span key={i} style={{color:COLORS.gold}}>.</span> : (()=>{const p=spring({frame:frame-22-i*1.1,fps,config:{damping:16, stiffness:190}}); const y=interpolate(p,[0,1],[80,0],{extrapolateRight:'clamp'}); const o=interpolate(p,[0,1],[0,1],{extrapolateRight:'clamp'}); return <span key={i} style={{display:'inline-block',overflow:'hidden',padding:'0.1em 0',margin:'-0.1em 0'}}><span style={{display:'inline-block',transform:`translateY(${y}%)`,opacity:o}}>{ch}</span></span>})() )}</div>
    <div style={{fontFamily:'Instrument Sans, sans-serif',fontSize:11,letterSpacing:'.28em',textTransform:'uppercase',opacity:0.55,marginTop:16,fontWeight:500 as any}}>July 4th — San Ignacio, Belize · 2:00 PM</div>
  </div>
};
const HeroSequence: React.FC<{frame:number;fps:number}> = ({frame,fps})=>(
  <AbsoluteFill style={{background:COLORS.ink,color:COLORS.paper,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
    <HeroNames frame={frame} fps={fps}/>
    <div style={{position:'absolute',top:80,left:'50%',transform:'translateX(-50%)',fontSize:11,letterSpacing:'.22em',textTransform:'uppercase',color:COLORS.gold}}>You are invited</div>
    <div style={{position:'absolute',bottom:80}}><HugeDate frame={frame} fps={fps}/></div>
  </AbsoluteFill>
);
