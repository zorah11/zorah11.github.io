"use strict";
(() => {
  const {countries, journeys, demo} = window.PAMOJA;
  const byId = id => journeys.find(journey => journey.id === id);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const params = new URLSearchParams(window.location.search);
  const unavailableStorage = {getItem() {return null;},setItem() {throw new Error('Storage unavailable');}};
  let localStorage,sessionStorage;
  try {localStorage=window.localStorage;} catch {localStorage=unavailableStorage;}
  try {sessionStorage=window.sessionStorage;} catch {sessionStorage=unavailableStorage;}
  const keys = {saved:'pamoja.saved.v1',session:'pamoja.demo.v1',briefs:'pamoja.briefs.v1',checklist:'pamoja.checklist.v1'};
  function read(store, key, fallback) {
    try { return JSON.parse(store.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function write(store, key, value) {
    try { store.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  }
  const rawSaved = read(localStorage, keys.saved, []);
  const saved = new Set((Array.isArray(rawSaved) ? rawSaved : []).filter(id => byId(id)));
  const signedIn = read(sessionStorage, keys.session, false) === true;
  let toastTimer;
  function toast(message) {
    const target = document.querySelector('#toast');
    target.textContent = message;
    target.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => target.classList.remove('is-visible'), 3300);
  }

  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('#main-nav');
  function closeMenu() {
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Open navigation');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (!nav.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeMenu(); menuButton.focus(); }
    if (event.key === 'Tab') {
      const links = [menuButton, ...nav.querySelectorAll('a')];
      const index = links.indexOf(document.activeElement);
      event.preventDefault();
      links[(index + (event.shiftKey ? -1 : 1) + links.length) % links.length].focus();
    }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.querySelectorAll('[data-account-link]').forEach(link => {
    link.href = signedIn ? 'account.html' : 'login.html';
    link.setAttribute('aria-label', signedIn ? 'My journey' : 'Demo sign in');
    link.querySelector('[data-account-label]').textContent = signedIn ? 'My journey' : 'Sign in';
  });
  document.querySelectorAll('[data-year]').forEach(element => element.textContent = new Date().getFullYear());
  const privacy = document.querySelector('.privacy-button');
  privacy.addEventListener('click', () => {
    const open = privacy.getAttribute('aria-expanded') !== 'true';
    privacy.setAttribute('aria-expanded', String(open));
    document.querySelector('#privacy').hidden = !open;
  });

  const heart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  function card(journey) {
    const j = Object.fromEntries(Object.entries(journey).filter(([key]) => !['stops','includes'].includes(key)).map(([key,value]) => [key,escape(value)]));
    return `<article class="journey-card"><div class="journey-image"><a href="journey.html?id=${j.id}" aria-label="Explore ${j.name}"><img src="assets/${j.image}.webp" alt="${j.line}" width="1536" height="1024" loading="lazy"></a><button class="save-button" type="button" data-save="${j.id}" aria-label="Save ${j.name}" aria-pressed="false">${heart}</button><span class="image-label">${j.countryName}</span></div><div class="journey-meta"><span>${j.days} days · Sample itinerary</span><span>${j.kind.replace('-',' ')}</span></div><h3><a href="journey.html?id=${j.id}">${j.name}</a></h3><p>${j.line}</p><a class="underlink" href="journey.html?id=${j.id}">Explore this journey</a></article>`;
  }
  function updateSaveButtons() {
    document.querySelectorAll('[data-save]').forEach(button => {
      const journey = byId(button.dataset.save);
      if (!journey) return;
      const active = saved.has(journey.id);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', active ? `Remove ${journey.name} from saved journeys` : `Save ${journey.name}`);
      if (!button.classList.contains('save-button')) button.textContent=active ? 'Saved to My journey' : 'Save this journey';
    });
  }
  function renderSaved() {
    const container = document.querySelector('#saved-journeys');
    if (!container) return;
    container.innerHTML = journeys.filter(journey => saved.has(journey.id)).map(card).join('');
    document.querySelector('#saved-empty').hidden = saved.size > 0;
    updateSaveButtons();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-save]');
    if (!button || !byId(button.dataset.save)) return;
    const id = button.dataset.save;
    const added = !saved.has(id);
    if (added) saved.add(id); else saved.delete(id);
    const persisted = write(localStorage, keys.saved, [...saved]);
    renderSaved();
    updateSaveButtons();
    toast(persisted ? (added ? 'Saved to My journey. Keep exploring.' : 'Removed from your saved journeys.') : 'Browser storage is unavailable. This change lasts on this page only.');
  });

  const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
  const validTravellers = value => /^\d+$/.test(value || '') && Number(value) >= 1 && Number(value) <= 100;
  function carrySearchChoices() {
    document.querySelectorAll('a[href^="journey.html"],a[href^="plan.html"]').forEach(link => {
      const url = new URL(link.getAttribute('href'), window.location.href);
      if (validDate(params.get('date'))) url.searchParams.set('date', params.get('date'));
      if (validTravellers(params.get('travellers'))) url.searchParams.set('travellers', params.get('travellers'));
      link.setAttribute('href', url.pathname.split('/').pop() + (url.search || ''));
    });
  }
  const search = document.querySelector('#trip-search');
  if (search) search.addEventListener('submit', event => {
    event.preventDefault();
    if (!search.reportValidity()) return;
    const data = new FormData(search);
    const query = new URLSearchParams({country:data.get('country'), travellers:data.get('travellers')});
    if (validDate(data.get('date'))) query.set('date', data.get('date'));
    window.location.assign('journeys.html?' + query.toString());
  });

  const filters = document.querySelector('#journey-filters');
  if (filters) {
    const country = document.querySelector('#filter-country');
    const query = document.querySelector('#filter-search');
    const tabs = [...document.querySelectorAll('.filter-tabs [data-kind]')];
    let kind = 'all';
    if (tabs.some(tab => tab.dataset.kind === params.get('kind'))) kind=params.get('kind');
    if ([...country.options].some(option => option.value === params.get('country'))) country.value = params.get('country');
    function filterJourneys() {
      let count = 0;
      const text = query.value.toLowerCase().trim();
      document.querySelectorAll('#journey-results .journey-card').forEach(element => {
        const match = (country.value === 'all' || element.dataset.country === country.value) && (kind === 'all' || element.dataset.kind === kind) && element.textContent.toLowerCase().includes(text);
        element.hidden = !match;
        if (match) count++;
      });
      document.querySelector('#no-journeys').hidden = count !== 0;
      document.querySelector('#results-count').textContent = count === 1 ? '1 journey to inspire you' : `${count} journeys to inspire you`;
      tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.kind === kind)));
    }
    tabs.forEach(tab => tab.addEventListener('click', () => { kind = tab.dataset.kind; filterJourneys(); }));
    country.addEventListener('change', filterJourneys);
    query.addEventListener('input', filterJourneys);
    function clearFilters() { country.value='all'; query.value=''; kind='all'; filterJourneys(); }
    filters.addEventListener('reset', event => { event.preventDefault(); clearFilters(); });
    filters.addEventListener('submit', event => { event.preventDefault(); filterJourneys(); });
    document.querySelector('#clear-filters').addEventListener('click', clearFilters);
    filterJourneys();
  }

  const detail = document.querySelector('#journey-detail');
  if (detail) {
    const journey = byId(params.get('id') || 'nairobi-mara');
    if (!journey) {
      detail.innerHTML = '<div class="empty-state"><h1>There’s another trail waiting.</h1><p>We couldn’t find that journey. Explore the collection to choose a new starting point.</p><a class="button" href="journeys.html">Browse journeys</a></div>';
    } else {
      document.title = journey.name + ' | Pamoja Trails';
      const dayNotes = {
        'kampala-nile':['Settle into your preferred accommodation and leave the rest of the day flexible around your arrival.','Build a day around Jinja and the Nile, with local sightseeing and a pace that suits your group.','Keep the day open for city exploring or confirmed match plans, then discuss your onward arrangements.'],
        'murchison-slow':['Plan your arrival in Hoima and accommodation around your independently confirmed match arrangements.','Leave time for your confirmed match plans and a transfer request suited to your group. Match tickets and stadium access are arranged separately.','Add a guided Murchison Falls wildlife extension to your travel enquiry, with activities confirmed by an operator.','Leave a comfortable travel window for your return and onward football or city plans.'],
        'nairobi-mara':['Arrive, settle in and add a city experience if you’d like an easy first day.','Travel towards the Mara with a driver request and your preferred style of safari stay.','Make wildlife viewing the focus, with time to pause and take in the landscape.','Leave room for another guided outing or a quieter morning at your accommodation.','Return with a comfortable margin before onward travel or any confirmed football plans.'],
        'serengeti-days':['Use Arusha as a starting point for an arrival transfer and your safari travel arrangements.','Discuss the route into the safari landscape and the style of accommodation you prefer.','Make space for a guided wildlife day at a pace that suits you.','Add another outing or time to enjoy the setting around your stay.','Shape your return around your next destination, allowing time for the journey.'],
        'matchday-wild':['Choose a base country and request arrival transfers that suit your group.','Get to know your city base and settle into your preferred accommodation.','Keep the day flexible around confirmed fixtures and independently arranged match tickets.','Begin the safari or sightseeing chapter that fits your route.','Spend a day with a guide, with experiences chosen around your interests.','Return to your city base and leave time to rest between travel days.','Plan departure transfers or leave room for a longer stay.'],
        'safari-stay':['Settle into the accommodation style you’ve chosen and enjoy a slower first evening.','Choose a guided day out or keep a little time free to enjoy the setting.','Begin the day gently, then arrange a transfer towards your next stop.']
      };
      const query = new URLSearchParams({journey:journey.id,country:journey.country});
      detail.innerHTML = `<div class="detail-heading"><div><p class="eyebrow">${escape(journey.countryName.toUpperCase())} · ${journey.days} DAYS · SAMPLE ITINERARY</p><h1>${escape(journey.name)}</h1></div><div><p>${escape(journey.overview)}</p><button class="underlink" type="button" data-save="${journey.id}" aria-pressed="false">Save this journey</button></div></div><figure class="travel-print itinerary-print"><img class="detail-hero" src="assets/${journey.image}.webp" alt="${escape(journey.line)}" width="1536" height="1024" fetchpriority="high"><figcaption>${escape(journey.name)} · ${escape(journey.countryName)}</figcaption></figure><div class="detail-content"><div><p class="eyebrow">THE SHAPE OF YOUR DAYS</p><h2>A little room<br><em>for discovery.</em></h2><div class="itinerary">${journey.stops.map((stop,index) => `<details ${index===0?'open':''}><summary>Day ${index+1} · ${escape(stop)}</summary><p>${escape(dayNotes[journey.id][index])}</p></details>`).join('')}</div></div><aside class="detail-aside"><p class="eyebrow">MAKE IT YOURS</p><h3>Bring the details together.</h3><ul>${journey.includes.map(item=>`<li>${escape(item)}</li>`).join('')}</ul><p class="small-note">This is a sample route. Final activities, prices and arrangements need confirmation with a travel operator. Match tickets aren’t included.</p><a class="button" href="plan.html?${escape(query.toString())}">Plan this journey</a></aside></div>`;
    }
  }

  const checklist = document.querySelectorAll('[data-checklist]');
  if (checklist.length) {
    const values = read(localStorage, keys.checklist, {});
    checklist.forEach(input => {
      input.checked = values && values[input.dataset.checklist] === true;
      input.addEventListener('change', () => {
        const state = Object.fromEntries([...checklist].map(item => [item.dataset.checklist, item.checked]));
        if (!write(localStorage, keys.checklist, state)) toast('This browser can’t keep the checklist after you leave.');
      });
    });
  }

  const planner = document.querySelector('#plan-form');
  if (planner) {
    const country = document.querySelector('#plan-country');
    const journey = document.querySelector('#plan-journey');
    const name = document.querySelector('#traveller-name');
    const start = document.querySelector('#start-date');
    const end = document.querySelector('#end-date');
    const travellers = document.querySelector('#traveller-count');
    const style = document.querySelector('#travel-style');
    const venue = document.querySelector('#match-venue');
    const review = document.querySelector('#brief-review');
    const status = document.querySelector('#plan-status');
    const save = document.querySelector('#save-brief');
    const download = document.querySelector('#download-brief');
    let reviewed = null;
    let downloadUrl = null;
    if (signedIn) name.value = demo.name;
    if (byId(params.get('journey'))) {
      journey.value = params.get('journey');
      country.value = byId(journey.value).country;
    }
    if ([...country.options].some(option=>option.value===params.get('country'))) country.value=params.get('country');
    if (validDate(params.get('date'))) start.value=params.get('date');
    if (validTravellers(params.get('travellers'))) travellers.value=params.get('travellers');
    if (params.get('interest')==='football') style.value='Football & city exploring';
    const requestedVenue=window.PAMOJA.venues?.find(item=>item.id===params.get('venue'));
    if (venue && requestedVenue) {venue.value=requestedVenue.id;country.value=requestedVenue.country;style.value='Football & city exploring';}
    const service = [...planner.querySelectorAll('[name="services"]')].find(input=>input.value===params.get('service'));
    if (service) service.checked = true;
    function summary() {
      document.querySelector('#summary-country').textContent = country.value === 'east-africa' ? 'East Africa' : countries.find(item=>item.id===country.value).name;
      document.querySelector('#summary-journey').textContent = byId(journey.value)?.name || 'Made for you';
      document.querySelector('#summary-travellers').textContent = travellers.value + (travellers.value === '1' ? ' explorer' : ' explorers');
      end.min = start.value;
    }
    function invalidateReview() {
      reviewed = null;
      review.hidden = true;
      save.disabled = false;
      save.textContent = 'Save demo enquiry';
      if (downloadUrl && window.URL.revokeObjectURL) window.URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
      download.removeAttribute('href');
      status.textContent = 'You can explore and plan without signing in.';
      summary();
    }
    planner.addEventListener('input', invalidateReview);
    planner.addEventListener('change', invalidateReview);
    journey.addEventListener('change', () => {
      const selected = byId(journey.value);
      if (selected) country.value = selected.country;
      summary();
    });
    venue?.addEventListener('change',()=>{
      const selected=window.PAMOJA.venues?.find(item=>item.id===venue.value);
      if (selected) {country.value=selected.country;style.value='Football & city exploring';summary();}
    });
    name.addEventListener('input', () => name.setCustomValidity(''));
    [start,end].forEach(input => input.addEventListener('input', () => end.setCustomValidity('')));
    planner.addEventListener('submit', event => {
      event.preventDefault();
      name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
      end.setCustomValidity(start.value && end.value && end.value < start.value ? 'Choose an end date on or after your start date.' : '');
      if (!planner.reportValidity()) return;
      const data = new FormData(planner);
      const countryName = country.value === 'east-africa' ? 'Help me choose in East Africa' : countries.find(item=>item.id===country.value).name;
      const serviceNames = {stays:'Accommodation',transfers:'Transfers & car hire',tours:'Tours & safaris',groups:'Group arrangements',entry:'Entry guidance enquiry'};
      const services = data.getAll('services').map(key=>serviceNames[key]).filter(Boolean);
      const lines = ['PAMOJA TRAILS · MY TRIP BRIEF','Name: '+name.value.trim(),'Destination: '+countryName,'Journey: '+(byId(journey.value)?.name || 'Something made for me'),'Travellers: '+travellers.value,'Travel style: '+style.value];
      const team=String(data.get('team')||'').trim();
      const matchBase=window.PAMOJA.venues?.find(item=>item.id===data.get('venue'));
      if (team) lines.push('Following: '+team);
      if (matchBase) lines.push('Preferred matchday base: '+matchBase.name);
      if (start.value) lines.push('Start date: '+start.value);
      if (end.value) lines.push('End date: '+end.value);
      if (services.length) lines.push('Include: '+services.join(', '));
      if (String(data.get('notes')||'').trim()) lines.push('My ideas: '+String(data.get('notes')).trim());
      lines.push('Demo enquiry only — no reservation has been placed.');
      const text = lines.join('\n');
      reviewed = {id:window.crypto?.randomUUID?.() || String(Date.now()),title:byId(journey.value)?.name || 'My custom East Africa trip',country:countryName,travellers:travellers.value,text};
      document.querySelector('#brief-text').textContent = text;
      if (window.URL.createObjectURL) {
        downloadUrl = window.URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
        download.href=downloadUrl;
      } else download.href='data:text/plain;charset=utf-8,'+encodeURIComponent(text);
      review.hidden=false;
      status.textContent='Your brief is ready to review below.';
      document.querySelector('#brief-title').focus();
    });
    save.addEventListener('click', () => {
      if (!reviewed) return;
      const existing = read(sessionStorage,keys.briefs,[]);
      const briefs = Array.isArray(existing) ? existing.slice(0,7) : [];
      if (!write(sessionStorage,keys.briefs,[reviewed,...briefs])) { toast('This browser can’t save the enquiry. Download your brief instead.'); return; }
      save.disabled = true;
      save.textContent='Saved to My journey';
      status.textContent='Your demo enquiry is saved. Find it in My journey.';
      toast('Demo enquiry saved. No booking has been sent.');
    });
    document.querySelector('#copy-brief').addEventListener('click', async () => {
      if (!reviewed) return;
      try { await navigator.clipboard.writeText(reviewed.text); toast('Trip brief copied.'); }
      catch { toast('Copy is unavailable here. You can download the brief instead.'); }
    });
    document.querySelector('#edit-brief').addEventListener('click', () => { invalidateReview(); name.focus(); });
    summary();
  }

  const login = document.querySelector('#login-form');
  if (login) {
    const email = document.querySelector('#demo-email');
    const password = document.querySelector('#demo-password');
    const status = document.querySelector('#login-status');
    document.querySelector('#fill-demo').addEventListener('click', () => { email.value=demo.email; password.value=demo.password; status.textContent='Demo details filled. Choose Sign in to the demo.'; });
    document.querySelector('#show-password').addEventListener('click', event => {
      const show = password.type === 'password';
      password.type=show?'text':'password';
      event.currentTarget.textContent=show?'Hide':'Show';
      event.currentTarget.setAttribute('aria-label',show?'Hide demo password':'Show demo password');
      event.currentTarget.setAttribute('aria-pressed',String(show));
    });
    login.addEventListener('submit', event => {
      event.preventDefault();
      if (!login.reportValidity()) return;
      if (email.value.trim().toLowerCase()!==demo.email || password.value!==demo.password) {
        status.textContent='Use the demo email and password shown above. Real accounts aren’t enabled.';
        return;
      }
      if (!write(sessionStorage,keys.session,true)) { status.textContent='This browser can’t keep a demo session. You can still browse and save journey ideas as a guest.'; return; }
      status.textContent='Signed in to the demo. Opening My journey…';
      window.location.assign('account.html');
    });
  }

  const state = document.querySelector('#account-state');
  if (state) {
    if (signedIn) {
      document.querySelector('#account-greeting').textContent='Welcome, '+demo.name+'. These are your favourite journeys and saved demo trip briefs.';
      state.innerHTML='<span>Demo account · explorer@pamoja.demo</span><button type="button" class="underlink" id="demo-signout">Sign out of demo</button>';
      document.querySelector('#demo-signout').addEventListener('click', () => {
        write(sessionStorage,keys.session,false);
        window.location.assign('account.html');
      });
    }
    const briefs = read(sessionStorage,keys.briefs,[]);
    const valid = (Array.isArray(briefs)?briefs:[]).filter(brief=>brief && typeof brief.text==='string' && typeof brief.title==='string').slice(0,8);
    document.querySelector('#briefs-empty').hidden = valid.length > 0;
    document.querySelector('#saved-briefs').innerHTML=valid.map(brief=>`<article class="saved-brief-card"><p class="eyebrow">SAVED DEMO ENQUIRY</p><h3>${escape(brief.title)}</h3><p>${escape(brief.country)} · ${escape(brief.travellers)} travellers · Not a confirmed booking</p><details><summary>Read my trip brief</summary><pre>${escape(brief.text)}</pre></details></article>`).join('');
  }
  renderSaved();
  updateSaveButtons();
  carrySearchChoices();
  // Observe selected story blocks once; no content is hidden while waiting for a reveal.
  function setupMotion() {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (preference?.matches || typeof window.IntersectionObserver !== 'function') return;
    const targets = document.querySelectorAll('.intro>div,.section-heading,.country-card,.home .journey-card,.matchday-feature>figure,.matchday-feature>div,.stay-copy,.destination-copy,.service-list article');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, {threshold:.12,rootMargin:'0px 0px -24px 0px'});
    targets.forEach(target => observer.observe(target));
    preference?.addEventListener?.('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      targets.forEach(target => target.classList.remove('reveal-in'));
    });
  }
  setupMotion();
})();

function setupLionFilm() {
  const film = document.querySelector('.lion-film');
  if (!film || !window.matchMedia) return;
  const portrait = matchMedia('(max-aspect-ratio: 4/5)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  function updatePlayback() {
    if (motion.matches || navigator.connection?.saveData || document.visibilityState === 'hidden') {
      film.pause();
      if (motion.matches) film.classList.remove('has-frame');
      return;
    }
    const source = portrait.matches ? film.dataset.portrait : film.dataset.wide;
    if (film.getAttribute('src') !== source) {
      film.classList.remove('has-frame');
      film.src = source;
    }
    film.defaultPlaybackRate = 0.65;
    film.playbackRate = 0.65;
    film.play().catch(() => {});
  }
  film.addEventListener('playing', () => film.classList.add('has-frame'));
  film.addEventListener('error', () => film.classList.remove('has-frame'));
  portrait.addEventListener('change', updatePlayback);
  motion.addEventListener('change', updatePlayback);
  document.addEventListener('visibilitychange', updatePlayback);
  updatePlayback();
}
setupLionFilm();
