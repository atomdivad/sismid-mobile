// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('MapController', function($scope, $ionicLoading) {
 
    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "Minha localização"
            });
        });
 
        $scope.map = map;
    });
 
})

.controller('ModalController', function($scope, $ionicModal) {
    
    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'

    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
        console.log('open');
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
})

.controller('CidadesController', function($scope, $http, $ionicLoading, $ionicPopup) {
    $scope.ufs = [];

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 200,
        showDelay: 0
    });
    $http.get('http://localhost:8000/api/uf').then(
    function(response) {
        $scope.ufs = response.data;
        $ionicLoading.hide();
    },    
    function(){
        $ionicLoading.hide();
        $ionicPopup.alert({
            title: 'Erro!',
            template: 'Ocorreu algum erro ao tentar buscar os dados! Verifique sua conexão!'
        });
    }
    );

    $scope.uf = 0;

    $scope.ufChange = function() {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
        $scope.cidades = [];
        $http.get('http://localhost:8000/api/uf/'+$scope.uf+'/cidades').then(
            function(response) {
              $scope.cidades = response.data;
              $ionicLoading.hide();
            },    
            function(){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Erro!',
                    template: 'Ocorreu algum erro ao tentar buscar os dados! Verifique sua conexão!'
                });
            }
        );
    }
});