var indexName = '';
function nameTheThing(name){
  indexName = name;
}

function findTextMatches(paraCodeText, searchstring) {
  textArr = paraCodeText;
  textArr = textArr.map(function(x){ return x.toLowerCase() })

  var matches = _.filter(
    textArr,
    function( s ) { return s.indexOf(searchstring) !== -1; }
  );

  if(matches.length > 0) {
    return matches[0].substring(matches[0].indexOf(searchstring), matches[0].indexOf(searchstring) + 50) + "...";
  } else {
    return paraCodeText[0].substring(0, 50) + "...";
  }
}

function addSearchContent(htag, url, content, searchstring) {
  if(htag.header.length > 0) {
    description_text = "";
    if(htag.paragraph.length > 0) {
      description_text = findTextMatches(htag.paragraph, searchstring);

    } else if(htag.code.length > 0 && htag.paragraph.length == 0) {
      description_text = findTextMatches(htag.code, searchstring);
    }
    content.push({title: htag.header[0], url: url, description: description_text});
  }

  return content;
}

$( document ).ready(function() {
    $('.ui.search').search({
      apiSettings: {
        url: "",
        responseAsync: function(settings, callback) {

          doTheThing(callback);

        }
      },
      maxResults: 10
    });

    function doTheThing(callback) {

      var endpoint = 'http://elasticsearch-onboarding.hq.target.com:9200';
      var client = new $.es.Client({
        hosts: endpoint,
        log: 'trace'
      });

      var searchstring = $('#search-input');
      searchstring = searchstring.val().toLowerCase();

      client.search({
          index: indexName,
          q: searchstring + "*"
        }).then(function (body) {

          var content = [];
          $.each(body.hits.hits, function(i,item){
            content = addSearchContent(item._source.h1, item._source.url, content, searchstring);
            content = addSearchContent(item._source.h2, item._source.url, content, searchstring);
            content = addSearchContent(item._source.h3, item._source.url, content, searchstring);
            content = addSearchContent(item._source.h4, item._source.url, content, searchstring);
            content = addSearchContent(item._source.h5, item._source.url, content, searchstring);

          });

          content = content.sort(function(a, b) {
            return b.title.toLowerCase().indexOf(searchstring) - a.title.toLowerCase().indexOf(searchstring);
          });

          var response = {
            success: true,
            results: content,
          };

          callback(response);

          return content;
        });
      }
});
