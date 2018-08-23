function getArticles() {
    $.getJSON('/articles', function(data) {
        for(var i = 0; i < 10; i++) {
            var card = $('<div>');
            card.addClass('card');

            var cardBody = $('<div>');
            cardBody.addClass('card-body');

            var cardTitle = $('<h5>');
            cardTitle.addClass('card-title');
            cardTitle.text(data[i].title);

            var cardLink = $('<a>');
            cardLink.attr('href', data[i].link);
            cardLink.addClass('btn btn-warning');
            cardLink.text('View Article');

            var cardSave = $('<a>');
            cardSave.attr('href', '/saveArticle');
            cardSave.attr('data-id', data[i]._id);
            cardSave.addClass('btn btn-danger save');
            cardSave.text('Save Article');
            
            //Appending elements
            card.append(cardBody, cardTitle, cardLink, cardSave)
            //Appending card to DOM
            $('#articles').append(card)
        }
    });

}

getArticles();
getSaved();