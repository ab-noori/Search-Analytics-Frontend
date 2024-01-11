document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  
    function handleSearch() {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        sendSearchRequest(query);
        sendArticleSearchRequest(query);
      }
    }
      
    function sendArticleSearchRequest(query) {
      fetch(`http://localhost:3000/api/articles?query=${query}`)
        .then(response => response.json())
        .then(articles => displayArticles(articles))
        .catch(error => console.error('Error fetching articles:', error));
    }
  
    function sendSearchRequest(query) {
      fetchIpAddress()
        .then(ipAddress => {
          const requestData = {
            query,
            ip_address: ipAddress,
          };
  
          return fetch('http://localhost:3000/api/searches', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
  
    function fetchIpAddress() {
      return fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip)
        .catch(error => {
          console.error('Error fetching IP address:', error);
          return null;
        });
    }
  
    function debounce(func, delay) {
      let timer;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
      };
    }

    // Search button
    function search() {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        sendSearchRequest(query);
        sendArticleSearchRequest(query);
  
        fetchRecentSearches();
      }
    }
  
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
      searchButton.addEventListener('click', search);
    }

    //--------------------------------Display searched quries-------------------------------------

    function fetchRecentSearches() {
      fetch('http://localhost:3000/api/searches')
        .then(response => response.json())
        .then(searches => displayRecentSearches(searches))
        .catch(error => console.error('Error fetching searches:', error));
    }
  
    function displayRecentSearches(searches) {
      const recentSearchesContainer = document.getElementById('recentSearchesContainer');
      recentSearchesContainer.innerHTML = ''; // Clear previous results
  
      if (searches.length === 0) {
        recentSearchesContainer.innerHTML = '<p>No recent searches found.</p>';
      } else {
        searches.forEach(search => {
          const searchDiv = document.createElement('div');
          searchDiv.classList.add('border', 'rounded', 'px-3', 'pt-1', 'mt-2', 'shadow');
          searchDiv.innerHTML = `<p> Query: ${search.query}</br> User: ${search.ip_address}</p>`;
          recentSearchesContainer.appendChild(searchDiv);
        });
      }
    }
  
    function handleSearch() {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        sendSearchRequest(query);
        sendArticleSearchRequest(query);
    
        fetchRecentSearches();
      }
    }    

    fetchRecentSearches();
    
    //----------------------------------Display Articles----------------------------------------

    function fetchArticles() {
        fetch('http://localhost:3000/api/articles')
          .then(response => response.json())
          .then(articles => displayArticles(articles))
          .catch(error => console.error('Error fetching articles:', error));
      }
    
      function displayArticles(articles) {
        const searchResultsContainer = document.getElementById('articlesContainer');
        searchResultsContainer.innerHTML = ''; 
    
        if (articles.length === 0) {
          searchResultsContainer.innerHTML = '<p>No articles found.</p>';
        } else {
          articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('border', 'rounded', 'p-3', 'my-2', 'shadow');
            articleDiv.innerHTML = `<h5>${article.title}</h5><p>${article.content}</p>`;
            searchResultsContainer.appendChild(articleDiv);
          });
        }
      }
    
      fetchArticles();
  });
  
  //------------------------------------Add new Article-------------------------------------------

  function addNewArticle() {
    const title = document.getElementById('articleTitle').value;
    const content = document.getElementById('articleContent').value;
  
    fetch('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article: {
          title,
          content,
        },
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Article added successfully:', data);
      document.getElementById('articleTitle').value = '';
      document.getElementById('articleContent').value = '';
    })
    .catch(error => {
      console.error('Error adding article:', error);
    });
  }
  