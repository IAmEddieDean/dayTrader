'use strict';

angular.module('day-trader', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://daytrippin.firebaseio.com/');
}])
.controller('master', ['$scope', '$firebaseObject', '$firebaseArray', '$http', function($scope, $firebaseObject, $firebaseArray, $http){

  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;
  
  var fbPortfolio = $scope.fbRoot.child('portfolio');
  var afPortfolio = $firebaseArray(fbPortfolio);
  $scope.portfolio = afPortfolio;

  $scope.addUser = function(){
    $scope.user.$save();
    console.log($scope.user);
    $scope.swapBar();
  };
  $scope.swapBar = function(){
    $scope.setupBar = true;
  };
  $scope.addPortfolio = function(){
    $scope.portfolio.$save();
    
  };

  $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=AAPL&callback=JSON_CALLBACK').then(function(response){
    console.log(response);
  });
}]);
