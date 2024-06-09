document.getElementById('announcements-link').addEventListener('click', () => {
    navigate('announcements');
  });
  
  document.getElementById('download-shop-link').addEventListener('click', () => {
    navigate('download-shop');
  });
  
  function navigate(page) {
    const contentDiv = document.getElementById('content');
    switch(page) {
      case 'announcements':
        contentDiv.innerHTML = '<h2>Announcements</h2><p>Here are the latest announcements.</p>';
        break;
      case 'download-shop':
        contentDiv.innerHTML = '<h2>Download Shop</h2><p>Welcome to the download shop.</p>';
        break;
      default:
        contentDiv.innerHTML = '<p>Select an option from the menu.</p>';
    }
  }
  