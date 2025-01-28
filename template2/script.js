(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const siteParam = urlParams.get('site');
  if (!siteParam) {
    console.warn("No ?site= provided in URL. Page won't populate data.");
    return;
  }

  const normalizedSlug = siteParam
    .replace(/'/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const DATA_URL = "https://raw.githubusercontent.com/greekfreek23/alabamaplumbersnowebsite/main/finalWebsiteData.json";

  fetch(DATA_URL)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(`Failed to load data: ${resp.status}`);
      }
      return resp.json();
    })
    .then(json => {
      const businesses = json.finalWebsiteData || [];
      const found = businesses.find(b => (b.siteId || '').toLowerCase() === normalizedSlug);
      if (!found) {
        console.warn(`No matching siteId for ${siteParam}`);
        return;
      }
      populateSite(found);
    })
    .catch(err => {
      console.error("Error loading or parsing data:", err);
    });

  function populateSite(data) {
    document.querySelectorAll("[data-logo]").forEach(el => {
      el.src = data.logo || "";
      el.alt = (data.businessName || "Business") + " Logo";
    });

    document.querySelectorAll("[data-business-name]").forEach(el => {
      el.textContent = data.businessName || "Your Business Name";
    });

    document.querySelector("[data-location='1']").textContent = data.locations?.[0]?.name || "Location 1";
    document.querySelector("[data-phone='1']").textContent = data.locations?.[0]?.phone || "555-123-4567";

    document.querySelector("[data-location='2']").textContent = data.locations?.[1]?.name || "Location 2";
    document.querySelector("[data-phone='2']").textContent = data.locations?.[1]?.phone || "555-234-5678";

    document.querySelector("[data-location='3']").textContent = data.locations?.[2]?.name || "Location 3";
    document.querySelector("[data-phone='3']").textContent = data.locations?.[2]?.phone || "555-345-6789";

    document.querySelector("[data-fax]").textContent = data.fax || "555-456-7890";

    document.querySelector("[data-address]").textContent = data.address || "123 Main St, Anytown, USA";
  }
})();
