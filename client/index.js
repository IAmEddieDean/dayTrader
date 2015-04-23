'use strict';

angular.module('day-trader', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://daytripper.firebaseio.com/');
}])
.controller('master', ['$scope', '$firebaseObject', '$firebaseArray', '$http', function($scope, $firebaseObject, $firebaseArray, $http){
  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;
  
  // var fbPortfolios = $scope.fbRoot.child('portfolios');
  // var afPortfolios = $firebaseArray(fbPortfolios);
  // $scope.portfolios = afPortfolios;
  var fbPortfolios = $scope.fbRoot.child('technology');
  var afPortfolios = $firebaseArray(fbPortfolios);
  $scope.technology = afPortfolios;

  var fbPortfolios2 = $scope.fbRoot.child('cereal');
  var afPortfolios2 = $firebaseArray(fbPortfolios2);
  $scope.cereal = afPortfolios2;

  var fbPortfolios3 = $scope.fbRoot.child('pharma');
  var afPortfolios3 = $firebaseArray(fbPortfolios3);
  $scope.pharma = afPortfolios3;
  
  $scope.addUser = function(){
    $scope.user.$save();
    $scope.swapBar();
  };
  $scope.buyShares = function(){
    $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+$scope.stock.symbol+'&callback=JSON_CALLBACK').then(function(response){
      var stock = {};
      stock.amount = $scope.stock.amount;
      stock.symbol = $scope.stock.symbol;
      stock.price = (response.data.LastPrice);

      if ($scope.user.capital - (stock.amount * stock.price) >= 0 && ($scope.stock.portfolio)){
        $scope[$scope.stock.portfolio].$add(stock);
        $scope.user.capital -= (stock.amount * stock.price);
        $scope.user.$save();
        $scope.portTotal(portfolio);
        
      } else {
        alert('Check your input and try again..');
      }
      // $scope.newBalance(0,0);
    });
  };
  $scope.swapBar = function(){
    $scope.setupBar = true;
  };
  $scope.sellShares = function(stock, port){
    $scope.user.capital += (stock.price * stock.amount);
    $scope[port].$remove(stock);
    $scope.user.$save();
    $scope.portfolio.$save();
  };
  // $scope.sellShares = function(stock, port){
  //     $scope.user.balance += (stock.price * stock.amount);
  //     $scope[port].$remove(stock);
  //     //$scope.saveUser();
  //   };
  $scope.portTotal = function(portfolio){
    var total = 0;
    $scope[portfolio].forEach(function(current){
      total += (current.price * current.amount);
    });
    return total;
  };

}]);
