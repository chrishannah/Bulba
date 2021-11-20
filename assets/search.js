function search() {
    let query = document.getElementById("query").value;

    let articles = document.querySelectorAll('article')
    for (var i = 0; i < articles.length; i++) {
        articles[i].classList.add("hidden");
    }
    let titles = document.querySelectorAll('.article-title')
    for (var i = 0; i < titles.length; i++) {
        titles[i].classList.add("hidden");
    }
    for (var i = 0; i < titles.length; i++) {
        if (titles[i].textContent.toLowerCase().includes(query.toLowerCase())) {
            titles[i].classList.remove("hidden");
            titles[i].closest("article").classList.remove("hidden");
        }
    }
}

function submitForm(event) { event.preventDefault(); }

let searchField = document.getElementById("query");
searchField.addEventListener('input', search);

let searchForm = document.getElementById("search-form");
searchForm.addEventListener('submit', submitForm);