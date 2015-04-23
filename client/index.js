'use strict';

angular.module('day-trader', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://daytrippin.firebaseio.com/');
}])
.controller('master', ['$scope', '$firebaseObject', '$firebaseArray', '$http', function($scope, $firebaseObject, $firebaseArray, $http){
  $scope.buffalos = [{'name':'buf1'}, {'name':'buf2'}];
  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;
  
  var fbPortfolios = $scope.fbRoot.child('portfolios');
  var afPortfolios = $firebaseArray(fbPortfolios);
  $scope.portfolios = afPortfolios;
  
  $scope.addUser = function(){
    $scope.user.$save();
    console.log($scope.user);
    $scope.swapBar();
  };
  $scope.swapBar = function(){
    $scope.setupBar = true;
  };
  $scope.addPortfolio = function(){
    $scope.portfolios.$add($scope.portfolio);
    // $scope.portfolio.name.$save();
    
  };
  $scope.buyShares = function(){
    var symbol = $scope.portfolio.stock.symbol;
    var shares = $scope.portfolio.stock.amount;
    $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ symbol +'&callback=JSON_CALLBACK').then(function(response){
      if((response.data.LastPrice * shares) < $scope.user.capital){
        $scope.user.capital -= (response.data.LastPrice * shares);
        console.log($scope.user.capital);
      }else{
        alert('Not Enough Funds');
      }
    });
  };
  
}]);
