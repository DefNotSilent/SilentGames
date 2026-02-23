document.addEventListener('DOMContentLoaded', () => {
    const faviconDropdown = document.getElementById('faviconDropdown');
    const presets = {
      'Fake Google Search': { title: 'calculator - Google Search', favicon: 'https://www.google.com/favicon.ico' },
      'Fake Google Doc': { title: 'Untitled document - Google Docs', favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico' },
      'Fake Google Slides': { title: 'Untitled Presentation - Google Slides', favicon: 'https://ssl.gstatic.com/docs/presentations/images/favicon-2023q4.ico' },
      'Fake Powerpoint': { title: 'Presentation.pptx - Microsoft PowerPoint Online', favicon: 'https://res-1.cdn.office.net/officeonline/pods/s/h25FD28BFF140E152_resources/1033/FavIcon_Ppt.ico' },
      'Fake Word Document': { title: 'Document.docx - Microsoft Word Online', favicon: 'https://res-1.cdn.office.net/officeonline/wv/s/h4FBD8CC4075E1795_resources/1033/FavIcon_Word.ico' },
      'Schoology': { title: 'Home | Schoology', favicon: 'https://www.powerschool.com/favicon.ico' },
      'Google': { title: 'Google', favicon: 'https://www.google.com/favicon.ico' },
      'Google Classroom': { title: 'Home', favicon: 'https://ssl.gstatic.com//classroom//favicon.png' },
      'Gmail': { title: 'Gmail', favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
      'Google Drive': { title: 'Home - Google Drive', favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png' },
      'Bing': { title: 'Bing', favicon: 'https://www.bing.com/favicon.ico' },
      'Outlook': { title: 'Outlook', favicon: 'https://outlook.live.com/owa/favicon.ico' },
      'OneDrive': { title: 'My files - OneDrive', favicon: 'https://onedrive.live.com/favicon.ico' },
      'Wikipedia': { title: 'Wikipedia', favicon: 'https://en.wikipedia.org/favicon.ico' },
      'Edpuzzle': { title: 'Edpuzzle', favicon: 'https://edpuzzle.imgix.net/favicons/favicon-32.png' },
      'IXL': { title: 'IXL | Math, Language Arts, Science, Social Studies, and Spanish', favicon: 'https://www.ixl.com/favicon.ico' },
      'Canvas': { title: 'Log In to Canvas', favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
      'Khan Academy': { title: 'Khan Academy | Free Online Courses, Lessons & Practice', favicon: 'https://cdn.kastatic.org/images/favicon.ico' },
      'YouTube': { title: 'YouTube', favicon: 'https://www.youtube.com/s/desktop/eb72fb02/img/favicon.ico' },
    };
  
    Object.keys(presets).forEach(preset => {
      const option = document.createElement('option');
      option.value = preset;
      option.textContent = preset;
      faviconDropdown.appendChild(option);
    });
  
    faviconDropdown.addEventListener('change', (event) => {
      const selectedPreset = event.target.value;
      if (presets[selectedPreset]) {
        const { title, favicon } = presets[selectedPreset];
        document.title = title;
        let link = document.querySelector('link[rel="shortcut icon"]');
        if (link) {
          link.href = favicon;
        } else {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          link.href = favicon;
          document.head.appendChild(link);
        }
        localStorage.setItem('faviconUrl', favicon);
        localStorage.setItem('pageTitle', title);
        alert(`set the cloak to ${selectedPreset}!`);
        location.reload();
      }
    });
  
    const savedFaviconUrl = localStorage.getItem('faviconUrl');
    const savedTitle = localStorage.getItem('pageTitle');
    if (savedFaviconUrl) {
      let link = document.querySelector('link[rel="shortcut icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = savedFaviconUrl;
    }
    if (savedTitle) {
      document.title = savedTitle;
      Array.from(faviconDropdown.options).forEach(option => {
        if (option.text === savedTitle) {
          faviconDropdown.value = option.value;
        }
      });
    }
  });
