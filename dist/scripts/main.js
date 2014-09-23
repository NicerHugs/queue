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
                  who: queueDatum.withWho,
                  when: Math.floor((Date.now() - queueDatum.createdDate)/60000) + " minutes ago"
              };
              return queueModel;
          });
          var sortedQueueModel = _.sortBy(queueModel, function(a) {
              return a.createdDate;
          });
          _.each(sortedQueueModel, function(queueItem){
                if (queueItem.who === 'Matt') {
                    renderTemplate('#templates-queue-item', '#matt-queue', queueItem);
                }
                else {
                    renderTemplate('#templates-queue-item', '#jake-queue', queueItem);
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
setInterval(function() {
    emptyQueue();
    populateQueue();
    }, 30000);
