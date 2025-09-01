(function fixPortalSizing() {
  const portal = document.getElementById('portal');
  const wrap = document.getElementById('portalWrap');

  function resizeIframe() {
    const iframe = portal?.shadowRoot?.querySelector('iframe');
    if (iframe) {
      iframe.style.height = '100%';
      iframe.style.flex = '1 1 auto';
    }
  }

  if (portal) {
    portal.addEventListener('dom-ready', resizeIframe);
  }
  window.addEventListener('resize', resizeIframe);

  setTimeout(resizeIframe, 500);
})();
