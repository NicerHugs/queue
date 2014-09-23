var serverURL = '//tiny-pizza-server.herokuapp.com/collections/tiy-gvl-queue';

function renderTemplate(templateId, location, model) {
    var templateString = $(templateId).text();
    var templateFunction = _.template(templateString);
    var renderedTemplate = templateFunction(model);
    $(location).append(renderedTemplate);
}

function emptyQueue() {
    $('#matt-queue').empty();
    $('#jake-queue').empty();
}

function markCompleted() {
    $('.completed-checkbox').on('click', function() {
        $(this).parent().toggleClass('completed');
        var id = $(this).parent().attr('id');
        $.ajax({
            url: serverURL + '/' + id,
            type: 'delete'
        }).done(function() {
            emptyQueue();
            populateQueue();
        });
    });
}

function populateQueue() {
    $.ajax({
      url: serverURL,
      type: 'get'
  })
      .done(function(queueData) {
          $('.queue-item').remove();
          var queueModel = _.map(queueData, function(queueDatum){
              var queueModel = {
                  id: queueDatum._id,
                  name: queueDatum.name,
                  createdDate: queueDatum.createdDate,
                  who: queueDatum.withWho
              };
              return queueModel;
          });
          _.each(queueModel, function(queueModel){
            if (queueModel.who === 'Matt') {
              renderTemplate('#templates-queue-item', '#matt-queue', queueModel);
            }
            else {
              renderTemplate('#templates-queue-item', '#jake-queue', queueModel);
            }
          });
          markCompleted();
      });
}

function sendNewQueue(e) {
    e.preventDefault();
    var queueObject =  {
        name: $('#name').val(),
        createdDate: Date.now(),
        withWho: $('#who').val(),
      };
    $.ajax({
        url: serverURL,
        type: 'POST',
        data: queueObject
    })
        .done(function() {
            emptyQueue();
            populateQueue();
        });
}

$('#add').on('click', sendNewQueue);
populateQueue();
