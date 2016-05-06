;
$(document).ready(function() {
    var list = $('.js-sortable-list-1');
    Sortable.create(list[0]);
});

var ToDoApp = angular.module('ToDoApp', []);
ToDoApp.controller('CreateListController', function($scope) {
    var me = this;

    // PouchDB Related Configuration
    var DB = new PouchDB('ToDo');

    // Basic Configuration for Database
    DB.get('config').then(function(doc) {
        console.log(doc);
    }).catch(function(error) {
        // Create if not exists
        if (error.status == 404) {
            DB.put({
                _id: 'config',
                versionCode: 1,
                lists: []
            });
        }
    });

    // Resets the Textbox and blurs it
    function reset() {
        me.showTitleError = false;

        // Need jQuery here since it is easier doing things this way
        $('#create-list').closeModal();
        $('#title-textbox').val('').blur();
        console.log('comes here to reset');
        return false;
    }

    me.onSubmit = function() {
        if ($scope.title && $scope.title.length > 0) {
            console.log('comes here');
            var id = null;
            DB.post({
                    _id: 'list-' + new Date().getTime(),
                    title: $scope.title,
                    list: true
                })
                .then(function(doc) {
                    id = doc.id;
                    return DB.get('config');
                })
                .then(function(doc) {
                    doc.lists.push(id);
                    return DB.put(doc);
                })
                .catch(function(err) {
                    console.log('error', err);
                });
            reset();
        } else {
            console.log('showing title error');
            me.showTitleError = true;
        }
    }

    // For Modal Window
    $(document).ready(function() {
        // This can be converted to angular
        $('.js-add-button').click(function() {
            $('#create-list').openModal({
                ready: function() {
                    $('#title-textbox').focus();
                },
                complete: function() {
                    reset();
                }
            });
            return false;
        });
    });
});
