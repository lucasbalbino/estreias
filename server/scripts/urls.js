const TMDB_API_KEY = "f2ad3897b5681a69563b0333cf996243";
// Other
// const TMDB_API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb";
const OMDB_API_KEY = "623c5bc3";

function urlJustWatchGeneral(type, index) {
    return 'https://apis.justwatch.com/content/titles/pt_BR/new?body=%7B' +
        '%22age_certifications%22:null,' +
        '%22content_types%22:%5B%22movie%22%5D,' +
        '%22genres%22:null,' +
        '%22languages%22:null,' +
        '%22max_price%22:null,' +
        '%22min_price%22:null,' +
        '%22monetization_types%22:%5B%22flatrate%22,%22free%22,%22rent%22,%22buy%22,%22ads%22%5D,' +
        '%22page%22:' + index + ',' +
        '%22page_size%22:1,' +
        '%22presentation_types%22:null,' +
        '%22providers%22:%5B%22' + type + '%22%5D,' +
        '%22release_year_from%22:null,' +
        '%22release_year_until%22:null,' +
        '%22scoring_filter_types%22:null,' +
        '%22timeline_type%22:null,' +
        '%22titles_per_provider%22:100' +
        '%7D';
}

function urlJustWatchMovie(id) {
    return "https://apis.justwatch.com/content/titles/movie/" + id + "/locale/pt_BR";
}

function urlTMDBMovie(title, year) {
    return 'https://api.themoviedb.org/3/search/movie?' +
        'api_key='+ TMDB_API_KEY +'&' +
        'language=pt-BR&' +
        'include_adult=false&' +
        'region=BRA&' +
        'query=' + title + '&' +
        'year=' + year;
}

function urlTMDBVideos(id) {
    return 'https://api.themoviedb.org/3/movie/' + id + '/videos?' +
        'api_key='+ TMDB_API_KEY;
}

function urlOMDB(title, year) {
    return 'https://www.omdbapi.com/?t=' + title + '&apikey='+ OMDB_API_KEY +'&y=' + year;
}


module.exports = {
    urlJustWatchGeneral: urlJustWatchGeneral,
    urlJustWatchMovie: urlJustWatchMovie,
    urlTMDBMovie: urlTMDBMovie,
    urlTMDBVideos: urlTMDBVideos,
    urlOMDB: urlOMDB
};