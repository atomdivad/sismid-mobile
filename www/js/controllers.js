angular.module('app.controllers', [])

.controller('MapController', function($scope, $ionicLoading, $rootScope) {
 
    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });
 
        $scope.map = map;
    }); 

    $rootScope.makeMarkers = function(pontos) {
        angular.forEach(pontos, function (i, item) {
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(i.latitude, i.longitude),
                map: $scope.map,
                title: item.idEndereco
            });
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });
    }   
 
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

.controller('PesquisaController', function($scope, $http, $ionicLoading, $ionicPopup, $rootScope) {
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
    $scope.distancia = 10;

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

    $scope.pesquisar = function() {
        var data = {
            nome: $scope.nome   ,
            uf: $scope.uf,
            cidade: $scope.cidade,
            distancia: $scope.distancia
        };

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
        $http.post('http://localhost:8000/api/app/mapa', data).then(
            function(response){
                $rootScope.makeMarkers(response.data);
                $ionicLoading.hide();
                $scope.closeModal();
            },
            function(response){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Erro!',
                    template: 'Ocorreu algum erro ao tentar buscar os dados! Verifique sua conexão!'
                });
            }
        );
    }
});