import {chapters, tracks, references} from '../data/course';
import waveform from '../data/waveform.json';
import {learningAssets} from '../data/learningAssets';

const audio = document.querySelector<HTMLAudioElement>('#course-audio')!;
const playButton = document.querySelector<HTMLButtonElement>('#play')!;
const waveformRange = document.querySelector<HTMLInputElement>('#wave-seek')!;
const waveBars = document.querySelector<HTMLElement>('#wave-bars')!;
const title = document.querySelector<HTMLElement>('#now-title')!;
const subtitle = document.querySelector<HTMLElement>('#now-subtitle')!;
const elapsed = document.querySelector<HTMLElement>('#elapsed')!;
const duration = document.querySelector<HTMLElement>('#duration')!;
const fileLabel = document.querySelector<HTMLElement>('#recording-label')!;
const followButton = document.querySelector<HTMLButtonElement>('#follow')!;
const resourceHeading = document.querySelector<HTMLElement>('#resources-heading')!;
const resourceSubheading = document.querySelector<HTMLElement>('#resources-subheading')!;
const resourceCount = document.querySelector<HTMLElement>('#resource-count')!;
const resourceCards = document.querySelector<HTMLElement>('#resource-cards')!;
const progress = document.querySelector<HTMLElement>('#course-progress')!;
const progressLabel = document.querySelector<HTMLElement>('#progress-label')!;
const base = document.documentElement.dataset.assetBase || '/';
let currentTrack = 0;
let activeChapter = chapters[0].id;
let follow = true;
let pendingSeek: {time:number; play:boolean} | null = null;
let suppressNextScroll = false;
const narrationPanel = document.querySelector<HTMLElement>('#nav-panel')!;
const narrationScroll = narrationPanel.querySelector<HTMLElement>('.chapter-scroll')!;
const mobileToolbar = document.querySelector<HTMLElement>('.mobile-actions');
// The welcome-card action is the intentional first step. Merely navigating
// among chapters or seeking the waveform must not start narration beforehand.
const prereqKey = 'cip-course-prerequisites-visited-from-welcome';
const prereqHint = document.querySelector<HTMLElement>('#player-prereq-message');
const resourcesAudio = document.querySelector<HTMLButtonElement>('#resource-audio-toggle');
let narrationUnlocked = false;
function storedPrereqVisit(): boolean {
  try { return localStorage.getItem(prereqKey) === '1' || sessionStorage.getItem(prereqKey) === '1'; }
  catch { return false; }
}
function updateNarrationGate() {
  narrationUnlocked = narrationUnlocked || storedPrereqVisit();
  playButton.disabled = !narrationUnlocked;
  waveformRange.disabled = !narrationUnlocked;
  if (resourcesAudio) resourcesAudio.disabled = !narrationUnlocked;
  if (prereqHint) prereqHint.hidden = narrationUnlocked;
  if (!narrationUnlocked && !audio.paused) audio.pause();
  setButtons();
}
// Only the welcome card's named action unlocks main-course narration.
document.querySelectorAll<HTMLAnchorElement>('[data-prereq-entry]').forEach(link => {
  link.addEventListener('click', () => {
    narrationUnlocked = true;
    try { localStorage.setItem(prereqKey, '1'); } catch {}
    try { sessionStorage.setItem(prereqKey, '1'); } catch {}
    updateNarrationGate();
  });
});
// Refresh after the browser's back/forward cache restores the course.
window.addEventListener('pageshow', updateNarrationGate);


