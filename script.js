(() => {
  const VIDEO_ID = 'NY62PbboDAY';
  const CORRECT_PASSWORD = '0427';
  let player = null;
  let playerReady = false;
  let desiredPlaying = false;
  let pendingPlay = false;

  const $ = (selector) => document.querySelector(selector);

  function musicButton() {
    return $('#musicToggle');
  }

  function setButtonState(isPlaying) {
    const button = musicButton();
    if (!button) return;
    button.textContent = isPlaying ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', isPlaying ? '배경음악 일시정지' : '배경음악 재생');
    button.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
  }

  function setDesiredPlaying(isPlaying) {
    desiredPlaying = isPlaying;
    setButtonState(isPlaying);
  }

  function playMusic() {
    setDesiredPlaying(true);
    if (!playerReady || !player || typeof player.playVideo !== 'function') {
      pendingPlay = true;
      return;
    }

    try {
      if (typeof player.unMute === 'function') player.unMute();
      if (typeof player.setVolume === 'function') player.setVolume(70);
      player.playVideo();
      pendingPlay = false;
    } catch (error) {
      pendingPlay = true;
    }
  }

  function pauseMusic() {
    pendingPlay = false;
    setDesiredPlaying(false);
    if (playerReady && player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
  }

  function wireMusicButton() {
    const button = musicButton();
    if (!button || button.dataset.wired === 'true') return;
    button.dataset.wired = 'true';
    button.addEventListener('click', () => {
      if (desiredPlaying) pauseMusic();
      else playMusic();
    });
    setButtonState(desiredPlaying);
  }

  function showOrpheusView({ fromPassword = false } = {}) {
    const gateView = $('#gateView');
    const orpheusView = $('#orpheusView');

    if (gateView) gateView.classList.add('is-hidden');
    if (orpheusView) orpheusView.classList.remove('is-hidden');

    document.body.classList.remove('gate-page');
    document.body.classList.add('sub-page');
    document.title = 'Orpheus';

    if (fromPassword && window.location.pathname.endsWith('/gate.html')) {
      window.history.pushState({}, '', './orpheus.html');
    }

    wireMusicButton();

    if (fromPassword) {
      sessionStorage.setItem('orpheusUnlocked', '1');
      playMusic();
    }
  }

  function wirePasswordForm() {
    const form = $('#passwordForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = $('#passwordInput');
      const message = $('#passwordMessage');
      const value = (input?.value || '').trim();

      if (value === CORRECT_PASSWORD) {
        if (message) message.textContent = '';
        showOrpheusView({ fromPassword: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      if (message) message.textContent = 'password mismatch';
      if (input) {
        input.value = '';
        input.focus();
      }
    });
  }

  function primeMutedPlayer() {
    if (!playerReady || !player) return;
    try {
      if (typeof player.mute === 'function') player.mute();
      if (typeof player.playVideo === 'function') player.playVideo();
    } catch (error) {
      // Muted priming is optional. Failure should not break the page.
    }
  }

  window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
    const playerNode = document.getElementById('youtubePlayer');
    if (!playerNode || !window.YT || !window.YT.Player) return;

    player = new YT.Player('youtubePlayer', {
      width: '1',
      height: '1',
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: VIDEO_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          playerReady = true;
          const iframe = event.target.getIframe?.();
          if (iframe) iframe.setAttribute('allow', 'autoplay; encrypted-media');
          try {
            event.target.setLoop(true);
            event.target.setVolume(70);
          } catch (error) {}

          // On the password page, preload muted playback so the later password click can unmute reliably.
          if (document.body.classList.contains('gate-page')) primeMutedPlayer();
          if (pendingPlay || desiredPlaying) playMusic();
        },
        onStateChange: (event) => {
          if (!window.YT || !window.YT.PlayerState) return;
          if (event.data === YT.PlayerState.ENDED && desiredPlaying && player) {
            player.playVideo();
          }
          if (event.data === YT.PlayerState.PLAYING && desiredPlaying) {
            setButtonState(true);
          }
          if ((event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.UNSTARTED) && !pendingPlay) {
            setButtonState(false);
          }
        }
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    wirePasswordForm();
    wireMusicButton();

    if (document.body.classList.contains('sub-page')) {
      showOrpheusView({ fromPassword: false });
      // Direct page access cannot always autoplay with sound. The visible button remains available.
      pendingPlay = true;
      setDesiredPlaying(false);
    }
  });
})();
