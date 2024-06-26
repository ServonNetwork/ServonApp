function loadTranslations(lang) {
  fetch(__dirname + `/assets/lang/${lang}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const elements = document.querySelectorAll('[id]');
      elements.forEach(element => {
        const key = element.id;
        if (data[key]) {
          element.innerText = data[key];
        }
      });
    })
    .catch(error => console.error('Error loading translations:', error));
}

loadTranslations('en');

document.getElementById('languageSwitcher').addEventListener('change', (e) => {
  const selectedLang = e.target.value;
  console.log(`Selected language: ${selectedLang}`);
  loadTranslations(selectedLang);
});