// Align chapter cards to the sticky narration panel, not two stacked CSS offsets.
// On small screens the mobile toolbar occupies that position instead.
function chapterViewportTop(): number {
  if (window.matchMedia('(max-width: 1000px)').matches) {
    return (mobileToolbar?.getBoundingClientRect().bottom ?? 66) + 12;
  }
  return narrationPanel.getBoundingClientRect().top;
}
function alignChapterCard(section: HTMLElement) {
  const top = section.getBoundingClientRect().top + window.scrollY - chapterViewportTop();
  // Force precise position even when html uses smooth scrolling for ordinary anchors.
  window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: 'instant' });
}
function keepCurrentChapterVisible(id: string) {
  // Never use element.scrollIntoView here: it also scrolls the document and
  // can undo the center column's alignment when the sidebar scrolls.
  const selected = [...narrationScroll.querySelectorAll<HTMLButtonElement>('[data-seek-chapter]')]
    .find(el => el.dataset.seekChapter === id);
  if (!selected || (window.matchMedia('(max-width: 1000px)').matches && !narrationPanel.classList.contains('mobile-open'))) return;
  const viewport = narrationScroll.getBoundingClientRect();
  const item = selected.getBoundingClientRect();
  const safeTop = viewport.top + 16;
  const safeBottom = viewport.bottom - 26;
  if (item.top < safeTop) {
    narrationScroll.scrollTop -= safeTop - item.top;
  } else if (item.bottom > safeBottom) {
    narrationScroll.scrollTop += item.bottom - safeBottom;
  }
}
const clock=(time:number)=>`${String(Math.floor(time/60)).padStart(2,'0')}:${String(Math.floor(time%60)).padStart(2,'0')}`;
function paintWaveform(){
  const values=waveform[currentTrack];
  waveBars.replaceChildren(...values.map((v,i)=>{
    const bar=document.createElement('span'); bar.className='wave-bar'; bar.dataset.bar=String(i);
    bar.style.setProperty('--a',String(v)); return bar;
  }));
  waveformRange.max=String(tracks[currentTrack].length);
  duration.textContent=clock(tracks[currentTrack].length);
  fileLabel.textContent=`FILE ${String(currentTrack+1).padStart(2,'0')} / ${String(tracks.length).padStart(2,'0')}`;
}
function paintTime(){
  const t=Number.isFinite(audio.currentTime)?audio.currentTime:0;
  elapsed.textContent=clock(t);
  waveformRange.value=String(t);
  const frac=t/tracks[currentTrack].length;
  for(const bar of waveBars.children){
    const element=bar as HTMLElement;
    const pos=(Number(element.dataset.bar||0)+.5)/waveBars.children.length;
    element.classList.toggle('heard',pos<frac);
    element.classList.toggle('current',Math.abs(pos-frac)<.01);
  }
  let chosen=chapters.find(c=>c.track===currentTrack)!;
  for(const chapter of chapters){
    if(chapter.track===currentTrack&&chapter.at<=t+.04) chosen=chapter;
  }
  if(chosen.id!==activeChapter) activate(chosen.id,true);
  renderHighlights(chosen.id,t);
  renderResources(chosen,t);
}
function renderHighlights(id:string,t:number){
  const chapter=chapters.find(c=>c.id===id)!;
  const active=(!audio.paused&&!audio.ended)?chapter.cues?.find(c=>t>=c.from&&t<c.to):undefined;
  document.querySelectorAll<HTMLElement>('[data-emphasis].lit').forEach(el=>el.classList.remove('lit'));
  if(active) document.querySelector<HTMLElement>(`[data-chapter="${id}"] [data-emphasis="${active.target}"]`)?.classList.add('lit');
}
function setButtons(){
  playButton.setAttribute('aria-label',!narrationUnlocked?'First check course prerequisites to unlock narration':audio.paused?'Play audio':'Pause audio');
  playButton.setAttribute('aria-pressed',String(!audio.paused));
  playButton.dataset.state=audio.paused?'play':'pause';
  const resourceAudioButton=document.querySelector<HTMLButtonElement>('#resource-audio-toggle');
  if(resourceAudioButton)resourceAudioButton.textContent=!narrationUnlocked?'Check prerequisites to unlock audio':audio.paused?'▶ Resume narration':'Pause & explore';
  if(audio.paused) document.querySelectorAll('[data-emphasis].lit').forEach(el=>el.classList.remove('lit'));
}
function safePlay(){if(!narrationUnlocked){audio.pause();updateNarrationGate();return;}void audio.play().catch(()=>{setButtons()});}
function setTrack(index:number,time:number,play=true){
  if(currentTrack===index){
    if(audio.readyState>=1) {audio.currentTime=Math.min(time,tracks[currentTrack].length-.01);paintTime();}
    else pendingSeek={time,play};
    if(play && audio.readyState>=1) safePlay();
    return;
  }
  currentTrack=index;
  pendingSeek={time,play};
  audio.src=`${base}audio/${tracks[index].file}`;
  audio.load();
  paintWaveform();
  elapsed.textContent=clock(time);
}
function activate(id:string, fromAudio=false, shouldScroll=true){
  const chapter=chapters.find(c=>c.id===id);
  if(!chapter)return;
  activeChapter=id;
  title.textContent=chapter.title;
  subtitle.textContent=chapter.subtitle;
  document.querySelectorAll<HTMLButtonElement>('[data-seek-chapter]').forEach(button=>{
    const selected=button.dataset.seekChapter===id;
    button.classList.toggle('selected',selected);
    if(selected)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
  });
  document.querySelectorAll<HTMLElement>('.lesson-beat').forEach(el=>el.classList.toggle('current-beat',el.dataset.chapter===id));
  document.querySelectorAll<HTMLButtonElement>('[data-module-jump]').forEach(el=>el.classList.toggle('chosen',el.dataset.moduleJump===String(chapter.module)));
  renderResources(chapter,chapter.at);
  keepCurrentChapterVisible(id);
  const chapterIndex=chapters.findIndex(c=>c.id===id);
  progress.style.width=`${(chapterIndex+1)/chapters.length*100}%`;
  progressLabel.textContent=`${String(chapterIndex+1).padStart(2,'0')} / ${chapters.length} SECTIONS`;
  if(shouldScroll && (!fromAudio || follow)){
    const section=document.getElementById(id);
    if(section){
      suppressNextScroll=true;
      alignChapterCard(section);
      window.setTimeout(()=>suppressNextScroll=false,350);
    }
  }
  if(!fromAudio)renderHighlights(id,chapters[chapterIndex].at);
}
let lastResourceSignature = '';
function renderResources(chapter:typeof chapters[number], time=chapter.at){
  const guide=learningAssets[chapter.id];
  if(!guide)return;
  const showVideo=chapter.id==='m2-shared-state'||chapter.id==='m2-replicas';
  const cuePassed=chapter.id==='m2-shared-state' && time>=177;
  const sourceKeys=chapter.resources.filter(key=>key!=='shared-state-animation');
  const signature=`${chapter.id}|${showVideo}|${cuePassed}`;
  if(signature===lastResourceSignature)return;
  lastResourceSignature=signature;
  const put=(id:string,value:string)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  const labDownload = document.querySelector<HTMLAnchorElement>('#download-lab');
  if(labDownload)labDownload.hidden=chapter.module!==1;
  const module2LabDownload = document.querySelector<HTMLAnchorElement>('#download-module2-lab');
  if(module2LabDownload)module2LabDownload.hidden=chapter.module!==2;
  resourceHeading.textContent=chapter.title;
  resourceSubheading.textContent=chapter.subtitle;
  put('resource-lesson-code',chapter.lesson);
  put('resource-focus',guide.question);
  put('resource-explore',guide.explore);
  put('resource-observe',guide.observe);
  put('resource-confusion',guide.confusion);
  put('resource-recover',guide.recover);
  const feature=document.querySelector<HTMLElement>('#resource-video')!;
  feature.hidden=!showVideo;
  feature.classList.toggle('resource-video-cue',cuePassed);
  put('resource-video-now',cuePassed?'IN NARRATION · PLAY ANYTIME':'14 SEC · PLAY ANYTIME');
  // One chapter-specific field reference plus, at most, one selected framework reference.
  // No bulk re-cycling of a fixed documentation set.
  const choices = chapter.module===3
    ? sourceKeys.map(key=>references[key]).filter(Boolean).map(ref=>({title:ref.title,detail:ref.detail,url:ref.url,label:ref.label}))
    : [{title:guide.referenceLabel,detail:'Selected for '+chapter.lesson+' · official or project reference',url:guide.reference,label:'RELEVANT REFERENCE'}];
  if(chapter.module!==3){
    const supplement=sourceKeys.map(k=>references[k]).find(r=>r&&r.url!==guide.reference);
    if(supplement)choices.push({title:supplement.title,detail:supplement.detail,url:supplement.url,label:'OPTIONAL DEEP DIVE'});
  }
  resourceCount.textContent=String(choices.length).padStart(2,'0');
  resourceCards.replaceChildren(...choices.map(resource=>{
    const link=document.createElement('a');link.className='resource-card';
    link.href=/^https?:\/\//.test(resource.url)?resource.url:`${base}${resource.url}`;
    link.target='_blank';link.rel='noopener noreferrer';
    const content=document.createElement('span');
    const label=document.createElement('small');label.textContent=resource.label;
    const h=document.createElement('b');h.textContent=resource.title;
    const desc=document.createElement('em');desc.textContent=resource.detail;
    content.append(label,h,desc);
    const arrow=document.createElement('span');arrow.className='resource-arrow';arrow.textContent='↗';
    link.append(content,arrow);return link;
  }));
}
// Exploring the lesson video should not leave two audio tracks playing at once.
document.querySelectorAll<HTMLVideoElement>('video').forEach(video=>video.addEventListener('play',()=>{
  audio.pause();
  document.querySelectorAll<HTMLVideoElement>('video').forEach(other=>{if(other!==video)other.pause();});
}));

