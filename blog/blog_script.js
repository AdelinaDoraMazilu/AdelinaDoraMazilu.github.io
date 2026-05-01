/* blog_script.js
   Handles the firefly hover effect in dark mode:
   - Swaps the firefly image src on mouseenter/mouseleave
   - Only active when dark mode is on (no [data-theme="light"] on <html>)

   The images expected:
     /blog/fireflies/firefly_without_light.png  — default state
     /blog/fireflies/firefly_with_light.png     — hover/lit state
*/

(function () {
  /* ----------------------------------------------------------------
     FIREFLY IMAGE PATHS
     Change these if you move the files.
     ---------------------------------------------------------------- */
  const FIREFLY_OFF = '/blog/fireflies/firefly_without_light.png';
  const FIREFLY_ON  = '/blog/fireflies/firefly_with_light.png';

  /* ----------------------------------------------------------------
     PRELOAD both images so the swap is instant (no flicker)
     ---------------------------------------------------------------- */
  function preload(src) {
    const img = new Image();
    img.src = src;
  }
  preload(FIREFLY_OFF);
  preload(FIREFLY_ON);

  /* ----------------------------------------------------------------
     ATTACH HOVER LISTENERS
     Called once on DOMContentLoaded, and can be called again if you
     dynamically add cards later (call attachFireflyListeners()).
     ---------------------------------------------------------------- */
  function isLightMode() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function attachFireflyListeners() {
    document.querySelectorAll('.blog-card .firefly-img-wrap img').forEach(function (img) {
      /* Avoid double-binding */
      if (img._fireflyBound) return;
      img._fireflyBound = true;

      img.closest('.blog-card').addEventListener('mouseenter', function () {
        if (!isLightMode()) img.src = FIREFLY_ON;
      });

      img.closest('.blog-card').addEventListener('mouseleave', function () {
        if (!isLightMode()) img.src = FIREFLY_OFF;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', attachFireflyListeners);

  /* ----------------------------------------------------------------
     If your theme toggle script changes data-theme at runtime,
     this resets any mid-hover firefly back to "off" when switching modes.
     ---------------------------------------------------------------- */
  const observer = new MutationObserver(function () {
    if (isLightMode()) {
      document.querySelectorAll('.blog-card .firefly-img-wrap img').forEach(function (img) {
        img.src = FIREFLY_OFF;
      });
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* Expose for dynamic card injection */
  window.attachFireflyListeners = attachFireflyListeners;
})();