function jumpTo(id:string){
  const ch=chapters.find(c=>c.id===id);if(!ch)return;
  activate(id,false);setTrack(ch.track,ch.at,narrationUnlocked);closeMobilePanels();
}
function closeMobilePanels(){
  document.querySelectorAll<HTMLElement>('.mobile-open').forEach(el=>el.classList.remove('mobile-open'));
  document.querySelectorAll<HTMLButtonElement>('[data-mobile]').forEach(el=>el.setAttribute('aria-expanded','false'));
}
document.querySelector<HTMLButtonElement>('#resource-audio-toggle')?.addEventListener('click',()=>audio.paused?safePlay():audio.pause());
playButton.addEventListener('click',()=>{
  if(!narrationUnlocked)return;
  if (audio.paused) {
    if (follow) activate(activeChapter,true,true);
    safePlay();
  } else audio.pause();
});
// Setup CTAs move the learner to the next chapter without starting narration unexpectedly.
// If narration is already playing, keep it synchronized with the destination chapter.
document.querySelectorAll<HTMLButtonElement>('[data-flow-jump]').forEach(button=>{
  button.addEventListener('click',()=>{
    const chapter=chapters.find(c=>c.id===button.dataset.flowJump);
    if(!chapter)return;
    const continueNarration=!audio.paused;
    if(continueNarration) audio.pause();
    activate(chapter.id,false,true);
    setTrack(chapter.track,chapter.at,continueNarration);
    closeMobilePanels();
  });
});
document.querySelector<HTMLButtonElement>('#hero-play')?.addEventListener('click',()=>jumpTo('baseline'));
document.querySelectorAll<HTMLButtonElement>('[data-seek-chapter]').forEach(el=>el.addEventListener('click',()=>jumpTo(el.dataset.seekChapter!)));
document.querySelectorAll<HTMLButtonElement>('[data-module-jump]').forEach(el=>el.addEventListener('click',()=>jumpTo(el.dataset.moduleJump==='0'?'baseline':el.dataset.moduleJump==='1'?'m1-opening':el.dataset.moduleJump==='2'?'m2-opening':'m3-0')));
document.querySelectorAll<HTMLButtonElement>('[data-next-chapter]').forEach(el=>el.addEventListener('click',()=>{
  const index=chapters.findIndex(c=>c.id===el.dataset.nextChapter);
  if(index<chapters.length-1)jumpTo(chapters[index+1].id);
}));
waveformRange.addEventListener('input',()=>{
  if(!narrationUnlocked)return;
  if(audio.readyState>=1){audio.currentTime=Number(waveformRange.value);paintTime();}
});
waveformRange.addEventListener('change',()=>{
  if(!narrationUnlocked)return;
  // An explicit seek navigates even if it lands within the current chapter.
  activate(activeChapter,false,true);
  safePlay();
});
audio.addEventListener('loadedmetadata',()=>{
  if(pendingSeek){const next=pendingSeek;pendingSeek=null;audio.currentTime=Math.min(next.time,Math.max(0,audio.duration-.01));paintTime();if(next.play)safePlay();}
  duration.textContent=clock(Number.isFinite(audio.duration)?audio.duration:tracks[currentTrack].length);
});
audio.addEventListener('timeupdate',paintTime);
audio.addEventListener('play',()=>{if(!narrationUnlocked){audio.pause();return;}setButtons();});
audio.addEventListener('pause',setButtons);
audio.addEventListener('ended',()=>{
  setButtons();if(currentTrack<tracks.length-1){
    const next=chapters.find(c=>c.track===currentTrack+1)!;
    activate(next.id,true);setTrack(currentTrack+1,0,true);
  }
});
const rates=[1,1.15,1.3,.85];let rateIndex=0;
document.querySelector<HTMLButtonElement>('#speed')?.addEventListener('click',e=>{
  rateIndex=(rateIndex+1)%rates.length;
  audio.playbackRate=rates[rateIndex];
  (e.currentTarget as HTMLElement).textContent=`${rates[rateIndex].toFixed(2).replace(/0$/,'')}×`;
});
followButton.addEventListener('click',()=>{follow=!follow;followButton.setAttribute('aria-pressed',String(follow));});
// When paused, deliberate reading/scrolling can update the reference panel
// without moving the audio playhead or concealing any lesson content.
const observer=new IntersectionObserver(entries=>{
  if(suppressNextScroll||(!audio.paused&&follow))return;
  const candidates=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(candidates.length){
    const id=(candidates[0].target as HTMLElement).dataset.chapter;
    if(id&&id!==activeChapter)activate(id,true,false);
  }
},{threshold:[0.2,.45,.7],rootMargin:'-20% 0px -48% 0px'});
document.querySelectorAll<HTMLElement>('[data-chapter]').forEach(el=>observer.observe(el));
// Minimal client persistence; checkpoints are never marked complete automatically.
const checks=[...document.querySelectorAll<HTMLInputElement>('[data-check]')];
const checkCount=document.querySelector<HTMLElement>('#check-progress');
function updateChecks(){
  checkCount!.textContent=`${checks.filter(c=>c.checked).length} / ${checks.length} COMPLETE`;
  try{localStorage.setItem('containers-in-practice-checkpoint0',JSON.stringify(checks.map(c=>({id:c.dataset.check,checked:c.checked}))))}catch{}
}
try{const stored=JSON.parse(localStorage.getItem('containers-in-practice-checkpoint0')||'[]');if(Array.isArray(stored))checks.forEach(c=>{c.checked=stored.some(x=>x.id===c.dataset.check&&x.checked);});}catch{}
if(checkCount)checkCount.textContent=`${checks.filter(c=>c.checked).length} / ${checks.length} COMPLETE`;
checks.forEach(el=>el.addEventListener('change',updateChecks));
// Accessible platform tabs and code-copy controls.
const tabs=[...document.querySelectorAll<HTMLButtonElement>('[data-platform]')];
function choosePlatform(platform:string){
  tabs.forEach(tab=>{const selected=tab.dataset.platform===platform;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  document.querySelectorAll<HTMLElement>('[data-platform-panel]').forEach(panel=>panel.hidden=panel.dataset.platformPanel!==platform);
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>choosePlatform(tab.dataset.platform!));
  tab.addEventListener('keydown',(event:KeyboardEvent)=>{
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();const direction=event.key==='ArrowRight'?1:-1;
    const next=tabs[(index+direction+tabs.length)%tabs.length];choosePlatform(next.dataset.platform!);next.focus();
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-copy-code]').forEach(button=>button.addEventListener('click',async()=>{
  const code=button.closest('.code-card')?.querySelector('code')?.textContent?.trim();if(!code)return;
  try{await navigator.clipboard.writeText(code);button.textContent='Copied ✓';window.setTimeout(()=>button.textContent='Copy ↗',1600);}catch{button.textContent='Select to copy';}
}));
document.querySelectorAll<HTMLButtonElement>('[data-mobile]').forEach(button=>button.addEventListener('click',()=>{
  const panel=document.getElementById(button.dataset.mobile==='nav'?'nav-panel':'resources-panel')!;
  const showing=panel.classList.contains('mobile-open');closeMobilePanels();if(!showing){panel.classList.add('mobile-open');button.setAttribute('aria-expanded','true');}
}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMobilePanels()});
paintWaveform();renderResources(chapters[0]);updateNarrationGate();
